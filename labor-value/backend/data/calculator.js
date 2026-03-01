/**
 * Labor Value Calculation Engine
 * 노동 기여도 산출 엔진
 * ================================
 * Core algorithm for computing salary based on labor contribution.
 * Physical labor is weighted at 1.8x relative to intellectual labor.
 *
 * 핵심 알고리즘: 노동 유형별 기여도를 수치화하여 연봉 산출
 * 육체노동은 지적노동 대비 1.8배 가중치 적용
 */

const PHYSICAL_MULTIPLIER = 1.8; // 육체노동 가중치
const AI_COLLAB_BONUS_MAX = 0.30; // AI 협업 최대 보너스 (30%)
const BASE_SALARY_MIN = 24000000; // 최저 기준 연봉 (2,400만원)

/**
 * 노동 강도 점수 → 레벨 분류
 * Labor intensity score → level classification
 */
function getIntensityLevel(score) {
  if (score < 20) return { level: 'minimal', label: '최소 / Minimal', color: '#64748b', multiplier: 0.6 };
  if (score < 40) return { level: 'light',   label: '경량 / Light',   color: '#10b981', multiplier: 0.8 };
  if (score < 60) return { level: 'medium',  label: '보통 / Medium',  color: '#3b82f6', multiplier: 1.0 };
  if (score < 75) return { level: 'heavy',   label: '고강도 / Heavy', color: '#f59e0b', multiplier: 1.2 };
  if (score < 90) return { level: 'intense', label: '강도 / Intense', color: '#f97316', multiplier: 1.5 };
  return                { level: 'extreme', label: '극한 / Extreme', color: '#ef4444', multiplier: 1.8 };
}

/**
 * AI 협업 수준 → 보너스 계수
 * AI collaboration level → bonus coefficient
 */
function getAICollabBonus(level) {
  const map = {
    none:     { label: '미사용 / None',          bonus: 0.00, description: 'AI 도구 미사용' },
    basic:    { label: '기초 / Basic',            bonus: 0.05, description: '단순 검색/참조 수준' },
    moderate: { label: '보통 / Moderate',         bonus: 0.12, description: '업무 보조 활용' },
    advanced: { label: '심화 / Advanced',         bonus: 0.20, description: '분석·생성 작업 협업' },
    expert:   { label: '전문 / Expert',           bonus: 0.28, description: '복잡 문제해결 핵심 역할' },
    pioneer:  { label: '선도적 / Pioneer',        bonus: 0.30, description: 'AI 협업 방식 자체를 혁신' },
  };
  return map[level] || map.none;
}

/**
 * 지적 노동 점수 산출
 * Intellectual labor score calculation
 */
function calcIntellectualScore(params) {
  const {
    problemComplexity,    // 문제 복잡도 0-100
    creativityRequired,   // 창의성 요구도 0-100
    decisionMakingWeight, // 의사결정 비중 0-100
    knowledgeDepth,       // 전문 지식 깊이 0-100
    communicationLoad,    // 소통·조정 부담 0-100
    aiCollabLevel,        // AI 협업 수준
  } = params;

  const rawScore = (
    problemComplexity    * 0.25 +
    creativityRequired   * 0.20 +
    decisionMakingWeight * 0.20 +
    knowledgeDepth       * 0.20 +
    communicationLoad    * 0.15
  );

  const aiBonus = getAICollabBonus(aiCollabLevel);
  const boostedScore = rawScore * (1 + aiBonus.bonus);

  return {
    rawScore: Math.round(rawScore * 10) / 10,
    aiBonus,
    finalScore: Math.min(Math.round(boostedScore * 10) / 10, 100),
    breakdown: {
      problemComplexity,
      creativityRequired,
      decisionMakingWeight,
      knowledgeDepth,
      communicationLoad,
    }
  };
}

/**
 * 육체 노동 점수 산출 (×1.8 가중치 적용)
 * Physical labor score calculation (×1.8 weight applied)
 */
