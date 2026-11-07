/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { onAuthStateChanged, signInWithPopup, signOut } from 'firebase/auth';
import { doc, serverTimestamp, setDoc } from 'firebase/firestore';
import { ASSESSMENT_QUESTIONS, DEMO_PRESETS } from './data/questions';
import { AdminDashboard } from './components/AdminDashboard';
import { AssessmentWorkspace } from './components/AssessmentWorkspace';
import { CandidateGraphView } from './components/CandidateGraphView';
import { RegistrationView, SavedDraftItem } from './components/RegistrationView';
import {
  auth,
  db,
  googleProvider,
  handleFirestoreError,
  OperationType,
} from './firebase';
import { AssessmentReport, CandidateProfile } from './types/assessment';
import { generateAssessmentReport } from './utils/scoringEngine';

type AppView = 'REGISTRATION' | 'ASSESSMENT' | 'CANDIDATE_GRAPHS' | 'ADMIN';

interface BrowserHistoryState {
  view: AppView;
  page: number;
  adminReportId: string | null;
}

const STORAGE_KEYS = {
  CANDIDATE: 'life_advisor_active_candidate_v3',
  ANSWERS: 'life_advisor_active_answers_v3',
  PAGE: 'life_advisor_active_page_v3',
  LAST_SAVED: 'life_advisor_last_saved_at_v3',
  DRAFTS_BY_PHONE: 'life_advisor_drafts_by_phone_v3',
  HISTORY: 'life_advisor_reports_history_v3',
  PENDING_SYNC: 'life_advisor_pending_cloud_sync_v3',
};

const EMPTY_CANDIDATE: CandidateProfile = {
  id: '',
  firstName: '',
  lastName: '',
  nickname: '',
  age: '',
  phone: '',
  lineId: '',
};

function buildInitialSampleReports(): AssessmentReport[] {
  return DEMO_PRESETS.map((preset) =>
    generateAssessmentReport(preset.candidate, preset.answers)
  );
}

