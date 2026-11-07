import React, { useState } from 'react';
import {
  BarChart3,
  Calendar,
  CheckCircle2,
  Edit3,
  FileCheck2,
  MessageSquare,
  Phone,
  Printer,
  RotateCcw,
  SlidersHorizontal,
  User,
  X,
} from 'lucide-react';
import { AssessmentReport } from '../types/assessment';
import {
  CategoryComparisonBarChart,
  DISCProfileBarChart,
  EnneagramBarChart,
  EQAQRIASECBarChart,
  MBTIBipolarSpectrumChart,
  PentagonRadarChart,
} from './Charts';
import { ExecutiveSummaryPrintSheet } from './ExecutiveSummaryPrintSheet';

interface CandidateGraphViewProps {
  report: AssessmentReport;
  savedToCloud: boolean;
  onEditSubmittedAssessment: () => void;
  onStartNewAssessment: () => void;
}

type CandidateReportTab = 'EXECUTIVE_PDF' | 'FULL_REPORT';

export const CandidateGraphView: React.FC<CandidateGraphViewProps> = ({
  report,
  savedToCloud,
  onEditSubmittedAssessment,
  onStartNewAssessment,
}) => {
  const [activeTab, setActiveTab] = useState<CandidateReportTab>('EXECUTIVE_PDF');
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

  const handlePrintExecutivePDF = () => {
    setActiveTab('EXECUTIVE_PDF');
    setTimeout(() => {
      window.print();
    }, 80);
  };

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 py-4 sm:py-6 print-one-page">
      {/* Top Action & Unified Candidate Info Bar (Hidden on Print) */}
      <div className="no-print max-w-6xl mx-auto mb-5 bg-white border border-[#D6CEBF] rounded-2xl p-3.5 sm:p-4 flex flex-col gap-3 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{savedToCloud ? 'บันทึกขึ้น Cloud แล้ว' : 'บันทึกผลสำเร็จ'}</span>
            </div>

            <button
              type="button"
              onClick={() => setShowCandidateInfoModal(true)}
              title="กดเพื่อดูข้อมูลผู้สมัคร"
              className="min-h-[40px] px-3.5 py-1.5 text-xs sm:text-sm font-bold text-[#0C2340] bg-[#FAF8F5] hover:bg-[#FBF6EA] border border-[#D6CEBF] hover:border-[#B48327] rounded-xl transition-colors inline-flex items-center gap-1.5 cursor-pointer"
            >
              <User className="w-4 h-4 text-[#B48327] shrink-0" />
              <span>
                คุณ{candidate.firstName} {candidate.lastName} ({candidate.nickname})
              </span>
              <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-mono-tabular text-xs">
                {overallScore}%
              </span>
            </button>

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
                <span>หน้ารายงานกราฟครบทุกหมวดหมู่</span>
              </button>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={onEditSubmittedAssessment}
              className="min-h-[40px] px-3.5 py-1.5 text-xs font-bold text-[#0C2340] bg-[#FAF8F5] hover:bg-[#FBF6EA] border border-[#D6CEBF] rounded-xl transition-colors inline-flex items-center gap-1.5 cursor-pointer"
            >
              <Edit3 className="w-3.5 h-3.5 text-[#B48327]" />
              <span>แก้ไขข้อมูล / คำตอบ</span>
            </button>

            {activeTab === 'FULL_REPORT' && (
              <button
                type="button"
                onClick={() => setShowBenchmark((prev) => !prev)}
                className="min-h-[40px] px-3.5 py-1.5 text-xs font-semibold text-[#0C2340] bg-[#FAF8F5] hover:bg-[#F3EFE6] border border-[#D6CEBF] rounded-xl transition-colors inline-flex items-center gap-1.5 cursor-pointer"
              >
                <SlidersHorizontal className="w-3.5 h-3.5 text-[#B48327]" />
                <span>{showBenchmark ? 'ซ่อนเกณฑ์มาตรฐาน' : 'แสดงเกณฑ์มาตรฐาน'}</span>
              </button>
            )}

            <button
              type="button"
              onClick={handlePrintExecutivePDF}
              className="flex-1 sm:flex-initial min-h-[40px] px-4 py-1.5 text-xs sm:text-sm font-bold text-[#F4D078] bg-[#0C2340] hover:bg-slate-900 border border-[#B48327] rounded-xl transition-colors inline-flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
            >
              <Printer className="w-4 h-4 text-[#F4D078] shrink-0" />
              <span>พิมพ์หน้าสรุปผลรายงาน PDF (A4)</span>
            </button>

            <button
              type="button"
              onClick={onStartNewAssessment}
              className="min-h-[40px] px-3.5 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors inline-flex items-center gap-1.5 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>ทำรายการใหม่</span>
            </button>
          </div>
        </div>
      </div>

      {/* 1. EXECUTIVE SUMMARY PRINT SHEET */}
      <div className={activeTab === 'EXECUTIVE_PDF' ? 'block' : 'hidden print:block'}>
        <ExecutiveSummaryPrintSheet report={report} />
      </div>

      {/* 2. FULL INTERACTIVE GRAPH VIEW */}
      {activeTab === 'FULL_REPORT' && (
        <div className="no-print max-w-6xl mx-auto space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <PentagonRadarChart
              title="กราฟเรดาร์ที่ 1: บุคลิกภาพสากล 5 มิติหลัก (Big Five / OCEAN)"
              subtitle="โครงสร้างอุปนิสัยพื้นฐาน 5 มิติเทียบกับเกณฑ์มาตรฐานที่ปรึกษาการเงิน"
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
        </div>
      )}

      {/* UNIFIED CANDIDATE INFO MODAL */}
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
                    ข้อมูลผู้สมัครของคุณ
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
              <div className="pt-1 border-t border-[#E6DFD3] text-slate-700">
                <strong>สรุปภาพรวม:</strong> {oneLineSummary}
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-1">
              <button
                type="button"
                onClick={() => {
                  setShowCandidateInfoModal(false);
                  onEditSubmittedAssessment();
                }}
                className="min-h-[40px] px-4 py-2 rounded-xl bg-[#0C2340] text-[#F4D078] border border-[#B48327] text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>แก้ไขคำตอบ</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
