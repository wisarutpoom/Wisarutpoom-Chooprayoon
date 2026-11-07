import React from 'react';
import {
  AlertTriangle,
  Award,
  Briefcase,
  CheckCircle2,
  Compass,
  ShieldCheck,
  Target,
  TrendingUp,
} from 'lucide-react';
import { AssessmentReport, CategoryAnalysis } from '../types/assessment';

interface ExecutiveSummaryPrintSheetProps {
  report: AssessmentReport;
}

export const ExecutiveSummaryPrintSheet: React.FC<ExecutiveSummaryPrintSheetProps> = ({
  report,
}) => {
  const {
    candidate,
    overallScore,
    suitabilityHeadline,
    mbti,
    bigFive,
    disc,
    eqAq,
    riasecDrive,
    enneagram,
    competencies,
    roleTracks,
    roadmap,
  } = report;

  const allCategories: CategoryAnalysis[] = [
    ...competencies,
    ...eqAq,
    ...riasecDrive,
    ...bigFive,
    ...disc.categories,
  ];

  const sortedByHighest = [...allCategories].sort((a, b) => b.score - a.score);
  const sortedByLowest = [...allCategories].sort((a, b) => a.score - b.score);

  const topStrengths = sortedByHighest.slice(0, 4);
  const topWeaknesses = sortedByLowest.slice(0, 4);

  const avgEQAQ = Math.round(eqAq.reduce((s, c) => s + c.score, 0) / eqAq.length);
  const avgComp = Math.round(
    competencies.reduce((s, c) => s + c.score, 0) / competencies.length
  );
  const avgBigFive = Math.round(
    bigFive.reduce((s, c) => s + c.score, 0) / bigFive.length
  );
  const avgDrive = Math.round(
    riasecDrive.reduce((s, c) => s + c.score, 0) / riasecDrive.length
  );

  const docRefNumber = `LAP-${candidate.phone.replace(/\D/g, '').slice(-4) || '2569'}-${overallScore}`;

  const verdictTier =
    overallScore >= 80
      ? {
          code: 'TIER I · DISTINGUISHED',
          label: 'ศักยภาพสูงมาก · พร้อมปั้นเป็นที่ปรึกษาการเงินแถวหน้า',
        }
      : overallScore >= 68
      ? {
          code: 'TIER II · QUALIFIED',
          label: 'ผ่านเกณฑ์มาตรฐาน · พร้อมพัฒนาสู่ระดับมืออาชีพ',
        }
      : {
          code: 'TIER III · DEVELOPMENT',
          label: 'ควรปูพื้นฐานและโค้ชอย่างใกล้ชิดใน 90 วันแรก',
        };

  return (
    <article className="a4-saraban-sheet flex flex-col justify-between text-[#0C2340] bg-white">
      <div className="space-y-3">
        {/* ===================================================================
            1. HERITAGE INSTITUTIONAL HEADER (ธีมไทยมาตรฐานสถาบันการเงิน)
            =================================================================== */}
        <header className="border-b-2 border-[#0C2340] pb-2.5">
          <div className="h-1 w-full bg-[#0C2340] mb-0.5" />
          <div className="h-[2px] w-full bg-[#B48327] mb-2" />

          <div className="flex flex-col sm:flex-row print:flex-row items-start justify-between gap-3">
            <div className="flex items-start sm:items-center gap-3">
              <div className="w-11 h-11 rounded-md bg-[#0C2340] border border-[#B48327] text-white flex flex-col items-center justify-center shrink-0">
                <ShieldCheck className="w-5 h-5 text-[#F4D078]" />
                <span className="text-[7.5px] font-mono-tabular tracking-widest text-[#F4D078] font-bold mt-0.5">
                  THAI STD
                </span>
              </div>
              <div>
                <div className="text-[9.5px] font-bold tracking-[0.12em] uppercase text-[#8A6116]">
                  LIFEADVISOR PSYCHOMETRICS · EXECUTIVE ASSESSMENT REPORT
                </div>
                <h1 className="text-base sm:text-[18px] font-bold text-[#0C2340] leading-tight">
                  ใบสรุปผลการประเมินศักยภาพและสมรรถนะที่ปรึกษาการเงิน
                </h1>
                <div className="text-[11px] text-slate-600 font-medium">
                  สรุปภาพรวม · จุดเด่น · จุดด้อย · คำแนะนำพัฒนา · สมรรถนะวิชาชีพ · แผนปฏิบัติการ 90 วัน
                </div>
              </div>
            </div>

            <div className="w-full sm:w-auto print:w-auto text-left sm:text-right print:text-right font-mono-tabular text-[10.5px] bg-[#FAF8F5] border border-[#D6CEBF] rounded px-2.5 py-1.5 shrink-0 leading-snug">
              <div className="text-[9.5px] font-bold text-[#8A6116] uppercase tracking-wider">
                OFFICIAL RECORD
              </div>
              <div>
                เลขที่อ้างอิง: <strong className="text-[#0C2340]">{docRefNumber}</strong>
              </div>
              <div className="text-slate-600">วันที่ประเมิน: {candidate.completedAt || 'วันนี้'}</div>
            </div>
          </div>

          {/* Candidate Identity & Overall Score Banner */}
          <div className="mt-2.5 grid grid-cols-12 items-stretch border border-[#D6CEBF] rounded-md overflow-hidden">
            <div className="col-span-12 sm:col-span-7 print:col-span-7 bg-[#FAF8F5] p-2.5 flex flex-col justify-between border-b sm:border-b-0 print:border-b-0 sm:border-r print:border-r border-[#D6CEBF]">
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <div>
                  <span className="text-[10px] font-bold text-[#8A6116] uppercase">
                    ชื่อ-นามสกุลผู้รับการประเมิน:
                  </span>
                  <div className="text-sm sm:text-[15px] font-bold text-[#0C2340]">
                    คุณ{candidate.firstName} {candidate.lastName}{' '}
                    <span className="text-slate-700 font-semibold">
                      (ชื่อเล่น: {candidate.nickname})
                    </span>
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded bg-white border border-[#D6CEBF] text-[10.5px] font-mono-tabular font-bold text-[#0C2340]">
                  อายุ {candidate.age} ปี
                </span>
              </div>

              <div className="mt-1.5 pt-1.5 border-t border-[#E6DFD3] flex flex-wrap items-center gap-x-4 gap-y-0.5 text-[11px] text-slate-700 font-mono-tabular">
                <span>
                  <strong>โทรศัพท์:</strong> {candidate.phone}
                </span>
                <span>·</span>
                <span>
                  <strong>Line ID:</strong>{' '}
                  <strong className="text-[#0C2340]">{candidate.lineId}</strong>
                </span>
                {candidate.isEdited && (
                  <span className="inline-flex items-center gap-1 text-amber-800 font-bold text-[10px]">
                    <AlertTriangle className="w-3 h-3" />
                    <span>แก้ไขครั้งที่ {candidate.submissionCount || 2}</span>
                  </span>
                )}
              </div>
            </div>

            <div className="col-span-12 sm:col-span-5 print:col-span-5 bg-[#0C2340] text-white p-2.5 flex items-center justify-between gap-2.5">
              <div className="pr-2.5 border-r border-slate-700 text-center shrink-0">
                <div className="text-[9.5px] text-[#F4D078] font-bold uppercase tracking-wider">
                  คะแนนรวมสุทธิ
                </div>
                <div className="text-2xl font-bold font-mono-tabular text-white leading-none mt-1">
                  {overallScore}%
                </div>
                <div className="text-[9.5px] text-emerald-300 font-semibold mt-1">
                  {suitabilityHeadline}
                </div>
              </div>

              <div className="flex-1 grid grid-cols-2 gap-1.5 text-center font-mono-tabular">
                <div className="bg-white/10 rounded px-1.5 py-1">
                  <div className="text-[9px] text-slate-300">MBTI 4 มิติ</div>
                  <div className="text-xs font-bold text-[#F4D078]">{mbti.code}</div>
                </div>
                <div className="bg-white/10 rounded px-1.5 py-1">
                  <div className="text-[9px] text-slate-300">สไตล์ DISC</div>
                  <div className="text-xs font-bold text-white">{disc.blendCode}</div>
                </div>
                <div className="bg-white/10 rounded px-1.5 py-1">
                  <div className="text-[9px] text-slate-300">นพลักษณ์</div>
                  <div className="text-xs font-bold text-white">
                    {enneagram.wingCode}
                  </div>
                </div>
                <div className="bg-white/10 rounded px-1.5 py-1">
                  <div className="text-[9px] text-slate-300">ความอึด EQ/AQ</div>
                  <div className="text-xs font-bold text-emerald-300">{avgEQAQ}%</div>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* ===================================================================
            2. ส่วนที่ ๑ : บทสรุปและวิเคราะห์ภาพรวม (COMPLETE HEADINGS & SYNTHESIS)
            =================================================================== */}
        <section className="border border-[#D6CEBF] rounded-md overflow-hidden print-break-inside-avoid">
          <div className="bg-[#0C2340] text-white px-3 py-1.5 flex flex-wrap items-center justify-between gap-2 border-b border-[#B48327]">
            <div className="flex items-center gap-1.5 text-xs font-bold">
              <Award className="w-3.5 h-3.5 text-[#F4D078] shrink-0" />
              <span>ส่วนที่ ๑ : บทสรุปผลการประเมินและวิเคราะห์ภาพรวม (Executive Synthesis)</span>
            </div>
            <span className="text-[10px] font-mono-tabular font-bold text-[#F4D078] tracking-wide">
              {verdictTier.code}
            </span>
          </div>

          <div className="p-3 bg-white space-y-2">
            <div className="grid grid-cols-12 gap-2.5 items-center bg-[#FAF8F5] border border-[#E6DFD3] rounded p-2.5">
              <div className="col-span-12 md:col-span-8 print:col-span-8 space-y-1">
                <div className="text-xs font-bold text-[#0C2340]">
                  สรุปผลภาพรวม: <span className="text-[#8A6116]">{verdictTier.label}</span>
                </div>
                <p className="text-[11.5px] text-slate-800 leading-relaxed">
                  บุคลิกภาพหลัก{' '}
                  <strong className="text-[#0C2340]">
                    {mbti.code} ({mbti.personaTitle})
                  </strong>{' '}
                  · พฤติกรรมการทำงาน{' '}
                  <strong className="text-[#0C2340]">
                    DISC-{disc.blendCode} ({disc.styleTitle})
                  </strong>{' '}
                  · แรงจูงใจนพลักษณ์{' '}
                  <strong className="text-[#0C2340]">
                    {enneagram.title}
                  </strong>{' '}
                  ถนัดกลยุทธ์{' '}
                  <strong className="underline decoration-[#B48327]">
                    "{mbti.recommendedSalesStyle}"
                  </strong>
                </p>
              </div>

              <div className="col-span-12 md:col-span-4 print:col-span-4 grid grid-cols-2 gap-1.5 border-t md:border-t-0 print:border-t-0 md:border-l print:border-l border-[#E6DFD3] pt-2 md:pt-0 print:pt-0 md:pl-2.5 print:pl-2.5">
                <div className="bg-white border border-[#E6DFD3] rounded px-2 py-1">
                  <div className="text-[9.5px] text-slate-500">สมรรถนะตัวแทน 5 ด้าน</div>
                  <div className="text-xs font-bold font-mono-tabular text-[#0C2340]">
                    {avgComp}% <span className="text-[9px] font-normal text-slate-500">(เกณฑ์ 76%)</span>
                  </div>
                </div>
                <div className="bg-white border border-[#E6DFD3] rounded px-2 py-1">
                  <div className="text-[9.5px] text-slate-500">บุคลิกภาพ Big Five</div>
                  <div className="text-xs font-bold font-mono-tabular text-[#0C2340]">
                    {avgBigFive}% <span className="text-[9px] font-normal text-slate-500">(เกณฑ์ 75%)</span>
                  </div>
                </div>
                <div className="bg-white border border-[#E6DFD3] rounded px-2 py-1">
                  <div className="text-[9.5px] text-slate-500">อารมณ์และความอึด EQ/AQ</div>
                  <div className="text-xs font-bold font-mono-tabular text-emerald-800">
                    {avgEQAQ}% <span className="text-[9px] font-normal text-slate-500">(เกณฑ์ 78%)</span>
                  </div>
                </div>
                <div className="bg-white border border-[#E6DFD3] rounded px-2 py-1">
                  <div className="text-[9.5px] text-slate-500">ความถนัดและแรงขับขาย</div>
                  <div className="text-xs font-bold font-mono-tabular text-[#8A6116]">
                    {avgDrive}% <span className="text-[9px] font-normal text-slate-500">(เกณฑ์ 76%)</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-12 gap-2 items-center text-[11px] bg-[#FAF8F5] border border-[#E6DFD3] rounded px-2.5 py-1.5">
              <div className="col-span-12 sm:col-span-7 print:col-span-7 flex flex-wrap items-center gap-x-2.5 gap-y-1">
                <span className="font-bold text-[#0C2340] inline-flex items-center gap-1">
                  <Briefcase className="w-3.5 h-3.5 text-[#B48327]" />
                  <span>สายงานที่เหมาะสม:</span>
                </span>
                {roleTracks.slice(0, 3).map((t) => (
                  <span
                    key={t.id}
                    className={
                      t.rank === 1
                        ? 'font-bold text-[#0C2340] bg-[#FBF6EA] border border-[#E5C878] px-1.5 py-0.5 rounded'
                        : 'text-slate-700'
                    }
                  >
                    อันดับ {t.rank}: {t.title} ({t.matchScore}%)
                  </span>
                ))}
              </div>
              <div className="col-span-12 sm:col-span-5 print:col-span-5 sm:text-right print:text-right text-slate-700">
                <strong className="text-[#0C2340]">กลุ่มลูกค้าเป้าหมาย:</strong>{' '}
                {mbti.idealClientSegment}
              </div>
            </div>
          </div>
        </section>

        {/* ===================================================================
            3. ส่วนที่ ๒ : จุดเด่น · จุดด้อย · คำแนะนำพัฒนา (FULL UNTRUNCATED TITLES)
            =================================================================== */}
        <section className="space-y-2 print-break-inside-avoid">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b-2 border-[#0C2340] pb-1">
            <h2 className="text-xs font-bold text-[#0C2340] flex items-center gap-1.5">
              <Target className="w-3.5 h-3.5 text-[#B48327]" />
              <span>ส่วนที่ ๒ : สรุปจุดเด่นหลัก · จุดด้อยที่ต้องระวัง · และคำแนะนำการพัฒนา</span>
            </h2>
            <span className="text-[10px] text-slate-500 font-medium">
              วิเคราะห์ครบทั้ง 60 ข้อ · 7 มาตรฐานสากล
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 print:grid-cols-3 gap-2.5">
            {/* COLUMN 1: จุดเด่น */}
            <div className="border border-emerald-300 rounded-md overflow-hidden bg-white flex flex-col">
              <div className="bg-emerald-900 text-white px-2.5 py-1.5 flex items-center justify-between">
                <span className="text-[11px] font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-300" />
                  <span>๒.๑ สรุปจุดเด่นหลัก (Strengths)</span>
                </span>
                <span className="text-[9.5px] text-emerald-200 font-mono-tabular">TOP 4</span>
              </div>
              <div className="p-2.5 space-y-2 flex-1">
                {topStrengths.map((item, idx) => (
                  <div
                    key={item.key}
                    className="pb-1.5 border-b border-slate-100 last:border-b-0 last:pb-0"
                  >
                    <div className="flex items-start justify-between gap-1.5 text-[11px] font-bold text-[#0C2340]">
                      <span className="leading-snug">
                        {idx + 1}. {item.title}
                      </span>
                      <span className="font-mono-tabular text-emerald-800 shrink-0">
                        {item.score}%
                      </span>
                    </div>
                    <p className="text-[10.5px] text-slate-700 leading-snug mt-0.5">
                      {item.strengths[0]}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* COLUMN 2: จุดด้อย */}
            <div className="border border-amber-300 rounded-md overflow-hidden bg-white flex flex-col">
              <div className="bg-amber-900 text-white px-2.5 py-1.5 flex items-center justify-between">
                <span className="text-[11px] font-bold flex items-center gap-1">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-300" />
                  <span>๒.๒ จุดด้อยและข้อควรระวัง (Weaknesses)</span>
                </span>
                <span className="text-[9.5px] text-amber-200 font-mono-tabular">FOCUS</span>
              </div>
              <div className="p-2.5 space-y-2 flex-1">
                {topWeaknesses.map((item, idx) => (
                  <div
                    key={item.key}
                    className="pb-1.5 border-b border-slate-100 last:border-b-0 last:pb-0"
                  >
                    <div className="flex items-start justify-between gap-1.5 text-[11px] font-bold text-[#0C2340]">
                      <span className="leading-snug">
                        {idx + 1}. {item.title}
                      </span>
                      <span className="font-mono-tabular text-amber-800 shrink-0">
                        {item.score}%
                      </span>
                    </div>
                    <p className="text-[10.5px] text-slate-700 leading-snug mt-0.5">
                      {item.weaknesses[0]}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* COLUMN 3: คำแนะนำ */}
            <div className="border border-[#D6CEBF] rounded-md overflow-hidden bg-white flex flex-col">
              <div className="bg-[#0C2340] text-white px-2.5 py-1.5 flex items-center justify-between">
                <span className="text-[11px] font-bold flex items-center gap-1">
                  <TrendingUp className="w-3.5 h-3.5 text-[#F4D078]" />
                  <span>๒.๓ สรุปคำแนะนำการพัฒนา (Action Plan)</span>
                </span>
                <span className="text-[9.5px] text-[#F4D078] font-mono-tabular">ACTION</span>
              </div>
              <div className="p-2.5 space-y-2 flex-1">
                {topWeaknesses.slice(0, 3).map((item, idx) => (
                  <div
                    key={item.key}
                    className="pb-1.5 border-b border-slate-100 last:border-b-0 last:pb-0"
                  >
                    <div className="text-[11px] font-bold text-[#0C2340] leading-snug">
                      {idx + 1}. แนวทางเสริม{item.title}
                    </div>
                    <p className="text-[10.5px] text-slate-700 leading-snug mt-0.5">
                      {item.recommendations[0]}
                    </p>
                  </div>
                ))}
                <div className="pt-0.5">
                  <div className="text-[11px] font-bold text-[#0C2340] leading-snug">
                    4. การโค้ชตามนพลักษณ์ ({enneagram.wingCode})
                  </div>
                  <p className="text-[10.5px] text-slate-700 leading-snug mt-0.5">
                    {enneagram.coachingAdvice}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ===================================================================
            4. ส่วนที่ ๓ : สมรรถนะวิชาชีพ 5 ด้าน & แผนปั้น 30-60-90 วัน
            =================================================================== */}
        <section className="grid grid-cols-1 md:grid-cols-12 print:grid-cols-12 gap-2.5 print-break-inside-avoid">
          <div className="md:col-span-7 print:col-span-7 border border-[#D6CEBF] rounded-md p-2.5 bg-white">
            <div className="flex flex-wrap items-center justify-between gap-1 border-b border-[#E6DFD3] pb-1 mb-2">
              <h3 className="text-[11px] font-bold text-[#0C2340] flex items-center gap-1">
                <Award className="w-3.5 h-3.5 text-[#B48327] shrink-0" />
                <span>ส่วนที่ ๓.๑ : ผลประเมินสมรรถนะวิชาชีพตัวแทนประกันชีวิตครบทั้ง 5 มิติหลัก</span>
              </h3>
              <span className="text-[10px] text-slate-500">เทียบเกณฑ์มาตรฐาน</span>
            </div>

            <div className="space-y-2">
              {competencies.map((comp) => {
                const diff = comp.score - comp.benchmark;
                return (
                  <div key={comp.key} className="space-y-0.5">
                    <div className="flex items-start justify-between gap-2 text-[10.5px]">
                      <span className="font-bold text-[#0C2340] leading-snug">
                        {comp.title}
                      </span>
                      <div className="flex items-center gap-1.5 font-mono-tabular shrink-0">
                        <span className="text-[10px] text-slate-500">
                          เกณฑ์ {comp.benchmark}%
                        </span>
                        <span
                          className={`text-[10px] font-bold ${
                            diff >= 0 ? 'text-emerald-700' : 'text-amber-700'
                          }`}
                        >
                          ({diff >= 0 ? `+${diff}%` : `${diff}%`})
                        </span>
                        <span className="font-bold text-[#0C2340] text-[11px] w-9 text-right">
                          {comp.score}%
                        </span>
                      </div>
                    </div>
                    <div className="relative h-2 w-full bg-slate-200 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${
                          comp.score >= comp.benchmark ? 'bg-[#0C2340]' : 'bg-amber-600'
                        }`}
                        style={{ width: `${comp.score}%` }}
                      />
                      <div
                        className="absolute inset-y-0 w-0.5 bg-[#B48327]"
                        style={{ left: `${comp.benchmark}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="md:col-span-5 print:col-span-5 border border-[#D6CEBF] rounded-md p-2.5 bg-[#FAF8F5] flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between border-b border-[#E6DFD3] pb-1 mb-1.5">
                <h3 className="text-[11px] font-bold text-[#0C2340] flex items-center gap-1">
                  <Compass className="w-3.5 h-3.5 text-[#B48327] shrink-0" />
                  <span>ส่วนที่ ๓.๒ : แผนปฏิบัติการปั้นตัวแทน 30-60-90 วัน</span>
                </h3>
              </div>

              <div className="space-y-1.5">
                {roadmap.map((phase) => (
                  <div
                    key={phase.phase}
                    className="px-2.5 py-1.5 rounded bg-white border border-[#E6DFD3] leading-snug"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-1 text-[10px] font-bold text-[#8A6116]">
                      <span>{phase.timeframe}</span>
                      <span className="font-mono-tabular text-slate-600">
                        {phase.keyMetrics}
                      </span>
                    </div>
                    <div className="text-[10.5px] font-bold text-[#0C2340] mt-0.5">
                      {phase.focusTitle}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-2 pt-1.5 border-t border-[#E6DFD3] text-[10px] text-slate-600">
              <span>ข้อควรระวังหลัก ({mbti.code}): </span>
              <strong className="text-[#0C2340]">
                {mbti.blindSpots[0]}
              </strong>
            </div>
          </div>
        </section>
      </div>

      {/* ===================================================================
          5. OFFICIAL ATTESTATION & SIGNATURE FOOTER (มาตรฐานงานสารบรรณ)
          =================================================================== */}
      <footer className="mt-3 pt-2.5 border-t-2 border-[#0C2340] print-break-inside-avoid">
        <div className="grid grid-cols-1 sm:grid-cols-2 print:grid-cols-2 gap-4 sm:gap-8 text-center text-[10.5px] text-slate-800 pt-1">
          <div className="space-y-3">
            <div>
              ลงชื่อ ............................................................ ผู้รับการประเมิน
            </div>
            <div className="text-[10px] text-slate-600 font-semibold">
              ( คุณ{candidate.firstName} {candidate.lastName} )
            </div>
          </div>
          <div className="space-y-3">
            <div>
              ลงชื่อ ............................................................ ผู้บริหารหน่วย / ผู้อนุมัติผล
            </div>
            <div className="text-[10px] text-slate-600">
              ( ............................................................ )
            </div>
          </div>
        </div>

        <div className="mt-2 pt-1.5 border-t border-[#E6DFD3] flex flex-col sm:flex-row print:flex-row items-center justify-between gap-1 text-[9.5px] text-slate-500">
          <span>
            LIFEADVISOR PSYCHOMETRICS · มาตรฐานงานสารบรรณ A4 (ขอบบน 2.5 · ล่าง 2.0 · ซ้าย 3.0 · ขวา 2.0 ซม.)
          </span>
          <span className="font-mono-tabular font-bold text-[#0C2340]">
            เอกสารรับรองผลฉบับสมบูรณ์ · หน้า ๑ / ๑
          </span>
        </div>
      </footer>
    </article>
  );
};
