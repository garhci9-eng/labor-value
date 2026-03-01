/**
 * Labor Value Salary Calculator — API Server
 * 노동 기여도 연봉 계산기 API 서버
 * ==========================================
 * ⚠️  PUBLIC INTEREST USE ONLY / 공익적 목적으로만 사용
 */

const express = require('express');
const cors    = require('cors');
const helmet  = require('helmet');
const morgan  = require('morgan');
const rateLimit = require('express-rate-limit');
const { v4: uuidv4 } = require('uuid');

const {
  calculateSalary,
  calcIntellectualScore,
  calcPhysicalScore,
  getIntensityLevel,
  SECTORS,
  JOB_PRESETS,
  PHYSICAL_MULTIPLIER,
} = require('./data/calculator');

const app  = express();
const PORT = process.env.PORT || 3001;

// ── MIDDLEWARE ──
app.use(helmet({ contentSecurityPolicy: false }));
app.use(cors({ origin: ['http://localhost:3000', 'http://localhost:5173'] }));
app.use(express.json());
app.use(morgan('dev'));

const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 300,
  message: { error: '요청 한도 초과. 15분 후 재시도하세요. / Rate limit exceeded.' }
});
app.use('/api/', limiter);

// Disclaimer header on every response
app.use((req, res, next) => {
  res.setHeader('X-Purpose', 'Public-Interest-Only');
  res.setHeader('X-Disclaimer', 'This tool is for public interest, research, and policy purposes only. Not for commercial exploitation.');
  next();
});

// ── ROUTES ──

// Health check
app.get('/api/health', (req, res) => res.json({
  status: 'ok',
  version: '1.0.0',
  physicalMultiplier: PHYSICAL_MULTIPLIER,
  disclaimer: '⚠️ 공익적 목적으로만 사용 / For public interest use only',
  timestamp: new Date().toISOString(),
}));

// Get all sectors
app.get('/api/sectors', (req, res) => res.json({ data: SECTORS }));

// Get job presets
app.get('/api/presets', (req, res) => res.json({ data: JOB_PRESETS }));

// Get single preset
app.get('/api/presets/:id', (req, res) => {
  const preset = JOB_PRESETS.find(p => p.id === req.params.id);
  if (!preset) return res.status(404).json({ error: '프리셋을 찾을 수 없습니다. / Preset not found.' });
  res.json({ data: preset });
});

// Main calculation endpoint
app.post('/api/calculate', (req, res) => {
  try {
    const input = req.body;

    // Basic validation
    const required = ['intellectualRatio', 'physicalRatio', 'intellectual', 'physical',
                      'workHoursPerWeek', 'shiftType', 'marketBaseSalary'];
    for (const field of required) {
      if (input[field] === undefined || input[field] === null) {
        return res.status(400).json({ error: `필드 누락: ${field} / Missing required field: ${field}` });
      }
    }

    const result = calculateSalary(input);

    res.json({
      id: uuidv4(),
      success: true,
      data: result,
      disclaimer: '이 계산 결과는 참조용이며 실제 고용 계약에 법적 효력이 없습니다. / Results are for reference only and have no legal effect on employment contracts.',
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Compare multiple workers
app.post('/api/compare', (req, res) => {
  try {
    const { workers } = req.body;
    if (!Array.isArray(workers) || workers.length < 2 || workers.length > 10) {
      return res.status(400).json({ error: '2–10명을 비교할 수 있습니다. / Provide 2–10 workers to compare.' });
    }
    const results = workers.map((w, i) => {
      try {
        return { index: i, name: w.name || `Worker ${i + 1}`, ...calculateSalary(w) };
      } catch (e) {
        return { index: i, name: w.name || `Worker ${i + 1}`, error: e.message };
      }
    });
    res.json({ success: true, data: results });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Intensity levels reference
app.get('/api/intensity-levels', (req, res) => {
  const levels = [0, 10, 30, 50, 65, 80, 95].map(s => ({
    score: s, ...getIntensityLevel(s)
  }));
  res.json({ data: levels });
});

// 404
app.use((req, res) => res.status(404).json({ error: 'Not found' }));

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal server error' });
});

app.listen(PORT, () => {
  console.log(`\n⚖️  Labor Value Calculator API`);
  console.log(`   http://localhost:${PORT}`);
  console.log(`   ⚠️  공익적 목적으로만 사용 / Public interest use only\n`);
});

module.exports = app;
