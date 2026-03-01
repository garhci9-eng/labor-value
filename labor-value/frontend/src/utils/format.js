export const formatKRW = (n) => {
  if (!n && n !== 0) return '—'
  if (n >= 100000000) {
    const eok = (n / 100000000).toFixed(1)
    return `${eok}억원`
  }
  if (n >= 10000) {
    const man = Math.round(n / 10000)
    return `${man.toLocaleString()}만원`
  }
  return `${n.toLocaleString()}원`
}

export const formatKRWFull = (n) => {
  if (!n && n !== 0) return '—'
  return `₩${n.toLocaleString()}`
}

export const pct = (v) => `${Math.round(v)}%`
