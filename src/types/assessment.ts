export type AssessmentPillar =
  | 'MBTI'
  | 'BIG_FIVE'
  | 'DISC'
  | 'EQ_AQ'
  | 'RIASEC_DRIVE'
  | 'ENNEAGRAM'
  | 'COMPETENCY';

export type MBTIDimensionKey = 'E_I' | 'S_N' | 'T_F' | 'J_P';

export type BigFiveDimensionKey =
  | 'OPENNESS'
  | 'CONSCIENTIOUSNESS'
  | 'EXTRAVERSION'
  | 'AGREEABLENESS'
  | 'EMOTIONAL_STABILITY';

export type DISCDimensionKey = 'DISC_D' | 'DISC_I' | 'DISC_S' | 'DISC_C';

export type EQAQDimensionKey = 'EQ_EMOTIONAL' | 'AQ_ADVERSITY';

export type RIASECDimensionKey =
  | 'RIASEC_ENTERPRISING'
  | 'RIASEC_SOCIAL'
  | 'RIASEC_INVESTIGATIVE'
  | 'SALES_DRIVE';

export type EnneagramDimensionKey =
  | 'ENNEAGRAM_1'
  | 'ENNEAGRAM_2'
  | 'ENNEAGRAM_3'
  | 'ENNEAGRAM_4'
  | 'ENNEAGRAM_5'
  | 'ENNEAGRAM_6'
  | 'ENNEAGRAM_7'
  | 'ENNEAGRAM_8'
  | 'ENNEAGRAM_9';

export type CompetencyDimensionKey =
  | 'PROSPECTING'
  | 'ADVISORY'
  | 'CLOSING'
  | 'RETENTION'
  | 'LEADERSHIP';

export type DimensionKey =
  | MBTIDimensionKey
  | BigFiveDimensionKey
  | DISCDimensionKey
  | EQAQDimensionKey
  | RIASECDimensionKey
  | EnneagramDimensionKey
  | CompetencyDimensionKey;

export interface CandidateProfile {
  id: string;
  firstName: string;
  lastName: string;
  nickname: string;
  age: string;
  phone: string;
  lineId: string;
  completedAt?: string;
  submissionCount?: number;
  isEdited?: boolean;
  editHistoryNote?: string;
}

export interface QuestionOption {
  value: number; // 1 to 5
  label: string;
  sublabel: string;
}

export interface QuestionItem {
  id: number;
  pillar: AssessmentPillar;
  dimension: DimensionKey;
  dimensionLabel: string;
  statement: string;
  scenarioHint: string;
  direction: 1 | -1;
}

export type ScoreLevel = 'HIGH' | 'GOOD' | 'MODERATE' | 'DEVELOP';

export interface CategoryAnalysis {
  key: DimensionKey;
  pillar: AssessmentPillar;
  code: string;
  title: string;
  subtitle: string;
  score: number; // 0 - 100
  benchmark: number; // 0 - 100
  level: ScoreLevel;
  levelLabel: string;
  summary: string;
  strengths: string[];
  weaknesses: string[];
  recommendations: string[];
}

export interface MBTIAxisDetail {
  key: MBTIDimensionKey;
  title: string;
  leftCode: 'E' | 'S' | 'T' | 'J';
  leftName: string;
  leftThai: string;
  rightCode: 'I' | 'N' | 'F' | 'P';
  rightName: string;
  rightThai: string;
  leftPercent: number;
  rightPercent: number;
  dominantCode: string;
  dominantLabel: string;
  clarityLabel: string;
  strengths: string[];
  weaknesses: string[];
  recommendations: string[];
}

export interface MBTIResult {
  code: string;
  personaTitle: string;
  personaTagline: string;
  overview: string;
  axes: MBTIAxisDetail[];
  naturalStrengths: string[];
  blindSpots: string[];
  recommendedSalesStyle: string;
  idealClientSegment: string;
}

export interface DISCResult {
  primaryCode: 'D' | 'I' | 'S' | 'C';
  secondaryCode: 'D' | 'I' | 'S' | 'C';
  blendCode: string; // e.g. "DI", "SC"
  styleTitle: string;
  summary: string;
  scores: {
    D: number;
    I: number;
    S: number;
    C: number;
  };
  categories: CategoryAnalysis[];
}

export interface EnneagramResult {
  dominantType: number; // 1..9
  wingCode: string; // e.g. "Type 3w2"
  title: string;
  coreMotivation: string;
  insuranceStrength: string;
  insuranceCaution: string;
  coachingAdvice: string;
  scores: Array<{
    typeNumber: number;
    label: string;
    score: number;
  }>;
}

export interface RoleTrackFit {
  id: 'SALES_HUNTER' | 'FINANCIAL_ADVISOR' | 'TEAM_LEADER';
  title: string;
  englishTitle: string;
  matchScore: number;
  rank: number;
  suitabilityLabel: string;
  description: string;
  whyYouFit: string[];
  potentialChallenges: string[];
  recommendedProducts: string[];
}

export interface RoadmapPhase {
  phase: string;
  timeframe: string;
  focusTitle: string;
  objectives: string[];
  keyMetrics: string;
}

export interface AssessmentReport {
  id: string;
  candidate: CandidateProfile;
  overallScore: number;
  suitabilityLevel: ScoreLevel;
  suitabilityHeadline: string;
  suitabilitySummary: string;
  /** Concise 1-line executive summary for the Admin Overview Directory */
  oneLineSummary: string;
  mbti: MBTIResult;
  bigFive: CategoryAnalysis[];
  disc: DISCResult;
  eqAq: CategoryAnalysis[];
  riasecDrive: CategoryAnalysis[];
  enneagram: EnneagramResult;
  competencies: CategoryAnalysis[];
  roleTracks: RoleTrackFit[];
  roadmap: RoadmapPhase[];
  answers: Record<number, number>;
}
