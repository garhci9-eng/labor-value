import React, { useState, useEffect } from 'react'
import { fetchSectors, fetchPresets, calculate } from '../utils/api'
import ScoreSlider from '../components/ScoreSlider'
import RatioBar from '../components/RatioBar'
import ResultPanel from '../components/ResultPanel'
import styles from './Calculator.module.css'

const AI_LEVELS = [
  { value: 'none',     label: '미사용 / None',    desc: 'AI 도구 미사용' },
  { value: 'basic',    label: '기초 / Basic',      desc: '단순 검색·참조' },
  { value: 'moderate', label: '보통 / Moderate',   desc: '업무 보조 활용' },
  { value: 'advanced', label: '심화 / Advanced',   desc: '분석·생성 협업' },
  { value: 'expert',   label: '전문 / Expert',     desc: '복잡 문제해결' },
  { value: 'pioneer',  label: '선도 / Pioneer',    desc: 'AI 방식 자체 혁신' },
]
const SHIFT_TYPES = [
  { value: 'day',       label: '주간 / Day Shift' },
  { value: 'shift',     label: '교대 / Shift Work' },
  { value: 'night',     label: '야간 / Night Shift' },
  { value: 'irregular', label: '불규칙 / Irregular' },
]

const DEFAULT_STATE = {
  jobTitle: '',
  sector: 'manufacturing',
  yearsExperience: 5,
  intellectualRatio: 50,
  physicalRatio: 50,
  intellectual: {
    problemComplexity: 50,
    creativityRequired: 50,
    decisionMakingWeight: 50,
    knowledgeDepth: 50,
    communicationLoad: 50,
    aiCollabLevel: 'none',
  },
  physical: {
    physicalStrength: 50,
    environmentRisk: 30,
    repetitiveMotion: 40,
    enduranceDemand: 50,
    skillPrecision: 40,
  },
  workHoursPerWeek: 40,
  shiftType: 'day',
  overtimeHoursPerMonth: 0,
  marketBaseSalary: 40000000,
  sectorFactor: 1.0,
}

