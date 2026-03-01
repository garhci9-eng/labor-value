import React from 'react'
import styles from './ScoreSlider.module.css'

export default function ScoreSlider({ label, sublabel, value, onChange, min = 0, max = 100, color = '#2d6ef5' }) {
  const pct = ((value - min) / (max - min)) * 100

  return (
    <div className={styles.wrap}>
      <div className={styles.top}>
        <div>
          <div className={styles.label}>{label}</div>
          {sublabel && <div className={styles.sub}>{sublabel}</div>}
        </div>
        <div className={styles.value} style={{ color }}>{value}</div>
      </div>
      <div className={styles.track}>
        <div className={styles.fill} style={{ width: `${pct}%`, background: color }} />
        <div className={styles.thumb} style={{ left: `${pct}%`, borderColor: color }} />
        <input
          type="range" min={min} max={max} value={value}
          className={styles.input}
          onChange={e => onChange(parseInt(e.target.value))}
        />
      </div>
      <div className={styles.ticks}>
        <span>0</span><span>25</span><span>50</span><span>75</span><span>100</span>
      </div>
    </div>
  )
}
