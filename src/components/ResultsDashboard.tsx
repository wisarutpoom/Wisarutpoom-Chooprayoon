import React, { useState } from 'react';
import {
  AlertTriangle,
  ArrowLeft,
  Award,
  BarChart3,
  Calendar,
  Compass,
  FileCheck2,
  MessageSquare,
  Phone,
  Printer,
  SlidersHorizontal,
  User,
  X,
} from 'lucide-react';
import {
  AssessmentReport,
  CategoryAnalysis,
} from '../types/assessment';
import {
  CategoryComparisonBarChart,
  DISCProfileBarChart,
  EnneagramBarChart,
  EQAQRIASECBarChart,
  MBTIBipolarSpectrumChart,
  PentagonRadarChart,
} from './Charts';
import { ExecutiveSummaryPrintSheet } from './ExecutiveSummaryPrintSheet';

interface ResultsDashboardProps {
  report: AssessmentReport;
  onBackToOverview: () => void;
}

type ReportTab = 'EXECUTIVE_PDF' | 'FULL_REPORT';

export const ResultsDashboard: React.FC<ResultsDashboardProps> = ({
  report,
  onBackToOverview,
}) => {
  const [activeTab, setActiveTab] = useState<ReportTab>('EXECUTIVE_PDF');
  const [showBenchmark, setShowBenchmark] = useState(true);
  const [showCandidateInfoModal, setShowCandidateInfoModal] = useState(false);

  const {
    candidate,
    overallScore,
    suitabilityHeadline,
    oneLineSummary,
    mbti,
    bigFive,
    disc,
    eqAq,
    riasecDrive,
    enneagram,
    competencies,
    roadmap,
  } = report;

  const bigFiveRadarItems = bigFive.map((item) => ({
    shortCode: item.code.split('·')[0].trim(),
    label: item.title,
    score: item.score,
    benchmark: item.benchmark,
  }));

  const competencyRadarItems = competencies.map((item) => ({
    shortCode: item.title.split(' (')[0].replace('การ', '').trim(),
    label: item.title,
    score: item.score,
    benchmark: item.benchmark,
  }));

  const allCategories: CategoryAnalysis[] = [
    ...competencies,
    ...eqAq,
    ...riasecDrive,
    ...bigFive,
    ...disc.categories,
  ];

  const handlePrintExecutivePDF = () => {
    setActiveTab('EXECUTIVE_PDF');
    setTimeout(() => {
      window.print();
    }, 80);
  };

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 py-4 sm:py-6 print-one-page">
      {/* =====================================================================
          TOP NAVIGATION & UNIFIED CANDIDATE INFO BAR (Hidden on print)
          ===================================================================== */}
      <div className="no-print max-w-6xl mx-auto mb-5 bg-white border border-[#D6CEBF] rounded-2xl p-3.5 sm:p-4 flex flex-col gap-3 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={onBackToOverview}
              className="min-h-[42px] px-3.5 py-2 text-xs sm:text-sm font-bold text-[#0C2340] bg-[#FAF8F5] hover:bg-[#F3EFE6] border border-[#D6CEBF] rounded-xl transition-colors inline-flex items-center gap-1.5 cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>กลับหน้ารายชื่อ</span>
            </button>

            <button
              type="button"
              onClick={() => setShowCandidateInfoModal(true)}
              title="กดเพื่อดูข้อมูลผู้สมัคร"
              className="min-h-[42px] px-3.5 py-2 text-xs sm:text-sm font-bold text-[#0C2340] bg-[#FAF8F5] hover:bg-[#FBF6EA] border border-[#D6CEBF] hover:border-[#B48327] rounded-xl transition-colors inline-flex items-center gap-2 cursor-pointer"
            >
              <User className="w-4 h-4 text-[#B48327] shrink-0" />
              <span>
                คุณ{candidate.firstName} {candidate.lastName} ({candidate.nickname})
              </span>
              <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-mono-tabular text-xs">
                {overallScore}%
              </span>
            </button>

            {/* 2-Tab Switcher — Complete Tab Headings */}
            <div className="w-full sm:w-auto grid grid-cols-1 sm:grid-cols-2 gap-1 p-1 bg-[#FAF8F5] rounded-xl border border-[#D6CEBF]">
              <button
                type="button"
                onClick={() => setActiveTab('EXECUTIVE_PDF')}
                className={`min-h-[38px] px-3 py-1.5 text-xs sm:text-sm font-bold rounded-lg transition-colors cursor-pointer inline-flex items-center justify-center gap-1.5 ${
                  activeTab === 'EXECUTIVE_PDF'
                    ? 'bg-[#0C2340] text-[#F4D078] shadow-xs'
                    : 'text-slate-700 hover:text-[#0C2340]'
                }`}
              >
                <FileCheck2 className="w-4 h-4 shrink-0" />
                <span>หน้าสรุปผลรายงาน (สำหรับพิมพ์ PDF)</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('FULL_REPORT')}
                className={`min-h-[38px] px-3 py-1.5 text-xs sm:text-sm font-bold rounded-lg transition-colors cursor-pointer inline-flex items-center justify-center gap-1.5 ${
                  activeTab === 'FULL_REPORT'
                    ? 'bg-[#0C2340] text-white shadow-xs'
                    : 'text-slate-700 hover:text-[#0C2340]'
                }`}
              >
                <BarChart3 className="w-4 h-4 shrink-0" />
                <span>หน้ารายงานกราฟและรายละเอียดครบทุกหมวด</span>
              </button>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {activeTab === 'FULL_REPORT' && (
              <button
                type="button"
                onClick={() => setShowBenchmark((prev) => !prev)}
                className="flex-1 sm:flex-initial min-h-[42px] px-3.5 py-2 text-xs font-semibold text-[#0C2340] bg-[#FAF8F5] hover:bg-[#F3EFE6] border border-[#D6CEBF] rounded-xl transition-colors inline-flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <SlidersHorizontal className="w-3.5 h-3.5 text-[#B48327]" />
                <span>{showBenchmark ? 'ซ่อนเกณฑ์มาตรฐาน' : 'แสดงเกณฑ์มาตรฐาน'}</span>
              </button>
            )}

            <button
              type="button"
              onClick={handlePrintExecutivePDF}
              className="flex-1 sm:flex-initial min-h-[42px] px-4 py-2 text-xs sm:text-sm font-bold text-[#F4D078] bg-[#0C2340] hover:bg-slate-900 border border-[#B48327] rounded-xl transition-colors inline-flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
            >
              <Printer className="w-4 h-4 text-[#F4D078] shrink-0" />
              <span>พิมพ์หน้าสรุปผลรายงาน PDF (A4)</span>
            </button>
          </div>
        </div>
      </div>

      {/* =====================================================================
          1. EXECUTIVE SUMMARY PRINT SHEET (Tab 1 + Always used for PDF Print)
          ===================================================================== */}
      <div className={activeTab === 'EXECUTIVE_PDF' ? 'block' : 'hidden print:block'}>
        <ExecutiveSummaryPrintSheet report={report} />
      </div>

      {/* =====================================================================
          2. FULL INTERACTIVE GRAPH & CATEGORY REPORT (Tab 2)
          ===================================================================== */}
      {activeTab === 'FULL_REPORT' && (
        <div className="no-print max-w-6xl mx-auto space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <PentagonRadarChart
              title="กราฟเรดาร์ที่ 1: บุคลิกภาพสากล 5 มิติหลัก (Big Five / OCEAN)"
              subtitle="วัดพื้นฐานนิสัย ความมีวินัย มนุษยสัมพันธ์ และความมั่นคงทางอารมณ์"
              items={bigFiveRadarItems}
              showBenchmark={showBenchmark}
              accentColor="blue"
            />
            <PentagonRadarChart
              title="กราฟเรดาร์ที่ 2: สมรรถนะวิชาชีพตัวแทนประกันชีวิตและที่ปรึกษาการเงิน 5 ด้าน"
              subtitle="การเปิดตลาด การวางแผนการเงิน การปิดการขาย การดูแลลูกค้า และภาวะผู้นำ"
              items={competencyRadarItems}
              showBenchmark={showBenchmark}
              accentColor="emerald"
            />
          </div>

          <MBTIBipolarSpectrumChart mbtiCode={mbti.code} axes={mbti.axes} />
          <DISCProfileBarChart disc={disc} />
          <EQAQRIASECBarChart eqAq={eqAq} riasecDrive={riasecDrive} />
          <EnneagramBarChart enneagram={enneagram} />
          <CategoryComparisonBarChart bigFive={bigFive} competencies={competencies} />

          {/* 90-Day Roadmap */}
          <div className="bg-white border border-[#D6CEBF] rounded-2xl p-4 sm:p-6 space-y-4">
            <h3 className="text-base sm:text-lg font-bold text-[#0C2340] flex items-center gap-2">
              <Compass className="w-5 h-5 text-[#B48327] shrink-0" />
              <span>แผนพัฒนาศักยภาพตัวแทน 90 วันแรก (30-60-90 Day Coaching Roadmap)</span>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {roadmap.map((phase) => (
                <div
                  key={phase.phase}
                  className="p-4 rounded-xl bg-[#FAF8F5] border border-[#E6DFD3] space-y-2"
                >
                  <div className="text-xs font-bold text-[#8A6116]">{phase.timeframe}</div>
                  <div className="text-sm font-bold text-[#0C2340]">{phase.focusTitle}</div>
                  <div className="text-xs font-mono-tabular text-emerald-800 font-semibold">
                    เป้าหมาย KPI: {phase.keyMetrics}
                  </div>
                  <ul className="text-xs text-slate-700 space-y-1 pt-1 border-t border-[#E6DFD3]">
                    {phase.objectives.map((act, i) => (
                      <li key={i}>• {act}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* Detailed Category Cards — Full Category Titles */}
          <div className="bg-white border border-[#D6CEBF] rounded-2xl p-4 sm:p-6 space-y-4">
            <h3 className="text-base sm:text-lg font-bold text-[#0C2340] flex items-center gap-2">
              <Award className="w-5 h-5 text-[#B48327] shrink-0" />
              <span>รายละเอียดผลการประเมินรายหมวดหมู่ครบทุกมิติ: จุดเด่น · จุดด้อย · คำแนะนำการพัฒนา</span>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {allCategories.map((cat, idx) => (
                <div
                  key={cat.key}
                  className="p-4 rounded-xl bg-[#FAF8F5] border border-[#E6DFD3] space-y-2"
                >
                  <div className="flex items-start justify-between gap-2">
                    <h4 className="text-sm font-bold text-[#0C2340] leading-snug">
                      {idx + 1}. {cat.title}
                    </h4>
                    <span className="font-mono-tabular font-bold text-[#0C2340] text-base shrink-0">
                      {cat.score}%
                    </span>
                  </div>
                  <p className="text-xs text-slate-600">{cat.summary}</p>
                  <div className="text-xs space-y-1 pt-1.5 border-t border-[#E6DFD3]">
                    <div className="text-emerald-800">
                      <strong>จุดเด่น:</strong> {cat.strengths[0]}
                    </div>
                    <div className="text-amber-800">
                      <strong>จุดด้อย / ข้อควรระวัง:</strong> {cat.weaknesses[0]}
                    </div>
                    <div className="text-[#0C2340]">
                      <strong>คำแนะนำการพัฒนา:</strong> {cat.recommendations[0]}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* =====================================================================
          UNIFIED CANDIDATE INFO MODAL
          ===================================================================== */}
      {showCandidateInfoModal && (
        <div
          className="no-print fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4"
          onClick={() => setShowCandidateInfoModal(false)}
        >
          <div
            className="bg-white border border-[#D6CEBF] rounded-t-3xl sm:rounded-2xl max-w-md w-full p-5 sm:p-6 space-y-4 shadow-xl max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-3 pb-3 border-b border-[#E6DFD3]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#0C2340] text-[#F4D078] flex items-center justify-center font-bold shrink-0">
                  <User className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-bold text-[#8A6116]">
                    ข้อมูลผู้ตอบแบบสอบถาม
                  </div>
                  <h3 className="text-base font-bold text-[#0C2340]">
                    คุณ{candidate.firstName} {candidate.lastName} ({candidate.nickname})
                  </h3>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowCandidateInfoModal(false)}
                className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2.5 text-xs sm:text-sm">
              <div className="p-3 rounded-lg bg-[#FAF8F5] border border-[#E6DFD3]">
                <div className="text-xs text-slate-500">อายุ</div>
                <div className="font-bold text-[#0C2340] font-mono-tabular">
                  {candidate.age} ปี
                </div>
              </div>
              <div className="p-3 rounded-lg bg-[#FAF8F5] border border-[#E6DFD3]">
                <div className="text-xs text-slate-500">คะแนนรวม</div>
                <div className="font-bold text-emerald-700 font-mono-tabular">
                  {overallScore}% ({suitabilityHeadline})
                </div>
              </div>
              <div className="p-3 rounded-lg bg-[#FAF8F5] border border-[#E6DFD3]">
                <div className="text-xs text-slate-500 flex items-center gap-1">
                  <Phone className="w-3 h-3" /> โทรศัพท์
                </div>
                <div className="font-bold text-[#0C2340] font-mono-tabular">
                  {candidate.phone}
                </div>
              </div>
              <div className="p-3 rounded-lg bg-[#FAF8F5] border border-[#E6DFD3]">
                <div className="text-xs text-slate-500 flex items-center gap-1">
                  <MessageSquare className="w-3 h-3" /> Line ID
                </div>
                <div className="font-bold text-[#0C2340] font-mono-tabular">
                  {candidate.lineId}
                </div>
              </div>
            </div>

            <div className="p-3 rounded-lg bg-[#FAF8F5] border border-[#E6DFD3] space-y-1.5 text-xs">
              <div className="flex items-center gap-1.5 text-slate-600">
                <Calendar className="w-3.5 h-3.5" />
                <span>วันที่ประเมิน: {candidate.completedAt || 'วันนี้'}</span>
              </div>
              {candidate.isEdited && (
                <div className="text-amber-800 font-semibold flex items-center gap-1">
                  <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                  <span>
                    {candidate.editHistoryNote ||
                      `แก้ไขคำตอบครั้งที่ ${candidate.submissionCount || 2}`}
                  </span>
                </div>
              )}
              <div className="pt-1 border-t border-[#E6DFD3] text-slate-700">
                <strong>สรุปภาพรวม:</strong> {oneLineSummary}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