export default function Calculator() {
  const [form, setForm]       = useState(DEFAULT_STATE)
  const [sectors, setSectors] = useState([])
  const [presets, setPresets] = useState([])
  const [result, setResult]   = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState(null)
  const [activeTab, setActiveTab] = useState('intellectual') // 'intellectual' | 'physical' | 'conditions'

  useEffect(() => {
    fetchSectors().then(r => setSectors(r.data.data)).catch(() => {})
    fetchPresets().then(r => setPresets(r.data.data)).catch(() => {})
  }, [])

  const setField = (key, val) => setForm(f => ({ ...f, [key]: val }))
  const setIntellectual = (key, val) => setForm(f => ({ ...f, intellectual: { ...f.intellectual, [key]: val } }))
  const setPhysical = (key, val) => setForm(f => ({ ...f, physical: { ...f.physical, [key]: val } }))

  const applyPreset = (preset) => {
    setForm(f => ({
      ...DEFAULT_STATE,
      jobTitle: preset.label,
      sector: preset.sector,
      intellectualRatio: preset.intellectualRatio,
      physicalRatio: preset.physicalRatio,
      intellectual: { ...preset.intellectual },
      physical: { ...preset.physical },
      workHoursPerWeek: preset.workHoursPerWeek,
      shiftType: preset.shiftType,
      overtimeHoursPerMonth: preset.overtimeHoursPerMonth,
      marketBaseSalary: sectors.find(s => s.id === preset.sector)?.baseSalary || 40000000,
      sectorFactor: sectors.find(s => s.id === preset.sector)?.sectorFactor || 1.0,
    }))
    setResult(null)
  }

  const handleSectorChange = (sectorId) => {
    const s = sectors.find(x => x.id === sectorId)
    setForm(f => ({
      ...f,
      sector: sectorId,
      marketBaseSalary: s?.baseSalary || f.marketBaseSalary,
      sectorFactor: s?.sectorFactor || f.sectorFactor,
    }))
  }

  const handleSubmit = async () => {
    setError(null)
    setLoading(true)
    try {
      const res = await calculate(form)
      setResult(res.data.data)
      setTimeout(() => {
        document.getElementById('result-anchor')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }, 100)
    } catch (e) {
      setError(e.response?.data?.error || '계산 오류가 발생했습니다.')
    } finally {
      setLoading(false)
    }
  }

  const physMultiplierScore = (form.physical.physicalStrength * 0.30 + form.physical.environmentRisk * 0.25 +
    form.physical.repetitiveMotion * 0.15 + form.physical.enduranceDemand * 0.20 + form.physical.skillPrecision * 0.10) * 1.8

  return (
    <div className={styles.wrap}>
      {result ? (
        <div id="result-anchor">
          <ResultPanel result={result} onReset={() => setResult(null)} />
        </div>
      ) : (
        <>
          {/* ── PRESETS ── */}
          <div className={styles.section}>
            <div className="section-heading">직종 프리셋 / Job Presets</div>
            <div className={styles.presetGrid}>
              {presets.map(p => (
                <button key={p.id} className={styles.presetBtn} onClick={() => applyPreset(p)}>
                  <span className={styles.presetLabel}>{p.label}</span>
                  <span className={styles.presetRatio}>
                    지적 {p.intellectualRatio}% / 육체 {p.physicalRatio}%
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* ── BASIC INFO ── */}
          <div className={styles.section}>
            <div className="section-heading">기본 정보 / Basic Information</div>
            <div className={styles.formGrid2}>
              <div className={styles.formGroup}>
                <label className={styles.label}>직종명 / Job Title</label>
                <input
                  className={styles.input} type="text"
                  placeholder="예: 건설 현장 반장, AI 엔지니어..."
                  value={form.jobTitle}
                  onChange={e => setField('jobTitle', e.target.value)}
                />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.label}>업종 / Sector</label>
                <select className={styles.select} value={form.sector} onChange={e => handleSectorChange(e.target.value)}>
                  {sectors.map(s => <option key={s.id} value={s.id}>{s.label}</option>)}
                </select>
              </div>
              <div className={styles.formGroup}>
                <label className={styles.label}>경력 (년) / Years of Experience</label>
                <div className={styles.numInputWrap}>
                  <input className={styles.numInput} type="number" min="0" max="50"
                    value={form.yearsExperience} onChange={e => setField('yearsExperience', parseInt(e.target.value) || 0)} />
                  <span className={styles.numUnit}>년</span>
                </div>
              </div>
              <div className={styles.formGroup}>
                <label className={styles.label}>시장 기준 연봉 / Market Base Salary</label>
                <div className={styles.numInputWrap}>
                  <input className={styles.numInput} type="number" min="0" step="1000000"
                    value={form.marketBaseSalary} onChange={e => setField('marketBaseSalary', parseInt(e.target.value) || 0)} />
                  <span className={styles.numUnit}>원</span>
                </div>
              </div>
            </div>
          </div>

          {/* ── RATIO BAR ── */}
          <div className={styles.section}>
            <div className="section-heading">노동 유형 비율 / Labor Type Ratio</div>
            <div className="alert alert-gold" style={{ marginBottom: '1rem', fontSize: '0.78rem' }}>
              ⚖️ &nbsp;<strong>육체노동은 1.8배 가중치가 자동 적용됩니다.</strong> 드래그하거나 버튼으로 비율을 조정하세요. &nbsp;/&nbsp;
              Physical labor gets automatic 1.8× weight. Drag or click buttons to set ratio.
            </div>
            <RatioBar
              intellectual={form.intellectualRatio}
              physical={form.physicalRatio}
              onChange={(i, p) => setForm(f => ({ ...f, intellectualRatio: i, physicalRatio: p }))}
            />
          </div>

          {/* ── TABS ── */}
          <div className={styles.section}>
            <div className={styles.tabs}>
              <button className={`${styles.tab} ${activeTab === 'intellectual' ? styles.tabActive : ''}`}
                onClick={() => setActiveTab('intellectual')}>
                🧠 지적 노동 / Intellectual
              </button>
              <button className={`${styles.tab} ${activeTab === 'physical' ? styles.tabActive : ''}`}
                onClick={() => setActiveTab('physical')}>
                💪 육체 노동 / Physical
                <span className={styles.tabMultiplier}>×1.8</span>
              </button>
              <button className={`${styles.tab} ${activeTab === 'conditions' ? styles.tabActive : ''}`}
                onClick={() => setActiveTab('conditions')}>
                ⏱️ 근무 조건 / Conditions
              </button>
            </div>

            {/* Intellectual Tab */}
            {activeTab === 'intellectual' && (
              <div className={`${styles.tabPanel} fade-in`}>
                <ScoreSlider label="문제 복잡도 / Problem Complexity"
                  sublabel="담당 업무의 분석·해결 난이도"
                  value={form.intellectual.problemComplexity}
                  onChange={v => setIntellectual('problemComplexity', v)} color="#2d6ef5" />
                <ScoreSlider label="창의성 요구도 / Creativity Required"
                  sublabel="새로운 아이디어·해결책 필요 정도"
                  value={form.intellectual.creativityRequired}
                  onChange={v => setIntellectual('creativityRequired', v)} color="#7c3aed" />
                <ScoreSlider label="의사결정 비중 / Decision-Making Weight"
                  sublabel="판단·결정이 필요한 업무 비중"
                  value={form.intellectual.decisionMakingWeight}
                  onChange={v => setIntellectual('decisionMakingWeight', v)} color="#0891b2" />
                <ScoreSlider label="전문 지식 깊이 / Knowledge Depth"
                  sublabel="요구되는 전문성·숙련도 수준"
                  value={form.intellectual.knowledgeDepth}
                  onChange={v => setIntellectual('knowledgeDepth', v)} color="#2563eb" />
                <ScoreSlider label="소통·조정 부담 / Communication Load"
                  sublabel="협업·조정·설득에 드는 에너지"
                  value={form.intellectual.communicationLoad}
                  onChange={v => setIntellectual('communicationLoad', v)} color="#4f46e5" />

                <div className={styles.formGroup} style={{ marginTop: '1.25rem' }}>
                  <label className={styles.label}>AI 협업 수준 / AI Collaboration Level</label>
                  <div className={styles.aiGrid}>
                    {AI_LEVELS.map(al => (
                      <button
                        key={al.value}
                        className={`${styles.aiBtn} ${form.intellectual.aiCollabLevel === al.value ? styles.aiBtnActive : ''}`}
                        onClick={() => setIntellectual('aiCollabLevel', al.value)}
                      >
                        <span className={styles.aiBtnLabel}>{al.label}</span>
                        <span className={styles.aiBtnDesc}>{al.desc}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Physical Tab */}
            {activeTab === 'physical' && (
              <div className={`${styles.tabPanel} fade-in`}>
                <div className="alert alert-warn" style={{ marginBottom: '1.25rem', fontSize: '0.78rem' }}>
                  💪 &nbsp;입력한 모든 육체 노동 점수에 <strong>×1.8 가중치</strong>가 자동 적용됩니다. 예상 가중 점수: <strong>{physMultiplierScore.toFixed(1)}</strong>
                </div>
                <ScoreSlider label="근력·체력 요구도 / Physical Strength"
                  sublabel="힘, 지속적인 체력이 요구되는 정도"
                  value={form.physical.physicalStrength}
                  onChange={v => setPhysical('physicalStrength', v)} color="#f97316" />
                <ScoreSlider label="환경 위험도 / Environmental Risk"
                  sublabel="작업 환경의 위험성·유해 요소"
                  value={form.physical.environmentRisk}
                  onChange={v => setPhysical('environmentRisk', v)} color="#dc2626" />
                <ScoreSlider label="반복 동작 부담 / Repetitive Motion"
                  sublabel="동일 동작 반복으로 인한 신체 부담"
                  value={form.physical.repetitiveMotion}
                  onChange={v => setPhysical('repetitiveMotion', v)} color="#ea580c" />
                <ScoreSlider label="지구력 요구 / Endurance Demand"
                  sublabel="장시간 지속적인 체력 소모 요구"
                  value={form.physical.enduranceDemand}
                  onChange={v => setPhysical('enduranceDemand', v)} color="#b45309" />
                <ScoreSlider label="숙련·정밀도 / Skill & Precision"
                  sublabel="육체적 기술·정밀도·숙련이 필요한 정도"
                  value={form.physical.skillPrecision}
                  onChange={v => setPhysical('skillPrecision', v)} color="#d97706" />
              </div>
            )}

            {/* Conditions Tab */}
            {activeTab === 'conditions' && (
              <div className={`${styles.tabPanel} fade-in`}>
                <div className={styles.formGrid2}>
                  <div className={styles.formGroup}>
                    <label className={styles.label}>주당 근무 시간 / Hours per Week</label>
                    <div className={styles.numInputWrap}>
                      <input className={styles.numInput} type="number" min="10" max="80"
                        value={form.workHoursPerWeek} onChange={e => setField('workHoursPerWeek', parseInt(e.target.value) || 40)} />
                      <span className={styles.numUnit}>시간/주</span>
                    </div>
                    {form.workHoursPerWeek > 52 && (
                      <div className={styles.fieldNote} style={{ color: 'var(--orange)' }}>⚠️ 주 52시간 초과 — 강도 가산 +20%</div>
                    )}
                  </div>
                  <div className={styles.formGroup}>
                    <label className={styles.label}>월 초과근무 시간 / Monthly Overtime</label>
                    <div className={styles.numInputWrap}>
                      <input className={styles.numInput} type="number" min="0" max="80"
                        value={form.overtimeHoursPerMonth} onChange={e => setField('overtimeHoursPerMonth', parseInt(e.target.value) || 0)} />
                      <span className={styles.numUnit}>시간/월</span>
                    </div>
                  </div>
                </div>

                <div className={styles.formGroup} style={{ marginTop: '0.5rem' }}>
                  <label className={styles.label}>근무 형태 / Shift Type</label>
                  <div className={styles.shiftGrid}>
                    {SHIFT_TYPES.map(st => (
                      <button
                        key={st.value}
                        className={`${styles.shiftBtn} ${form.shiftType === st.value ? styles.shiftBtnActive : ''}`}
                        onClick={() => setField('shiftType', st.value)}
                      >
                        {st.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className={styles.formGroup} style={{ marginTop: '1rem' }}>
                  <label className={styles.label}>업종 보정 계수 / Sector Adjustment Factor</label>
                  <div className={styles.numInputWrap}>
                    <input className={styles.numInput} type="number" min="0.5" max="3.0" step="0.05"
                      value={form.sectorFactor} onChange={e => setField('sectorFactor', parseFloat(e.target.value) || 1.0)} />
                    <span className={styles.numUnit}>배율</span>
                  </div>
                  <div className={styles.fieldNote}>업종 선택 시 자동 설정. 직접 수정 가능.</div>
                </div>
              </div>
            )}
          </div>

          {/* ── SUBMIT ── */}
          {error && (
            <div className="alert alert-danger" style={{ marginBottom: '1rem' }}>
              ❌ &nbsp;{error}
            </div>
          )}

          <button className={`${styles.calcBtn} ${loading ? styles.calcBtnLoading : ''}`}
            onClick={handleSubmit} disabled={loading}>
            {loading ? (
              <><span className={styles.spinner} /> 계산 중... / Calculating...</>
            ) : (
              <> ⚖️ 노동 기여도 연봉 계산 / Calculate Salary</>
            )}
          </button>
        </>
      )}
    </div>
  )
}
