import {
  AssessmentPillar,
  CandidateProfile,
  QuestionItem,
  QuestionOption,
} from '../types/assessment';

export const LIKERT_OPTIONS: QuestionOption[] = [
  { value: 1, label: 'ไม่ตรงเลย', sublabel: '1 คะแนน' },
  { value: 2, label: 'ค่อนข้างไม่ตรง', sublabel: '2 คะแนน' },
  { value: 3, label: 'ปานกลาง / ไม่แน่ใจ', sublabel: '3 คะแนน' },
  { value: 4, label: 'ค่อนข้างตรง', sublabel: '4 คะแนน' },
  { value: 5, label: 'ตรงกับฉันมากที่สุด', sublabel: '5 คะแนน' },
];

export const PILLAR_METADATA: Record<
  AssessmentPillar,
  {
    id: AssessmentPillar;
    stepNumber: string;
    title: string;
    englishTitle: string;
    questionRange: string;
    description: string;
  }
> = {
  MBTI: {
    id: 'MBTI',
    stepNumber: '01',
    title: 'โครงสร้างบุคลิกภาพ MBTI 4 มิติ (Jungian Type)',
    englishTitle: 'MBTI Cognitive Style',
    questionRange: 'ข้อที่ 1 – 8 (8 ข้อ)',
    description:
      'วิเคราะห์การรับส่งพลังงาน (E/I), การมองข้อมูล (S/N), การตัดสินใจจูงใจ (T/F) และการจัดระเบียบตารางงาน (J/P)',
  },
  BIG_FIVE: {
    id: 'BIG_FIVE',
    stepNumber: '02',
    title: 'บุคลิกภาพสากล 5 มิติหลัก (Big Five / OCEAN)',
    englishTitle: 'Five-Factor Personality Model',
    questionRange: 'ข้อที่ 9 – 18 (10 ข้อ)',
    description:
      'วัดการเปิดรับนวัตกรรม (O), วินัยความมุ่งมั่น (C), พลังสังคม (E), จิตบริการ (A) และความมั่นคงทางอารมณ์ (ES)',
  },
  DISC: {
    id: 'DISC',
    stepNumber: '03',
    title: 'พฤติกรรมการทำงานและการสื่อสาร 4 ทิศทาง (DISC Profile)',
    englishTitle: 'DISC Behavioral Assessment',
    questionRange: 'ข้อที่ 19 – 26 (8 ข้อ)',
    description:
      'วิเคราะห์จริตการรุกปิดการขาย (Dominance), การสร้างแรงจูงใจ (Influence), การดูแลระยะยาว (Steadiness) และความแม่นยำของข้อมูล (Compliance)',
  },
  EQ_AQ: {
    id: 'EQ_AQ',
    stepNumber: '04',
    title: 'ความฉลาดทางอารมณ์และความอึดต่อคำปฏิเสธ (EQ & AQ / Grit)',
    englishTitle: 'Emotional & Adversity Quotient',
    questionRange: 'ข้อที่ 27 – 32 (6 ข้อ)',
    description:
      'วัดความสามารถในการอ่านความรู้สึกของลูกค้า การควบคุมอารมณ์ตนเอง และการฟื้นตัวจากคำปฏิเสธในงานขาย',
  },
  RIASEC_DRIVE: {
    id: 'RIASEC_DRIVE',
    stepNumber: '05',
    title: 'ความถนัดทางอาชีพและแรงขับความสำเร็จ (Holland RIASEC & Sales Drive)',
    englishTitle: 'Career Interest & Achievement Drive',
    questionRange: 'ข้อที่ 33 – 40 (8 ข้อ)',
    description:
      'วัดความเป็นผู้ประกอบการ (Enterprising), จิตวิญญาณผู้ให้คำปรึกษา (Social), การคิดวิเคราะห์การเงิน (Investigative) และแรงขับเคลื่อนสู่เป้าหมาย MDRT',
  },
  ENNEAGRAM: {
    id: 'ENNEAGRAM',
    stepNumber: '06',
    title: 'นพลักษณ์และแรงจูงใจเบื้องลึก 9 ลักษณ์ (Enneagram 9 Types)',
    englishTitle: 'Enneagram Core Motivations',
    questionRange: 'ข้อที่ 41 – 49 (9 ข้อ)',
    description:
      'ค้นหาแรงจูงใจระดับจิตใต้สำนึกทั้ง 9 ลักษณ์ เพื่อเข้าใจคุณค่าหลักที่ขับเคลื่อนการทำงานและการดูแลลูกค้าของคุณ',
  },
  COMPETENCY: {
    id: 'COMPETENCY',
    stepNumber: '07',
    title: 'สมรรถนะวิชาชีพตัวแทนประกันชีวิตและที่ปรึกษาการเงิน 5 ด้าน',
    englishTitle: 'Insurance & Financial Advisor Competency',
    questionRange: 'ข้อที่ 50 – 60 (11 ข้อ)',
    description:
      'ประเมินทักษะภาคสนาม: การแสวงหาผู้มุ่งหวัง (Prospecting), การวิเคราะห์ความต้องการ (Fact-Finding), การปิดการขาย (Closing), การบริการหลังการขาย (Retention) และภาวะผู้นำทีม (Leadership)',
  },
};

