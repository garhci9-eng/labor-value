import React from 'react'
import styles from './About.module.css'

export default function About() {
  return (
    <div className={styles.wrap}>
      <h2 className={styles.title}>이론 및 알고리즘</h2>
      <p className={styles.sub}>Labor Contribution Theory & Algorithm — 노동 기여도 연봉 체계 이론</p>

      <div className="alert alert-gold" style={{ marginBottom: '1.5rem' }}>
        ⚠️ &nbsp;이 시스템은 <strong>공익적 목적</strong>을 위해서만 사용되어야 합니다. 정책 연구, 임금 공정성 연구, 사회적 논의를 위한 참조 도구입니다. &nbsp;/&nbsp;
        This system must be used for <strong>public interest purposes only</strong> — policy research, wage fairness studies, and social discourse.
      </div>

      <div className={styles.section}>
        <div className="section-heading">핵심 원칙 / Core Principles</div>
        <div className={styles.principleGrid}>
          {[
            { icon: '⚖️', title: '육체노동 1.8배 가중', titleEn: 'Physical Labor ×1.8 Weight', desc: '힘을 쓰는 육체노동은 지적노동 대비 1.8배의 사회적 가치를 인정받습니다. 신체 소모, 위험 노출, 회복 비용을 반영합니다.', descEn: 'Physical labor requiring bodily exertion is recognized at 1.8× the value of intellectual labor, reflecting physical depletion, risk exposure, and recovery costs.' },
            { icon: '🤖', title: 'AI 협업 가치 인정', titleEn: 'AI Collaboration Value', desc: 'AI와의 협업 수준에 따라 지적 노동 점수에 최대 30%의 생산성 보너스를 부여합니다. AI를 도구로 활용하는 능력 자체가 노동 가치입니다.', descEn: 'Up to 30% productivity bonus applied to intellectual labor based on AI collaboration level. The ability to leverage AI as a tool is itself a labor skill.' },
            { icon: '📊', title: '노동 강도 계단 구조', titleEn: '6-Level Intensity Ladder', desc: '노동 강도를 6단계로 분류하여 최소(0.6×)부터 극한(1.8×)까지 차등 계수를 적용합니다.', descEn: 'Labor intensity classified into 6 levels, applying differential coefficients from Minimal (0.6×) to Extreme (1.8×).' },
            { icon: '🌐', title: '업종별 보정', titleEn: 'Sector Adjustment', desc: '업종별 시장 현실을 반영한 기준 연봉과 보정 계수를 적용합니다. 공공·의료 분야는 사회적 필수성을 추가 반영합니다.', descEn: 'Sector-specific base salary and adjustment factors reflecting market realities. Public and healthcare sectors additionally reflect social necessity.' },
          ].map((p, i) => (
            <div key={i} className={styles.principleCard}>
              <div className={styles.princIcon}>{p.icon}</div>
              <div className={styles.princTitle}>{p.title}</div>
              <div className={styles.princTitleEn}>{p.titleEn}</div>
              <div className={styles.princDesc}>{p.desc}</div>
              <div className={styles.princDescEn}>{p.descEn}</div>
            </div>
          ))}
        </div>
      </div>

      <div className={styles.section}>
        <div className="section-heading">계산 공식 / Calculation Formula</div>
        <div className={styles.formulaBox}>
          <div className={styles.formulaTitle}>종합 노동 점수 / Composite Labor Score</div>
          <div className={styles.formula}>
            <span className={styles.fVar}>S</span>
            <span className={styles.fOp}> = </span>
            <span className={styles.fGroup}>
              (<span className={styles.fVar}>I</span> × <span className={styles.fConst}>AI_bonus</span>)
              × <span className={styles.fRatio}>R<sub>i</sub></span>
            </span>
            <span className={styles.fOp}> + </span>
            <span className={styles.fGroup}>
              (<span className={styles.fVar}>P</span> × <span className={styles.fConst}>1.8</span>)
              × <span className={styles.fRatio}>R<sub>p</sub></span>
            </span>
          </div>
          <div className={styles.formulaTitle} style={{ marginTop: '1.25rem' }}>최종 연봉 / Final Annual Salary</div>
          <div className={styles.formula} style={{ fontSize: '0.9rem', flexWrap: 'wrap', gap: '0.35rem' }}>
            <span className={styles.fVar}>Salary</span>
            <span className={styles.fOp}> = </span>
            <span className={styles.fConst}>Base</span>
            <span className={styles.fOp}> × </span>
            <span className={styles.fConst}>Sector</span>
            <span className={styles.fOp}> × </span>
            <span className={styles.fGroup}><span className={styles.fVar}>S</span>/50</span>
            <span className={styles.fOp}> × </span>
            <span className={styles.fConst}>Intensity</span>
            <span className={styles.fOp}> × </span>
            <span className={styles.fConst}>Shift</span>
            <span className={styles.fOp}> × </span>
            <span className={styles.fConst}>Experience</span>
            <span className={styles.fOp}> × </span>
            <span className={styles.fConst}>(1+OT)</span>
          </div>
          <div className={styles.formulaVars}>
            <div><strong>I</strong> : 지적노동 원점수 (0–100)</div>
            <div><strong>P</strong> : 육체노동 원점수 (0–100)</div>
            <div><strong>R<sub>i</sub>, R<sub>p</sub></strong> : 지적/육체 비율 합 = 1</div>
            <div><strong>1.8</strong> : 육체노동 보호 가중치</div>
            <div><strong>AI_bonus</strong> : 1.0 ~ 1.30</div>
            <div><strong>50</strong> : 중립 기준점 (baseline)</div>
            <div><strong>Intensity</strong> : 0.6 ~ 1.8</div>
            <div><strong>OT</strong> : 초과근무 보너스 (최대 20%)</div>
          </div>
        </div>
      </div>

      <div className={styles.section}>
        <div className="section-heading">강도 단계 / Intensity Levels</div>
        <div className={styles.intensityTable}>
          {[
            { level: '최소 / Minimal', range: '0–19', mult: '×0.6', color: '#64748b' },
            { level: '경량 / Light',   range: '20–39', mult: '×0.8', color: '#10b981' },
            { level: '보통 / Medium',  range: '40–59', mult: '×1.0', color: '#2d6ef5' },
            { level: '고강도 / Heavy', range: '60–74', mult: '×1.2', color: '#f59e0b' },
            { level: '강도 / Intense', range: '75–89', mult: '×1.5', color: '#f97316' },
            { level: '극한 / Extreme', range: '90–100',mult: '×1.8', color: '#ef4444' },
          ].map((r, i) => (
            <div key={i} className={styles.iRow}>
              <div className={styles.iLevel} style={{ color: r.color }}>{r.level}</div>
              <div className={styles.iRange}>{r.range}점</div>
              <div className={styles.iMult} style={{ color: r.color }}>{r.mult}</div>
              <div className={styles.iBar}>
                <div style={{ width: `${(i+1)/6*100}%`, height: '100%', background: r.color, borderRadius: '2px' }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className={styles.section}>
        <div className="section-heading">공익 사용 조건 / Public Interest Terms</div>
        <div className="alert alert-danger">
          🚫 &nbsp;<strong>금지 사용:</strong> 상업적 임금 책정 도구로의 활용, 노동자 착취 목적의 사용, 특정 직군 비하 목적, 영리 기업의 임금 삭감 근거 자료로의 활용 &nbsp;/&nbsp;
          <strong>Prohibited:</strong> Use as a commercial wage-setting tool, use to exploit workers, use to demean specific occupations, use as justification for wage cuts.
        </div>
        <div className="alert alert-success" style={{ marginTop: '0.75rem' }}>
          ✅ &nbsp;<strong>허용 사용:</strong> 임금 공정성 정책 연구, 노동 가치 학문적 논의, 사회적 임금 체계 개혁 토론, 노동자 권리 강화 캠페인, 교육 목적 &nbsp;/&nbsp;
          <strong>Permitted:</strong> Wage fairness policy research, academic discussion of labor value, social wage reform debate, worker rights campaigns, educational purposes.
        </div>
      </div>
    </div>
  )
}