function getTimeString(): string {
  return new Date().toLocaleTimeString('th-TH', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
}

export default function App() {
  const [view, setView] = useState<AppView>('REGISTRATION');
  const [adminSelectedReportId, setAdminSelectedReportId] = useState<string | null>(
    null
  );

  const [isOnline, setIsOnline] = useState<boolean>(() =>
    typeof navigator !== 'undefined' ? navigator.onLine : true
  );

  const [candidateGoogleEmail, setCandidateGoogleEmail] = useState<string | null>(
    auth.currentUser?.email ?? null
  );

  const [candidate, setCandidate] = useState<CandidateProfile>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.CANDIDATE);
      return raw ? JSON.parse(raw) : EMPTY_CANDIDATE;
    } catch {
      return EMPTY_CANDIDATE;
    }
  });

  const [answers, setAnswers] = useState<Record<number, number>>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.ANSWERS);
      return raw ? JSON.parse(raw) : {};
    } catch {
      return {};
    }
  });

  const [currentPage, setCurrentPage] = useState<number>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.PAGE);
      const parsed = raw ? parseInt(raw, 10) : 0;
      return isNaN(parsed) || parsed < 0 ? 0 : parsed;
    } catch {
      return 0;
    }
  });

  const [lastSavedAt, setLastSavedAt] = useState<string | null>(() => {
    try {
      return localStorage.getItem(STORAGE_KEYS.LAST_SAVED);
    } catch {
      return null;
    }
  });

  const [draftsByPhone, setDraftsByPhone] = useState<Record<string, SavedDraftItem>>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.DRAFTS_BY_PHONE);
      return raw ? JSON.parse(raw) : {};
    } catch {
      return {};
    }
  });

  const [savedReports, setSavedReports] = useState<AssessmentReport[]>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.HISTORY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
      return buildInitialSampleReports();
    } catch {
      return buildInitialSampleReports();
    }
  });

  const [activeReport, setActiveReport] = useState<AssessmentReport | null>(null);
  const [editingPreviousReport, setEditingPreviousReport] = useState<AssessmentReport | null>(
    null
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [savedToCloud, setSavedToCloud] = useState(false);
  const [gateNotice, setGateNotice] = useState<string | null>(null);

  // =========================================================================
  // BROWSER HISTORY API (Support Browser Back / Forward Buttons Seamlessly)
  // =========================================================================
  const isPoppingHistoryRef = useRef(false);

  const pushNavigationState = useCallback(
    (nextView: AppView, nextPage: number, nextAdminReportId: string | null) => {
      setView(nextView);
      setCurrentPage(nextPage);
      setAdminSelectedReportId(nextAdminReportId);

      if (isPoppingHistoryRef.current) {
        return;
      }

      const statePayload: BrowserHistoryState = {
        view: nextView,
        page: nextPage,
        adminReportId: nextAdminReportId,
      };

      try {
        window.history.pushState(statePayload, '');
      } catch {
        // Ignore history errors in restricted environments
      }
    },
    []
  );

  useEffect(() => {
    // Initialize root history entry on first mount
    const initialState: BrowserHistoryState = {
      view: 'REGISTRATION',
      page: 0,
      adminReportId: null,
    };
    try {
      window.history.replaceState(initialState, '');
    } catch {
      // Ignore
    }

    const handlePopState = (event: PopStateEvent) => {
      const st = event.state as BrowserHistoryState | null;
      isPoppingHistoryRef.current = true;
      if (st && st.view) {
        setView(st.view);
        setCurrentPage(typeof st.page === 'number' ? st.page : 0);
        setAdminSelectedReportId(st.adminReportId ?? null);
      } else {
        setView('REGISTRATION');
        setCurrentPage(0);
        setAdminSelectedReportId(null);
      }
      setGateNotice(null);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      setTimeout(() => {
        isPoppingHistoryRef.current = false;
      }, 20);
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Track Auth state
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      setCandidateGoogleEmail(user?.email ?? null);
    });
    return () => unsub();
  }, []);

  // Track Online / Offline events & retry queued cloud submissions when back online
  const uploadReportToFirestore = useCallback(async (report: AssessmentReport) => {
    const answersMap: Record<string, number> = {};
    Object.entries(report.answers).forEach(([k, v]) => {
      answersMap[String(k)] = Number(v);
    });

    const submissionId =
      report.id && /^[a-zA-Z0-9_-]+$/.test(report.id)
        ? report.id
        : `cand_${Date.now()}`;

    await setDoc(doc(db, 'assessments', submissionId), {
      firstName: report.candidate.firstName.trim().slice(0, 100),
      lastName: report.candidate.lastName.trim().slice(0, 100),
      nickname: report.candidate.nickname.trim().slice(0, 60),
      age: report.candidate.age.trim().slice(0, 10),
      phone: report.candidate.phone.trim().slice(0, 30),
      lineId: report.candidate.lineId.trim().slice(0, 80),
      completedAtText: (report.candidate.completedAt || 'วันนี้').slice(0, 120),
      overallScore: Math.round(report.overallScore),
      mbtiCode: report.mbti.code.slice(0, 10),
      discCode: report.disc.blendCode.slice(0, 80),
      enneagramCode: report.enneagram.wingCode.slice(0, 100),
      topRoleTitle: (report.roleTracks[0]?.title || 'Advisor').slice(0, 150),
      answers: answersMap,
      createdAt: serverTimestamp(),
    });
  }, []);

  useEffect(() => {
    const handleOnline = async () => {
      setIsOnline(true);
      try {
        const rawQueue = localStorage.getItem(STORAGE_KEYS.PENDING_SYNC);
        if (!rawQueue) return;
        const queued: AssessmentReport[] = JSON.parse(rawQueue);
        if (!Array.isArray(queued) || queued.length === 0) return;

        for (const item of queued) {
          await uploadReportToFirestore(item);
        }
        localStorage.removeItem(STORAGE_KEYS.PENDING_SYNC);
        setSavedToCloud(true);
      } catch {
        // Keep in queue for next online cycle
      }
    };

    const handleOffline = () => {
      setIsOnline(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [uploadReportToFirestore]);

  // Auto-save candidate, answers, currentPage, and draftsByPhone on every change
  useEffect(() => {
    const nowStr = getTimeString();
    setLastSavedAt(nowStr);
    try {
      localStorage.setItem(STORAGE_KEYS.CANDIDATE, JSON.stringify(candidate));
      localStorage.setItem(STORAGE_KEYS.ANSWERS, JSON.stringify(answers));
      localStorage.setItem(STORAGE_KEYS.PAGE, String(currentPage));
      localStorage.setItem(STORAGE_KEYS.LAST_SAVED, nowStr);

      const cleanPhone = candidate.phone.replace(/[-\s]/g, '');
      if (cleanPhone.length >= 9 && Object.keys(answers).length > 0) {
        setDraftsByPhone((prev) => {
          const updated: Record<string, SavedDraftItem> = {
            ...prev,
            [cleanPhone]: {
              candidate,
              answers,
              currentPage,
              updatedAt: nowStr,
              googleEmail: candidateGoogleEmail ?? undefined,
            },
          };
          localStorage.setItem(STORAGE_KEYS.DRAFTS_BY_PHONE, JSON.stringify(updated));
          return updated;
        });
      }
    } catch {
      // Ignore storage quota errors
    }
  }, [candidate, answers, currentPage, candidateGoogleEmail]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(savedReports));
    } catch {
      // Ignore storage quota errors
    }
  }, [savedReports]);

  const isCandidateValid = (c: CandidateProfile) => {
    return (
      Boolean(c.firstName.trim()) &&
      Boolean(c.lastName.trim()) &&
      Boolean(c.nickname.trim()) &&
      Boolean(c.age.trim()) &&
      Boolean(c.phone.trim()) &&
      Boolean(c.lineId.trim())
    );
  };

  const handleCandidateGoogleSignIn = async () => {
    try {
      const res = await signInWithPopup(auth, googleProvider);
      if (res.user.displayName && !candidate.firstName) {
        const parts = res.user.displayName.trim().split(' ');
        setCandidate((prev) => ({
          ...prev,
          firstName: prev.firstName || parts[0] || '',
          lastName: prev.lastName || parts.slice(1).join(' ') || '',
        }));
      }
    } catch {
      // Handled by popup
    }
  };

  const handleCandidateGoogleSignOut = async () => {
    await signOut(auth);
  };

  const handleStartAssessment = (registeredCandidate: CandidateProfile) => {
    const cleanPhone = registeredCandidate.phone.replace(/[-\s]/g, '');

    const existingSubmitted = savedReports.find(
      (r) =>
        (registeredCandidate.id && r.candidate.id === registeredCandidate.id) ||
        (cleanPhone.length >= 9 &&
          r.candidate.phone.replace(/[-\s]/g, '') === cleanPhone &&
          !r.id.startsWith('demo_'))
    );

    if (existingSubmitted && !editingPreviousReport) {
      setEditingPreviousReport(existingSubmitted);
    }

    const cleanId =
      registeredCandidate.id && /^[a-zA-Z0-9_-]+$/.test(registeredCandidate.id)
        ? registeredCandidate.id
        : `cand_${Date.now()}`;

    const withId: CandidateProfile = {
      ...registeredCandidate,
      id: cleanId,
    };
    setCandidate(withId);
    setGateNotice(null);
    pushNavigationState('ASSESSMENT', currentPage, null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleResumeDraft = (draft: SavedDraftItem) => {
    const targetPage = draft.currentPage || 0;
    setCandidate(draft.candidate);
    setAnswers(draft.answers);
    setGateNotice(null);
    pushNavigationState('ASSESSMENT', targetPage, null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleClearActiveDraft = () => {
    const cleanPhone = candidate.phone.replace(/[-\s]/g, '');
    setCandidate(EMPTY_CANDIDATE);
    setAnswers({});
    setCurrentPage(0);
    setEditingPreviousReport(null);
    if (cleanPhone) {
      setDraftsByPhone((prev) => {
        const next = { ...prev };
        delete next[cleanPhone];
        try {
          localStorage.setItem(STORAGE_KEYS.DRAFTS_BY_PHONE, JSON.stringify(next));
        } catch {
          // Ignore
        }
        return next;
      });
    }
  };

  const handleSelectAnswer = (questionId: number, value: number) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: value,
    }));
  };

  const handleResetAnswers = () => {
    setAnswers({});
    pushNavigationState('ASSESSMENT', 0, null);
  };

  const handleChangeAssessmentPage = (nextPage: number) => {
    pushNavigationState('ASSESSMENT', nextPage, null);
  };

  const handleCompleteAssessment = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    const baseDateStr = new Date().toLocaleDateString('th-TH', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

    const cleanPhone = candidate.phone.replace(/[-\s]/g, '');
    const previousReport =
      editingPreviousReport ||
      savedReports.find(
        (r) =>
          (candidate.id && r.id === candidate.id) ||
          (cleanPhone.length >= 9 &&
            r.candidate.phone.replace(/[-\s]/g, '') === cleanPhone)
      );

    const isEditedSubmission = Boolean(previousReport);
    const nextSubmissionCount = previousReport
      ? (previousReport.candidate.submissionCount || 1) + 1
      : 1;

    const submissionId = previousReport
      ? `${previousReport.id.split('_rev')[0]}_rev${nextSubmissionCount}_${Date.now()}`
      : candidate.id && /^[a-zA-Z0-9_-]+$/.test(candidate.id)
      ? `${candidate.id}_${Date.now()}`
      : `cand_${Date.now()}`;

    const prelimReport = generateAssessmentReport(candidate, answers);

    let editHistoryNote: string | undefined;
    let completedAtText = baseDateStr;

    if (isEditedSubmission && previousReport) {
      const changedAnswersCount = Object.keys(answers).filter(
        (k) => answers[Number(k)] !== previousReport.answers[Number(k)]
      ).length;
      const infoChanged =
        previousReport.candidate.firstName !== candidate.firstName ||
        previousReport.candidate.lastName !== candidate.lastName ||
        previousReport.candidate.nickname !== candidate.nickname ||
        previousReport.candidate.age !== candidate.age ||
        previousReport.candidate.phone !== candidate.phone ||
        previousReport.candidate.lineId !== candidate.lineId;

      const changeDesc =
        changedAnswersCount > 0 && infoChanged
          ? `แก้ไขข้อมูลส่วนตัวและคำตอบ ${changedAnswersCount} ข้อ`
          : changedAnswersCount > 0
          ? `แก้ไขคำตอบ ${changedAnswersCount} ข้อ`
          : 'แก้ไขข้อมูลผู้สมัครและส่งแบบสอบถามซ้ำ';

      editHistoryNote = `${changeDesc} เมื่อ ${baseDateStr} (ส่งครั้งที่ ${nextSubmissionCount} · คะแนนเดิม ${previousReport.overallScore}% → ${prelimReport.overallScore}%)`;
      completedAtText = `${baseDateStr} [แก้ไขครั้งที่ ${nextSubmissionCount}: เดิม ${previousReport.overallScore}%→${prelimReport.overallScore}%]`;
    }

    const report = generateAssessmentReport(
      {
        ...candidate,
        id: submissionId,
        completedAt: completedAtText,
        isEdited: isEditedSubmission,
        submissionCount: nextSubmissionCount,
        editHistoryNote,
      },
      answers
    );

    let cloudOk = false;
    if (isOnline) {
      try {
        await uploadReportToFirestore(report);
        cloudOk = true;
      } catch (error) {
        try {
          const rawQueue = localStorage.getItem(STORAGE_KEYS.PENDING_SYNC);
          const queue: AssessmentReport[] = rawQueue ? JSON.parse(rawQueue) : [];
          queue.push(report);
          localStorage.setItem(STORAGE_KEYS.PENDING_SYNC, JSON.stringify(queue));
        } catch {
          // Ignore storage error
        }
        try {
          handleFirestoreError(error, OperationType.CREATE, `assessments/${submissionId}`);
        } catch {
          // Logged
        }
      }
    } else {
      try {
        const rawQueue = localStorage.getItem(STORAGE_KEYS.PENDING_SYNC);
        const queue: AssessmentReport[] = rawQueue ? JSON.parse(rawQueue) : [];
        queue.push(report);
        localStorage.setItem(STORAGE_KEYS.PENDING_SYNC, JSON.stringify(queue));
      } catch {
        // Ignore
      }
    }

    setSavedToCloud(cloudOk);
    setActiveReport(report);
    setEditingPreviousReport(null);

    setSavedReports((prev) => {
      const filtered = prev.filter(
        (r) =>
          r.id !== report.id &&
          (!previousReport || r.id !== previousReport.id)
      );
      return [report, ...filtered].slice(0, 30);
    });

    if (cleanPhone) {
      setDraftsByPhone((prev) => {
        const next = { ...prev };
        delete next[cleanPhone];
        try {
          localStorage.setItem(STORAGE_KEYS.DRAFTS_BY_PHONE, JSON.stringify(next));
        } catch {
          // Ignore
        }
        return next;
      });
    }

    setAnswers({});
    setIsSubmitting(false);
    pushNavigationState('CANDIDATE_GRAPHS', 0, null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleEditSubmittedAssessment = () => {
    if (!activeReport) return;
    setEditingPreviousReport(activeReport);
    setCandidate(activeReport.candidate);
    setAnswers(activeReport.answers);
    pushNavigationState('ASSESSMENT', 0, null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleStartNewCandidate = () => {
    setCandidate(EMPTY_CANDIDATE);
    setAnswers({});
    setActiveReport(null);
    setEditingPreviousReport(null);
    setGateNotice(null);
    pushNavigationState('REGISTRATION', 0, null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDeleteLocalReport = (id: string) => {
    setSavedReports((prev) => prev.filter((r) => r.id !== id));
  };

  const handleResetFiveSampleReports = () => {
    const samples = buildInitialSampleReports();
    setSavedReports((prev) => {
      const sampleIds = new Set(samples.map((s) => s.id));
      const customOnly = prev.filter((r) => !sampleIds.has(r.id));
      return [...customOnly, ...samples];
    });
  };

  const handleSelectAdminReport = (reportId: string | null) => {
    pushNavigationState('ADMIN', currentPage, reportId);
  };

  const handleNavClick = (target: AppView) => {
    if (target === 'ADMIN') {
      setGateNotice(null);
      pushNavigationState('ADMIN', currentPage, null);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    if (target === 'REGISTRATION') {
      setGateNotice(null);
      pushNavigationState('REGISTRATION', currentPage, null);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    if (target === 'ASSESSMENT') {
      if (!candidateGoogleEmail) {
        pushNavigationState('REGISTRATION', currentPage, null);
        setGateNotice('กรุณาเข้าสู่ระบบด้วยบัญชี Google (Gmail) ก่อนเริ่มทำแบบทดสอบ');
        const el = document.getElementById('registration-card');
        el?.scrollIntoView({ behavior: 'smooth' });
        return;
      }
      if (!isCandidateValid(candidate)) {
        pushNavigationState('REGISTRATION', currentPage, null);
        setGateNotice(
          'กรุณากรอก ชื่อ, นามสกุล, ชื่อเล่น, อายุ, เบอร์โทรศัพท์ และ Line ID ให้ครบถ้วนก่อนเริ่มทำแบบทดสอบ'
        );
        const el = document.getElementById('registration-card');
        el?.scrollIntoView({ behavior: 'smooth' });
        return;
      }
      setGateNotice(null);
      pushNavigationState('ASSESSMENT', currentPage, null);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    if (target === 'CANDIDATE_GRAPHS') {
      if (activeReport) {
        setGateNotice(null);
        pushNavigationState('CANDIDATE_GRAPHS', currentPage, null);
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }
      pushNavigationState('REGISTRATION', currentPage, null);
      setGateNotice(
        `กรุณากรอกข้อมูลและทำแบบทดสอบให้ครบ ${ASSESSMENT_QUESTIONS.length} ข้อเพื่อดูกราฟวิเคราะห์ของคุณ`
      );
    }
  };

  const editedCount = useMemo(
    () =>
      savedReports.filter(
        (r) => r.candidate.isEdited || (r.candidate.submissionCount ?? 1) > 1
      ).length,
    [savedReports]
  );

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF8F5] text-[#0C2340] pb-safe">
      <div className="no-print thai-gold-divider" />
      {/* Strict 3-Zone Top Bar Contract */}
      <header className="no-print sticky top-0 z-30 bg-[#0C2340] border-b border-[#B48327] px-3 sm:px-6 lg:px-8 h-14 flex items-center shadow-xs">
        <div className="w-full max-w-7xl mx-auto flex items-center justify-between gap-3 sm:gap-8">
          {/* Zone 1: Single text element wordmark */}
          <a
            href="#top"
            onClick={(e) => {
              e.preventDefault();
              handleNavClick('REGISTRATION');
            }}
            className="text-sm sm:text-base lg:text-lg font-bold tracking-tight text-[#F4D078] whitespace-nowrap shrink-0"
          >
            LifeAdvisor Psychometrics
          </a>

          {/* Zone 2: Concise single-line text navigation links */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-300">
            <a
              href="#register"
              onClick={(e) => {
                e.preventDefault();
                handleNavClick('REGISTRATION');
              }}
              className={`hover:text-white transition-colors whitespace-nowrap shrink-0 ${
                view === 'REGISTRATION'
                  ? 'text-[#F4D078] font-bold underline decoration-[#B48327] underline-offset-4'
                  : ''
              }`}
            >
              1. ลงทะเบียน
            </a>
            <a
              href="#assessment"
              onClick={(e) => {
                e.preventDefault();
                handleNavClick('ASSESSMENT');
              }}
              className={`hover:text-white transition-colors whitespace-nowrap shrink-0 ${
                view === 'ASSESSMENT'
                  ? 'text-[#F4D078] font-bold underline decoration-[#B48327] underline-offset-4'
                  : ''
              }`}
            >
              2. แบบประเมิน ({ASSESSMENT_QUESTIONS.length} ข้อ)
            </a>
            {activeReport && (
              <a
                href="#graphs"
                onClick={(e) => {
                  e.preventDefault();
                  handleNavClick('CANDIDATE_GRAPHS');
                }}
                className={`hover:text-white transition-colors whitespace-nowrap shrink-0 ${
                  view === 'CANDIDATE_GRAPHS'
                    ? 'text-[#F4D078] font-bold underline decoration-[#B48327] underline-offset-4'
                    : ''
                }`}
              >
                3. รายงานผลของฉัน
              </a>
            )}
          </nav>

          {/* Zone 3: 1 primary action (Toggle Admin Portal or Candidate View) */}
          <div className="flex items-center shrink-0">
            {view === 'ADMIN' ? (
              <button
                type="button"
                onClick={() => handleNavClick('REGISTRATION')}
                className="min-h-[38px] px-3 sm:px-3.5 py-1.5 text-xs sm:text-sm font-bold text-[#0C2340] bg-[#F4D078] hover:bg-[#E5C158] rounded-lg transition-colors cursor-pointer whitespace-nowrap shrink-0"
              >
                หน้าผู้ทำแบบประเมิน
              </button>
            ) : (
              <button
                type="button"
                onClick={() => handleNavClick('ADMIN')}
                className="min-h-[38px] px-3 sm:px-3.5 py-1.5 text-xs sm:text-sm font-bold text-[#F4D078] bg-white/10 hover:bg-white/15 border border-[#B48327]/70 rounded-lg transition-colors cursor-pointer whitespace-nowrap shrink-0"
              >
                สำหรับแอดมิน {editedCount > 0 ? `(${editedCount})` : ''}
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Mobile & Compact Tablet Step Strip (Full-width balanced grid, full headings shown) */}
      {view !== 'ADMIN' && (
        <div className="no-print md:hidden bg-white border-b border-[#D6CEBF] px-3 py-1.5">
          <div
            className={`grid gap-1.5 ${
              activeReport ? 'grid-cols-3' : 'grid-cols-2'
            }`}
          >
            <button
              type="button"
              onClick={() => handleNavClick('REGISTRATION')}
              className={`min-h-[42px] px-2 py-1.5 rounded-lg text-xs font-bold transition-colors text-center cursor-pointer ${
                view === 'REGISTRATION'
                  ? 'bg-[#0C2340] text-[#F4D078] border border-[#B48327]'
                  : 'bg-[#FAF8F5] text-slate-700 border border-[#E6DFD3]'
              }`}
            >
              1. ลงทะเบียน
            </button>
            <button
              type="button"
              onClick={() => handleNavClick('ASSESSMENT')}
              className={`min-h-[42px] px-2 py-1.5 rounded-lg text-xs font-bold transition-colors text-center cursor-pointer ${
                view === 'ASSESSMENT'
                  ? 'bg-[#0C2340] text-[#F4D078] border border-[#B48327]'
                  : 'bg-[#FAF8F5] text-slate-700 border border-[#E6DFD3]'
              }`}
            >
              2. แบบประเมิน ({ASSESSMENT_QUESTIONS.length} ข้อ)
            </button>
            {activeReport && (
              <button
                type="button"
                onClick={() => handleNavClick('CANDIDATE_GRAPHS')}
                className={`min-h-[42px] px-2 py-1.5 rounded-lg text-xs font-bold transition-colors text-center cursor-pointer ${
                  view === 'CANDIDATE_GRAPHS'
                    ? 'bg-[#0C2340] text-[#F4D078] border border-[#B48327]'
                    : 'bg-[#FAF8F5] text-slate-700 border border-[#E6DFD3]'
                }`}
              >
                3. รายงานผลของฉัน
              </button>
            )}
          </div>
        </div>
      )}

      {/* Gate Notice Banner */}
      {gateNotice && (
        <div className="no-print max-w-5xl mx-auto px-3 sm:px-6 lg:px-8 pt-4">
          <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-300 text-xs sm:text-sm text-amber-950 flex items-center justify-between gap-3">
            <span className="font-semibold">{gateNotice}</span>
            <button
              type="button"
              onClick={() => setGateNotice(null)}
              className="min-h-[36px] px-2.5 text-xs font-bold text-amber-900 hover:underline shrink-0 cursor-pointer"
            >
              รับทราบ
            </button>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 w-full">
        {view === 'REGISTRATION' && (
          <RegistrationView
            initialCandidate={candidate}
            answeredCount={Object.keys(answers).length}
            totalQuestions={ASSESSMENT_QUESTIONS.length}
            currentPage={currentPage}
            lastSavedAt={lastSavedAt}
            isOnline={isOnline}
            savedDrafts={Object.values(draftsByPhone)}
            candidateGoogleEmail={candidateGoogleEmail}
            onCandidateGoogleSignIn={handleCandidateGoogleSignIn}
            onCandidateGoogleSignOut={handleCandidateGoogleSignOut}
            onAutoSaveCandidate={(updated) => setCandidate(updated)}
            onStartAssessment={handleStartAssessment}
            onResumeDraft={handleResumeDraft}
            onClearActiveDraft={handleClearActiveDraft}
          />
        )}

        {view === 'ASSESSMENT' && (
          <AssessmentWorkspace
            candidate={candidate}
            answers={answers}
            currentPage={currentPage}
            lastSavedAt={lastSavedAt}
            isOnline={isOnline}
            isSubmitting={isSubmitting}
            isEditingSubmitted={Boolean(editingPreviousReport)}
            onChangePage={handleChangeAssessmentPage}
            onSelectAnswer={handleSelectAnswer}
            onResetAnswers={handleResetAnswers}
            onEditCandidate={() => pushNavigationState('REGISTRATION', currentPage, null)}
            onCompleteAssessment={handleCompleteAssessment}
          />
        )}

        {view === 'CANDIDATE_GRAPHS' && activeReport && (
          <CandidateGraphView
            report={activeReport}
            savedToCloud={savedToCloud}
            onEditSubmittedAssessment={handleEditSubmittedAssessment}
            onStartNewAssessment={handleStartNewCandidate}
          />
        )}

        {view === 'ADMIN' && (
          <AdminDashboard
            localReports={savedReports}
            selectedReportId={adminSelectedReportId}
            onSelectReportId={handleSelectAdminReport}
            onDeleteLocalReport={handleDeleteLocalReport}
            onResetFiveSampleReports={handleResetFiveSampleReports}
          />
        )}
      </main>

      {/* Quiet Footer */}
      <footer className="no-print border-t border-[#D6CEBF] bg-white py-5 px-4 sm:px-6 lg:px-8 mt-8 sm:mt-12">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-center sm:text-left text-xs text-slate-600">
          <div>
            LifeAdvisor Psychometrics · ระบบประเมินศักยภาพที่ปรึกษาการเงินและตัวแทนประกันชีวิต (60 ข้อ · 7 มาตรฐานสากล)
          </div>
          <div className="flex flex-wrap items-center justify-center gap-2">
            <span className="font-mono-tabular font-bold text-[#0C2340]">
              match.smartnexus.vip
            </span>
            <span aria-hidden="true">·</span>
            <span>MBTI · Big Five · DISC · EQ/AQ · RIASEC · Enneagram</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