export const ASSESSMENT_QUESTIONS: QuestionItem[] = [
  // ============================================================================
  // PART 1: MBTI 4 AXES (Questions 1 – 8: 2 high-discrimination items per axis)
  // ============================================================================
  {
    id: 1,
    pillar: 'MBTI',
    dimension: 'E_I',
    dimensionLabel: 'MBTI · E vs I (การรับส่งพลังงานและการสร้างเครือข่าย)',
    statement:
      'ฉันรู้สึกมีพลังและกระตือรือร้นเมื่อได้ออกไปพบปะผู้คนใหม่ๆ ในงานสัมมนา กิจกรรมเครือข่าย หรือการนัดพบลูกค้าหลายรายต่อวัน',
    scenarioHint: 'วัดแนวโน้ม Extraversion (E) เทียบกับ Introversion (I)',
    direction: 1,
  },
  {
    id: 2,
    pillar: 'MBTI',
    dimension: 'E_I',
    dimensionLabel: 'MBTI · E vs I (การรับส่งพลังงานและการสร้างเครือข่าย)',
    statement:
      'ฉันถนัดการสร้างความไว้วางใจผ่านการพูดคุยเชิงลึกแบบตัวต่อตัว (1-on-1) ในบรรยากาศที่สงบ มากกว่าการเข้าสังคมกลุ่มใหญ่',
    scenarioHint: 'วัดความถนัดแบบ Introversion (I) ในการฟังเชิงลึก',
    direction: -1,
  },
  {
    id: 3,
    pillar: 'MBTI',
    dimension: 'S_N',
    dimensionLabel: 'MBTI · S vs N (การรับข้อมูลและการมองภาพอนาคต)',
    statement:
      'เวลาอธิบายแผนการเงิน ฉันชอบเริ่มจากตัวเลขที่จับต้องได้ชัดเจน เช่น เบี้ยประกันต่อปี ค่ารักษาพยาบาลจริง และตารางผลประโยชน์',
    scenarioHint: 'วัดแนวโน้ม Sensing (S) ที่เน้นข้อเท็จจริงและตัวเลขรูปธรรม',
    direction: 1,
  },
  {
    id: 4,
    pillar: 'MBTI',
    dimension: 'S_N',
    dimensionLabel: 'MBTI · S vs N (การรับข้อมูลและการมองภาพอนาคต)',
    statement:
      'ฉันชอบชวนลูกค้าจินตนาการถึงภาพอนาคตระยะยาว 10–20 ปีข้างหน้า เช่น ไลฟ์สไตล์วัยเกษียณและมรดก ก่อนลงรายละเอียดตัวเลข',
    scenarioHint: 'วัดแนวโน้ม Intuition (N) ที่มองภาพใหญ่และวิสัยทัศน์ระยะยาว',
    direction: -1,
  },
  {
    id: 5,
    pillar: 'MBTI',
    dimension: 'T_F',
    dimensionLabel: 'MBTI · T vs F (การตัดสินใจและการโน้มน้าวใจ)',
    statement:
      'ฉันเชื่อว่าการชี้ให้เห็นความคุ้มค่าเชิงตรรกะ อัตราผลตอบแทน (IRR) และสิทธิลดหย่อนภาษี คือหัวใจสำคัญที่สุดในการช่วยให้ลูกค้าตัดสินใจ',
    scenarioHint: 'วัดแนวโน้ม Thinking (T) ที่ใช้เหตุผลและความคุ้มค่านำ',
    direction: 1,
  },
  {
    id: 6,
    pillar: 'MBTI',
    dimension: 'T_F',
    dimensionLabel: 'MBTI · T vs F (การตัดสินใจและการโน้มน้าวใจ)',
    statement:
      'ในการคุยกับลูกค้า ฉันให้ความสำคัญกับความรู้สึก ความห่วงใยต่อครอบครัว และความอุ่นใจของลูกค้ามากกว่าตัวเลขผลตอบแทน',
    scenarioHint: 'วัดแนวโน้ม Feeling (F) ที่เน้นคุณค่าทางใจและครอบครัว',
    direction: -1,
  },
  {
    id: 7,
    pillar: 'MBTI',
    dimension: 'J_P',
    dimensionLabel: 'MBTI · J vs P (การวางแผนและการจัดระเบียบตารางงาน)',
    statement:
      'ฉันชอบวางตารางนัดหมายลูกค้าล่วงหน้าเป็นรายสัปดาห์อย่างชัดเจน และเตรียมสคริปต์รวมถึงเอกสารให้ครบถ้วนก่อนออกพบเสมอ',
    scenarioHint: 'วัดแนวโน้ม Judging (J) ด้านการจัดระบบงานและวินัยล่วงหน้า',
    direction: 1,
  },
  {
    id: 8,
    pillar: 'MBTI',
    dimension: 'J_P',
    dimensionLabel: 'MBTI · J vs P (การวางแผนและการจัดระเบียบตารางงาน)',
    statement:
      'ฉันทำงานได้ดีที่สุดเมื่อมีความยืดหยุ่น สามารถปรับเปลี่ยนแผนการนำเสนอได้สดๆ หน้างานตามจังหวะอารมณ์ของลูกค้า',
    scenarioHint: 'วัดแนวโน้ม Perceiving (P) ด้านความคล่องตัวและการปรับตัวเฉพาะหน้า',
    direction: -1,
  },

  // ============================================================================
  // PART 2: BIG FIVE / OCEAN (Questions 9 – 18: 2 items per dimension)
  // ============================================================================
  {
    id: 9,
    pillar: 'BIG_FIVE',
    dimension: 'OPENNESS',
    dimensionLabel: 'Big Five · Openness (การเปิดรับนวัตกรรมและผลิตภัณฑ์ซับซ้อน)',
    statement:
      'ฉันสนใจเรียนรู้ผลิตภัณฑ์ทางการเงินยุคใหม่ที่มีความซับซ้อน เช่น ประกันชีวิตควบการลงทุน (Unit Linked), กองทุนรวม และการวางแผนภาษีมรดก',
    scenarioHint: 'ความพร้อมในการต่อยอดสู่ที่ปรึกษาการเงินมืออาชีพ (Financial Planner)',
    direction: 1,
  },
  {
    id: 10,
    pillar: 'BIG_FIVE',
    dimension: 'OPENNESS',
    dimensionLabel: 'Big Five · Openness (การเปิดรับนวัตกรรมและผลิตภัณฑ์ซับซ้อน)',
    statement:
      'ฉันสนุกกับการทดลองใช้เครื่องมือดิจิทัล โซเชียลมีเดีย หรือแอปพลิเคชันวางแผนการเงินใหม่ๆ เพื่อสร้างความแตกต่างในการดูแลลูกค้า',
    scenarioHint: 'การประยุกต์ใช้เทคโนโลยีและการตลาดยุคใหม่',
    direction: 1,
  },
  {
    id: 11,
    pillar: 'BIG_FIVE',
    dimension: 'CONSCIENTIOUSNESS',
    dimensionLabel: 'Big Five · Conscientiousness (วินัย ความรับผิดชอบ และการมุ่งสู่เป้าหมาย)',
    statement:
      'เมื่อฉันตั้งเป้าหมายจำนวนการติดต่อลูกค้าในแต่ละสัปดาห์แล้ว ฉันจะลงมือทำให้ครบตามแผนแม้ในวันที่ไม่มีหัวหน้าคอยเตือน',
    scenarioHint: 'วินัยในการบริหารตนเอง (Self-Discipline) ปัจจัยหลักสู่คุณวุฒิ MDRT',
    direction: 1,
  },
  {
    id: 12,
    pillar: 'BIG_FIVE',
    dimension: 'CONSCIENTIOUSNESS',
    dimensionLabel: 'Big Five · Conscientiousness (วินัย ความรับผิดชอบ และการมุ่งสู่เป้าหมาย)',
    statement:
      'ฉันตรวจสอบความถูกต้องของเอกสาร ประวัติสุขภาพ และเงื่อนไขกรมธรรม์อย่างละเอียดรอบคอบทุกครั้ง เพื่อป้องกันปัญหาการเคลมของลูกค้า',
    scenarioHint: 'ความประณีตและความรับผิดชอบต่อวิชาชีพ',
    direction: 1,
  },
  {
    id: 13,
    pillar: 'BIG_FIVE',
    dimension: 'EXTRAVERSION',
    dimensionLabel: 'Big Five · Extraversion (ความกระตือรือร้นและพลังทางสังคม)',
    statement:
      'ฉันสามารถสร้างบรรยากาศที่เป็นกันเองและทำให้คนที่เพิ่งรู้จักกันครั้งแรกเปิดใจพูดคุยเรื่องชีวิตและครอบครัวได้อย่างรวดเร็ว',
    scenarioHint: 'ความสามารถในการสร้าง Rapport และเปิดใจลูกค้า',
    direction: 1,
  },
  {
    id: 14,
    pillar: 'BIG_FIVE',
    dimension: 'EXTRAVERSION',
    dimensionLabel: 'Big Five · Extraversion (ความกระตือรือร้นและพลังทางสังคม)',
    statement:
      'เวลาอยู่ในกลุ่มเพื่อนหรือที่ทำงาน ฉันมักเป็นคนที่ช่วยสร้างสีสัน พลังบวก และความกระตือรือร้นให้กับคนรอบข้างเสมอ',
    scenarioHint: 'พลังดึงดูดทางสังคม (Social Magnetism)',
    direction: 1,
  },
  {
    id: 15,
    pillar: 'BIG_FIVE',
    dimension: 'AGREEABLENESS',
    dimensionLabel: 'Big Five · Agreeableness (ความเข้าอกเข้าใจและจิตวิญญาณการบริการ)',
    statement:
      'ฉันยึดผลประโยชน์และความเหมาะสมกับงบประมาณของลูกค้าเป็นอันดับแรกเสมอ แม้ว่าแบบประกันนั้นอาจให้ค่าคอมมิชชันน้อยกว่าอีกแบบ',
    scenarioHint: 'จริยธรรมวิชาชีพและความไว้วางใจระยะยาว (Client-First Integrity)',
    direction: 1,
  },
  {
    id: 16,
    pillar: 'BIG_FIVE',
    dimension: 'AGREEABLENESS',
    dimensionLabel: 'Big Five · Agreeableness (ความเข้าอกเข้าใจและจิตวิญญาณการบริการ)',
    statement:
      'ฉันมีความสุขอย่างแท้จริงเมื่อได้ช่วยเหลือประสานงานให้ลูกค้าและครอบครัวได้รับความคุ้มครองหรือเคลมสินไหมได้อย่างราบรื่นยามเจ็บป่วย',
    scenarioHint: 'จิตวิญญาณการดูแลลูกค้าเสมือนคนในครอบครัว',
    direction: 1,
  },
  {
    id: 17,
    pillar: 'BIG_FIVE',
    dimension: 'EMOTIONAL_STABILITY',
    dimensionLabel: 'Big Five · Emotional Stability (ความมั่นคงทางอารมณ์และความนิ่งยามกดดัน)',
    statement:
      'เมื่อต้องรับมือกับเคสเร่งด่วน เช่น ลูกค้าเข้าโรงพยาบาลฉุกเฉินและกังวลเรื่องสิทธิ์การเคลม ฉันยังสามารถครองสติและแก้ปัญหาได้อย่างสุขุม',
    scenarioHint: 'ความนิ่งและการเป็นที่พึ่งทางใจยามวิกฤต',
    direction: 1,
  },
  {
    id: 18,
    pillar: 'BIG_FIVE',
    dimension: 'EMOTIONAL_STABILITY',
    dimensionLabel: 'Big Five · Emotional Stability (ความมั่นคงทางอารมณ์และความนิ่งยามกดดัน)',
    statement:
      'เวลาที่ลูกค้าปฏิเสธหรือเลื่อนนัดกะทันหัน ฉันมักจะรู้สึกเครียด กังวล และหมดกำลังใจไปหลายวันกว่าจะกลับมาเริ่มงานใหม่ได้',
    scenarioHint: 'ความเปราะบางต่อคำปฏิเสธ (ข้อคำถามกลับด้าน)',
    direction: -1,
  },

  // ============================================================================
  // PART 3: DISC BEHAVIORAL PROFILE (Questions 19 – 26: 2 items per D, I, S, C)
  // ============================================================================
  {
    id: 19,
    pillar: 'DISC',
    dimension: 'DISC_D',
    dimensionLabel: 'DISC · Dominance (มุ่งผลลัพธ์ กล้าตัดสินใจ ขับเคลื่อนเป้าหมาย)',
    statement:
      'ฉันเป็นคนทำงานไว มุ่งเน้นผลลัพธ์ที่ชัดเจน และกล้าเจรจากับลูกค้ากลุ่มเจ้าของธุรกิจหรือผู้บริหารระดับสูงอย่างมั่นใจ',
    scenarioHint: 'พฤติกรรมแบบ Dominance (D) — นักบุกเบิกและพิชิตเป้า',
    direction: 1,
  },
  {
    id: 20,
    pillar: 'DISC',
    dimension: 'DISC_D',
    dimensionLabel: 'DISC · Dominance (มุ่งผลลัพธ์ กล้าตัดสินใจ ขับเคลื่อนเป้าหมาย)',
    statement:
      'ในการสนทนาการขาย ฉันชอบเข้าสู่ประเด็นสำคัญอย่างกระชับและกล้าชวนให้ลูกค้าตัดสินใจทันทีเมื่อเห็นว่าแผนตอบโจทย์แล้ว',
    scenarioHint: 'ความเด็ดขาดในการนำเสนอและปิดการขาย',
    direction: 1,
  },
  {
    id: 21,
    pillar: 'DISC',
    dimension: 'DISC_I',
    dimensionLabel: 'DISC · Influence (สร้างแรงจูงใจ มีเสน่ห์ เชื่อมโยงผู้คน)',
    statement:
      'ฉันถนัดการใช้เรื่องเล่า (Storytelling) และอารมณ์ความรู้สึกเพื่อสร้างแรงบันดาลใจให้ลูกค้าเห็นคุณค่าของการปกป้องคนที่เขารัก',
    scenarioHint: 'พฤติกรรมแบบ Influence (I) — นักจูงใจและสร้างแรงบันดาลใจ',
    direction: 1,
  },
  {
    id: 22,
    pillar: 'DISC',
    dimension: 'DISC_I',
    dimensionLabel: 'DISC · Influence (สร้างแรงจูงใจ มีเสน่ห์ เชื่อมโยงผู้คน)',
    statement:
      'ผู้คนมักจดจำฉันได้จากรอยยิ้ม ความสดใสเป็นกันเอง และความสามารถในการเชื่อมโยงคนรู้จักให้กลายเป็นเครือข่ายลูกค้าที่อบอุ่น',
    scenarioHint: 'เสน่ห์ในการขยายเครือข่ายบอกต่อ (Referral Network)',
    direction: 1,
  },
  {
    id: 23,
    pillar: 'DISC',
    dimension: 'DISC_S',
    dimensionLabel: 'DISC · Steadiness (สม่ำเสมอ จริงใจ ดูแลระยะยาว)',
    statement:
      'ฉันเป็นผู้ฟังที่อดทน ไม่ชอบเร่งรัดหรือกดดันลูกค้า แต่เน้นการค่อยๆ สร้างความเชื่อมั่นและดูแลกันไปยาวนานเหมือนญาติมิตร',
    scenarioHint: 'พฤติกรรมแบบ Steadiness (S) — ที่ปรึกษาผู้ซื่อสัตย์และอบอุ่น',
    direction: 1,
  },
  {
    id: 24,
    pillar: 'DISC',
    dimension: 'DISC_S',
    dimensionLabel: 'DISC · Steadiness (สม่ำเสมอ จริงใจ ดูแลระยะยาว)',
    statement:
      'ฉันให้ความสำคัญกับการรักษาความสัมพันธ์กับลูกค้าเดิมอย่างเสมอต้นเสมอปลาย แม้ว่าจะปิดการขายเคสนั้นไปนานหลายปีแล้วก็ตาม',
    scenarioHint: 'ความยั่งยืนในการดูแลลูกค้า (Long-Term Stewardship)',
    direction: 1,
  },
  {
    id: 25,
    pillar: 'DISC',
    dimension: 'DISC_C',
    dimensionLabel: 'DISC · Compliance (รอบคอบ แม่นยำ วิเคราะห์ข้อมูลเชิงลึก)',
    statement:
      'เวลาจะแนะนำแผนประกันหรือการลงทุน ฉันจะเตรียมตารางเปรียบเทียบตัวเลข ข้อกฎหมายภาษี และเงื่อนไขสัญญาอย่างรัดกุมไร้ที่ติเสมอ',
    scenarioHint: 'พฤติกรรมแบบ Compliance (C) — ผู้เชี่ยวชาญข้อมูลที่แม่นยำ',
    direction: 1,
  },
  {
    id: 26,
    pillar: 'DISC',
    dimension: 'DISC_C',
    dimensionLabel: 'DISC · Compliance (รอบคอบ แม่นยำ วิเคราะห์ข้อมูลเชิงลึก)',
    statement:
      'ลูกค้ากลุ่มวิชาชีพ เช่น แพทย์ วิศวกร หรือนักบัญชี มักประทับใจฉันเพราะฉันตอบคำถามเชิงเทคนิคด้วยหลักฐานอ้างอิงที่ชัดเจน',
    scenarioHint: 'ความน่าเชื่อถือเชิงวิเคราะห์ (Analytical Credibility)',
    direction: 1,
  },

  // ============================================================================
  // PART 4: EQ & AQ / GRIT RESILIENCE (Questions 27 – 32: 3 EQ + 3 AQ)
  // ============================================================================
  {
    id: 27,
    pillar: 'EQ_AQ',
    dimension: 'EQ_EMOTIONAL',
    dimensionLabel: 'EQ · ความฉลาดทางอารมณ์และการอ่านสัญญาณลูกค้า',
    statement:
      'ฉันสังเกตสีหน้า น้ำเสียง และภาษากายของลูกค้าได้ไว รู้ทันทีว่าจังหวะไหนลูกค้ากำลังสนใจและจังหวะไหนที่เริ่มรู้สึกอึดอัด',
    scenarioHint: 'ความฉลาดทางอารมณ์ในการอ่านใจผู้ฟัง (Empathy & Social Radar)',
    direction: 1,
  },
  {
    id: 28,
    pillar: 'EQ_AQ',
    dimension: 'EQ_EMOTIONAL',
    dimensionLabel: 'EQ · ความฉลาดทางอารมณ์และการอ่านสัญญาณลูกค้า',
    statement:
      'เมื่อเจอลูกค้าที่มีอคติต่ออาชีพขายประกัน ฉันสามารถรับฟังด้วยความเข้าใจโดยไม่โต้เถียง และค่อยๆ เปลี่ยนบรรยากาศให้เป็นมิตรได้',
    scenarioHint: 'การควบคุมอารมณ์ตนเองและการคลี่คลายอคติ',
    direction: 1,
  },
  {
    id: 29,
    pillar: 'EQ_AQ',
    dimension: 'EQ_EMOTIONAL',
    dimensionLabel: 'EQ · ความฉลาดทางอารมณ์และการอ่านสัญญาณลูกค้า',
    statement:
      'ฉันรู้วิธีปรับโทนการพูดคุยให้เข้ากับบุคลิกของลูกค้าแต่ละคน ไม่ว่าจะเป็นผู้บริหารที่เร่งรีบ หรือหัวหน้าครอบครัวที่ต้องการคำปรึกษาอบอุ่น',
    scenarioHint: 'ความยืดหยุ่นทางอารมณ์และการสื่อสาร (Adaptive Communication)',
    direction: 1,
  },
  {
    id: 30,
    pillar: 'EQ_AQ',
    dimension: 'AQ_ADVERSITY',
    dimensionLabel: 'AQ & Grit · ความอึดต่อคำปฏิเสธและการฟื้นตัวจากอุปสรรค',
    statement:
      'สำหรับฉัน คำปฏิเสธของลูกค้าแปลว่า "วันนี้เขายังไม่เห็นความจำเป็น หรือยังไม่ถึงจังหวะเวลา" ไม่ได้แปลว่าฉันล้มเหลว',
    scenarioHint: 'กรอบความคิดเติบโต (Growth Mindset) ในการรับมือคำปฏิเสธ',
    direction: 1,
  },
  {
    id: 31,
    pillar: 'EQ_AQ',
    dimension: 'AQ_ADVERSITY',
    dimensionLabel: 'AQ & Grit · ความอึดต่อคำปฏิเสธและการฟื้นตัวจากอุปสรรค',
    statement:
      'แม้จะต้องเจอกับการถูกปฏิเสธติดต่อกันหลายเคสในสัปดาห์เดียว ฉันก็ยังสามารถรีเซ็ตพลังใจและยกหูโทรศัพท์นัดหมายลูกค้ารายต่อไปได้ทันที',
    scenarioHint: 'ความอึดและการฟื้นตัวเร็ว (Bounce-Back Resilience)',
    direction: 1,
  },
  {
    id: 32,
    pillar: 'EQ_AQ',
    dimension: 'AQ_ADVERSITY',
    dimensionLabel: 'AQ & Grit · ความอึดต่อคำปฏิเสธและการฟื้นตัวจากอุปสรรค',
    statement:
      'เมื่อตั้งเป้าหมายใหญ่ในชีวิตแล้ว ฉันจะกัดไม่ปล่อยและหาทางพัฒนาทักษะของตัวเองไปเรื่อยๆ จนกว่าจะทำสำเร็จ',
    scenarioHint: 'ความเพียรพยายามระยะยาว (Grit & Perseverance)',
    direction: 1,
  },

  // ============================================================================
  // PART 5: HOLLAND RIASEC & SALES DRIVE (Questions 33 – 40: 2 items per dim)
  // ============================================================================
  {
    id: 33,
    pillar: 'RIASEC_DRIVE',
    dimension: 'RIASEC_ENTERPRISING',
    dimensionLabel: 'RIASEC · Enterprising (จริตผู้ประกอบการและการสร้างธุรกิจ)',
    statement:
      'ฉันมองอาชีพที่ปรึกษาการเงินว่าเป็นการสร้างธุรกิจของตัวเอง ที่มีอิสระในการกำหนดกลยุทธ์ การตลาด และเป้าหมายการเติบโต',
    scenarioHint: 'จิตวิญญาณผู้ประกอบการ (Entrepreneurial Mindset)',
    direction: 1,
  },
  {
    id: 34,
    pillar: 'RIASEC_DRIVE',
    dimension: 'RIASEC_ENTERPRISING',
    dimensionLabel: 'RIASEC · Enterprising (จริตผู้ประกอบการและการสร้างธุรกิจ)',
    statement:
      'ฉันชอบบทบาทการเป็นผู้นำ การริเริ่มโครงการใหม่ และการจูงใจผู้คนให้ร่วมขับเคลื่อนเป้าหมายใหญ่ไปด้วยกัน',
    scenarioHint: 'ศักยภาพการบริหารธุรกิจและขยายทีม',
    direction: 1,
  },
  {
    id: 35,
    pillar: 'RIASEC_DRIVE',
    dimension: 'RIASEC_SOCIAL',
    dimensionLabel: 'RIASEC · Social (จริตผู้ให้คำปรึกษาและพัฒนาคุณภาพชีวิตผู้คน)',
    statement:
      'ฉันชอบงานที่ได้ให้คำปรึกษา แนะนำแนวทางแก้ไขปัญหาชีวิต และช่วยให้ครอบครัวของผู้อื่นมีความมั่นคงปลอดภัยยิ่งขึ้น',
    scenarioHint: 'ความถนัดสายที่ปรึกษาและผู้ดูแลชีวิต (Social & Helping Orientation)',
    direction: 1,
  },
  {
    id: 36,
    pillar: 'RIASEC_DRIVE',
    dimension: 'RIASEC_SOCIAL',
    dimensionLabel: 'RIASEC · Social (จริตผู้ให้คำปรึกษาและพัฒนาคุณภาพชีวิตผู้คน)',
    statement:
      'การได้รับคำขอบคุณจากลูกค้าที่ครอบครัวของเขารอดพ้นวิกฤตการเงินเพราะแผนที่เราดูแล มีคุณค่าทางใจต่อฉันมาก',
    scenarioHint: 'แรงจูงใจจากคุณค่าของวิชาชีพ (Purpose-Driven Advisor)',
    direction: 1,
  },
  {
    id: 37,
    pillar: 'RIASEC_DRIVE',
    dimension: 'RIASEC_INVESTIGATIVE',
    dimensionLabel: 'RIASEC · Investigative (จริตนักวิเคราะห์และวางแผนการเงิน)',
    statement:
      'ฉันชอบศึกษาวิเคราะห์ข้อมูลทางการเงิน การจัดพอร์ตลงทุน การลดหย่อนภาษี และการวางแผนงบดุลของครอบครัวอย่างเป็นระบบ',
    scenarioHint: 'ความถนัดสายนักวางแผนการเงิน (Financial Planning & Analysis)',
    direction: 1,
  },
  {
    id: 38,
    pillar: 'RIASEC_DRIVE',
    dimension: 'RIASEC_INVESTIGATIVE',
    dimensionLabel: 'RIASEC · Investigative (จริตนักวิเคราะห์และวางแผนการเงิน)',
    statement:
      'ฉันพร้อมเรียนรู้และสอบคุณวุฒิวิชาชีพทางการเงินเพิ่มเติม (เช่น IC License, AFPT, CFP) เพื่อยกระดับความเชี่ยวชาญของตนเอง',
    scenarioHint: 'ความมุ่งมั่นสู่มาตรฐานวิชาชีพการเงินสากล',
    direction: 1,
  },
  {
    id: 39,
    pillar: 'RIASEC_DRIVE',
    dimension: 'SALES_DRIVE',
    dimensionLabel: 'Sales Drive · แรงขับเคลื่อนสู่ความสำเร็จและรายได้ไร้ขีดจำกัด',
    statement:
      'ฉันชอบระบบผลตอบแทนที่ "ทำมากได้มาก ตามความสามารถจริง" มากกว่าการรับเงินเดือนคงที่แต่มีเพดานจำกัดการเติบโต',
    scenarioHint: 'แรงขับเคลื่อนด้านรายได้และความก้าวหน้า (Achievement & Income Drive)',
    direction: 1,
  },
  {
    id: 40,
    pillar: 'RIASEC_DRIVE',
    dimension: 'SALES_DRIVE',
    dimensionLabel: 'Sales Drive · แรงขับเคลื่อนสู่ความสำเร็จและรายได้ไร้ขีดจำกัด',
    statement:
      'ฉันมีเป้าหมายชัดเจนในการพิชิตคุณวุฒิระดับสากล (เช่น MDRT / Top Producer) เพื่อสร้างอิสรภาพทางการเงินให้ตัวเองและครอบครัว',
    scenarioHint: 'ความชัดเจนของเป้าหมายความสำเร็จระดับสูง (High Ambition)',
    direction: 1,
  },

  // ============================================================================
  // PART 6: ENNEAGRAM 9 TYPES (Questions 41 – 49: 1 core item per Type 1–9)
  // ============================================================================
  {
    id: 41,
    pillar: 'ENNEAGRAM',
    dimension: 'ENNEAGRAM_1',
    dimensionLabel: 'Enneagram · ลักษณ์ 1 (ผู้ยึดมั่นมาตรฐานและความถูกต้อง)',
    statement:
      'แรงขับสำคัญที่สุดของฉันคือการทำทุกอย่างให้ถูกต้องตามมาตรฐาน มีจริยธรรมวิชาชีพไร้ที่ติ และปรับปรุงงานให้สมบูรณ์แบบเสมอ',
    scenarioHint: 'นพลักษณ์ที่ 1: The Principled Perfectionist',
    direction: 1,
  },
  {
    id: 42,
    pillar: 'ENNEAGRAM',
    dimension: 'ENNEAGRAM_2',
    dimensionLabel: 'Enneagram · ลักษณ์ 2 (ผู้ให้และผู้ดูแลเอาใจใส่ผู้อื่น)',
    statement:
      'แรงขับสำคัญที่สุดของฉันคือการได้ช่วยเหลือ ดูแลเอาใจใส่ และเป็นคนสำคัญที่คนรอบข้างและลูกค้ารักและพึ่งพาได้เสมอ',
    scenarioHint: 'นพลักษณ์ที่ 2: The Caring Giver',
    direction: 1,
  },
  {
    id: 43,
    pillar: 'ENNEAGRAM',
    dimension: 'ENNEAGRAM_3',
    dimensionLabel: 'Enneagram · ลักษณ์ 3 (ผู้มุ่งมั่นสู่ความสำเร็จและภาพลักษณ์มืออาชีพ)',
    statement:
      'แรงขับสำคัญที่สุดของฉันคือการสร้างผลงานให้โดดเด่น บรรลุเป้าหมายอันดับต้นๆ และได้รับการยอมรับในฐานะมืออาชีพที่ประสบความสำเร็จ',
    scenarioHint: 'นพลักษณ์ที่ 3: The Driven Achiever',
    direction: 1,
  },
  {
    id: 44,
    pillar: 'ENNEAGRAM',
    dimension: 'ENNEAGRAM_4',
    dimensionLabel: 'Enneagram · ลักษณ์ 4 (ผู้มีเอกลักษณ์เฉพาะตัวและเข้าใจอารมณ์ลึกซึ้ง)',
    statement:
      'แรงขับสำคัญที่สุดของฉันคือการทำงานที่มีความหมายลึกซึ้ง จริงใจต่อความรู้สึก และออกแบบแผนชีวิตที่เข้าใจความต่างของแต่ละบุคคล',
    scenarioHint: 'นพลักษณ์ที่ 4: The Authentic Individualist',
    direction: 1,
  },
  {
    id: 45,
    pillar: 'ENNEAGRAM',
    dimension: 'ENNEAGRAM_5',
    dimensionLabel: 'Enneagram · ลักษณ์ 5 (ผู้เชี่ยวชาญข้อมูลและการวิเคราะห์เชิงลึก)',
    statement:
      'แรงขับสำคัญที่สุดของฉันคือการมีความรู้ความเชี่ยวชาญที่ลึกซึ้ง รู้จริงในข้อมูลเชิงเทคนิค และเข้าใจโครงสร้างการเงินอย่างทะลุปรุโปร่ง',
    scenarioHint: 'นพลักษณ์ที่ 5: The Analytical Specialist',
    direction: 1,
  },
  {
    id: 46,
    pillar: 'ENNEAGRAM',
    dimension: 'ENNEAGRAM_6',
    dimensionLabel: 'Enneagram · ลักษณ์ 6 (นักบริหารความเสี่ยงผู้รอบคอบและซื่อสัตย์)',
    statement:
      'แรงขับสำคัญที่สุดของฉันคือการสร้างความมั่นคงปลอดภัย การมองเห็นความเสี่ยงล่วงหน้าเพื่อเตรียมแผนสำรอง และความซื่อสัตย์ต่อลูกค้าและทีม',
    scenarioHint: 'นพลักษณ์ที่ 6: The Loyal Risk Guardian',
    direction: 1,
  },
  {
    id: 47,
    pillar: 'ENNEAGRAM',
    dimension: 'ENNEAGRAM_7',
    dimensionLabel: 'Enneagram · ลักษณ์ 7 (ผู้มองโลกในแง่ดีและนักสร้างโอกาสใหม่)',
    statement:
      'แรงขับสำคัญที่สุดของฉันคือความอิสระ ความสนุกสนานในการได้ออกไปเจอผู้คนและโอกาสใหม่ๆ ที่หลากหลายไม่จำเจ',
    scenarioHint: 'นพลักษณ์ที่ 7: The Enthusiastic Visionary',
    direction: 1,
  },
  {
    id: 48,
    pillar: 'ENNEAGRAM',
    dimension: 'ENNEAGRAM_8',
    dimensionLabel: 'Enneagram · ลักษณ์ 8 (ผู้นำที่เข้มแข็งและผู้ปกป้องคนในดูแล)',
    statement:
      'แรงขับสำคัญที่สุดของฉันคือการเป็นผู้นำที่เข้มแข็ง พึ่งพาตัวเองได้ กล้าตัดสินใจเรื่องใหญ่ และปกป้องผลประโยชน์ของลูกค้าและลูกทีมอย่างเต็มที่',
    scenarioHint: 'นพลักษณ์ที่ 8: The Powerful Challenger',
    direction: 1,
  },
  {
    id: 49,
    pillar: 'ENNEAGRAM',
    dimension: 'ENNEAGRAM_9',
    dimensionLabel: 'Enneagram · ลักษณ์ 9 (ผู้สร้างความสบายใจและประสานความเข้าใจ)',
    statement:
      'แรงขับสำคัญที่สุดของฉันคือความสงบใจ ความราบรื่น และการสร้างพื้นที่ปลอดภัยในการพูดคุยโดยไม่กดดันใคร',
    scenarioHint: 'นพลักษณ์ที่ 9: The Harmonious Peacemaker',
    direction: 1,
  },

  // ============================================================================
  // PART 7: INSURANCE AGENT CORE COMPETENCY (Questions 50 – 60: 11 Questions)
  // ============================================================================
  {
    id: 50,
    pillar: 'COMPETENCY',
    dimension: 'PROSPECTING',
    dimensionLabel: 'สมรรถนะตัวแทน · การแสวงหาผู้มุ่งหวังและเปิดตลาด (Prospecting)',
    statement:
      'ฉันกล้าที่จะขอรายชื่อผู้มุ่งหวังแนะนำต่อ (Referral) จากลูกค้าหรือคนรู้จักที่ประทับใจในการบริการของฉันอย่างเป็นธรรมชาติ',
    scenarioHint: 'ทักษะการต่อยอดรายชื่อลูกค้าอย่างไม่รู้จบ',
    direction: 1,
  },
  {
    id: 51,
    pillar: 'COMPETENCY',
    dimension: 'PROSPECTING',
    dimensionLabel: 'สมรรถนะตัวแทน · การแสวงหาผู้มุ่งหวังและเปิดตลาด (Prospecting)',
    statement:
      'ฉันสามารถแปลงบทสนทนาทั่วไปในชีวิตประจำวัน (เช่น เรื่องงาน สุขภาพ ภาษี ลูกเรียนต่อ) ให้เชื่อมโยงเข้าสู่การนัดหมายพูดคุยเรื่องแผนการเงินได้',
    scenarioHint: 'ทักษะการจับสัญญาณความต้องการ (Need Detection & Approach)',
    direction: 1,
  },
  {
    id: 52,
    pillar: 'COMPETENCY',
    dimension: 'PROSPECTING',
    dimensionLabel: 'สมรรถนะตัวแทน · การแสวงหาผู้มุ่งหวังและเปิดตลาด (Prospecting)',
    statement:
      'เมื่อรายชื่อคนรู้จักใกล้ตัวเริ่มหมด ฉันมีวิธีสร้างช่องทางใหม่ๆ (เช่น เพจความรู้, สัมมนาออนไลน์, เครือข่ายอาชีพ) เพื่อเติมผู้มุ่งหวังใหม่ทุกสัปดาห์',
    scenarioHint: 'การบริหารฐานรายชื่อผู้มุ่งหวังอย่างต่อเนื่อง (Pipeline Management)',
    direction: 1,
  },
  {
    id: 53,
    pillar: 'COMPETENCY',
    dimension: 'ADVISORY',
    dimensionLabel: 'สมรรถนะตัวแทน · การวิเคราะห์ความต้องการและวางแผนการเงิน (Advisory)',
    statement:
      'ก่อนเสนอแบบประกันใดๆ ฉันชอบตั้งคำถามเพื่อสำรวจเป้าหมายชีวิต รายได้ ภาระหนี้สิน และความกังวลที่แท้จริงของลูกค้าอย่างครบถ้วน (Fact-Finding)',
    scenarioHint: 'การทำงานแบบที่ปรึกษาที่ยึดความต้องการของลูกค้าเป็นศูนย์กลาง',
    direction: 1,
  },
  {
    id: 54,
    pillar: 'COMPETENCY',
    dimension: 'ADVISORY',
    dimensionLabel: 'สมรรถนะตัวแทน · การวิเคราะห์ความต้องการและวางแผนการเงิน (Advisory)',
    statement:
      'ฉันสามารถคำนวณทุนประกันที่เหมาะสม งบค่ารักษาพยาบาล เงินเกษียณ และย่อยเงื่อนไขซับซ้อนให้ลูกค้าเข้าใจและเห็นภาพชัดเจนได้ง่าย',
    scenarioHint: 'ทักษะการออกแบบโซลูชันทางการเงินเฉพาะบุคคล',
    direction: 1,
  },
  {
    id: 55,
    pillar: 'COMPETENCY',
    dimension: 'CLOSING',
    dimensionLabel: 'สมรรถนะตัวแทน · การจัดการข้อโต้แย้งและปิดการขาย (Closing)',
    statement:
      'เมื่อลูกค้าพูดว่า "ขอคิดดูก่อน" หรือ "เบี้ยแพงไป" ฉันมองว่าเป็นโอกาสในการถามลึกถึงสาเหตุที่แท้จริงและช่วยปรับแผนให้ลงตัว มากกว่าจะยอมถอยทันที',
    scenarioHint: 'ทักษะการก้าวข้ามข้อโต้แย้งอย่างสร้างสรรค์ (Objection Handling)',
    direction: 1,
  },
  {
    id: 56,
    pillar: 'COMPETENCY',
    dimension: 'CLOSING',
    dimensionLabel: 'สมรรถนะตัวแทน · การจัดการข้อโต้แย้งและปิดการขาย (Closing)',
    statement:
      'เมื่อเห็นว่าแผนที่นำเสนอตอบโจทย์ลูกค้าครบถ้วนแล้ว ฉันมีความมั่นใจที่จะสรุปผลประโยชน์และชวนให้ลูกค้าตัดสินใจทำสัญญาในวันนั้นเลย',
    scenarioHint: 'ความเด็ดขาดและจังหวะในการสรุปปิดการขาย',
    direction: 1,
  },
  {
    id: 57,
    pillar: 'COMPETENCY',
    dimension: 'RETENTION',
    dimensionLabel: 'สมรรถนะตัวแทน · การดูแลลูกค้าระยะยาวและความยั่งยืน (Client Retention)',
    statement:
      'ฉันให้ความสำคัญกับการดูแลลูกค้าหลังการขายอย่างสม่ำเสมอ ทั้งการช่วยประสานงานเคลมสินไหมยามเจ็บป่วย และการทบทวนกรมธรรม์ประจำปี',
    scenarioHint: 'การสร้างความประทับใจระยะยาวและอัตราความยั่งยืนของกรมธรรม์ (Persistency)',
    direction: 1,
  },
  {
    id: 58,
    pillar: 'COMPETENCY',
    dimension: 'RETENTION',
    dimensionLabel: 'สมรรถนะตัวแทน · การดูแลลูกค้าระยะยาวและความยั่งยืน (Client Retention)',
    statement:
      'ฉันจดจำรายละเอียดสำคัญของครอบครัวลูกค้า (เช่น ชื่อบุตร วันเกิด เป้าหมายชีวิต) และนำมาใส่ใจดูแลจนเกิดการซื้อซ้ำและบอกต่อทั้งครอบครัว',
    scenarioHint: 'การเป็นที่ปรึกษาประจำครอบครัว (Trusted Family Advisor)',
    direction: 1,
  },
  {
    id: 59,
    pillar: 'COMPETENCY',
    dimension: 'LEADERSHIP',
    dimensionLabel: 'สมรรถนะตัวแทน · ภาวะผู้นำและการสร้างทีมตัวแทน (Agency Leadership)',
    statement:
      'ฉันชอบการถ่ายทอดความรู้ สอนงาน (Coaching) และช่วยให้รุ่นน้องหรือเพื่อนร่วมทีมพัฒนาทักษะจนประสบความสำเร็จไปด้วยกัน',
    scenarioHint: 'ศักยภาพในการเติบโตเป็นผู้จัดการหน่วยและผู้บริหารทีมตัวแทน',
    direction: 1,
  },
  {
    id: 60,
    pillar: 'COMPETENCY',
    dimension: 'LEADERSHIP',
    dimensionLabel: 'สมรรถนะตัวแทน · ภาวะผู้นำและการสร้างทีมตัวแทน (Agency Leadership)',
    statement:
      'ฉันมีวิสัยทัศน์ในการดึงดูดคนเก่งเข้ามาร่วมทีมและสร้างระบบการทำงานที่ชัดเจน เพื่อเติบโตเป็นองค์กรที่ปรึกษาการเงินที่มั่นคง',
    scenarioHint: 'ทักษะการสรรหาและสร้างทีมงานคุณภาพ (Recruiting & Agency Building)',
    direction: 1,
  },
];

