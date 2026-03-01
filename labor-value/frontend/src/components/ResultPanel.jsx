import React, { useState, useEffect } from 'react'
import { formatKRW, formatKRWFull } from '../utils/format'
import styles from './ResultPanel.module.css'

function AnimatedNumber({ value, duration = 1200 }) {
  const [display, setDisplay] = useState(0)
  useEffect(() => {
    let start = 0
    const steps = 60
    const increment = value / steps
    const interval = duration / steps
    const timer = setInterval(() => {
      start += increment
      if (start >= value) { setDisplay(value); clearInterval(timer) }
      else setDisplay(Math.round(start))
    }, interval)
    return () => clearInterval(timer)
  }, [value, duration])
  return <>{formatKRWFull(display)}</>
}

function ScoreGauge({ label, score, color, max = 100 }) {
  const pct = Math.min((score / max) * 100, 100)
  return (
    <div className={styles.gaugeWrap}>
      <div className={styles.gaugeTop}>
        <span className={styles.gaugeLabel}>{label}</span>
        <span className={styles.gaugeValue} style={{ color }}>{score.toFixed(1)}</span>
      </div>
      <div className={styles.gaugeTrack}>
        <div className={styles.gaugeFill} style={{ '--w': `${pct}%`, background: color }} />
      </div>
    </div>
  )
}

function MultiplierRow({ label, value, isBoost }) {
  const numVal = parseFloat(value)
  const neutral = Math.abs(numVal - 1.0) < 0.001 || numVal === 0
  const positive = !neutral && (isBoost ? numVal > 0 : numVal > 1.0)
  return (
    <div className={styles.multRow}>
      <span className={styles.multLabel}>{label}</span>
      <span className={styles.multVal} style={{
        color: neutral ? 'var(--text3)' : positive ? 'var(--green)' : 'var(--orange)'
      }}>
        {isBoost ? `+${value}%` : `×${value}`}
      </span>
    </div>
  )
}

