import React, { useMemo, useState } from 'react';
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  CloudOff,
  Edit3,
  Loader2,
  RotateCcw,
  Save,
  Wifi,
} from 'lucide-react';
import {
  ASSESSMENT_QUESTIONS,
  LIKERT_OPTIONS,
  PILLAR_METADATA,
} from '../data/questions';
import { AssessmentPillar, CandidateProfile, QuestionItem } from '../types/assessment';

interface AssessmentWorkspaceProps {
  candidate: CandidateProfile;
  answers: Record<number, number>;
  currentPage: number;
  lastSavedAt: string | null;
  isOnline: boolean;
  isSubmitting?: boolean;
  isEditingSubmitted?: boolean;
  onChangePage: (page: number) => void;
  onSelectAnswer: (questionId: number, value: number) => void;
  onResetAnswers: () => void;
  onEditCandidate: () => void;
  onCompleteAssessment: () => void;
}

const QUESTIONS_PER_PAGE = 5;

const PILLAR_STAGES: Array<{
  key: AssessmentPillar;
  startQuestionId: number;
  fullLabel: string;
  rangeLabel: string;
}> = [
  { key: 'MBTI', startQuestionId: 1, fullLabel: '01. บุคลิกภาพ MBTI 4 มิติ', rangeLabel: 'ข้อ 1–8' },
  { key: 'BIG_FIVE', startQuestionId: 9, fullLabel: '02. บุคลิกภาพสากล Big Five (OCEAN)', rangeLabel: 'ข้อ 9–18' },
  { key: 'DISC', startQuestionId: 19, fullLabel: '03. พฤติกรรมการทำงาน DISC', rangeLabel: 'ข้อ 19–26' },
  { key: 'EQ_AQ', startQuestionId: 27, fullLabel: '04. ความฉลาดทางอารมณ์และความอึด (EQ & AQ)', rangeLabel: 'ข้อ 27–32' },
  { key: 'RIASEC_DRIVE', startQuestionId: 33, fullLabel: '05. ความถนัดอาชีพและแรงขับการขาย (RIASEC)', rangeLabel: 'ข้อ 33–40' },
  { key: 'ENNEAGRAM', startQuestionId: 41, fullLabel: '06. แรงจูงใจภายใน นพลักษณ์ (Enneagram)', rangeLabel: 'ข้อ 41–49' },
  { key: 'COMPETENCY', startQuestionId: 50, fullLabel: '07. สมรรถนะวิชาชีพตัวแทนประกันชีวิต 5 ด้าน', rangeLabel: 'ข้อ 50–60' },
];