function calcPhysicalScore(params) {
  const {
    physicalStrength,   // 근력·체력 요구도 0-100
    environmentRisk,    // 환경 위험도 0-100
    repetitiveMotion,   // 반복 동작 부담 0-100
    enduranceDemand,    // 지구력 요구 0-100
    skillPrecision,     // 숙련·정밀도 0-100
  } = params;

  const rawScore = (
    physicalStrength * 0.30 +
    environmentRisk  * 0.25 +
    repetitiveMotion * 0.15 +
    enduranceDemand  * 0.20 +
    skillPrecision   * 0.10
  );

  const weightedScore = rawScore * PHYSICAL_MULTIPLIER;

  return {
    rawScore: Math.round(rawScore * 10) / 10,
    multiplier: PHYSICAL_MULTIPLIER,
    weightedScore: Math.round(Math.min(weightedScore, 100) * 10) / 10,
    breakdown: {
      physicalStrength,
      environmentRisk,
      repetitiveMotion,
      enduranceDemand,
      skillPrecision,
    }
  };
}

/**
 * 최종 연봉 계산 — 핵심 함수
 * Final salary calculation — core function
 *
 * Formula:
 * TotalLaborScore = (IntellectualScore × intRatio) + (PhysicalWeightedScore × physRatio)
 * IntensityMultiplier = f(workHoursPerWeek, shiftType)
 * BaseSalary = marketBase × sectorFactor
 * FinalSalary = BaseSalary × (TotalLaborScore / 50) × IntensityMultiplier
 */
function calculateSalary(input) {
  const {
    // Worker info
    jobTitle,
    sector,
    yearsExperience,

    // Labor type ratio (must sum to 100)
    intellectualRatio,   // 0-100
    physicalRatio,       // 0-100

    // Intellectual params
    intellectual,

    // Physical params
    physical,

    // Work conditions
    workHoursPerWeek,    // 주당 근무 시간
    shiftType,           // 'day' | 'shift' | 'night' | 'irregular'
    overtimeHoursPerMonth,

    // Market
    marketBaseSalary,    // 시장 기준 연봉 (원)
    sectorFactor,        // 업종 보정 계수 (기본 1.0)
  } = input;

  // Validate ratios
  const totalRatio = intellectualRatio + physicalRatio;
  if (Math.abs(totalRatio - 100) > 0.1) {
    throw new Error('지적노동 + 육체노동 비율의 합이 100이 되어야 합니다. / Intellectual + Physical ratio must sum to 100.');
  }

  // Calculate component scores
  const intellResult = calcIntellectualScore(intellectual);
  const physResult   = calcPhysicalScore(physical);

  // Composite labor score (0-100 scale)
  const compositeLaborScore =
    (intellResult.finalScore * (intellectualRatio / 100)) +
    (physResult.weightedScore * (physicalRatio / 100));

  // Intensity from weekly hours
  let hoursIntensityBonus = 0;
  if (workHoursPerWeek > 52) hoursIntensityBonus = 0.20;
  else if (workHoursPerWeek > 44) hoursIntensityBonus = 0.12;
  else if (workHoursPerWeek > 40) hoursIntensityBonus = 0.05;

  // Shift type multiplier
  const shiftMap = {
    day:       1.00,
    shift:     1.10,
    night:     1.20,
    irregular: 1.15,
  };
  const shiftMult = shiftMap[shiftType] || 1.00;

  // Overtime bonus
  const overtimeBonus = Math.min(overtimeHoursPerMonth * 0.005, 0.20);

  // Experience factor (log scale, caps at 30 yrs)
  const expFactor = 1 + Math.min(Math.log(yearsExperience + 1) / Math.log(31), 1) * 0.50;

  // Intensity level (composite)
  const intensityScore = Math.min(compositeLaborScore + hoursIntensityBonus * 100, 100);
  const intensityLevel = getIntensityLevel(intensityScore);

  // Final calculation
  const base = Math.max(marketBaseSalary || 36000000, BASE_SALARY_MIN);
  const sectorAdj = sectorFactor || 1.0;

  const laborContributionMultiplier = compositeLaborScore / 50; // 50 = neutral baseline
  const finalSalary = Math.round(
    base
    * sectorAdj
    * laborContributionMultiplier
    * intensityLevel.multiplier
    * shiftMult
    * (1 + overtimeBonus)
    * expFactor
  );

  // Monthly breakdown
  const monthlySalary   = Math.round(finalSalary / 12);
  const dailyWage       = Math.round(finalSalary / 365);
  const hourlyWage      = Math.round(dailyWage / 8);

  return {
    // Scores
    intellectualScore: intellResult,
    physicalScore:     physResult,
    compositeLaborScore: Math.round(compositeLaborScore * 10) / 10,

    // Intensity
    intensityScore: Math.round(intensityScore * 10) / 10,
    intensityLevel,

    // Multipliers
    multipliers: {
      sectorFactor: sectorAdj,
      shiftMultiplier: shiftMult,
      overtimeBonus: Math.round(overtimeBonus * 100),
      experienceFactor: Math.round(expFactor * 100) / 100,
      intensityMultiplier: intensityLevel.multiplier,
      laborContributionMultiplier: Math.round(laborContributionMultiplier * 100) / 100,
    },

    // Salary results
    salary: {
      annual:  finalSalary,
      monthly: monthlySalary,
      daily:   dailyWage,
      hourly:  hourlyWage,
    },

    // Metadata
    meta: {
      jobTitle,
      sector,
      yearsExperience,
      intellectualRatio,
      physicalRatio,
      workHoursPerWeek,
      shiftType,
      physicalMultiplierApplied: PHYSICAL_MULTIPLIER,
      calculatedAt: new Date().toISOString(),
    }
  };
}

