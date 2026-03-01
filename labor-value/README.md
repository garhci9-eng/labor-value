# 노동 기여도 연봉 계산기 / Labor Contribution Salary System

> **노동을 수치화하고, 공정한 연봉을 계산합니다**  
> **Quantifying labor, calculating fair compensation**

---

## ⚠️ 공익 사용 선언 / PUBLIC INTEREST DECLARATION

> 🌍 **이 소프트웨어는 반드시 공익적 목적으로만 사용되어야 합니다.**  
> 🌍 **This software MUST be used for public interest purposes ONLY.**

| 한국어 | English |
|--------|---------|
| 임금 공정성 정책 연구 목적 허용 | Wage fairness policy research — PERMITTED |
| 노동 가치 학문적 논의 허용 | Academic labor value discussion — PERMITTED |
| 사회적 임금 체계 개혁 토론 허용 | Social wage reform debate — PERMITTED |
| 노동자 권리 강화 캠페인 허용 | Worker rights campaigns — PERMITTED |
| **상업적 임금 착취 목적 사용 금지** | **Commercial wage exploitation — PROHIBITED** |
| **노동자 임금 삭감 근거 자료 사용 금지** | **Justification for wage cuts — PROHIBITED** |
| **영리 기업 단독 임금 책정 금지** | **For-profit wage setting tool — PROHIBITED** |

---

## 💡 아이디어 및 기여 / Idea & Contribution

| 항목 | 비율 | 설명 |
|------|------|------|
| **아이디어 / Concept** | **90%** | 노동의 공정한 가치 평가, 육체노동 1.8배 원칙, AI 협업 지수 반영 체계 설계 |
| **구현 / Implementation** | **10%** | Claude (Anthropic)가 코드 구현 및 UI 설계 지원 |

> 노동 가치의 재정의와 공정한 임금 체계를 향한 핵심 아이디어는 현장의 통찰에서 비롯되었습니다.  
> The core insight — redefining labor value with physical protection weighting — originated from real-world observation.

---

## 🎯 시스템 개요 / System Overview

### 핵심 원칙 / Core Principles

**1. 육체노동 1.8배 보호 가중치 / Physical Labor 1.8× Protective Weight**
- 힘을 쓰는 노동은 신체 소모, 위험 노출, 회복 비용이 수반됩니다
- Physical labor involves bodily depletion, risk exposure, and recovery costs

**2. AI 협업 지적 노동 / AI-Collaborative Intellectual Labor**
- AI와의 협업 수준에 따라 지적 노동 점수에 최대 30% 생산성 보너스 적용
- Up to 30% productivity bonus based on AI collaboration level

**3. 6단계 노동 강도 계단 / 6-Level Intensity Ladder**
```
최소 (×0.6) → 경량 (×0.8) → 보통 (×1.0) → 고강도 (×1.2) → 강도 (×1.5) → 극한 (×1.8)
```

---

## 📐 계산 알고리즘 / Calculation Algorithm

### 핵심 공식 / Core Formula

```
종합 노동 점수 (S) = 
  (지적노동 점수 × AI보너스) × 지적비율
  + (육체노동 점수 × 1.8)   × 육체비율

최종 연봉 = 기준연봉 × 업종계수 × (S/50) × 강도계수 × 교대계수 × (1+초과근무) × 경력계수
```

### 주요 계수 / Key Coefficients

| 계수 | 범위 | 설명 |
|------|------|------|
| 육체노동 가중치 | ×1.8 (고정) | 신체 노동 보호 |
| AI 협업 보너스 | +0% ~ +30% | 협업 수준별 차등 |
| 강도 계수 | ×0.6 ~ ×1.8 | 6단계 분류 |
| 교대 계수 | ×1.0 ~ ×1.2 | 야간/교대 추가 |
| 경력 계수 | ×1.0 ~ ×1.5 | 로그 스케일 |

---

## 🏗️ 기술 스택 / Tech Stack