export const AssessmentWorkspace: React.FC<AssessmentWorkspaceProps> = ({
  candidate,
  answers,
  currentPage,
  lastSavedAt,
  isOnline,
  isSubmitting = false,
  isEditingSubmitted = false,
  onChangePage,
  onSelectAnswer,
  onResetAnswers,
  onEditCandidate,
  onCompleteAssessment,
}) => {
  const [showUnansweredOnly, setShowUnansweredOnly] = useState(false);
  const [validationNotice, setValidationNotice] = useState<string | null>(null);

  const totalQuestions = ASSESSMENT_QUESTIONS.length;
  const answeredCount = Object.keys(answers).length;
  const progressPct = Math.round((answeredCount / totalQuestions) * 100);
  const totalPages = Math.ceil(totalQuestions / QUESTIONS_PER_PAGE);

  const unansweredQuestions = useMemo(
    () => ASSESSMENT_QUESTIONS.filter((q) => answers[q.id] === undefined),
    [answers]
  );

  const visibleQuestions: QuestionItem[] = useMemo(() => {
    if (showUnansweredOnly) {
      return unansweredQuestions;
    }
    const start = currentPage * QUESTIONS_PER_PAGE;
    return ASSESSMENT_QUESTIONS.slice(start, start + QUESTIONS_PER_PAGE);
  }, [currentPage, showUnansweredOnly, unansweredQuestions]);

  const currentPillarKey = visibleQuestions[0]?.pillar ?? 'MBTI';
  const currentPillarMeta = PILLAR_METADATA[currentPillarKey];

  const handleSelectOption = (questionId: number, val: number) => {
    onSelectAnswer(questionId, val);
    if (validationNotice) {
      setValidationNotice(null);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages - 1) {
      onChangePage(currentPage + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 0) {
      onChangePage(currentPage - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleTrySubmit = () => {
    if (isSubmitting) return;
    if (unansweredQuestions.length > 0) {
      const firstMissing = unansweredQuestions[0];
      const targetPage = Math.floor((firstMissing.id - 1) / QUESTIONS_PER_PAGE);
      setShowUnansweredOnly(false);
      onChangePage(targetPage);
      setValidationNotice(
        `ยังตอบไม่ครบ เหลืออีก ${unansweredQuestions.length} ข้อ (พาไปยังข้อที่ ${firstMissing.id} แล้ว)`
      );
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    onCompleteAssessment();
  };

  return (
    <div className="max-w-5xl mx-auto px-3 sm:px-6 lg:px-8 py-5 sm:py-8 space-y-5">
      {/* Editing Previously Submitted Assessment Notice */}
      {isEditingSubmitted && (
        <div className="p-3.5 rounded-xl bg-[#FBF6EA] border border-[#E5C878] text-xs sm:text-sm text-[#0C2340] flex items-center gap-2.5">
          <Edit3 className="w-4 h-4 text-[#B48327] shrink-0" />
          <span>
            <strong>โหมดแก้ไขคำตอบ:</strong> เมื่อส่งใหม่ ระบบจะอัปเดตผลคะแนนและแจ้งเตือนผู้ดูแลระบบอัตโนมัติ
          </span>
        </div>
      )}

      {/* Offline Banner */}
      {!isOnline && (
        <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-300 flex items-center gap-2.5 text-xs sm:text-sm text-amber-950">
          <CloudOff className="w-4 h-4 text-amber-700 shrink-0" />
          <span>
            <strong>ออฟไลน์ชั่วคราว:</strong> ระบบบันทึกคำตอบในเครื่องอัตโนมัติ และซิงค์ขึ้น Cloud ทันทีเมื่อออนไลน์
          </span>
        </div>
      )}

      {/* Candidate Header & Progress Bar Card */}
      <div className="bg-white border border-[#D6CEBF] rounded-2xl p-4 sm:p-5 space-y-4 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3.5 border-b border-[#E6DFD3]">
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2 text-xs text-slate-600">
              <span className="font-bold text-[#8A6116]">ผู้รับการประเมิน</span>
              <span>·</span>
              <span className="inline-flex items-center gap-1 text-emerald-700 font-bold">
                <Save className="w-3.5 h-3.5" />
                <span>บันทึกอัตโนมัติ {lastSavedAt ? `(${lastSavedAt})` : ''}</span>
              </span>
              <span>·</span>
              {isOnline ? (
                <span className="inline-flex items-center gap-1 text-emerald-700 font-mono-tabular">
                  <Wifi className="w-3.5 h-3.5" /> ออนไลน์
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 text-amber-700 font-mono-tabular">
                  <CloudOff className="w-3.5 h-3.5" /> ออฟไลน์
                </span>
              )}
            </div>
            <div className="text-base font-bold text-[#0C2340] flex flex-wrap items-center gap-x-2 gap-y-1">
              <span>
                คุณ{candidate.firstName} {candidate.lastName} ({candidate.nickname})
              </span>
              <span className="text-slate-300">·</span>
              <span className="font-mono-tabular text-sm text-slate-700">
                อายุ {candidate.age} ปี
              </span>
              <span className="text-slate-300">·</span>
              <span className="font-mono-tabular text-xs sm:text-sm text-slate-600">
                โทร: {candidate.phone}
              </span>
              <span className="text-slate-300">·</span>
              <span className="font-mono-tabular text-xs sm:text-sm text-slate-600">
                Line ID: {candidate.lineId}
              </span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={onEditCandidate}
              className="min-h-[40px] px-3.5 py-1.5 text-xs font-bold text-[#0C2340] bg-[#FAF8F5] hover:bg-[#F3EFE6] border border-[#D6CEBF] rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Edit3 className="w-3.5 h-3.5 text-[#B48327]" />
              <span>แก้ไขข้อมูลส่วนตัว</span>
            </button>
            <button
              type="button"
              onClick={onResetAnswers}
              className="min-h-[40px] px-3.5 py-1.5 text-xs font-semibold text-slate-600 hover:text-rose-700 hover:bg-rose-50 rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>เริ่มตอบใหม่</span>
            </button>
          </div>
        </div>

        {/* Progress Tracker */}
        <div className="space-y-2">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs sm:text-sm">
            <div className="font-bold text-[#0C2340]">
              ความคืบหน้าการทำแบบประเมิน:{' '}
              <span className="font-mono-tabular text-[#8A6116]">
                ตอบแล้ว {answeredCount} / {totalQuestions} ข้อ ({progressPct}%)
              </span>
            </div>
            <button
              type="button"
              onClick={() => setShowUnansweredOnly((prev) => !prev)}
              className={`min-h-[38px] px-3.5 py-1.5 text-xs font-bold rounded-xl border transition-colors cursor-pointer ${
                showUnansweredOnly
                  ? 'bg-[#0C2340] text-[#F4D078] border-[#B48327]'
                  : 'bg-[#FAF8F5] text-[#0C2340] border-[#D6CEBF] hover:bg-[#F3EFE6]'
              }`}
            >
              {showUnansweredOnly
                ? `แสดงคำถามทั้งหมด ${totalQuestions} ข้อ`
                : `ดูเฉพาะข้อที่ยังไม่ตอบ (${unansweredQuestions.length} ข้อ)`}
            </button>
          </div>

          <div className="h-2.5 w-full bg-[#FAF8F5] rounded-full overflow-hidden border border-[#D6CEBF]">
            <div
              className="h-full bg-[#0C2340] transition-all duration-200 rounded-full"
              style={{ width: `${progressPct}%` }}
            />
          </div>
        </div>

        {/* 7-Stage Stepper Tabs — Full Titles Shown Completely Without Truncation */}
        {!showUnansweredOnly && (
          <div className="pt-1 space-y-1.5">
            <div className="text-xs font-bold text-slate-500">
              เลือกหมวดหมู่การประเมิน (ครบทั้ง 7 หมวดหมู่):
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
              {PILLAR_STAGES.map((stage) => {
                const isActive = currentPillarKey === stage.key;
                const targetPage = Math.floor((stage.startQuestionId - 1) / QUESTIONS_PER_PAGE);
                return (
                  <button
                    key={stage.key}
                    type="button"
                    onClick={() => {
                      setShowUnansweredOnly(false);
                      onChangePage(targetPage);
                    }}
                    className={`min-h-[42px] py-2 px-3 rounded-xl text-left text-xs font-bold border transition-colors cursor-pointer flex items-center justify-between gap-2 ${
                      isActive
                        ? 'bg-[#0C2340] border-[#B48327] text-[#F4D078] shadow-2xs'
                        : 'bg-[#FAF8F5] border-[#E6DFD3] text-[#0C2340] hover:bg-[#F3EFE6]'
                    }`}
                  >
                    <span className="leading-snug">{stage.fullLabel}</span>
                    <span
                      className={`font-mono-tabular text-[11px] shrink-0 ${
                        isActive ? 'text-white' : 'text-[#8A6116]'
                      }`}
                    >
                      {stage.rangeLabel}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Validation Notice */}
      {validationNotice && (
        <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-300 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs sm:text-sm text-amber-950">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
            <span className="font-bold">{validationNotice}</span>
          </div>
          <button
            type="button"
            onClick={() => setShowUnansweredOnly(true)}
            className="min-h-[38px] px-3.5 py-1.5 text-xs font-bold bg-amber-700 text-white rounded-lg hover:bg-amber-800 transition-colors shrink-0 cursor-pointer"
          >
            ดูข้อที่ยังไม่ตอบทั้งหมด
          </button>
        </div>
      )}

      {/* Current Pillar Header — Full Title & Subtitle Shown */}
      {!showUnansweredOnly && (
        <div className="bg-white border border-[#D6CEBF] rounded-2xl p-4 sm:p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          <div className="space-y-1">
            <div className="text-xs font-bold text-[#8A6116]">
              หมวดที่ {currentPillarMeta.stepNumber} · {currentPillarMeta.questionRange} · หน้าที่ {currentPage + 1} จาก {totalPages}
            </div>
            <h2 className="text-base sm:text-lg font-bold text-[#0C2340] leading-snug">
              {currentPillarMeta.title} ({currentPillarMeta.englishTitle})
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              {currentPillarMeta.description}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-1.5 shrink-0">
            {Array.from({ length: totalPages }).map((_, idx) => {
              const pageStart = idx * QUESTIONS_PER_PAGE;
              const pageItems = ASSESSMENT_QUESTIONS.slice(
                pageStart,
                pageStart + QUESTIONS_PER_PAGE
              );
              const pageDone = pageItems.every((q) => answers[q.id] !== undefined);
              const isCurrent = idx === currentPage;

              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => onChangePage(idx)}
                  className={`min-w-[36px] min-h-[36px] px-2 rounded-lg font-mono-tabular text-xs font-bold border transition-colors cursor-pointer ${
                    isCurrent
                      ? 'bg-[#0C2340] text-[#F4D078] border-[#B48327]'
                      : pageDone
                      ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                      : 'bg-[#FAF8F5] text-slate-700 border-[#E6DFD3] hover:bg-[#F3EFE6]'
                  }`}
                  title={`หน้าที่ ${idx + 1}`}
                >
                  {idx + 1}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Questions List */}
      {visibleQuestions.length === 0 ? (
        <div className="bg-white border border-[#D6CEBF] rounded-2xl p-8 text-center space-y-4">
          <CheckCircle2 className="w-11 h-11 text-emerald-600 mx-auto" />
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-[#0C2340]">
              ตอบครบทั้ง {totalQuestions} ข้อเรียบร้อยแล้ว
            </h3>
            <p className="text-sm text-slate-600">
              กดปุ่มด้านล่างเพื่อประมวลผลรายงานและกราฟวิเคราะห์ของคุณ
            </p>
          </div>
          <button
            type="button"
            disabled={isSubmitting}
            onClick={handleTrySubmit}
            className="min-h-[48px] px-6 py-3 bg-[#0C2340] hover:bg-slate-900 border border-[#B48327] text-[#F4D078] text-sm sm:text-base font-bold rounded-xl transition-colors cursor-pointer inline-flex items-center gap-2"
          >
            {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
            <span>ส่งแบบประเมินและดูรายงานผล →</span>
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {visibleQuestions.map((q) => {
            const selectedValue = answers[q.id];
            return (
              <div
                key={q.id}
                className={`bg-white rounded-2xl p-4 sm:p-5 border transition-colors ${
                  selectedValue !== undefined
                    ? 'border-[#B48327] shadow-2xs'
                    : 'border-[#D6CEBF]'
                }`}
              >
                <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-600 mb-2">
                  <span>
                    <strong className="font-mono-tabular text-[#0C2340]">
                      ข้อที่ {q.id} / {totalQuestions}
                    </strong>{' '}
                    · หมวดย่อย: <strong className="text-[#8A6116]">{q.dimensionLabel}</strong>
                  </span>
                  {selectedValue !== undefined ? (
                    <span className="text-emerald-700 font-bold inline-flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>บันทึกแล้ว</span>
                    </span>
                  ) : (
                    <span className="text-slate-400">รอเลือกคำตอบ</span>
                  )}
                </div>

                <h3 className="text-base sm:text-lg font-bold text-[#0C2340] leading-relaxed">
                  {q.statement}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 mt-1">{q.scenarioHint}</p>

                <div className="mt-3.5 grid grid-cols-1 sm:grid-cols-5 gap-2">
                  {LIKERT_OPTIONS.map((opt) => {
                    const isSelected = selectedValue === opt.value;
                    return (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => handleSelectOption(q.id, opt.value)}
                        className={`min-h-[48px] sm:min-h-[54px] p-3 rounded-xl border text-left sm:text-center transition-all cursor-pointer flex sm:flex-col items-center justify-between sm:justify-center gap-1 ${
                          isSelected
                            ? 'bg-[#0C2340] border-[#B48327] text-white shadow-xs'
                            : 'bg-[#FAF8F5] border-[#E6DFD3] text-[#0C2340] hover:bg-white hover:border-[#B48327]'
                        }`}
                      >
                        <span className="text-xs sm:text-sm font-bold leading-snug">
                          {opt.label}
                        </span>
                        <span
                          className={`text-[11px] font-mono-tabular shrink-0 ${
                            isSelected ? 'text-[#F4D078]' : 'text-slate-500'
                          }`}
                        >
                          {opt.sublabel}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Bottom Navigation & Submit Bar */}
      <div className="bg-white border border-[#D6CEBF] rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-start">
          <button
            type="button"
            onClick={handlePrevPage}
            disabled={currentPage === 0 || showUnansweredOnly}
            className="min-h-[44px] px-4 py-2 text-xs sm:text-sm font-bold text-[#0C2340] bg-[#FAF8F5] hover:bg-[#F3EFE6] border border-[#D6CEBF] disabled:opacity-40 rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>หน้าก่อนหน้า</span>
          </button>

          {!showUnansweredOnly && (
            <span className="text-xs sm:text-sm font-mono-tabular font-bold text-[#0C2340] px-2">
              หน้า {currentPage + 1} / {totalPages}
            </span>
          )}

          {currentPage < totalPages - 1 && !showUnansweredOnly && (
            <button
              type="button"
              onClick={handleNextPage}
              className="min-h-[44px] px-4 py-2 text-xs sm:text-sm font-bold text-white bg-[#0C2340] hover:bg-slate-900 rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <span>หน้าถัดไป</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>

        <button
          type="button"
          disabled={isSubmitting}
          onClick={handleTrySubmit}
          className={`w-full sm:w-auto min-h-[46px] px-5 py-2.5 text-sm font-bold rounded-xl transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 border ${
            answeredCount === totalQuestions
              ? 'bg-[#0C2340] hover:bg-slate-900 text-[#F4D078] border-[#B48327] shadow-xs'
              : 'bg-[#FAF8F5] hover:bg-[#FBF6EA] text-[#0C2340] border-[#D6CEBF]'
          }`}
        >
          {isSubmitting ? (
            <Loader2 className="w-4 h-4 shrink-0 animate-spin" />
          ) : (
            <CheckCircle2 className="w-4 h-4 shrink-0 text-[#B48327]" />
          )}
          <span>
            {answeredCount === totalQuestions
              ? `ส่งคำตอบและดูรายงานผล (${totalQuestions} ข้อ)`
              : `ส่งแบบประเมิน (${answeredCount}/${totalQuestions} ข้อ)`}
          </span>
        </button>
      </div>
    </div>
  );
};