export interface DemoPreset {
  id: string;
  label: string;
  badge: string;
  candidate: CandidateProfile;
  answers: Record<number, number>;
}

function buildPresetAnswers(
  pattern: 'ADVISOR' | 'HUNTER' | 'GUARDIAN' | 'MENTOR' | 'NEWBIE'
): Record<number, number> {
  const ans: Record<number, number> = {};
  for (let i = 1; i <= 60; i++) {
    if (pattern === 'ADVISOR') {
      // ENTJ · DISC DC · Enneagram 3w2 · High potential (88%+)
      ans[i] = 5;
      if ([2, 4, 6, 8, 18].includes(i)) ans[i] = 1;
      if ([23, 24, 42, 44, 49].includes(i)) ans[i] = 3;
    } else if (pattern === 'HUNTER') {
      // ESTP / ENTP · DISC DI · Enneagram 7w8 · Strong Sales Hunter (84%)
      ans[i] = 5;
      if ([2, 4, 6, 7, 18, 25, 26, 41, 45].includes(i)) ans[i] = 2;
      if ([8, 19, 20, 21, 22, 31, 39, 40, 47, 48, 50, 51, 55, 56].includes(i)) ans[i] = 5;
    } else if (pattern === 'GUARDIAN') {
      // ISTJ · DISC CS · Enneagram 6w5 · Precision Financial Planner (79%)
      ans[i] = 4;
      if ([1, 8, 13, 14, 18, 19, 21, 47].includes(i)) ans[i] = 2;
      if ([2, 3, 5, 7, 11, 12, 23, 24, 25, 26, 37, 38, 41, 45, 46, 53, 54, 57, 58].includes(i)) {
        ans[i] = 5;
      }
    } else if (pattern === 'MENTOR') {
      // ENFJ · DISC IS · Enneagram 2w3 · Inspiring Family Mentor & Team Leader (85%)
      ans[i] = 4;
      if ([2, 5, 8, 18, 19, 45].includes(i)) ans[i] = 2;
      if ([1, 4, 6, 7, 13, 15, 16, 21, 22, 23, 24, 27, 28, 29, 35, 36, 42, 43, 57, 58, 59, 60].includes(i)) {
        ans[i] = 5;
      }
    } else {
      // NEWBIE: ISFJ · DISC SI · Enneagram 9w1 · Developing New Agent (64%)
      ans[i] = 3;
      if ([2, 3, 6, 7, 15, 16, 23, 24, 35, 36, 42, 49, 57, 58].includes(i)) ans[i] = 5;
      if ([1, 5, 19, 20, 30, 31, 50, 52, 55, 56].includes(i)) ans[i] = 2;
      if (i === 18) ans[i] = 4;
    }
  }
  return ans;
}