export default function ResultPanel({ result, onReset }) {
  if (!result) return null

  const { intellectualScore, physicalScore, compositeLaborScore,
          intensityLevel, multipliers, salary, meta } = result

  const intensityColorMap = {
    minimal: '#64748b', light: '#10b981', medium: '#2d6ef5',
    heavy: '#f59e0b', intense: '#f97316', extreme: '#ef4444'
  }
  const intColor = intensityColorMap[intensityLevel.level] || '#2d6ef5'

  return (
    <div className={`${styles.panel} fade-up`}>

      {/* ── TOP HERO ── */}
      <div className={styles.hero}>
        <div className={styles.heroLeft}>
          <div className={styles.heroLabel}>연간 기여도 기반 연봉 / Annual Contribution-Based Salary</div>
          <div className={styles.heroSalary}>
            <AnimatedNumber value={salary.annual} />
          </div>
          <div className={styles.heroSub}>
            월 <strong>{formatKRW(salary.monthly)}</strong> &nbsp;·&nbsp;
            일 <strong>{formatKRW(salary.daily)}</strong> &nbsp;·&nbsp;
            시간 <strong>{formatKRW(salary.hourly)}</strong>
          </div>
        </div>
        <div className={styles.heroRight}>
          <div className={styles.intensityCircle} style={{ borderColor: intColor, boxShadow: `0 0 30px ${intColor}40` }}>
            <div className={styles.icScore} style={{ color: intColor }}>{result.intensityScore}</div>
            <div className={styles.icLabel}>강도 지수</div>
            <div className={styles.icLevel} style={{ color: intColor }}>{intensityLevel.label}</div>
          </div>
        </div>
      </div>

      {/* ── SCORE BREAKDOWN ── */}
      <div className={styles.section}>
        <div className="section-heading">노동 점수 분석 / Labor Score Analysis</div>
        <div className={styles.scoreGrid}>
          <div className={styles.scoreCard}>
            <div className={styles.scTop}>
              <span className={styles.scIcon}>🧠</span>
              <span className={styles.scLabel}>지적 노동 점수</span>
              <span className={`tag tag-blue`}>{meta.intellectualRatio}% 비중</span>
            </div>
            <div className={styles.scBig} style={{ color: '#4d8fff' }}>{intellectualScore.finalScore}</div>
            <div className={styles.scSub}>원점수 {intellectualScore.rawScore} + AI 협업 보너스 +{Math.round(intellectualScore.aiBonus.bonus * 100)}%</div>
            <div className={styles.scAI}>
              <span className="tag tag-cyan">{intellectualScore.aiBonus.label}</span>
              <span className={styles.scAIDesc}>{intellectualScore.aiBonus.description}</span>
            </div>
          </div>

          <div className={styles.scoreCard}>
            <div className={styles.scTop}>
              <span className={styles.scIcon}>💪</span>
              <span className={styles.scLabel}>육체 노동 점수</span>
              <span className={`tag tag-orange`}>{meta.physicalRatio}% 비중</span>
            </div>
            <div className={styles.scBig} style={{ color: '#fb923c' }}>
              {physicalScore.weightedScore}
              <span className={styles.scMultTag}>×1.8</span>
            </div>
            <div className={styles.scSub}>원점수 {physicalScore.rawScore} × 1.8 가중치 적용</div>
            <div className={styles.physMultiplierNote}>
              육체노동 보호 가중치 1.8배 적용 / Physical labor protection weight ×1.8
            </div>
          </div>

          <div className={styles.scoreCard} style={{ gridColumn: '1 / -1' }}>
            <div className={styles.scTop}>
              <span className={styles.scIcon}>⚖️</span>
              <span className={styles.scLabel}>종합 노동 기여도 점수 / Composite Labor Score</span>
            </div>
            <div className={styles.compositeBar}>
              <div className={styles.compIntell} style={{ width: `${meta.intellectualRatio}%` }}>
                <span>{meta.intellectualRatio}%</span>
              </div>
              <div className={styles.compPhys} style={{ width: `${meta.physicalRatio}%` }}>
                <span>{meta.physicalRatio}%</span>
              </div>
            </div>
            <div className={styles.compScore}>
              종합 점수: <strong style={{ color: 'var(--gold2)', fontSize: '1.4rem' }}>{compositeLaborScore.toFixed(1)}</strong> / 100
            </div>
          </div>
        </div>
      </div>

      {/* ── DETAIL SCORES ── */}
      <div className={styles.section}>
        <div className="section-heading">세부 점수 / Detailed Sub-scores</div>
        <div className={styles.detailGrid}>
          <div className={styles.detailCard}>
            <div className={styles.detailTitle}>🧠 지적 노동 세부 / Intellectual Sub-scores</div>
            <ScoreGauge label="문제 복잡도" score={intellectualScore.breakdown.problemComplexity} color="#2d6ef5" />
            <ScoreGauge label="창의성 요구도" score={intellectualScore.breakdown.creativityRequired} color="#7c3aed" />
            <ScoreGauge label="의사결정 비중" score={intellectualScore.breakdown.decisionMakingWeight} color="#0891b2" />
            <ScoreGauge label="전문 지식 깊이" score={intellectualScore.breakdown.knowledgeDepth} color="#2563eb" />
            <ScoreGauge label="소통·조정 부담" score={intellectualScore.breakdown.communicationLoad} color="#4f46e5" />
          </div>
          <div className={styles.detailCard}>
            <div className={styles.detailTitle}>💪 육체 노동 세부 / Physical Sub-scores</div>
            <ScoreGauge label="근력·체력 요구도" score={physicalScore.breakdown.physicalStrength} color="#f97316" />
            <ScoreGauge label="환경 위험도" score={physicalScore.breakdown.environmentRisk} color="#dc2626" />
            <ScoreGauge label="반복 동작 부담" score={physicalScore.breakdown.repetitiveMotion} color="#ea580c" />
            <ScoreGauge label="지구력 요구" score={physicalScore.breakdown.enduranceDemand} color="#b45309" />
            <ScoreGauge label="숙련·정밀도" score={physicalScore.breakdown.skillPrecision} color="#d97706" />
          </div>
        </div>
      </div>

      {/* ── MULTIPLIERS ── */}
      <div className={styles.section}>
        <div className="section-heading">적용 계수 / Applied Multipliers</div>
        <div className={styles.multGrid}>
          <MultiplierRow label="업종 보정 계수 / Sector Factor" value={multipliers.sectorFactor.toFixed(2)} />
          <MultiplierRow label="노동 기여도 계수 / Contribution Factor" value={multipliers.laborContributionMultiplier.toFixed(2)} />
          <MultiplierRow label="강도 계수 / Intensity Multiplier" value={multipliers.intensityMultiplier.toFixed(2)} />
          <MultiplierRow label="교대 계수 / Shift Multiplier" value={multipliers.shiftMultiplier.toFixed(2)} />
          <MultiplierRow label="경력 계수 / Experience Factor" value={multipliers.experienceFactor.toFixed(2)} />
          <MultiplierRow label="초과근무 보너스 / Overtime Bonus" value={multipliers.overtimeBonus} isBoost />
        </div>
      </div>

      <div className="alert alert-gold" style={{ marginTop: '0.5rem', fontSize: '0.75rem' }}>
        ⚠️ &nbsp;이 계산 결과는 정책 연구 및 공익 목적을 위한 참조 수치입니다. 실제 고용 계약이나 임금 협상에 법적 효력이 없습니다. &nbsp;/&nbsp;
        Results are for policy research and public interest reference only. No legal effect on employment contracts.
      </div>

      <button className={styles.resetBtn} onClick={onReset}>
        ↩ 새로 계산 / New Calculation
      </button>
    </div>
  )
}
