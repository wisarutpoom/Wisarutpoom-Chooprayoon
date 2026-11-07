import React, { useEffect, useMemo, useState } from 'react';
import {
  onAuthStateChanged,
  signInWithPopup,
  signOut,
  User as FirebaseUser,
} from 'firebase/auth';
import {
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
} from 'firebase/firestore';
import {
  AlertCircle,
  AlertTriangle,
  Award,
  Calendar,
  Check,
  CheckCircle2,
  CloudUpload,
  Copy,
  Eye,
  Loader2,
  LogIn,
  LogOut,
  MessageSquare,
  Phone,
  Search,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  Trash2,
  User,
  Users,
  X,
} from 'lucide-react';
import {
  auth,
  db,
  googleProvider,
  handleFirestoreError,
  isAuthorizedAdminEmail,
  OperationType,
} from '../firebase';
import { DEMO_PRESETS } from '../data/questions';
import { AssessmentReport, CandidateProfile } from '../types/assessment';
import { generateAssessmentReport } from '../utils/scoringEngine';
import { ResultsDashboard } from './ResultsDashboard';

interface AdminDashboardProps {
  localReports: AssessmentReport[];
  selectedReportId: string | null;
  onSelectReportId: (id: string | null) => void;
  onDeleteLocalReport: (id: string) => void;
  onResetFiveSampleReports: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  localReports,
  selectedReportId,
  onSelectReportId,
  onDeleteLocalReport,
  onResetFiveSampleReports,
}) => {
  const [currentUser, setCurrentUser] = useState<FirebaseUser | null>(auth.currentUser);
  const [authLoading, setAuthLoading] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);

  const [cloudReports, setCloudReports] = useState<AssessmentReport[]>([]);
  const [loadingData, setLoadingData] = useState(false);
  const [seedingDemo, setSeedingDemo] = useState(false);
  const [syncSuccessMsg, setSyncSuccessMsg] = useState<string | null>(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [showEditedOnly, setShowEditedOnly] = useState(false);
  const [infoModalReport, setInfoModalReport] = useState<AssessmentReport | null>(null);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setAuthLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const isVerifiedAdmin = Boolean(
    currentUser && isAuthorizedAdminEmail(currentUser.email)
  );

  useEffect(() => {
    if (!isVerifiedAdmin) {
      setCloudReports([]);
      return;
    }

    setLoadingData(true);
    const q = query(collection(db, 'assessments'), orderBy('createdAt', 'desc'));

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const parsed: AssessmentReport[] = [];
        snapshot.forEach((docSnap) => {
          const data = docSnap.data();
          const completedAtRaw = String(data.completedAtText || '');
          const isEditedMatch = completedAtRaw.includes('[แก้ไข');
          let editNote: string | undefined;
          let submissionCount = 1;

          if (isEditedMatch) {
            const bracketMatch = completedAtRaw.match(/\[(.*?)\]/);
            editNote = bracketMatch
              ? `ผู้สมัครกลับมา${bracketMatch[1]}`
              : 'ผู้สมัครกลับมาแก้ไขข้อมูล/คำตอบและส่งใหม่';
            const countMatch = completedAtRaw.match(/ครั้งที่\s*(\d+)/);
            if (countMatch) {
              submissionCount = parseInt(countMatch[1], 10) || 2;
            } else {
              submissionCount = 2;
            }
          }

          const candidate: CandidateProfile = {
            id: docSnap.id,
            firstName: String(data.firstName || ''),
            lastName: String(data.lastName || ''),
            nickname: String(data.nickname || ''),
            age: String(data.age || ''),
            phone: String(data.phone || ''),
            lineId: String(data.lineId || ''),
            completedAt: completedAtRaw,
            isEdited: isEditedMatch,
            submissionCount,
            editHistoryNote: editNote,
          };

          const rawAnswers = (data.answers || {}) as Record<string, number>;
          const numericAnswers: Record<number, number> = {};
          Object.entries(rawAnswers).forEach(([k, v]) => {
            numericAnswers[Number(k)] = Number(v);
          });

          const rep = generateAssessmentReport(candidate, numericAnswers);
          parsed.push(rep);
        });
        setCloudReports(parsed);
        setLoadingData(false);
      },
      (error) => {
        setLoadingData(false);
        try {
          handleFirestoreError(error, OperationType.LIST, 'assessments');
        } catch {
          // Handled
        }
      }
    );

    return () => unsubscribe();
  }, [isVerifiedAdmin]);

  const allReports = useMemo(() => {
    const map = new Map<string, AssessmentReport>();
    cloudReports.forEach((r) => map.set(r.id, r));
    localReports.forEach((r) => {
      if (!map.has(r.id)) {
        map.set(r.id, r);
      }
    });
    return Array.from(map.values());
  }, [cloudReports, localReports]);

  const selectedReport = useMemo(
    () => allReports.find((r) => r.id === selectedReportId) || null,
    [allReports, selectedReportId]
  );

  const editedReports = useMemo(
    () =>
      allReports.filter(
        (rep) => rep.candidate.isEdited || (rep.candidate.submissionCount ?? 1) > 1
      ),
    [allReports]
  );

  const filteredReports = useMemo(() => {
    let list = allReports;
    if (showEditedOnly) {
      list = editedReports;
    }
    const q = searchQuery.trim().toLowerCase();
    if (!q) return list;
    return list.filter((rep) => {
      const fullText = `${rep.candidate.firstName} ${rep.candidate.lastName} ${rep.candidate.nickname} ${rep.candidate.phone} ${rep.candidate.lineId} ${rep.mbti.code} ${rep.disc.blendCode} ${rep.enneagram.wingCode} ${rep.oneLineSummary}`.toLowerCase();
      return fullText.includes(q);
    });
  }, [allReports, editedReports, searchQuery, showEditedOnly]);

  const handleGoogleSignIn = async () => {
    setAuthError(null);
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (err) {
      setAuthError(
        err instanceof Error ? err.message : 'ไม่สามารถเข้าสู่ระบบด้วย Google ได้ กรุณาลองใหม่'
      );
    }
  };

  const handleSignOut = async () => {
    onSelectReportId(null);
    await signOut(auth);
  };

  const handleCopyText = (key: string, text: string) => {
    navigator.clipboard?.writeText(text);
    setCopiedField(key);
    setTimeout(() => setCopiedField(null), 1800);
  };

  const handleSyncAndSeedToCloud = async () => {
    onResetFiveSampleReports();
    if (!isVerifiedAdmin || seedingDemo) return;
    setSeedingDemo(true);
    setSyncSuccessMsg(null);
    try {
      const demoReps = DEMO_PRESETS.map((preset) =>
        generateAssessmentReport(preset.candidate, preset.answers)
      );
      const combinedMap = new Map<string, AssessmentReport>();
      demoReps.forEach((r) => combinedMap.set(r.id, r));
      localReports.forEach((r) => combinedMap.set(r.id, r));

      for (const rep of combinedMap.values()) {
        const docId =
          rep.id && /^[a-zA-Z0-9_-]+$/.test(rep.id)
            ? rep.id
            : `cand_${Date.now()}`;
        const answersMap: Record<string, number> = {};
        Object.entries(rep.answers).forEach(([k, v]) => {
          answersMap[String(k)] = Number(v);
        });

        await setDoc(doc(db, 'assessments', docId), {
          firstName: rep.candidate.firstName.slice(0, 100),
          lastName: rep.candidate.lastName.slice(0, 100),
          nickname: rep.candidate.nickname.slice(0, 60),
          age: rep.candidate.age.slice(0, 10),
          phone: rep.candidate.phone.slice(0, 30),
          lineId: rep.candidate.lineId.slice(0, 80),
          completedAtText: (rep.candidate.completedAt || 'วันนี้').slice(0, 120),
          overallScore: Math.round(rep.overallScore),
          mbtiCode: rep.mbti.code.slice(0, 10),
          discCode: rep.disc.blendCode.slice(0, 80),
          enneagramCode: rep.enneagram.wingCode.slice(0, 100),
          topRoleTitle: (rep.roleTracks[0]?.title || 'Advisor').slice(0, 150),
          answers: answersMap,
          createdAt: serverTimestamp(),
        });
      }
      setSyncSuccessMsg('ซิงค์และเผยแพร่ข้อมูลทั้งหมดขึ้นระบบ Cloud (Firebase) เรียบร้อยแล้ว');
      setTimeout(() => setSyncSuccessMsg(null), 4000);
    } catch (error) {
      try {
        handleFirestoreError(error, OperationType.WRITE, 'assessments');
      } catch {
        // Logged
      }
    } finally {
      setSeedingDemo(false);
    }
  };

  const handleDeleteSubmission = async (assessmentId: string) => {
    onDeleteLocalReport(assessmentId);
    if (selectedReportId === assessmentId) {
      onSelectReportId(null);
    }
    if (infoModalReport?.id === assessmentId) {
      setInfoModalReport(null);
    }
    if (!isVerifiedAdmin || deletingId) return;
    setDeletingId(assessmentId);
    try {
      await deleteDoc(doc(db, 'assessments', assessmentId));
    } catch (error) {
      try {
        handleFirestoreError(error, OperationType.DELETE, `assessments/${assessmentId}`);
      } catch {
        // Logged
      }
    } finally {
      setDeletingId(null);
    }
  };

  if (authLoading) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center space-y-3">
        <Loader2 className="w-8 h-8 text-[#0C2340] animate-spin mx-auto" />
        <p className="text-sm text-slate-600">กำลังโหลดระบบแอดมิน...</p>
      </div>
    );
  }

  if (!currentUser) {
    return (
      <div className="max-w-xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
        <div className="bg-white border border-[#D6CEBF] rounded-2xl overflow-hidden shadow-xs">
          <div className="thai-gold-divider" />
          <div className="p-6 sm:p-8 space-y-5 text-center">
            <div className="w-12 h-12 rounded-xl bg-[#0C2340] border border-[#B48327] flex items-center justify-center mx-auto">
              <ShieldCheck className="w-6 h-6 text-[#F4D078]" />
            </div>

            <div className="space-y-1.5">
              <div className="text-xs font-bold text-[#8A6116] uppercase tracking-wider">
                ADMIN PORTAL · GOOGLE AUTHENTICATION
              </div>
              <h1 className="text-xl sm:text-2xl font-bold text-[#0C2340]">
                สำหรับผู้ดูแลระบบ (Admin)
              </h1>
              <p className="text-sm text-slate-600">
                เข้าสู่ระบบด้วยบัญชี Google (Gmail) เพื่อดูรายชื่อผู้ตอบแบบสอบถาม คะแนน และพิมพ์รายงาน PDF
              </p>
            </div>

            {authError && (
              <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-xs text-rose-700 flex items-center gap-2 text-left">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{authError}</span>
              </div>
            )}

            <button
              type="button"
              onClick={handleGoogleSignIn}
              className="w-full min-h-[48px] py-3 px-5 bg-[#0C2340] hover:bg-slate-900 border border-[#B48327] text-white font-bold text-sm sm:text-base rounded-xl transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-xs"
            >
              <LogIn className="w-5 h-5 text-[#F4D078]" />
              <span>เข้าสู่ระบบด้วยบัญชี Google (Gmail)</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!isVerifiedAdmin) {
    return (
      <div className="max-w-xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
        <div className="bg-white border border-rose-200 rounded-2xl p-6 sm:p-8 space-y-4 text-center">
          <div className="w-12 h-12 rounded-xl bg-rose-50 border border-rose-200 flex items-center justify-center mx-auto">
            <ShieldAlert className="w-6 h-6 text-rose-600" />
          </div>
          <div className="space-y-1">
            <h2 className="text-lg font-bold text-[#0C2340]">
              บัญชีนี้ไม่มีสิทธิ์ผู้ดูแลระบบ
            </h2>
            <p className="text-sm text-slate-600">
              อีเมล <strong className="text-[#0C2340]">{currentUser.email}</strong> ไม่ได้รับอนุญาต
            </p>
          </div>
          <button
            type="button"
            onClick={handleSignOut}
            className="min-h-[44px] px-5 py-2 bg-[#0C2340] hover:bg-slate-800 text-white text-sm font-bold rounded-xl transition-colors inline-flex items-center gap-2 cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>สลับบัญชี Google</span>
          </button>
        </div>
      </div>
    );
  }

  if (selectedReport) {
    return (
      <ResultsDashboard
        report={selectedReport}
        onBackToOverview={() => {
          onSelectReportId(null);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />
    );
  }

  const totalCount = allReports.length;
  const avgScore =
    totalCount > 0
      ? Math.round(allReports.reduce((acc, r) => acc + r.overallScore, 0) / totalCount)
      : 0;
  const highPotentialCount = allReports.filter((r) => r.overallScore >= 80).length;

  return (
    <div className="max-w-6xl mx-auto px-3 sm:px-6 lg:px-8 py-5 sm:py-8 space-y-5">
      {/* Compact Admin Header */}
      <div className="bg-white border border-[#D6CEBF] rounded-2xl overflow-hidden shadow-xs">
        <div className="thai-gold-divider" />
        <div className="p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-1.5 text-xs font-bold text-[#8A6116]">
              <ShieldCheck className="w-4 h-4 text-[#B48327]" />
              <span>ADMIN DASHBOARD · ระบบบริหารผลประเมินบน Cloud</span>
            </div>
            <h1 className="text-lg sm:text-xl font-bold text-[#0C2340]">
              รายชื่อผู้ประเมินและผลคะแนนทั้งหมด ({totalCount} คน)
            </h1>
          </div>

          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <button
              type="button"
              disabled={seedingDemo}
              onClick={handleSyncAndSeedToCloud}
              className="min-h-[40px] px-3.5 py-2 text-xs font-bold text-[#0C2340] bg-[#FBF6EA] hover:bg-[#F5E8C7] border border-[#E5C878] rounded-xl transition-colors inline-flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              {seedingDemo ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <CloudUpload className="w-4 h-4 text-[#B48327]" />
              )}
              <span>ซิงค์ข้อมูลและตัวอย่าง 5 รายการขึ้น Cloud</span>
            </button>

            <button
              type="button"
              onClick={handleSignOut}
              className="min-h-[40px] px-3.5 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors inline-flex items-center gap-1.5 cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>ออก ({currentUser.email})</span>
            </button>
          </div>
        </div>
      </div>

      {syncSuccessMsg && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-300 text-xs sm:text-sm text-emerald-900 font-bold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{syncSuccessMsg}</span>
        </div>
      )}

      {/* Compact 4 KPI Summary Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white border border-[#D6CEBF] rounded-xl p-3.5 flex items-center justify-between">
          <div>
            <div className="text-xs text-slate-500">ผู้ประเมินทั้งหมด</div>
            <div className="text-xl font-bold font-mono-tabular text-[#0C2340]">
              {totalCount} คน
            </div>
          </div>
          <Users className="w-5 h-5 text-[#B48327]" />
        </div>

        <div className="bg-white border border-[#D6CEBF] rounded-xl p-3.5 flex items-center justify-between">
          <div>
            <div className="text-xs text-slate-500">คะแนนเฉลี่ย</div>
            <div className="text-xl font-bold font-mono-tabular text-[#0C2340]">
              {avgScore}%
            </div>
          </div>
          <span className="text-xs font-mono-tabular font-bold text-[#8A6116]">AVG</span>
        </div>

        <div className="bg-white border border-[#D6CEBF] rounded-xl p-3.5 flex items-center justify-between">
          <div>
            <div className="text-xs text-slate-500">ศักยภาพสูง (≥80%)</div>
            <div className="text-xl font-bold font-mono-tabular text-emerald-700">
              {highPotentialCount} คน
            </div>
          </div>
          <Award className="w-5 h-5 text-emerald-700" />
        </div>

        <button
          type="button"
          onClick={() => setShowEditedOnly((prev) => !prev)}
          className={`border rounded-xl p-3.5 flex items-center justify-between text-left transition-colors cursor-pointer ${
            showEditedOnly
              ? 'bg-amber-50 border-amber-400'
              : 'bg-white border-[#D6CEBF] hover:bg-[#FAF8F5]'
          }`}
        >
          <div>
            <div className="text-xs text-slate-500">แก้ไขคำตอบ</div>
            <div className="text-xl font-bold font-mono-tabular text-amber-700">
              {editedReports.length} คน
            </div>
          </div>
          <AlertTriangle className="w-5 h-5 text-amber-600" />
        </button>
      </div>

      {/* Main List Container */}
      <div className="bg-white border border-[#D6CEBF] rounded-2xl p-4 sm:p-5 space-y-4 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#E6DFD3]">
          <div className="text-xs sm:text-sm text-slate-600">
            กด <strong className="text-[#0C2340]">ข้อมูลผู้สมัคร</strong> เพื่อดูเบอร์โทรศัพท์ / Line ID หรือกด{' '}
            <strong className="text-[#8A6116]">ดูผลวิเคราะห์</strong> เพื่อเปิดรายงานและพิมพ์ PDF
          </div>

          <div className="relative w-full sm:w-64 shrink-0">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ค้นหาชื่อ หรือ ชื่อเล่น..."
              className="w-full min-h-[40px] pl-9 pr-3 py-1.5 text-base sm:text-sm rounded-xl border border-[#D6CEBF] bg-[#FAF8F5] text-[#0C2340] placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#B48327]"
            />
          </div>
        </div>

        {loadingData ? (
          <div className="py-12 text-center space-y-2">
            <Loader2 className="w-7 h-7 text-[#0C2340] animate-spin mx-auto" />
            <p className="text-sm text-slate-600">กำลังโหลดรายชื่อ...</p>
          </div>
        ) : filteredReports.length === 0 ? (
          <div className="py-10 text-center space-y-3">
            <p className="text-sm text-slate-600">ไม่พบรายชื่อผู้ทำแบบประเมิน</p>
            <button
              type="button"
              onClick={handleSyncAndSeedToCloud}
              className="min-h-[42px] px-4 py-2 text-xs font-bold text-[#F4D078] bg-[#0C2340] hover:bg-slate-900 border border-[#B48327] rounded-xl transition-colors inline-flex items-center gap-1.5 cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              <span>โหลดข้อมูลตัวอย่าง 5 รายการขึ้น Cloud</span>
            </button>
          </div>
        ) : (
          <>
            {/* Mobile Card-Based View (Smaller Screens < md) — Full Headings & Role Titles */}
            <div className="md:hidden space-y-3">
              {filteredReports.map((rep, index) => {
                const scoreBadgeColor =
                  rep.overallScore >= 80
                    ? 'text-emerald-800 bg-emerald-50 border-emerald-200'
                    : rep.overallScore >= 68
                    ? 'text-[#0C2340] bg-[#FBF6EA] border-[#E5C878]'
                    : rep.overallScore >= 55
                    ? 'text-amber-800 bg-amber-50 border-amber-200'
                    : 'text-rose-800 bg-rose-50 border-rose-200';

                const isEdited =
                  rep.candidate.isEdited || (rep.candidate.submissionCount ?? 1) > 1;

                return (
                  <div
                    key={rep.id}
                    className={`p-4 rounded-xl border transition-colors space-y-3 ${
                      isEdited
                        ? 'bg-amber-50/30 border-amber-300'
                        : 'bg-[#FAF8F5] border-[#E6DFD3]'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="space-y-1">
                        <div className="flex flex-wrap items-center gap-1.5">
                          <span className="font-mono-tabular text-xs font-bold text-slate-400">
                            #{index + 1}
                          </span>
                          <button
                            type="button"
                            onClick={() => setInfoModalReport(rep)}
                            className="font-bold text-[#0C2340] hover:text-[#8A6116] text-base text-left cursor-pointer transition-colors"
                          >
                            คุณ{rep.candidate.firstName} {rep.candidate.lastName}{' '}
                            <span className="text-slate-600 font-normal text-sm">
                              (ชื่อเล่น: {rep.candidate.nickname})
                            </span>
                          </button>
                        </div>

                        {isEdited && (
                          <div>
                            <button
                              type="button"
                              onClick={() => setInfoModalReport(rep)}
                              className="px-2 py-0.5 rounded bg-amber-100 border border-amber-300 text-amber-900 text-[11px] font-bold inline-flex items-center gap-1 cursor-pointer"
                            >
                              <AlertTriangle className="w-3 h-3 text-amber-700 shrink-0" />
                              <span>แก้ไขครั้งที่ {rep.candidate.submissionCount || 2}</span>
                            </button>
                          </div>
                        )}
                      </div>

                      <span
                        className={`inline-flex items-center justify-center min-w-[62px] px-3 py-1 rounded-lg border font-mono-tabular font-bold text-base shrink-0 ${scoreBadgeColor}`}
                      >
                        {rep.overallScore}%
                      </span>
                    </div>

                    <div className="p-2.5 rounded-lg bg-white border border-[#E6DFD3] space-y-1 text-xs">
                      <div className="font-mono-tabular font-bold text-[#8A6116]">
                        โปรไฟล์: {rep.mbti.code} · DISC {rep.disc.blendCode} · {rep.enneagram.wingCode}
                      </div>
                      <div className="text-slate-700">
                        สายงานที่เหมาะสม:{' '}
                        <strong className="text-[#0C2340]">
                          {rep.roleTracks[0]?.title}
                        </strong>
                      </div>
                    </div>

                    <div className="pt-1 flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setInfoModalReport(rep)}
                        className="flex-1 min-h-[44px] px-3 py-2 rounded-xl border border-[#D6CEBF] bg-white hover:bg-[#FBF6EA] text-[#0C2340] text-xs font-bold inline-flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <User className="w-4 h-4 text-[#B48327] shrink-0" />
                        <span>ข้อมูลผู้สมัคร</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          onSelectReportId(rep.id);
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                        className="flex-1 min-h-[44px] px-3 py-2 rounded-xl bg-[#0C2340] hover:bg-slate-800 border border-[#B48327] text-white font-bold text-xs inline-flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-xs"
                      >
                        <Eye className="w-4 h-4 text-[#F4D078] shrink-0" />
                        <span>ดูผลวิเคราะห์</span>
                      </button>

                      <button
                        type="button"
                        disabled={deletingId === rep.id}
                        onClick={() => handleDeleteSubmission(rep.id)}
                        title="ลบรายการนี้"
                        aria-label="ลบรายการนี้"
                        className="w-11 h-11 rounded-xl border border-[#D6CEBF] bg-white text-slate-400 hover:text-rose-600 hover:bg-rose-50 hover:border-rose-200 inline-flex items-center justify-center transition-colors cursor-pointer shrink-0 disabled:opacity-40"
                      >
                        {deletingId === rep.id ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Trash2 className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Desktop Table View (Screens >= md) — Full Role & Profile Titles */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-[#D6CEBF] text-xs sm:text-sm text-[#0C2340] bg-[#FAF8F5]">
                    <th className="py-3 px-4 font-bold">ชื่อ-นามสกุลผู้ตอบแบบสอบถาม</th>
                    <th className="py-3 px-4 font-bold text-center whitespace-nowrap">
                      ผลคะแนนรวม
                    </th>
                    <th className="py-3 px-4 font-bold">
                      รหัสบุคลิกภาพและสายงานที่เหมาะสม
                    </th>
                    <th className="py-3 px-4 font-bold text-right whitespace-nowrap">
                      ข้อมูลผู้สมัคร / รายงานผล
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E6DFD3] text-sm">
                  {filteredReports.map((rep, index) => {
                    const scoreBadgeColor =
                      rep.overallScore >= 80
                        ? 'text-emerald-800 bg-emerald-50 border-emerald-200'
                        : rep.overallScore >= 68
                        ? 'text-[#0C2340] bg-[#FBF6EA] border-[#E5C878]'
                        : rep.overallScore >= 55
                        ? 'text-amber-800 bg-amber-50 border-amber-200'
                        : 'text-rose-800 bg-rose-50 border-rose-200';

                    const isEdited =
                      rep.candidate.isEdited || (rep.candidate.submissionCount ?? 1) > 1;

                    return (
                      <tr
                        key={rep.id}
                        className="hover:bg-[#FAF8F5] transition-colors"
                      >
                        <td className="py-3.5 px-4 align-middle">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="font-mono-tabular text-xs text-slate-400 w-5">
                              {index + 1}.
                            </span>
                            <button
                              type="button"
                              onClick={() => setInfoModalReport(rep)}
                              className="font-bold text-[#0C2340] hover:text-[#8A6116] text-base text-left cursor-pointer transition-colors"
                            >
                              คุณ{rep.candidate.firstName} {rep.candidate.lastName}{' '}
                              <span className="text-slate-500 font-normal text-sm">
                                ({rep.candidate.nickname})
                              </span>
                            </button>

                            {isEdited && (
                              <button
                                type="button"
                                onClick={() => setInfoModalReport(rep)}
                                title="กดเพื่อดูประวัติการแก้ไขคำตอบ"
                                className="px-2 py-0.5 rounded bg-amber-100 border border-amber-300 text-amber-900 text-[11px] font-bold inline-flex items-center gap-1 cursor-pointer hover:bg-amber-200 transition-colors"
                              >
                                <AlertTriangle className="w-3 h-3 text-amber-700" />
                                <span>แก้ไขครั้งที่ {rep.candidate.submissionCount || 2}</span>
                              </button>
                            )}
                          </div>
                        </td>

                        <td className="py-3.5 px-4 align-middle text-center whitespace-nowrap">
                          <span
                            className={`inline-flex items-center justify-center min-w-[64px] px-3 py-1 rounded-lg border font-mono-tabular font-bold text-base ${scoreBadgeColor}`}
                          >
                            {rep.overallScore}%
                          </span>
                        </td>

                        <td className="py-3.5 px-4 align-middle">
                          <div className="flex flex-wrap items-center gap-2 text-xs text-slate-700">
                            <span className="px-2 py-0.5 rounded bg-[#FAF8F5] border border-[#E6DFD3] font-mono-tabular font-bold text-[#0C2340] shrink-0">
                              {rep.mbti.code} · DISC {rep.disc.blendCode}
                            </span>
                            <span className="text-slate-600">
                              สายงาน: <strong className="text-[#0C2340]">{rep.roleTracks[0]?.title}</strong>
                            </span>
                          </div>
                        </td>

                        <td className="py-3.5 px-4 align-middle text-right whitespace-nowrap">
                          <div className="inline-flex items-center justify-end gap-1.5">
                            <button
                              type="button"
                              onClick={() => setInfoModalReport(rep)}
                              title={`ดูข้อมูลติดต่อของคุณ${rep.candidate.firstName}`}
                              aria-label={`ดูข้อมูลติดต่อของคุณ${rep.candidate.firstName}`}
                              className="min-h-[38px] px-2.5 py-1.5 rounded-lg border border-[#D6CEBF] bg-[#FAF8F5] hover:bg-[#FBF6EA] hover:border-[#B48327] text-[#0C2340] text-xs font-bold inline-flex items-center gap-1.5 transition-colors cursor-pointer"
                            >
                              <User className="w-4 h-4 text-[#B48327] shrink-0" />
                              <span>ข้อมูลผู้สมัคร</span>
                            </button>

                            <button
                              type="button"
                              onClick={() => {
                                onSelectReportId(rep.id);
                                window.scrollTo({ top: 0, behavior: 'smooth' });
                              }}
                              title={`ดูผลวิเคราะห์ของคุณ${rep.candidate.firstName}`}
                              aria-label={`ดูผลวิเคราะห์ของคุณ${rep.candidate.firstName}`}
                              className="min-h-[38px] px-3 py-1.5 rounded-lg bg-[#0C2340] hover:bg-slate-800 border border-[#B48327] text-white font-bold text-xs inline-flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
                            >
                              <Eye className="w-4 h-4 text-[#F4D078] shrink-0" />
                              <span>ดูผลวิเคราะห์</span>
                            </button>

                            <button
                              type="button"
                              disabled={deletingId === rep.id}
                              onClick={() => handleDeleteSubmission(rep.id)}
                              title="ลบรายการนี้"
                              aria-label="ลบรายการนี้"
                              className="w-9 h-9 rounded-lg border border-[#D6CEBF] text-slate-400 hover:text-rose-600 hover:bg-rose-50 hover:border-rose-200 inline-flex items-center justify-center transition-colors cursor-pointer disabled:opacity-40"
                            >
                              {deletingId === rep.id ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                              ) : (
                                <Trash2 className="w-4 h-4" />
                              )}
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>

      {/* UNIFIED CANDIDATE INFORMATION MODAL */}
      {infoModalReport && (
        <div
          className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4"
          onClick={() => setInfoModalReport(null)}
        >
          <div
            className="bg-white border border-[#D6CEBF] rounded-t-3xl sm:rounded-2xl max-w-lg w-full p-5 sm:p-6 space-y-4 shadow-xl max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-3 pb-3 border-b border-[#E6DFD3]">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl bg-[#0C2340] text-[#F4D078] flex items-center justify-center font-bold text-lg shrink-0">
                  {infoModalReport.candidate.firstName.slice(0, 1) || 'U'}
                </div>
                <div>
                  <div className="text-xs font-bold text-[#8A6116]">
                    ข้อมูลผู้ตอบแบบสอบถาม
                  </div>
                  <h3 className="text-lg font-bold text-[#0C2340]">
                    คุณ{infoModalReport.candidate.firstName}{' '}
                    {infoModalReport.candidate.lastName} ({infoModalReport.candidate.nickname})
                  </h3>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setInfoModalReport(null)}
                className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center cursor-pointer"
                aria-label="ปิดหน้าต่าง"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
              <div className="p-3 rounded-xl bg-[#FAF8F5] border border-[#E6DFD3]">
                <div className="text-xs text-slate-500">อายุ</div>
                <div className="font-bold text-[#0C2340] font-mono-tabular mt-0.5">
                  {infoModalReport.candidate.age} ปี
                </div>
              </div>

              <div className="p-3 rounded-xl bg-[#FAF8F5] border border-[#E6DFD3]">
                <div className="text-xs text-slate-500">คะแนนรวม</div>
                <div className="font-bold text-emerald-700 font-mono-tabular mt-0.5">
                  {infoModalReport.overallScore}% ({infoModalReport.suitabilityHeadline})
                </div>
              </div>

              <div className="p-3 rounded-xl bg-[#FAF8F5] border border-[#E6DFD3] flex items-center justify-between gap-2">
                <div>
                  <div className="text-xs text-slate-500 flex items-center gap-1">
                    <Phone className="w-3 h-3" /> โทรศัพท์
                  </div>
                  <div className="font-bold text-[#0C2340] font-mono-tabular mt-0.5">
                    {infoModalReport.candidate.phone}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    handleCopyText('phone', infoModalReport.candidate.phone)
                  }
                  className="px-2.5 py-1 rounded bg-white border border-[#D6CEBF] hover:bg-slate-100 text-xs font-semibold text-[#0C2340] inline-flex items-center gap-1 cursor-pointer"
                >
                  {copiedField === 'phone' ? (
                    <>
                      <Check className="w-3 h-3 text-emerald-600" />
                      <span>คัดลอกแล้ว</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3" />
                      <span>คัดลอก</span>
                    </>
                  )}
                </button>
              </div>

              <div className="p-3 rounded-xl bg-[#FAF8F5] border border-[#E6DFD3] flex items-center justify-between gap-2">
                <div>
                  <div className="text-xs text-slate-500 flex items-center gap-1">
                    <MessageSquare className="w-3 h-3" /> Line ID
                  </div>
                  <div className="font-bold text-[#0C2340] font-mono-tabular mt-0.5">
                    {infoModalReport.candidate.lineId}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    handleCopyText('line', infoModalReport.candidate.lineId)
                  }
                  className="px-2.5 py-1 rounded bg-white border border-[#D6CEBF] hover:bg-slate-100 text-xs font-semibold text-[#0C2340] inline-flex items-center gap-1 cursor-pointer"
                >
                  {copiedField === 'line' ? (
                    <>
                      <Check className="w-3 h-3 text-emerald-600" />
                      <span>คัดลอกแล้ว</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3" />
                      <span>คัดลอก</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-[#FAF8F5] border border-[#E6DFD3] space-y-2 text-xs">
              <div className="flex items-center gap-1.5 text-slate-700 font-medium">
                <Calendar className="w-3.5 h-3.5 text-[#B48327] shrink-0" />
                <span>วันที่ประเมิน: {infoModalReport.candidate.completedAt}</span>
              </div>

              {(infoModalReport.candidate.isEdited ||
                (infoModalReport.candidate.submissionCount ?? 1) > 1) && (
                <div className="p-2.5 rounded-lg bg-amber-50 border border-amber-300 text-amber-950 font-medium flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                  <div>
                    <div className="font-bold">
                      ประวัติการแก้ไข (ครั้งที่ {infoModalReport.candidate.submissionCount || 2})
                    </div>
                    <div>
                      {infoModalReport.candidate.editHistoryNote ||
                        'ผู้สมัครกลับมาแก้ไขข้อมูลหรือคำตอบ'}
                    </div>
                  </div>
                </div>
              )}

              <div className="pt-1 border-t border-[#E6DFD3] text-slate-700 leading-relaxed">
                <strong className="text-[#0C2340]">สรุปภาพรวม:</strong>{' '}
                {infoModalReport.oneLineSummary}
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setInfoModalReport(null)}
                className="min-h-[42px] px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs sm:text-sm font-semibold cursor-pointer"
              >
                ปิดหน้าต่าง
              </button>
              <button
                type="button"
                onClick={() => {
                  const targetId = infoModalReport.id;
                  setInfoModalReport(null);
                  onSelectReportId(targetId);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="min-h-[42px] px-4 py-2 rounded-xl bg-[#0C2340] hover:bg-slate-800 border border-[#B48327] text-white text-xs sm:text-sm font-bold inline-flex items-center gap-1.5 cursor-pointer"
              >
                <Eye className="w-4 h-4 text-[#F4D078]" />
                <span>เปิดรายงานผลและพิมพ์ PDF</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
