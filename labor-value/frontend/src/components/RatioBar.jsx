import React from 'react'
import styles from './RatioBar.module.css'

export default function RatioBar({ intellectual, physical, onChange }) {
  const handleDrag = (e) => {
    const rect = e.currentTarget.parentElement.getBoundingClientRect()
    const clientX = e.touches ? e.touches[0].clientX : e.clientX
    const pct = Math.max(0, Math.min(100, Math.round(((clientX - rect.left) / rect.width) * 100)))
    onChange(pct, 100 - pct)
  }

  return (
    <div className={styles.wrap}>
      <div className={styles.labels}>
        <div className={styles.labelLeft}>
          <span className={styles.dot} style={{ background: '#2d6ef5' }} />
          지적 노동 / Intellectual
        </div>
        <div className={styles.labelRight}>
          육체 노동 / Physical
          <span className={styles.dot} style={{ background: '#f97316' }} />
          <span className={styles.multiplierBadge}>×1.8</span>
        </div>
      </div>

      <div className={styles.barWrap}>
        <div className={styles.bar}>
          <div className={styles.intellSide} style={{ width: `${intellectual}%` }}>
            {intellectual >= 15 && (
              <span className={styles.barLabel}>{intellectual}%</span>
            )}
          </div>
          <div className={styles.physSide} style={{ width: `${physical}%` }}>
            {physical >= 15 && (
              <span className={styles.barLabel}>{physical}%</span>
            )}
          </div>
          {/* Drag handle */}
          <div
            className={styles.handle}
            style={{ left: `${intellectual}%` }}
            onMouseDown={(e) => {
              e.preventDefault()
              const onMove = (me) => handleDrag(me)
              const onUp   = () => { document.removeEventListener('mousemove', onMove); document.removeEventListener('mouseup', onUp) }
              document.addEventListener('mousemove', onMove)
              document.addEventListener('mouseup', onUp)
            }}
            onTouchStart={(e) => {
              const onMove = (te) => handleDrag(te)
              const onEnd  = () => { document.removeEventListener('touchmove', onMove); document.removeEventListener('touchend', onEnd) }
              document.addEventListener('touchmove', onMove)
              document.addEventListener('touchend', onEnd)
            }}
          />
        </div>
      </div>

      <div className={styles.quickBtns}>
        {[[100,0],[80,20],[60,40],[50,50],[40,60],[20,80],[0,100]].map(([i,p]) => (
          <button
            key={i}
            className={`${styles.qBtn} ${intellectual === i ? styles.qBtnActive : ''}`}
            onClick={() => onChange(i, p)}
          >
            {i}/{p}
          </button>
        ))}
      </div>

      <div className={styles.weightedNote}>
        실효 비중 적용 후: 지적 <strong style={{color:'#4d8fff'}}>{intellectual}점</strong> + 육체 <strong style={{color:'#fb923c'}}>
          {physical}점 × 1.8 = {(physical * 1.8).toFixed(0)}점
        </strong>
      </div>
    </div>
  )
}