/**
 * 업종별 기준 데이터
 * Sector reference data
 */
const SECTORS = [
  { id: 'construction',    label: '건설 / Construction',            baseSalary: 38000000, sectorFactor: 1.05 },
  { id: 'manufacturing',   label: '제조 / Manufacturing',           baseSalary: 36000000, sectorFactor: 1.00 },
  { id: 'logistics',       label: '물류·운송 / Logistics',          baseSalary: 34000000, sectorFactor: 0.98 },
  { id: 'healthcare',      label: '의료·보건 / Healthcare',         baseSalary: 50000000, sectorFactor: 1.20 },
  { id: 'it',              label: 'IT·소프트웨어 / IT & Software',  baseSalary: 55000000, sectorFactor: 1.25 },
  { id: 'finance',         label: '금융 / Finance',                 baseSalary: 60000000, sectorFactor: 1.30 },
  { id: 'education',       label: '교육 / Education',               baseSalary: 40000000, sectorFactor: 1.00 },
  { id: 'agriculture',     label: '농업·어업 / Agriculture',        baseSalary: 28000000, sectorFactor: 0.85 },
  { id: 'service',         label: '서비스 / Service',               baseSalary: 30000000, sectorFactor: 0.90 },
  { id: 'public',          label: '공공·행정 / Public Sector',      baseSalary: 45000000, sectorFactor: 1.10 },
  { id: 'arts',            label: '예술·문화 / Arts & Culture',     baseSalary: 32000000, sectorFactor: 0.92 },
  { id: 'research',        label: '연구·개발 / R&D',                baseSalary: 52000000, sectorFactor: 1.18 },
  { id: 'custom',          label: '직접 입력 / Custom',             baseSalary: 40000000, sectorFactor: 1.00 },
];

