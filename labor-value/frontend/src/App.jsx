import React, { useState, useEffect } from 'react'
import Calculator from './pages/Calculator'
import About from './pages/About'
import { healthCheck } from './utils/api'
import styles from './styles/App.module.css'

const NAV = [
  { id: 'calculator', label: '계산기', labelEn: 'Calculator', icon: '⚖️' },
  { id: 'about',      label: '이론',   labelEn: 'Theory',     icon: '📐' },
]

export default function App() {
  const [page, setPage] = useState('calculator')
  const [apiOk, setApiOk] = useState(null)

  useEffect(() => {
    healthCheck().then(() => setApiOk(true)).catch(() => setApiOk(false))
  }, [])

  return (
    <div className={styles.app}>
      {/* ── HEADER ── */}
      <header className={styles.header}>
        <div className={styles.headerInner}>
          <div className={styles.logoWrap}>
            <div className={styles.logoMark}>
              <span className={styles.logoGlyph}>⚖</span>
            </div>
            <div>
              <div className={styles.logoText}>노동 기여도 연봉 계산기</div>
              <div className={styles.logoSub}>Labor Contribution Salary System · v1.0</div>
            </div>
          </div>

          <nav className={styles.nav}>
            {NAV.map(n => (
              <button
                key={n.id}
                className={`${styles.navBtn} ${page === n.id ? styles.navActive : ''}`}
                onClick={() => setPage(n.id)}
              >
                <span>{n.icon}</span>
                <span>{n.label}</span>
                <span className={styles.navEn}>/ {n.labelEn}</span>
              </button>
            ))}
          </nav>

          <div className={styles.apiStatus}>
            <span className={styles.apiDot} style={{
              background: apiOk === null ? '#475569' : apiOk ? '#00c896' : '#ef4444',
              boxShadow: apiOk ? '0 0 6px #00c896' : 'none',
              animation: apiOk ? 'pulse 2s ease-in-out infinite' : 'none'
            }} />
            <span className={styles.apiLabel}>
              {apiOk === null ? '연결 중...' : apiOk ? 'API 연결' : 'API 오프라인'}
            </span>
          </div>
        </div>
      </header>

      {/* ── DISCLAIMER BANNER ── */}
      <div className={styles.disclaimer}>
        ⚠️ &nbsp;
        <strong>공익적 목적으로만 사용 / FOR PUBLIC INTEREST USE ONLY</strong>
        &nbsp;— 정책 연구, 임금 공정성 논의, 교육 목적에 한함 / Policy research, wage fairness discussion, and educational use only
      </div>

      {/* ── HERO ── */}
      {page === 'calculator' && (
        <div className={styles.hero}>
          <div className={styles.heroInner}>
            <div className={styles.heroTag}>
              <span className="tag tag-gold">육체노동 ×1.8 가중치 / Physical Labor ×1.8 Weight</span>
              <span className="tag tag-cyan">AI 협업 지수 반영 / AI Collaboration Index</span>
            </div>
            <h1 className={styles.heroTitle}>
              노동의 가치를<br />
              <em>공정하게</em> 계산합니다
            </h1>
            <p className={styles.heroDesc}>
              지적 노동(AI 협업 포함)과 육체 노동을 수치화하고,<br />
              육체 노동에 <strong>1.8배 보호 가중치</strong>를 적용하여 노동 강도 기반 연봉을 산출합니다.<br />
              <span style={{ color: 'var(--text3)', fontSize: '0.85em' }}>
                Quantifies intellectual (incl. AI collaboration) and physical labor,
                applies <strong>1.8× protective weight</strong> to physical labor for intensity-based salary calculation.
              </span>
            </p>
          </div>
        </div>
      )}

      {/* ── MAIN ── */}
      <div className={styles.layout}>
        <aside className={styles.sidebar}>
          <div className={styles.sideCard}>
            <div className={styles.sideTitle}>핵심 계수 / Key Factors</div>
            {[
              { label: '육체노동 가중치', val: '×1.8', color: '#f97316' },
              { label: 'AI 협업 보너스', val: '최대 +30%', color: '#00c9d4' },
              { label: '강도 계수 범위', val: '0.6 ~ 1.8', color: '#2d6ef5' },
              { label: '경력 보정 상한', val: '+50%', color: '#10b981' },
            ].map(f => (
              <div key={f.label} className={styles.sideRow}>
                <span className={styles.sideName}>{f.label}</span>
                <span className={styles.sideVal} style={{ color: f.color }}>{f.val}</span>
              </div>
            ))}
          </div>

          <div className={styles.sideCard} style={{ marginTop: '0.75rem' }}>
            <div className={styles.sideTitle}>공익 사용 원칙 / Public Interest</div>
            <div className={styles.sideNotice}>
              이 계산기는 노동 가치의 공정한 평가를 위한 공익 도구입니다. 상업적 임금 착취 목적 사용 금지.<br /><br />
              <em>This calculator is a public interest tool for fair labor value assessment. Commercial wage exploitation prohibited.</em>
            </div>
          </div>

          <div className={styles.sideCard} style={{ marginTop: '0.75rem' }}>
            <div className={styles.sideTitle}>기여 / Contribution</div>
            <div className={styles.contribRow}>
              <span className={styles.contribLabel}>아이디어</span>
              <div className={styles.contribBar}>
                <div style={{ width: '90%', background: 'var(--gold)' }} />
              </div>
              <span className={styles.contribPct} style={{ color: 'var(--gold2)' }}>90%</span>
            </div>
            <div className={styles.contribRow}>
              <span className={styles.contribLabel}>Claude</span>
              <div className={styles.contribBar}>
                <div style={{ width: '10%', background: 'var(--cyan)' }} />
              </div>
              <span className={styles.contribPct} style={{ color: 'var(--cyan)' }}>10%</span>
            </div>
          </div>
        </aside>

        <main className={styles.main}>
          <div key={page}>
            {page === 'calculator' && <Calculator />}
            {page === 'about'      && <About />}
          </div>
        </main>
      </div>

      <footer className={styles.footer}>
        <div className={styles.footerInner}>
          <span>노동 기여도 연봉 계산기 / Labor Contribution Salary System</span>
          <span>아이디어 90% 창작자 · 구현 10% Claude (Anthropic)</span>
          <span>⚠️ 공익적 목적으로만 사용 / Public Interest Use Only</span>
        </div>
      </footer>
    </div>
  )
}