export const DEMO_PRESETS: DemoPreset[] = [
  {
    id: 'preset-advisor',
    label: 'ตัวอย่างที่ 1: สไตล์แม่ทัพที่ปรึกษาการเงินและผู้นำองค์กร (ENTJ · DISC DC)',
    badge: 'Wealth Advisor & Leader',
    candidate: {
      id: 'demo_1',
      firstName: 'ธนภัทร',
      lastName: 'อัศวกุล',
      nickname: 'ภัทร',
      age: '32',
      phone: '081-942-5690',
      lineId: 'thanaphat.fa',
      completedAt: '7 พ.ย. 2569 09:30',
    },
    answers: buildPresetAnswers('ADVISOR'),
  },
  {
    id: 'preset-hunter',
    label: 'ตัวอย่างที่ 2: สไตล์นักขายเชิงรุกและสร้างเครือข่าย (ESTP · DISC DI)',
    badge: 'Top Sales & Rainmaker',
    candidate: {
      id: 'demo_2',
      firstName: 'พิมพ์ชนก',
      lastName: 'เจริญรุ่งเรือง',
      nickname: 'พิม',
      age: '26',
      phone: '089-415-8821',
      lineId: 'pimchanok.insure',
      completedAt: '7 พ.ย. 2569 10:15 [แก้ไขครั้งที่ 2: เดิม 76%→86%]',
      submissionCount: 2,
      isEdited: true,
      editHistoryNote:
        'กลับมาแก้ไขคำตอบและส่งแบบประเมินใหม่ (ครั้งที่ 2 · คะแนนเดิม 76% → 86%)',
    },
    answers: buildPresetAnswers('HUNTER'),
  },
  {
    id: 'preset-guardian',
    label: 'ตัวอย่างที่ 3: สไตล์นักวางแผนรอบคอบและดูแลระยะยาว (ISTJ · DISC CS)',
    badge: 'Specialist & Fiduciary',
    candidate: {
      id: 'demo_3',
      firstName: 'กิตติพงศ์',
      lastName: 'วงศ์สวัสดิ์',
      nickname: 'กิต',
      age: '38',
      phone: '086-731-2044',
      lineId: 'kittipong_plan',
      completedAt: '7 พ.ย. 2569 11:05',
    },
    answers: buildPresetAnswers('GUARDIAN'),
  },
  {
    id: 'preset-mentor',
    label: 'ตัวอย่างที่ 4: สไตล์โค้ชสร้างแรงบันดาลใจและดูแลครอบครัว (ENFJ · DISC IS)',
    badge: 'Family Mentor & Team Builder',
    candidate: {
      id: 'demo_4',
      firstName: 'ณัฐณิชา',
      lastName: 'เมธีวรากุล',
      nickname: 'แนท',
      age: '34',
      phone: '082-559-1420',
      lineId: 'natnicha.mentor',
      completedAt: '7 พ.ย. 2569 13:20',
    },
    answers: buildPresetAnswers('MENTOR'),
  },
  {
    id: 'preset-newbie',
    label: 'ตัวอย่างที่ 5: ผู้สมัครรุ่นใหม่ จิตบริการดี ควรเสริมทักษะปิดการขาย (ISFJ · DISC SI)',
    badge: 'Developing New Agent',
    candidate: {
      id: 'demo_5',
      firstName: 'ศุภกร',
      lastName: 'รัตนโชติ',
      nickname: 'บอส',
      age: '24',
      phone: '094-618-3395',
      lineId: 'supakorn.boss',
      completedAt: '7 พ.ย. 2569 14:10',
    },
    answers: buildPresetAnswers('NEWBIE'),
  },
];