const JOB_PRESETS = [
  {
    id: 'construction_worker',
    label: '건설 노동자 / Construction Worker',
    sector: 'construction',
    intellectualRatio: 15, physicalRatio: 85,
    intellectual: { problemComplexity: 20, creativityRequired: 15, decisionMakingWeight: 25, knowledgeDepth: 30, communicationLoad: 20, aiCollabLevel: 'none' },
    physical: { physicalStrength: 90, environmentRisk: 80, repetitiveMotion: 60, enduranceDemand: 85, skillPrecision: 55 },
    workHoursPerWeek: 50, shiftType: 'day', overtimeHoursPerMonth: 20,
  },
  {
    id: 'software_engineer',
    label: '소프트웨어 엔지니어 / Software Engineer',
    sector: 'it',
    intellectualRatio: 95, physicalRatio: 5,
    intellectual: { problemComplexity: 85, creativityRequired: 75, decisionMakingWeight: 70, knowledgeDepth: 88, communicationLoad: 60, aiCollabLevel: 'advanced' },
    physical: { physicalStrength: 5, environmentRisk: 5, repetitiveMotion: 40, enduranceDemand: 20, skillPrecision: 30 },
    workHoursPerWeek: 45, shiftType: 'day', overtimeHoursPerMonth: 15,
  },
  {
    id: 'nurse',
    label: '간호사 / Nurse',
    sector: 'healthcare',
    intellectualRatio: 55, physicalRatio: 45,
    intellectual: { problemComplexity: 70, creativityRequired: 40, decisionMakingWeight: 65, knowledgeDepth: 80, communicationLoad: 75, aiCollabLevel: 'moderate' },
    physical: { physicalStrength: 55, environmentRisk: 60, repetitiveMotion: 55, enduranceDemand: 70, skillPrecision: 70 },
    workHoursPerWeek: 44, shiftType: 'shift', overtimeHoursPerMonth: 10,
  },
  {
    id: 'delivery_driver',
    label: '택배 기사 / Delivery Driver',
    sector: 'logistics',
    intellectualRatio: 20, physicalRatio: 80,
    intellectual: { problemComplexity: 25, creativityRequired: 15, decisionMakingWeight: 30, knowledgeDepth: 20, communicationLoad: 35, aiCollabLevel: 'basic' },
    physical: { physicalStrength: 75, environmentRisk: 65, repetitiveMotion: 80, enduranceDemand: 85, skillPrecision: 45 },
    workHoursPerWeek: 55, shiftType: 'irregular', overtimeHoursPerMonth: 30,
  },
  {
    id: 'ai_researcher',
    label: 'AI 연구원 / AI Researcher',
    sector: 'research',
    intellectualRatio: 98, physicalRatio: 2,
    intellectual: { problemComplexity: 95, creativityRequired: 90, decisionMakingWeight: 80, knowledgeDepth: 95, communicationLoad: 55, aiCollabLevel: 'pioneer' },
    physical: { physicalStrength: 5, environmentRisk: 5, repetitiveMotion: 20, enduranceDemand: 15, skillPrecision: 10 },
    workHoursPerWeek: 50, shiftType: 'day', overtimeHoursPerMonth: 20,
  },
  {
    id: 'farmer',
    label: '농업인 / Farmer',
    sector: 'agriculture',
    intellectualRatio: 30, physicalRatio: 70,
    intellectual: { problemComplexity: 40, creativityRequired: 35, decisionMakingWeight: 50, knowledgeDepth: 55, communicationLoad: 25, aiCollabLevel: 'none' },
    physical: { physicalStrength: 80, environmentRisk: 55, repetitiveMotion: 70, enduranceDemand: 80, skillPrecision: 60 },
    workHoursPerWeek: 60, shiftType: 'irregular', overtimeHoursPerMonth: 35,
  },
];

module.exports = {
  calculateSalary,
  calcIntellectualScore,
  calcPhysicalScore,
  getIntensityLevel,
  getAICollabBonus,
  SECTORS,
  JOB_PRESETS,
  PHYSICAL_MULTIPLIER,
};
