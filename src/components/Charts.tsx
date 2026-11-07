import React from 'react';
import {
  CategoryAnalysis,
  DISCResult,
  EnneagramResult,
  MBTIAxisDetail,
} from '../types/assessment';

interface RadarPoint {
  label: string;
  shortCode: string;
  score: number;
  benchmark: number;
}

interface PentagonRadarChartProps {
  title: string;
  subtitle: string;
  items: RadarPoint[];
  showBenchmark: boolean;
  accentColor?: 'blue' | 'emerald';
}

export const PentagonRadarChart: React.FC<PentagonRadarChartProps> = ({
  title,
  subtitle,
  items,
  showBenchmark,
  accentColor = 'blue',
}) => {
  const size = 380;
  const center = size / 2;
  const radius = 104;
  const levels = [20, 40, 60, 80, 100];

  const getCoordinates = (index: number, valuePct: number, total: number) => {
    const angle = (Math.PI * 2 * index) / total - Math.PI / 2;
    const r = (valuePct / 100) * radius;
    return {
      x: center + r * Math.cos(angle),
      y: center + r * Math.sin(angle),
      angle,
    };
  };

  const total = items.length;
  const scorePoints = items
    .map((item, i) => {
      const pt = getCoordinates(i, item.score, total);
      return `${pt.x.toFixed(1)},${pt.y.toFixed(1)}`;
    })
    .join(' ');

  const benchmarkPoints = items
    .map((item, i) => {
      const pt = getCoordinates(i, item.benchmark, total);
      return `${pt.x.toFixed(1)},${pt.y.toFixed(1)}`;
    })
    .join(' ');

  const strokeHex = accentColor === 'blue' ? '#0C2340' : '#047857';
  const fillRgba =
    accentColor === 'blue' ? 'rgba(12, 35, 64, 0.16)' : 'rgba(4, 120, 87, 0.16)';

  return (
    <div className="bg-white border border-[#D6CEBF] rounded-2xl p-4 sm:p-6 print-break-inside-avoid">
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 pb-4 border-b border-[#E6DFD3]">
        <div>
          <h3 className="text-base sm:text-lg font-bold text-[#0C2340] leading-snug">
            {title}
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 mt-0.5">{subtitle}</p>
        </div>
        <div className="flex flex-wrap items-center gap-3 text-xs sm:text-sm text-slate-700 shrink-0">
          <span className="flex items-center gap-1.5">
            <span
              className={`inline-block w-3 h-3 rounded-xs ${
                accentColor === 'blue' ? 'bg-[#0C2340]' : 'bg-emerald-700'
              }`}
            />
            <span>คะแนนผู้ประเมิน</span>
          </span>
          {showBenchmark && (
            <span className="flex items-center gap-1.5">
              <span className="inline-block w-3.5 h-0.5 border-t-2 border-dashed border-[#B48327]" />
              <span>เกณฑ์มาตรฐาน</span>
            </span>
          )}
        </div>
      </div>

      <div className="mt-4 flex flex-col xl:flex-row items-center gap-6">
        <div className="w-full max-w-[340px] mx-auto shrink-0">
          <svg
            viewBox={`0 0 ${size} ${size}`}
            className="w-full h-auto overflow-visible"
            role="img"
            aria-label={title}
          >
            {levels.map((lvl) => {
              const ringPts = items
                .map((_, idx) => {
                  const pt = getCoordinates(idx, lvl, total);
                  return `${pt.x.toFixed(1)},${pt.y.toFixed(1)}`;
                })
                .join(' ');
              return (
                <g key={lvl}>
                  <polygon
                    points={ringPts}
                    fill="none"
                    stroke={lvl === 100 ? '#C7BFA8' : '#E6DFD3'}
                    strokeWidth={lvl === 100 ? '1.25' : '1'}
                  />
                  <text
                    x={center + 4}
                    y={center - (lvl / 100) * radius + 11}
                    className="fill-slate-400 text-[10px] font-mono-tabular"
                  >
                    {lvl}%
                  </text>
                </g>
              );
            })}

            {items.map((_, idx) => {
              const outer = getCoordinates(idx, 100, total);
              return (
                <line
                  key={idx}
                  x1={center}
                  y1={center}
                  x2={outer.x}
                  y2={outer.y}
                  stroke="#E6DFD3"
                  strokeWidth="1"
                />
              );
            })}

            {showBenchmark && (
              <polygon
                points={benchmarkPoints}
                fill="rgba(180, 131, 39, 0.08)"
                stroke="#B48327"
                strokeWidth="1.75"
                strokeDasharray="4 3"
              />
            )}

            <polygon
              points={scorePoints}
              fill={fillRgba}
              stroke={strokeHex}
              strokeWidth="2.5"
            />

            {items.map((item, idx) => {
              const pt = getCoordinates(idx, item.score, total);
              const labelPos = getCoordinates(idx, 128, total);
              const textAnchor =
                Math.abs(labelPos.x - center) < 12
                  ? 'middle'
                  : labelPos.x > center
                  ? 'start'
                  : 'end';

              return (
                <g key={item.shortCode}>
                  <circle
                    cx={pt.x}
                    cy={pt.y}
                    r="5"
                    fill="#FFFFFF"
                    stroke={strokeHex}
                    strokeWidth="2.5"
                  />
                  <text
                    x={labelPos.x}
                    y={labelPos.y - 4}
                    textAnchor={textAnchor}
                    className="fill-[#0C2340] text-[11.5px] font-bold"
                  >
                    {item.shortCode}
                  </text>
                  <text
                    x={labelPos.x}
                    y={labelPos.y + 12}
                    textAnchor={textAnchor}
                    className="fill-[#8A6116] text-[11.5px] font-mono-tabular font-bold"
                  >
                    {item.score}%
                  </text>
                </g>
              );
            })}
          </svg>
        </div>

        <div className="w-full flex-1 space-y-2.5">
          {items.map((item) => {
            const diff = item.score - item.benchmark;
            return (
              <div
                key={item.shortCode}
                className="p-3 rounded-xl bg-[#FAF8F5] border border-[#E6DFD3]"
              >
                <div className="flex items-start justify-between gap-2 text-xs sm:text-sm">
                  <span className="font-bold text-[#0C2340] leading-snug">
                    {item.label}
                  </span>
                  <span className="font-mono-tabular font-bold text-[#0C2340] shrink-0">
                    {item.score}%
                  </span>
                </div>
                <div className="mt-1.5 h-2 w-full bg-slate-200 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${
                      accentColor === 'blue' ? 'bg-[#0C2340]' : 'bg-emerald-700'
                    }`}
                    style={{ width: `${item.score}%` }}
                  />
                </div>
                <div className="mt-1.5 flex items-center justify-between text-xs text-slate-600">
                  <span>เกณฑ์มาตรฐาน: {item.benchmark}%</span>
                  <span
                    className={`font-mono-tabular font-bold ${
                      diff >= 0 ? 'text-emerald-700' : 'text-amber-700'
                    }`}
                  >
                    {diff >= 0 ? `+${diff}% สูงกว่าเกณฑ์` : `${diff}% ควรเสริม`}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

interface MBTIBipolarSpectrumProps {
  mbtiCode: string;
  axes: MBTIAxisDetail[];
}

export const MBTIBipolarSpectrumChart: React.FC<MBTIBipolarSpectrumProps> = ({
  mbtiCode,
  axes,
}) => {
  return (
    <div className="bg-white border border-[#D6CEBF] rounded-2xl p-4 sm:p-6 print-break-inside-avoid">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-[#E6DFD3]">
        <div>
          <h3 className="text-base sm:text-lg font-bold text-[#0C2340]">
            หมวดที่ 1: กราฟสเปกตรัมบุคลิกภาพ MBTI ทั้ง 4 มิติ (รหัสของคุณ: {mbtiCode})
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
            แสดงสัดส่วนธรรมชาติการรับส่งพลังงาน การมองข้อมูล การตัดสินใจ และการจัดระเบียบงาน
          </p>
        </div>
        <span className="text-xs sm:text-sm font-mono-tabular text-slate-700 shrink-0">
          MBTI Type: <strong className="text-[#0C2340] text-base">{mbtiCode}</strong>
        </span>
      </div>

      <div className="mt-5 space-y-5">
        {axes.map((axis) => {
          const isLeftWin = axis.leftPercent >= axis.rightPercent;
          return (
            <div key={axis.key} className="space-y-2 p-3 sm:p-0 rounded-xl bg-[#FAF8F5] sm:bg-transparent border border-[#E6DFD3] sm:border-none">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-xs sm:text-sm text-slate-600">
                <span className="font-bold text-[#0C2340]">{axis.title}</span>
                <span>
                  ขั้วเด่น: <strong className="text-[#8A6116]">{axis.dominantLabel}</strong> ·{' '}
                  {axis.clarityLabel}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-12 items-center gap-2 md:gap-4">
                <div className="md:col-span-3 text-left flex md:block items-center justify-between gap-2">
                  <div
                    className={`text-xs sm:text-sm font-bold ${
                      isLeftWin ? 'text-[#0C2340]' : 'text-slate-600'
                    }`}
                  >
                    <span className="font-mono-tabular">{axis.leftPercent}%</span> · {axis.leftCode}{' '}
                    ({axis.leftName})
                  </div>
                  <div className="text-xs text-slate-600">{axis.leftThai}</div>
                </div>

                <div className="md:col-span-6">
                  <div className="relative h-4 sm:h-5 w-full bg-slate-100 rounded-lg overflow-hidden border border-[#D6CEBF] flex">
                    <div
                      className={`h-full transition-all ${
                        isLeftWin ? 'bg-[#0C2340]' : 'bg-slate-300'
                      }`}
                      style={{ width: `${axis.leftPercent}%` }}
                    />
                    <div
                      className={`h-full transition-all ${
                        !isLeftWin ? 'bg-[#B48327]' : 'bg-slate-200'
                      }`}
                      style={{ width: `${axis.rightPercent}%` }}
                    />
                    <div className="absolute inset-y-0 left-1/2 w-0.5 bg-white/90 z-10" />
                  </div>
                </div>

                <div className="md:col-span-3 md:text-right flex md:block items-center justify-between gap-2">
                  <div
                    className={`text-xs sm:text-sm font-bold ${
                      !isLeftWin ? 'text-[#8A6116]' : 'text-slate-600'
                    }`}
                  >
                    {axis.rightCode} ({axis.rightName}) ·{' '}
                    <span className="font-mono-tabular">{axis.rightPercent}%</span>
                  </div>
                  <div className="text-xs text-slate-600">{axis.rightThai}</div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

interface DISCProfileBarChartProps {
  disc: DISCResult;
}

export const DISCProfileBarChart: React.FC<DISCProfileBarChartProps> = ({ disc }) => {
  const barColors: Record<string, string> = {
    D: 'bg-rose-700',
    I: 'bg-[#B48327]',
    S: 'bg-emerald-700',
    C: 'bg-[#0C2340]',
  };

  return (
    <div className="bg-white border border-[#D6CEBF] rounded-2xl p-4 sm:p-6 print-break-inside-avoid">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-[#E6DFD3]">
        <div>
          <h3 className="text-base sm:text-lg font-bold text-[#0C2340]">
            หมวดที่ 3: กราฟพฤติกรรมการทำงานและการสื่อสาร DISC (สไตล์หลัก: {disc.blendCode})
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
            {disc.styleTitle} — {disc.summary}
          </p>
        </div>
        <span className="text-xs sm:text-sm font-mono-tabular text-slate-700 shrink-0">
          DISC Blend: <strong className="text-[#0C2340] text-base">{disc.blendCode}</strong>
        </span>
      </div>

      <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        {disc.categories.map((cat) => (
          <div
            key={cat.key}
            className="p-3.5 sm:p-4 rounded-xl bg-[#FAF8F5] border border-[#E6DFD3] space-y-2"
          >
            <div className="flex items-start justify-between gap-2">
              <span className="text-xs sm:text-sm font-bold text-[#0C2340] leading-snug">
                {cat.title}
              </span>
              <span className="text-sm sm:text-base font-mono-tabular font-bold text-[#0C2340] shrink-0">
                {cat.score}%
              </span>
            </div>
            <div className="h-2.5 w-full bg-slate-200 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full ${barColors[cat.code] || 'bg-[#0C2340]'}`}
                style={{ width: `${cat.score}%` }}
              />
            </div>
            <p className="text-xs text-slate-600">{cat.subtitle}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

interface EQAQRIASECBarChartProps {
  eqAq: CategoryAnalysis[];
  riasecDrive: CategoryAnalysis[];
}

export const EQAQRIASECBarChart: React.FC<EQAQRIASECBarChartProps> = ({
  eqAq,
  riasecDrive,
}) => {
  const combined = [...eqAq, ...riasecDrive];

  return (
    <div className="bg-white border border-[#D6CEBF] rounded-2xl p-4 sm:p-6 print-break-inside-avoid">
      <div className="pb-4 border-b border-[#E6DFD3]">
        <h3 className="text-base sm:text-lg font-bold text-[#0C2340]">
          หมวดที่ 4 และ 5: ความฉลาดทางอารมณ์ (EQ), ความอึดต่ออุปสรรค (AQ) และแรงขับเคลื่อนอาชีพ (RIASEC & Drive)
        </h3>
        <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
          วัดความแข็งแกร่งทางจิตวิทยาในการรับมือคำปฏิเสธและแรงจูงใจสู่ความสำเร็จในวิชาชีพที่ปรึกษาการเงิน
        </p>
      </div>

      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3.5">
        {combined.map((item) => {
          const isEQAQ = item.pillar === 'EQ_AQ';
          return (
            <div
              key={item.key}
              className="p-3.5 sm:p-4 rounded-xl bg-[#FAF8F5] border border-[#E6DFD3] space-y-2"
            >
              <div className="flex items-start justify-between gap-2 text-xs sm:text-sm">
                <span className="font-bold text-[#0C2340] leading-snug">{item.title}</span>
                <span className="font-mono-tabular font-bold text-[#0C2340] shrink-0">
                  {item.score}%
                </span>
              </div>
              <div className="relative h-2.5 w-full bg-slate-200 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full ${
                    isEQAQ ? 'bg-[#0C2340]' : 'bg-emerald-700'
                  }`}
                  style={{ width: `${item.score}%` }}
                />
                <div
                  className="absolute inset-y-0 w-0.5 bg-[#B48327]"
                  style={{ left: `${item.benchmark}%` }}
                  title={`เกณฑ์มาตรฐาน ${item.benchmark}%`}
                />
              </div>
              <div className="flex items-center justify-between text-xs text-slate-600">
                <span>เกณฑ์อ้างอิง: {item.benchmark}%</span>
                <span className="font-semibold text-[#8A6116]">{item.levelLabel}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

interface EnneagramBarChartProps {
  enneagram: EnneagramResult;
}

export const EnneagramBarChart: React.FC<EnneagramBarChartProps> = ({ enneagram }) => {
  return (
    <div className="bg-white border border-[#D6CEBF] rounded-2xl p-4 sm:p-6 print-break-inside-avoid">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-[#E6DFD3]">
        <div>
          <h3 className="text-base sm:text-lg font-bold text-[#0C2340]">
            หมวดที่ 6: กราฟนพลักษณ์ Enneagram ทั้ง 9 ลักษณ์ (ลักษณ์เด่นของคุณ: {enneagram.wingCode})
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
            {enneagram.title} — {enneagram.coreMotivation}
          </p>
        </div>
        <span className="text-xs sm:text-sm font-mono-tabular text-slate-700 shrink-0">
          Enneagram: <strong className="text-[#0C2340] text-base">{enneagram.wingCode}</strong>
        </span>
      </div>

      <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {enneagram.scores.map((s) => {
          const isDominant = s.typeNumber === enneagram.dominantType;
          return (
            <div
              key={s.typeNumber}
              className={`p-3.5 rounded-xl border ${
                isDominant
                  ? 'bg-[#FBF6EA] border-[#B48327]'
                  : 'bg-[#FAF8F5] border-[#E6DFD3]'
              }`}
            >
              <div className="flex items-start justify-between gap-2 text-xs sm:text-sm">
                <span
                  className={`font-bold leading-snug ${
                    isDominant ? 'text-[#0C2340]' : 'text-slate-800'
                  }`}
                >
                  {s.label}
                </span>
                <span className="font-mono-tabular font-bold text-[#0C2340] shrink-0">
                  {s.score}%
                </span>
              </div>
              <div className="mt-2 h-2 w-full bg-slate-200 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full ${
                    isDominant ? 'bg-[#0C2340]' : 'bg-slate-500'
                  }`}
                  style={{ width: `${s.score}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

interface CategoryComparisonBarChartProps {
  bigFive: CategoryAnalysis[];
  competencies: CategoryAnalysis[];
}

export const CategoryComparisonBarChart: React.FC<CategoryComparisonBarChartProps> = ({
  bigFive,
  competencies,
}) => {
  const allItems = [...bigFive, ...competencies];

  const getBarStyle = (score: number) => {
    if (score >= 80) return 'bg-emerald-700';
    if (score >= 65) return 'bg-[#0C2340]';
    if (score >= 50) return 'bg-[#B48327]';
    return 'bg-rose-600';
  };

  const getStatusTextStyle = (score: number) => {
    if (score >= 80) return 'text-emerald-700';
    if (score >= 65) return 'text-[#0C2340]';
    if (score >= 50) return 'text-[#8A6116]';
    return 'text-rose-700';
  };

  return (
    <div className="bg-white border border-[#D6CEBF] rounded-2xl p-4 sm:p-6 print-break-inside-avoid">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-[#E6DFD3]">
        <div>
          <h3 className="text-base sm:text-lg font-bold text-[#0C2340]">
            หมวดที่ 2 และ 7: เปรียบเทียบคะแนนรายหมวดทั้ง 10 มิติ (Big Five + สมรรถนะวิชาชีพ 5 ด้าน)
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
            แสดงคะแนนครบทุกหัวข้อเทียบกับเกณฑ์มาตรฐานที่ปรึกษาการเงินมืออาชีพ
          </p>
        </div>
        <div className="text-xs text-slate-600">
          <span>80%+ โดดเด่น</span>
          <span className="mx-1.5">·</span>
          <span>65–79% เกณฑ์ดี</span>
          <span className="mx-1.5">·</span>
          <span>50–64% ปานกลาง</span>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
        {allItems.map((cat) => (
          <div key={cat.key} className="space-y-1.5">
            <div className="flex items-start justify-between gap-2 text-xs sm:text-sm">
              <span className="font-bold text-[#0C2340] leading-snug">{cat.title}</span>
              <span className="font-mono-tabular shrink-0">
                <strong className="text-[#0C2340]">{cat.score}%</strong>{' '}
                <span className={getStatusTextStyle(cat.score)}>· {cat.levelLabel}</span>
              </span>
            </div>
            <div className="relative h-3 w-full bg-[#FAF8F5] rounded-md overflow-hidden border border-[#E6DFD3]">
              <div
                className={`h-full rounded-xs transition-all ${getBarStyle(cat.score)}`}
                style={{ width: `${cat.score}%` }}
              />
              <div
                className="absolute inset-y-0 w-0.5 bg-[#B48327]"
                style={{ left: `${cat.benchmark}%` }}
                title={`เกณฑ์มาตรฐาน ${cat.benchmark}%`}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
