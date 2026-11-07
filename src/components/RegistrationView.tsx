import React, { useEffect, useState } from 'react';
import {
  ArrowRight,
  Award,
  CheckCircle2,
  ClipboardCheck,
  CloudOff,
  FileCheck2,
  LogIn,
  LogOut,
  Phone,
  PlayCircle,
  RotateCcw,
  Save,
  ShieldCheck,
  UserCheck,
  Wifi,
} from 'lucide-react';
import { PILLAR_METADATA } from '../data/questions';
import { CandidateProfile } from '../types/assessment';

export interface SavedDraftItem {
  candidate: CandidateProfile;
  answers: Record<number, number>;
  currentPage: number;
  updatedAt: string;
  googleEmail?: string;
}

interface RegistrationViewProps {
  initialCandidate: CandidateProfile;
  answeredCount: number;
  totalQuestions: number;
  currentPage: number;
  lastSavedAt: string | null;
  isOnline: boolean;
  savedDrafts: SavedDraftItem[];
  candidateGoogleEmail: string | null;
  onCandidateGoogleSignIn: () => Promise<void>;
  onCandidateGoogleSignOut: () => Promise<void>;
  onAutoSaveCandidate: (candidate: CandidateProfile) => void;
  onStartAssessment: (candidate: CandidateProfile) => void;
  onResumeDraft: (draft: SavedDraftItem) => void;
  onClearActiveDraft: () => void;
}