```
Frontend:  React 18 (Vite) + CSS Modules
Backend:   Node.js + Express 4
Security:  Helmet, Rate Limiting, CORS
Deploy:    Docker + Docker Compose + Nginx
Fonts:     Syne, Noto Sans KR, JetBrains Mono
```

---

## 📡 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/health` | 헬스체크 |
| `GET` | `/api/sectors` | 업종 목록 |
| `GET` | `/api/presets` | 직종 프리셋 |
| `POST` | `/api/calculate` | **연봉 계산 (핵심)** |
| `POST` | `/api/compare` | 다수 노동자 비교 |
| `GET` | `/api/intensity-levels` | 강도 단계 조회 |

### 계산 요청 예시 / Calculate Request Example

```bash
POST /api/calculate
Content-Type: application/json

{
  "jobTitle": "건설 현장 반장",
  "sector": "construction",
  "yearsExperience": 15,
  "intellectualRatio": 20,
  "physicalRatio": 80,
  "intellectual": {
    "problemComplexity": 40,
    "creativityRequired": 30,
    "decisionMakingWeight": 50,
    "knowledgeDepth": 55,
    "communicationLoad": 45,
    "aiCollabLevel": "none"
  },
  "physical": {
    "physicalStrength": 90,
    "environmentRisk": 80,
    "repetitiveMotion": 65,
    "enduranceDemand": 85,
    "skillPrecision": 70
  },
  "workHoursPerWeek": 52,
  "shiftType": "day",
  "overtimeHoursPerMonth": 20,
  "marketBaseSalary": 38000000,
  "sectorFactor": 1.05
}
```

---

## 🚀 시작하기 / Getting Started

```bash
# 1. Clone
git clone https://github.com/YOUR_USERNAME/labor-value-salary-system.git
cd labor-value-salary-system

# 2. Install
npm run install:all

# 3. Run (dev)
npm run dev
# → Frontend: http://localhost:3000
# → Backend:  http://localhost:3001

# Docker
docker-compose up -d
```

---

## 🗂️ 프로젝트 구조 / Project Structure

```
labor-value-salary-system/
├── backend/
│   ├── data/
│   │   └── calculator.js     # 핵심 계산 엔진
│   ├── server.js             # Express API
│   └── Dockerfile
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── RatioBar.jsx      # 노동 비율 드래그 바
│   │   │   ├── ScoreSlider.jsx   # 점수 입력 슬라이더
│   │   │   └── ResultPanel.jsx   # 결과 표시 패널
│   │   ├── pages/
│   │   │   ├── Calculator.jsx    # 메인 계산기
│   │   │   └── About.jsx         # 이론 설명
│   │   └── utils/
│   │       ├── api.js            # API 클라이언트
│   │       └── format.js         # 숫자 포맷
│   └── Dockerfile
├── docker-compose.yml
└── README.md
```

---

## 📄 라이선스 / License

**MIT License** — 단, 반드시 공익적 목적으로만 사용해야 합니다.

```
이 소프트웨어의 사용 조건:
1. 공익, 연구, 교육, 비영리 목적으로만 사용 가능
2. 상업적 임금 착취 또는 노동자 불이익 목적 사용 금지
3. 이 도구의 결과물은 실제 고용 계약에 법적 효력 없음

Usage conditions:
1. Public interest, research, education, and non-profit use only
2. Prohibited for commercial wage exploitation or worker disadvantage
3. Results have no legal effect on actual employment contracts
```

---

## ⚕️ 면책 조항 / Disclaimer

이 계산기는 노동 가치의 공정한 평가를 위한 정책 연구 도구입니다.  
계산 결과는 참조용이며, 실제 고용 계약이나 임금 협상에 법적 효력이 없습니다.

This calculator is a policy research tool for fair labor value assessment.  
Results are for reference only and have no legal effect on employment contracts or wage negotiations.

---

<div align="center">

**아이디어 90% 창작자 · 구현 10% Claude (Anthropic)**

⚖️ 모든 노동은 공정하게 평가받아야 합니다 / All labor deserves fair evaluation ⚖️

🌍 공익적 목적으로만 사용 / For public interest use only 🌍

</div>