export const RegistrationView: React.FC<RegistrationViewProps> = ({
  initialCandidate,
  answeredCount,
  totalQuestions,
  currentPage,
  lastSavedAt,
  isOnline,
  savedDrafts,
  candidateGoogleEmail,
  onCandidateGoogleSignIn,
  onCandidateGoogleSignOut,
  onAutoSaveCandidate,
  onStartAssessment,
  onResumeDraft,
  onClearActiveDraft,
}) => {
  const [form, setForm] = useState<CandidateProfile>(initialCandidate);
  const [errors, setErrors] = useState<Partial<Record<keyof CandidateProfile, string>>>({});
  const [authNotice, setAuthNotice] = useState<string | null>(null);

  useEffect(() => {
    setForm(initialCandidate);
  }, [initialCandidate]);

  useEffect(() => {
    if (candidateGoogleEmail) {
      setAuthNotice(null);
    }
  }, [candidateGoogleEmail]);

  const handleChange = (field: keyof CandidateProfile, value: string) => {
    const updated = { ...form, [field]: value };
    setForm(updated);
    onAutoSaveCandidate(updated);
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const validateAndSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthNotice(null);

    if (!candidateGoogleEmail) {
      setAuthNotice('กรุณาเข้าสู่ระบบด้วยบัญชี Google (Gmail) ก่อนเริ่มทำแบบประเมิน');
      return;
    }

    const nextErrors: Partial<Record<keyof CandidateProfile, string>> = {};

    if (!form.firstName.trim()) nextErrors.firstName = 'กรุณากรอกชื่อจริง';
    if (!form.lastName.trim()) nextErrors.lastName = 'กรุณากรอกนามสกุล';
    if (!form.nickname.trim()) nextErrors.nickname = 'กรุณากรอกชื่อเล่น';

    const ageNum = parseInt(form.age.trim(), 10);
    if (!form.age.trim() || isNaN(ageNum) || ageNum < 18 || ageNum > 85) {
      nextErrors.age = 'ระบุอายุ 18 – 85 ปี';
    }

    const cleanPhone = form.phone.replace(/[-\s]/g, '');
    if (!cleanPhone || cleanPhone.length < 9 || !/^\d+$/.test(cleanPhone)) {
      nextErrors.phone = 'กรอกเบอร์โทรศัพท์ 9–10 หลัก';
    }

    if (!form.lineId.trim()) nextErrors.lineId = 'กรุณากรอก Line ID';

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    onStartAssessment({
      ...form,
      firstName: form.firstName.trim(),
      lastName: form.lastName.trim(),
      nickname: form.nickname.trim(),
      age: form.age.trim(),
      phone: form.phone.trim(),
      lineId: form.lineId.trim(),
    });
  };

  const isRegistrationComplete =
    Boolean(form.firstName.trim()) &&
    Boolean(form.lastName.trim()) &&
    Boolean(form.nickname.trim()) &&
    Boolean(form.age.trim()) &&
    Boolean(form.phone.trim()) &&
    Boolean(form.lineId.trim());

  const totalPages = Math.ceil(totalQuestions / 5);

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-5 sm:py-8 space-y-6">
      {/* Compact Auto-Save Resume Banner */}
      {(answeredCount > 0 || savedDrafts.length > 0) && (
        <div className="bg-white border border-[#D6CEBF] rounded-2xl overflow-hidden shadow-xs">
          <div className="thai-gold-divider" />
          <div className="p-4 sm:p-5 space-y-3">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
              <div>
                <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#8A6116]">
                  <Save className="w-3.5 h-3.5" />
                  <span>พบแบบประเมินที่บันทึกอัตโนมัติไว้</span>
                </div>
                <h2 className="text-base sm:text-lg font-bold text-[#0C2340]">
                  สามารถกดทำต่อจากข้อเดิมได้ทันทีโดยไม่ต้องเริ่มใหม่
                </h2>
              </div>

              {answeredCount > 0 && (
                <div className="flex flex-wrap items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => {
                      if (!candidateGoogleEmail) {
                        setAuthNotice('กรุณาเข้าสู่ระบบด้วย Gmail ก่อนทำต่อ');
                        return;
                      }
                      if (isRegistrationComplete) {
                        onStartAssessment(form);
                      }
                    }}
                    className="min-h-[44px] px-4 py-2 bg-[#0C2340] hover:bg-slate-800 border border-[#B48327] text-[#F4D078] text-xs sm:text-sm font-bold rounded-xl transition-colors inline-flex items-center gap-2 cursor-pointer"
                  >
                    <PlayCircle className="w-4 h-4 shrink-0" />
                    <span>
                      ทำต่อ ({answeredCount}/{totalQuestions} ข้อ · หน้า {currentPage + 1}/{totalPages})
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={onClearActiveDraft}
                    className="min-h-[44px] px-3.5 py-2 bg-slate-100 hover:bg-rose-50 text-slate-700 hover:text-rose-700 text-xs font-semibold rounded-xl transition-colors inline-flex items-center gap-1.5 cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>เริ่มใหม่</span>
                  </button>
                </div>
              )}
            </div>

            {savedDrafts.length > 0 && (
              <div className="pt-3 border-t border-[#E6DFD3] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                {savedDrafts.map((draft) => {
                  const count = Object.keys(draft.answers).length;
                  return (
                    <div
                      key={draft.candidate.phone || draft.candidate.id}
                      className="p-3 rounded-xl bg-[#FAF8F5] border border-[#E6DFD3] flex items-center justify-between gap-2"
                    >
                      <div>
                        <div className="font-bold text-xs sm:text-sm text-[#0C2340]">
                          คุณ{draft.candidate.firstName || 'ผู้สมัคร'} ({draft.candidate.nickname || '-'})
                        </div>
                        <div className="text-xs text-slate-600 font-mono-tabular">
                          ตอบแล้ว {count}/{totalQuestions} ข้อ
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          if (!candidateGoogleEmail) {
                            setAuthNotice('กรุณาเข้าสู่ระบบด้วย Gmail ก่อนทำต่อ');
                            return;
                          }
                          onResumeDraft(draft);
                        }}
                        className="min-h-[38px] px-3 py-1.5 bg-white hover:bg-slate-50 text-[#0C2340] border border-[#D6CEBF] rounded-lg text-xs font-bold shrink-0 cursor-pointer"
                      >
                        ทำต่อ →
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Right Column (Top on Mobile): Registration Form */}
        <div
          id="registration-card"
          className="lg:col-span-5 lg:order-2 bg-white border border-[#D6CEBF] rounded-2xl p-4 sm:p-6 lg:p-7 flex flex-col justify-between shadow-xs"
        >
          <div>
            <div className="thai-gold-divider rounded-full mb-4" />
            <div className="flex items-center justify-between gap-2 pb-3.5 border-b border-[#E6DFD3]">
              <div>
                <div className="text-xs font-bold text-[#8A6116]">
                  ขั้นตอนที่ 1 · ยืนยันตัวตนและกรอกข้อมูล
                </div>
                <h2 className="text-lg sm:text-xl font-bold text-[#0C2340]">
                  ลงทะเบียนผู้รับการประเมิน
                </h2>
              </div>
              <UserCheck className="w-5 h-5 text-[#B48327] shrink-0" />
            </div>

            {/* Step 1: Google Gmail Auth */}
            <div className="mt-4 p-3.5 rounded-xl bg-[#FAF8F5] border border-[#E6DFD3] space-y-2">
              <div className="text-xs sm:text-sm font-bold text-[#0C2340] flex items-center justify-between">
                <span>๑. ยืนยันตัวตนด้วยบัญชี Google (Gmail)</span>
                <span className="text-rose-600">*</span>
              </div>

              {candidateGoogleEmail ? (
                <div className="flex flex-wrap items-center justify-between gap-2 pt-1 text-xs sm:text-sm">
                  <span className="text-emerald-800 font-bold flex items-center gap-1.5 break-all">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>{candidateGoogleEmail}</span>
                  </span>
                  <button
                    type="button"
                    onClick={onCandidateGoogleSignOut}
                    className="min-h-[36px] px-2.5 py-1 rounded-lg bg-white border border-[#D6CEBF] text-slate-700 hover:text-rose-600 text-xs font-semibold inline-flex items-center gap-1 shrink-0 cursor-pointer"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>สลับบัญชี</span>
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={onCandidateGoogleSignIn}
                  className="w-full min-h-[46px] px-4 py-2.5 bg-[#0C2340] hover:bg-slate-800 border border-[#B48327] text-white rounded-xl text-xs sm:text-sm font-bold inline-flex items-center justify-center gap-2 cursor-pointer transition-colors"
                >
                  <LogIn className="w-4 h-4 text-[#F4D078]" />
                  <span>เข้าสู่ระบบด้วยบัญชี Google (Gmail)</span>
                </button>
              )}
            </div>

            {authNotice && (
              <div className="mt-3 p-3 rounded-xl bg-rose-50 border border-rose-300 text-xs sm:text-sm text-rose-800 font-semibold">
                {authNotice}
              </div>
            )}

            {/* Step 2: Candidate Details */}
            <form onSubmit={validateAndSubmit} className="mt-4 space-y-3.5" noValidate>
              <div className="text-xs sm:text-sm font-bold text-[#0C2340]">
                ๒. ข้อมูลส่วนตัวและช่องทางติดต่อ
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label htmlFor="firstName" className="block text-xs font-bold text-slate-700 mb-1">
                    ชื่อจริง <span className="text-rose-600">*</span>
                  </label>
                  <input
                    id="firstName"
                    type="text"
                    value={form.firstName}
                    onChange={(e) => handleChange('firstName', e.target.value)}
                    placeholder="เช่น ธนภัทร"
                    className={`w-full min-h-[44px] px-3.5 py-2 text-base sm:text-sm rounded-xl border bg-white text-[#0C2340] placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0C2340] ${
                      errors.firstName ? 'border-rose-500' : 'border-[#D6CEBF]'
                    }`}
                  />
                  {errors.firstName && (
                    <p className="mt-1 text-xs text-rose-600">{errors.firstName}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="lastName" className="block text-xs font-bold text-slate-700 mb-1">
                    นามสกุล <span className="text-rose-600">*</span>
                  </label>
                  <input
                    id="lastName"
                    type="text"
                    value={form.lastName}
                    onChange={(e) => handleChange('lastName', e.target.value)}
                    placeholder="เช่น อัศวกุล"
                    className={`w-full min-h-[44px] px-3.5 py-2 text-base sm:text-sm rounded-xl border bg-white text-[#0C2340] placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0C2340] ${
                      errors.lastName ? 'border-rose-500' : 'border-[#D6CEBF]'
                    }`}
                  />
                  {errors.lastName && (
                    <p className="mt-1 text-xs text-rose-600">{errors.lastName}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label htmlFor="nickname" className="block text-xs font-bold text-slate-700 mb-1">
                    ชื่อเล่น <span className="text-rose-600">*</span>
                  </label>
                  <input
                    id="nickname"
                    type="text"
                    value={form.nickname}
                    onChange={(e) => handleChange('nickname', e.target.value)}
                    placeholder="เช่น ภัทร"
                    className={`w-full min-h-[44px] px-3.5 py-2 text-base sm:text-sm rounded-xl border bg-white text-[#0C2340] placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0C2340] ${
                      errors.nickname ? 'border-rose-500' : 'border-[#D6CEBF]'
                    }`}
                  />
                  {errors.nickname && (
                    <p className="mt-1 text-xs text-rose-600">{errors.nickname}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="age" className="block text-xs font-bold text-slate-700 mb-1">
                    อายุ (ปี) <span className="text-rose-600">*</span>
                  </label>
                  <input
                    id="age"
                    type="number"
                    inputMode="numeric"
                    min={18}
                    max={85}
                    value={form.age}
                    onChange={(e) => handleChange('age', e.target.value)}
                    placeholder="เช่น 29"
                    className={`w-full min-h-[44px] px-3.5 py-2 text-base sm:text-sm font-mono-tabular rounded-xl border bg-white text-[#0C2340] placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0C2340] ${
                      errors.age ? 'border-rose-500' : 'border-[#D6CEBF]'
                    }`}
                  />
                  {errors.age && (
                    <p className="mt-1 text-xs text-rose-600">{errors.age}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label htmlFor="phone" className="block text-xs font-bold text-slate-700 mb-1">
                    เบอร์โทรศัพท์ <span className="text-rose-600">*</span>
                  </label>
                  <div className="relative">
                    <input
                      id="phone"
                      type="tel"
                      inputMode="tel"
                      value={form.phone}
                      onChange={(e) => handleChange('phone', e.target.value)}
                      placeholder="081-234-5678"
                      className={`w-full min-h-[44px] px-3.5 py-2 text-base sm:text-sm font-mono-tabular rounded-xl border bg-white text-[#0C2340] placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0C2340] ${
                        errors.phone ? 'border-rose-500' : 'border-[#D6CEBF]'
                      }`}
                    />
                    <Phone className="w-4 h-4 text-slate-400 absolute right-3 top-3 pointer-events-none" />
                  </div>
                  {errors.phone && (
                    <p className="mt-1 text-xs text-rose-600">{errors.phone}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="lineId" className="block text-xs font-bold text-slate-700 mb-1">
                    Line ID <span className="text-rose-600">*</span>
                  </label>
                  <input
                    id="lineId"
                    type="text"
                    value={form.lineId}
                    onChange={(e) => handleChange('lineId', e.target.value)}
                    placeholder="ระบุ Line ID"
                    className={`w-full min-h-[44px] px-3.5 py-2 text-base sm:text-sm font-mono-tabular rounded-xl border bg-white text-[#0C2340] placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0C2340] ${
                      errors.lineId ? 'border-rose-500' : 'border-[#D6CEBF]'
                    }`}
                  />
                  {errors.lineId && (
                    <p className="mt-1 text-xs text-rose-600">{errors.lineId}</p>
                  )}
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full min-h-[48px] py-3 px-5 bg-[#0C2340] hover:bg-slate-800 text-[#F4D078] border border-[#B48327] font-bold text-sm sm:text-base rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>
                    {answeredCount > 0
                      ? `ทำแบบประเมินต่อ (${answeredCount}/${totalQuestions} ข้อ)`
                      : `เริ่มทำแบบประเมิน (${totalQuestions} ข้อ)`}
                  </span>
                  <ArrowRight className="w-4 h-4 shrink-0" />
                </button>
              </div>
            </form>
          </div>

          <div className="mt-5 pt-3 border-t border-[#E6DFD3] flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-[#B48327]" />
              <span>บันทึกคำตอบอัตโนมัติ</span>
            </span>
            <span className="font-mono-tabular flex items-center gap-1">
              {isOnline ? (
                <span className="text-emerald-700 flex items-center gap-1">
                  <Wifi className="w-3.5 h-3.5" /> ออนไลน์
                </span>
              ) : (
                <span className="text-amber-700 flex items-center gap-1">
                  <CloudOff className="w-3.5 h-3.5" /> ออฟไลน์
                </span>
              )}
              {lastSavedAt && <span>· {lastSavedAt}</span>}
            </span>
          </div>
        </div>

        {/* Left Column: Complete 7-Pillar Overview (No Truncation, Full Titles Displayed) */}
        <div className="lg:col-span-7 lg:order-1 flex flex-col justify-between bg-white border border-[#D6CEBF] rounded-2xl p-4 sm:p-6 lg:p-8 shadow-xs">
          <div className="space-y-4 sm:space-y-5">
            <div className="flex items-center gap-2 text-xs font-bold text-[#8A6116]">
              <Award className="w-4 h-4 text-[#B48327] shrink-0" />
              <span>มาตรฐานการประเมินที่ปรึกษาทางการเงินและตัวแทนประกันชีวิต</span>
            </div>

            <div className="space-y-2">
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-[#0C2340] leading-snug">
                แบบประเมินบุคลิกภาพและสมรรถนะวิชาชีพที่ปรึกษาการเงิน
              </h1>
              <p className="text-xs sm:text-sm lg:text-base text-slate-600 leading-relaxed">
                วิเคราะห์จุดแข็ง สไตล์การทำงาน และสายงานที่เหมาะสมด้วย 7 มาตรฐานสากล ({totalQuestions} ข้อ · ใช้เวลา 10–15 นาที) พร้อมออกใบสรุปผลการประเมินทันที
              </p>
            </div>

            {/* Complete 7-Pillar Grid — Full Headings Shown Without Cutoff */}
            <div className="space-y-2.5 pt-1">
              <h2 className="text-xs sm:text-sm font-bold text-[#0C2340]">
                โครงสร้างหัวข้อการประเมินทั้ง 7 มาตรฐานสากล (ครบ 60 ข้อ)
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {Object.values(PILLAR_METADATA).map((pillar) => (
                  <div
                    key={pillar.id}
                    className="p-3 sm:p-3.5 rounded-xl bg-[#FAF8F5] border border-[#E6DFD3] flex flex-col justify-between gap-1.5"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="text-xs sm:text-sm font-bold text-[#0C2340] leading-snug">
                        {pillar.stepNumber}. {pillar.title}
                      </div>
                      <span className="font-mono-tabular text-[11px] font-bold text-[#8A6116] shrink-0">
                        {pillar.questionRange.replace('ข้อที่ ', 'ข้อ ')}
                      </span>
                    </div>
                    <div className="text-[11px] sm:text-xs font-semibold text-[#8A6116]">
                      {pillar.englishTitle}
                    </div>
                    <p className="text-[11px] sm:text-xs text-slate-600 leading-relaxed">
                      {pillar.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 3 Concise Feature Highlights */}
          <div className="mt-6 pt-4 border-t border-[#E6DFD3] grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-left">
            <div className="flex items-center gap-2">
              <ClipboardCheck className="w-4 h-4 text-[#B48327] shrink-0" />
              <span className="text-xs font-bold text-[#0C2340]">บันทึกอัตโนมัติทุกข้อ</span>
            </div>
            <div className="flex items-center gap-2">
              <FileCheck2 className="w-4 h-4 text-[#B48327] shrink-0" />
              <span className="text-xs font-bold text-[#0C2340]">ใบสรุปผล PDF หน้าเดียว (A4)</span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#B48327] shrink-0" />
              <span className="text-xs font-bold text-[#0C2340]">ยืนยันตัวตนด้วย Gmail</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
