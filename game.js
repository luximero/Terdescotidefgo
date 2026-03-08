/* ═══════════════════════════════════════════════════════
   STACK — Final Game Engine v3.0
   by Bilal

   Features:
   • EN / RU language switching (PERFECT, COMBO always EN)
   • Combo grow mechanic: combo ≥ 2 grows block back to original width
   • Pixel-perfect camera always showing moving block
   • Hi-DPI canvas rendering
   • localStorage records
   • Web Audio sound engine (no files needed)
   • Milestone celebrations at 100,200...1000 and 2000...10000
═══════════════════════════════════════════════════════ */
"use strict";

/* ─────────────────────────────────────
   I18N — TRANSLATIONS
   NOTE: PERFECT and COMBO are intentionally kept in English in both langs
───────────────────────────────────── */
const I18N = {
  ru: {
    subtitle:      "Укладывай блоки идеально",
    best:          "🏆 Рекорд",
    last:          "Прошлый",
    play:          "▶\u00A0\u00A0ИГРАТЬ",
    howto:         "Как играть",
    reset:         "Сбросить рекорд",
    howto_title:   "Как играть",
    h1_title:      "Тапни по экрану",
    h1_body:       "Останови движущийся блок",
    h2_title:      "Блок обрезается",
    h2_body:       "Лишнее отваливается — блок уже",
    h3_body:       "Точное попадание — размер не уменьшается",
    h4_body:       "С 2-го PERFECT подряд блок растёт обратно до исходного размера!",
    h5_title:      "Промах = конец",
    h5_body:       "Полностью мимо стека — игра закончена",
    h6_title:      "Рекорд сохраняется",
    h6_body:       "Побей себя — рекорд станет золотым",
    back:          "← Назад",
    pause_title:   "Пауза",
    current_score: "Текущий счёт",
    resume:        "▶ Продолжить",
    restart:       "↺ Заново",
    menu:          "← Меню",
    go_title:      "Игра окончена",
    your_score:    "Ваш счёт",
    new_record:    "🏆 Новый рекорд!",
    hud_score:     "СЧЁТ",
    hud_best:      "РЕКОРД",
    tap_hint:      "Тапни чтобы остановить блок",
    m100:          "🎉 Сотня! Отлично!",
    m200:          "🔥 200! Горячо!",
    m300:          "⚡ 300! Молния!",
    m400:          "💥 400! Взрыв!",
    m500:          "🌟 500! Звезда!",
    m600:          "🚀 600! Ракета!",
    m700:          "👑 700! Король!",
    m800:          "💎 800! Алмаз!",
    m900:          "🔮 900! Магия!",
    m1000:         "🏆 ТЫСЯЧА! ЛЕГЕНДА!",
    m2000:         "🌙 2000! Космос!",
    m3000:         "⭐ 3000! Суперзвезда!",
    m4000:         "🌈 4000! Радуга!",
    m5000:         "🦋 5000! Бабочка!",
    m6000:         "🌊 6000! Океан!",
    m7000:         "🔱 7000! Посейдон!",
    m8000:         "🌋 8000! Вулкан!",
    m9000:         "☄️ 9000! Комета!",
    m10000:        "💫 10 000! БОГ ИГРЫ!",
  },
  en: {
    subtitle:      "Stack the blocks perfectly",
    best:          "🏆 Best",
    last:          "Last",
    play:          "▶\u00A0\u00A0PLAY",
    howto:         "How to play",
    reset:         "Reset record",
    howto_title:   "How to play",
    h1_title:      "Tap the screen",
    h1_body:       "Stop the moving block at the right moment",
    h2_title:      "Block is trimmed",
    h2_body:       "The overhanging part falls off — block gets narrower",
    h3_body:       "Exact hit — block size doesn't shrink",
    h4_body:       "From 2nd PERFECT in a row the block grows back to its original width!",
    h5_title:      "Miss = game over",
    h5_body:       "Completely off the stack — game ends",
    h6_title:      "Record is saved",
    h6_body:       "Beat yourself — record turns gold",
    back:          "← Back",
    pause_title:   "Paused",
    current_score: "Current score",
    resume:        "▶ Resume",
    restart:       "↺ Restart",
    menu:          "← Menu",
    go_title:      "Game Over",
    your_score:    "Your score",
    new_record:    "🏆 New Record!",
    hud_score:     "SCORE",
    hud_best:      "BEST",
    tap_hint:      "Tap to stop the block",
    m100:          "🎉 One hundred! Nice!",
    m200:          "🔥 200! On fire!",
    m300:          "⚡ 300! Lightning!",
    m400:          "💥 400! Boom!",
    m500:          "🌟 500! Superstar!",
    m600:          "🚀 600! Rocket!",
    m700:          "👑 700! King!",
    m800:          "💎 800! Diamond!",
    m900:          "🔮 900! Magic!",
    m1000:         "🏆 ONE THOUSAND! LEGEND!",
    m2000:         "🌙 2000! Cosmic!",
    m3000:         "⭐ 3000! Superstar!",
    m4000:         "🌈 4000! Rainbow!",
    m5000:         "🦋 5000! Butterfly!",
    m6000:         "🌊 6000! Ocean!",
    m7000:         "🔱 7000! Poseidon!",
    m8000:         "🌋 8000! Volcano!",
    m9000:         "☄️ 9000! Comet!",
    m10000:        "💫 10 000! GAME GOD!",
  },
};

/* ─────────────────────────────────────
   LANGUAGE STATE
───────────────────────────────────── */
const SK_LANG = 'stack_lang';
let currentLang = localStorage.getItem(SK_LANG) || 'ru';

function setLang(lang) {
  currentLang = lang;
  localStorage.setItem(SK_LANG, lang);

  // Toggle active class on buttons
  document.getElementById('lang-ru').classList.toggle('active', lang === 'ru');
  document.getElementById('lang-en').classList.toggle('active', lang === 'en');

  // Update html lang attribute
  document.getElementById('html-root').setAttribute('lang', lang);

  // Update all elements with data-i18n
  const t = I18N[lang];
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (t[key] !== undefined) el.textContent = t[key];
  });

  // Update HUD labels (inside game screen, separate IDs)
  document.getElementById('hud-lbl-score').textContent = t.hud_score;
  document.getElementById('hud-lbl-best').textContent  = t.hud_best;

  // Refresh menu scores display (labels already updated above)
  refreshMenu();
}

/* expose globally for onclick */
window.setLang = setLang;

/* ─────────────────────────────────────
   STORAGE
───────────────────────────────────── */
const SK_BEST = 'stack_best_v3';
const SK_LAST = 'stack_last_v3';
function getBest()   { return parseInt(localStorage.getItem(SK_BEST) || '0', 10); }
function getLast()   { const v = localStorage.getItem(SK_LAST); return v === null ? null : parseInt(v, 10); }
function saveBest(v) { localStorage.setItem(SK_BEST, String(v)); }
function saveLast(v) { localStorage.setItem(SK_LAST, String(v)); }
function clearAll()  { localStorage.removeItem(SK_BEST); localStorage.removeItem(SK_LAST); }

/* ─────────────────────────────────────
   DOM REFS
───────────────────────────────────── */
const canvas     = document.getElementById('canvas');
const ctx        = canvas.getContext('2d');
const elFeedback = document.getElementById('feedback');
const elTapHint  = document.getElementById('tap-hint');
const elHudScore = document.getElementById('hud-score');
const elHudBest  = document.getElementById('hud-best');
const elMenuBest = document.getElementById('menu-best');
const elMenuLast = document.getElementById('menu-last');
const elPauseSc  = document.getElementById('pause-score');
const elGoScore  = document.getElementById('go-score');
const elGoBest   = document.getElementById('go-best');
const elNewBest  = document.getElementById('new-best');

const SCREENS = {
  menu:     document.getElementById('screen-menu'),
  howto:    document.getElementById('screen-howto'),
  game:     document.getElementById('screen-game'),
  pause:    document.getElementById('screen-pause'),
  gameover: document.getElementById('screen-gameover'),
};

/* ─────────────────────────────────────
   SCREEN MANAGER
───────────────────────────────────── */
let curScreen = 'menu';
function showScreen(name) {
  Object.values(SCREENS).forEach(s => s.classList.remove('active'));
  SCREENS[name].classList.add('active');
  curScreen = name;
}

/* ─────────────────────────────────────
   BUTTONS
───────────────────────────────────── */
function wire(id, fn) { document.getElementById(id).addEventListener('click', fn); }
wire('btn-play',       () => { sfxTick(); startGame(); });
wire('btn-howto',      () => { sfxTick(); showScreen('howto'); });
wire('btn-howto-back', () => { sfxTick(); showScreen('menu'); refreshMenu(); });
wire('btn-reset',      () => { sfxTick(); clearAll(); refreshMenu(); });
wire('btn-pause',      () => pauseGame());
wire('btn-resume',     () => { sfxTick(); resumeGame(); });
wire('btn-restart-p',  () => { sfxTick(); startGame(); });
wire('btn-menu-p',     () => { sfxTick(); stopGame(); showScreen('menu'); refreshMenu(); });
wire('btn-restart-go', () => { sfxTick(); startGame(); });
wire('btn-menu-go',    () => { sfxTick(); showScreen('menu'); refreshMenu(); });

function refreshMenu() {
  elMenuBest.textContent = getBest();
  const last = getLast();
  elMenuLast.textContent = last !== null ? last : '—';
}

/* ─────────────────────────────────────
   INPUT
───────────────────────────────────── */
canvas.addEventListener('touchstart', e => { e.preventDefault(); onTap(); }, { passive: false });
canvas.addEventListener('mousedown',  e => { e.preventDefault(); onTap(); });
document.addEventListener('keydown', e => {
  if (e.code === 'Space' || e.code === 'Enter') { e.preventDefault(); onTap(); }
  if (e.code === 'Escape') {
    if (curScreen === 'game')  pauseGame();
    else if (curScreen === 'pause') resumeGame();
  }
});
function onTap() {
  if (curScreen === 'game' && gs.running && !gs.paused) placeBlock();
}


/* ═══════════════════════════════════════
   SOUND ENGINE — Web Audio API
   Все звуки синтезируются в коде.
   Никаких внешних файлов не требуется!
═══════════════════════════════════════ */
let _ac = null; // AudioContext singleton

function ac() {
  if (!_ac) _ac = new (window.AudioContext || window.webkitAudioContext)();
  if (_ac.state === 'suspended') _ac.resume(); // mobile autoplay fix
  return _ac;
}

/* Универсальный генератор тона */
function tone({ freq=440, freq2=null, type='sine', vol=0.35,
                attack=0.005, decay=0.1, sustain=0.3, release=0.18,
                dur=0.35, delay=0 } = {}) {
  try {
    const ctx2  = ac();
    const t0    = ctx2.currentTime + delay;
    const osc   = ctx2.createOscillator();
    const gain  = ctx2.createGain();
    osc.connect(gain);
    gain.connect(ctx2.destination);
    osc.type = type;
    osc.frequency.setValueAtTime(freq, t0);
    if (freq2) osc.frequency.linearRampToValueAtTime(freq2, t0 + dur * 0.7);
    gain.gain.setValueAtTime(0, t0);
    gain.gain.linearRampToValueAtTime(vol,        t0 + attack);
    gain.gain.linearRampToValueAtTime(vol*sustain, t0 + attack + decay);
    gain.gain.linearRampToValueAtTime(0,           t0 + attack + decay + release);
    osc.start(t0);
    osc.stop(t0 + dur + 0.05);
  } catch(e) {}
}

/* Шум для эффекта "вжух" */
function noise({ vol=0.2, dur=0.12, delay=0 } = {}) {
  try {
    const ctx2 = ac();
    const t0   = ctx2.currentTime + delay;
    const buf  = ctx2.createBuffer(1, ctx2.sampleRate * dur, ctx2.sampleRate);
    const data = buf.getChannelData(0);
    for (let i=0; i<data.length; i++) data[i] = Math.random()*2-1;
    const src  = ctx2.createBufferSource();
    const filt = ctx2.createBiquadFilter();
    const gain = ctx2.createGain();
    src.buffer = buf;
    filt.type  = 'bandpass';
    filt.frequency.value = 800;
    src.connect(filt); filt.connect(gain); gain.connect(ctx2.destination);
    gain.gain.setValueAtTime(vol, t0);
    gain.gain.linearRampToValueAtTime(0, t0 + dur);
    src.start(t0); src.stop(t0 + dur + 0.01);
  } catch(e) {}
}

/* ── Конкретные звуки ── */

// Обычное попадание — глухой "клок"
function sfxPlace() {
  tone({ freq:180, freq2:120, type:'triangle', vol:0.4, attack:0.003,
         decay:0.06, sustain:0.0, release:0.08, dur:0.18 });
  noise({ vol:0.15, dur:0.08 });
}

// PERFECT — чистый высокий "пинг"
function sfxPerfect() {
  tone({ freq:880, type:'sine', vol:0.45, attack:0.004,
         decay:0.05, sustain:0.4, release:0.22, dur:0.38 });
  tone({ freq:1320, type:'sine', vol:0.2, attack:0.01,
         decay:0.08, sustain:0.1, release:0.15, dur:0.3, delay:0.04 });
}

// COMBO ×N — восходящие ноты, выше с каждым уровнем
function sfxCombo(combo) {
  const base  = 523; // C5
  const step  = Math.min(combo - 1, 8); // не улетать в ультразвук
  const freq1 = base * Math.pow(1.12, step);
  const freq2 = freq1 * 1.5;
  tone({ freq:freq1, freq2, type:'square', vol:0.3, attack:0.005,
         decay:0.07, sustain:0.2, release:0.18, dur:0.32 });
  tone({ freq:freq1*2, type:'sine', vol:0.18, attack:0.01,
         decay:0.1, sustain:0.15, release:0.2, dur:0.35, delay:0.05 });
}

// Обрезка блока — короткий "щелк"
function sfxCut() {
  tone({ freq:220, freq2:80, type:'sawtooth', vol:0.25, attack:0.002,
         decay:0.05, sustain:0.0, release:0.06, dur:0.12 });
  noise({ vol:0.18, dur:0.06 });
}

// Полный промах / Game Over — низкий "бум"
function sfxGameOver() {
  tone({ freq:120, freq2:55, type:'sawtooth', vol:0.5, attack:0.01,
         decay:0.18, sustain:0.2, release:0.5, dur:0.9 });
  tone({ freq:80,  type:'sine',    vol:0.35, attack:0.005,
         decay:0.3, sustain:0.1, release:0.6, dur:0.9, delay:0.05 });
  noise({ vol:0.3, dur:0.25, delay:0.02 });
}

// Milestone (100, 200... 10000) — праздничный аккорд
function sfxMilestone(score) {
  const big = score >= 1000;
  const notes = big
    ? [523, 659, 784, 1047, 1319]   // C5 E5 G5 C6 E6
    : [523, 659, 784, 1047];        // C5 E5 G5 C6
  notes.forEach((f, i) => {
    tone({ freq:f, type:'sine', vol: big ? 0.35 : 0.28,
           attack:0.005, decay:0.1, sustain:0.4, release:0.3,
           dur: big ? 0.9 : 0.65, delay: i * (big ? 0.07 : 0.06) });
  });
  if (big) {
    // Extra sparkle на больших milestones
    tone({ freq:2093, type:'sine', vol:0.15, attack:0.01,
           decay:0.05, sustain:0.2, release:0.3, dur:0.6, delay:0.28 });
  }
}

// Кнопки меню — лёгкий "тик"
function sfxTick() {
  tone({ freq:600, type:'sine', vol:0.18, attack:0.003,
         decay:0.04, sustain:0.0, release:0.05, dur:0.09 });
}

// Запуск игры — «поехали»
function sfxStart() {
  [392, 523, 659].forEach((f, i) => {
    tone({ freq:f, type:'sine', vol:0.28, attack:0.005,
           decay:0.08, sustain:0.2, release:0.18, dur:0.28, delay: i*0.1 });
  });
}

// Новый рекорд на экране Game Over
function sfxNewRecord() {
  [784, 988, 1175, 1568].forEach((f, i) => {
    tone({ freq:f, type:'sine', vol:0.32, attack:0.005,
           decay:0.08, sustain:0.3, release:0.3, dur:0.5, delay: i*0.09 });
  });
}

/* ─────────────────────────────────────
   GAME CONSTANTS
───────────────────────────────────── */
const BLOCK_H       = 26;    // block visual height px
const BLOCK_GAP     = 5;     // vertical gap between blocks px
const PERFECT_PX    = 8;     // snap threshold px
const BASE_SPEED    = 190;   // starting speed px/s
const SPEED_INC     = 3.5;   // speed increase per level
const MAX_SPEED     = 440;   // max speed cap px/s
const CAM_LERP      = 0.12;  // camera smoothing (0-1)
const INIT_W_FRAC   = 0.60;  // initial block width fraction of CW
const INIT_BLOCKS   = 4;     // number of foundation blocks
const COMBO_GROW_PX = 8;     // px block grows per combo ≥ 2
const MOVING_Y_FRAC = 0.28;  // moving block target Y fraction of CH

/* Colour themes, cycling every 10 levels */
const THEMES = [
  { top:'#f5c518', mid:'#c49010', bot:'#7a5000', bg0:'#0d0d1a', bg1:'#1a1428' },
  { top:'#4ade80', mid:'#22c55e', bot:'#15803d', bg0:'#081408', bg1:'#0e2014' },
  { top:'#60a5fa', mid:'#3b82f6', bot:'#1d4ed8', bg0:'#080c18', bg1:'#0e1428' },
  { top:'#f472b6', mid:'#ec4899', bot:'#be185d', bg0:'#180810', bg1:'#28101c' },
  { top:'#a78bfa', mid:'#7c3aed', bot:'#5b21b6', bg0:'#0e0818', bg1:'#180e28' },
  { top:'#fb923c', mid:'#ea580c', bot:'#9a3412', bg0:'#180a04', bg1:'#2a1208' },
  { top:'#34d399', mid:'#059669', bot:'#065f46', bg0:'#040f0a', bg1:'#0a1e14' },
  { top:'#e879f9', mid:'#c026d3', bot:'#86198f', bg0:'#140818', bg1:'#220e28' },
];

/* ─────────────────────────────────────
   GAME STATE
───────────────────────────────────── */
let gs = {
  running: false,
  paused:  false,
  score:   0,
  combo:   0,
  animId:  null,
  lastTs:  0,
};

let stack      = [];   // placed blocks [{level, x, w}]
let moving     = null; // current sliding block {level, x, w, dir, speed}
let cuts       = [];   // debris [{x, w, level, vy, alpha}]
let camY       = 0;    // current camera Y offset
let targetY    = 0;    // camera target
let theme      = THEMES[0];
let initBlockW = 0;    // original width — combo growth ceiling
let CW = 0, CH = 0;   // canvas logical size
let hintShown       = false;
let lastMilestone    = 0;   // tracks last celebrated score milestone

/* ─────────────────────────────────────
   RESIZE — hi-DPI
───────────────────────────────────── */
function resize() {
  const dpr  = window.devicePixelRatio || 1;
  const rect = canvas.parentElement.getBoundingClientRect();
  CW = Math.floor(rect.width  || window.innerWidth);
  CH = Math.floor(rect.height || window.innerHeight);
  canvas.width        = CW * dpr;
  canvas.height       = CH * dpr;
  canvas.style.width  = CW + 'px';
  canvas.style.height = CH + 'px';
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
}
window.addEventListener('resize', () => {
  resize();
  if (gs.running && !gs.paused) drawFrame();
});

/* ─────────────────────────────────────
   GAME FLOW
───────────────────────────────────── */
function startGame() {
  stopGame();
  showScreen('game');
  resize();
  resetState();
  elHudBest.textContent  = getBest();
  elHudScore.textContent = '0';
  elTapHint.classList.remove('hidden');
  hintShown = false;
  sfxStart();
  requestAnimationFrame(loop);
}

function stopGame() {
  gs.running = false;
  gs.paused  = false;
  if (gs.animId) { cancelAnimationFrame(gs.animId); gs.animId = null; }
}

function pauseGame() {
  if (!gs.running || gs.paused) return;
  gs.paused = true;
  elPauseSc.textContent = gs.score;
  showScreen('pause');
}

function resumeGame() {
  if (!gs.paused) return;
  gs.paused = false;
  gs.lastTs = 0;
  showScreen('game');
  requestAnimationFrame(loop);
}

function resetState() {
  gs.running = true;
  gs.paused  = false;
  gs.score   = 0;
  gs.combo   = 0;
  gs.lastTs  = 0;
  camY    = 0;
  targetY = 0;
  theme   = THEMES[0];
  stack         = [];
  cuts          = [];
  moving        = null;
  lastMilestone = 0;
  buildFoundation();
  spawnMoving();
}

/* ─────────────────────────────────────
   FOUNDATION
───────────────────────────────────── */
function buildFoundation() {
  initBlockW = Math.round(CW * INIT_W_FRAC);
  const x = Math.round((CW - initBlockW) / 2);
  for (let i = 0; i < INIT_BLOCKS; i++) {
    stack.push({ level: i, x, w: initBlockW });
  }
}

/* ─────────────────────────────────────
   SPAWN MOVING BLOCK
───────────────────────────────────── */
function spawnMoving() {
  const top     = stack[stack.length - 1];
  const level   = top.level + 1;
  const w       = top.w;
  const goRight = (level % 2 === 0); // alternate direction each level
  const startX  = goRight ? -w : CW;
  const speed   = Math.min(BASE_SPEED + level * SPEED_INC, MAX_SPEED);
  moving = { level, x: startX, w, dir: goRight ? 1 : -1, speed };
}

/* ─────────────────────────────────────
   PLACE BLOCK  — core logic
───────────────────────────────────── */
function placeBlock() {
  if (!hintShown) { elTapHint.classList.add('hidden'); hintShown = true; }

  const top = stack[stack.length - 1];
  const tx = top.x,    tw = top.w;
  const mx = moving.x, mw = moving.w;

  // Overlap
  const ol = Math.max(mx, tx);
  const or = Math.min(mx + mw, tx + tw);
  const ow = or - ol;

  // Complete miss → game over
  if (ow <= 0) { sfxGameOver(); gameOver(); return; }

  const diff = Math.abs(mx - tx);
  let nx = ol, nw = ow;
  let isPerfect = false;

  /* ── PERFECT HIT ── */
  if (diff <= PERFECT_PX) {
    isPerfect = true;
    gs.combo++;

    if (gs.combo === 1) {
      // 1st perfect: snap without shrink, no grow yet
      nw = tw;
      nx = tx;
      sfxPerfect();
      showFeedback('PERFECT!', 'perfect');

    } else {
      // combo ≥ 2: grow block toward initBlockW
      // Amount to grow this step, capped so we never exceed original width
      const growAmt = Math.min(COMBO_GROW_PX, initBlockW - tw);
      nw = tw + growAmt;          // new width (already ≤ initBlockW)
      nx = tx - growAmt / 2;     // keep centred
      // Safety clamp: never exceed original, never leave screen
      nw = Math.min(nw, initBlockW);
      nx = Math.max(0, Math.min(nx, CW - nw));
      nw = Math.round(nw);
      nx = Math.round(nx);
      sfxCombo(gs.combo);
      showFeedback('COMBO ×' + gs.combo, 'combo');
    }

  /* ── PARTIAL HIT ── */
  } else {
    gs.combo = 0;
    sfxCut();
    // Debris: the piece that fell off
    const cutX = (mx < tx) ? mx : (ol + ow);
    const cutW = mw - nw;
    if (cutW > 0) cuts.push({ x: cutX, w: cutW, level: moving.level, vy: 0, alpha: 1 });
  }

  // Push new placed block
  stack.push({ level: moving.level, x: nx, w: nw });
  if (!isPerfect) sfxPlace(); // perfect already has its own sound

  // Score: 1 base + 1 for any perfect + 1 per combo above 2
  const pts = 1 + (isPerfect ? 1 : 0) + Math.max(0, gs.combo - 2);
  gs.score += pts;
  elHudScore.textContent = gs.score;

  // ── Milestone celebrations ──
  const MILESTONES_SMALL = [100,200,300,400,500,600,700,800,900,1000];
  const MILESTONES_BIG   = [2000,3000,4000,5000,6000,7000,8000,9000,10000];
  const ALL_MILESTONES   = [...MILESTONES_SMALL, ...MILESTONES_BIG];
  for (const ms of ALL_MILESTONES) {
    if (gs.score >= ms && lastMilestone < ms) {
      lastMilestone = ms;
      sfxMilestone(ms);
      const key = 'm' + ms;
      const text = I18N[currentLang][key] || ('Score: ' + ms + '!');
      showMilestone(text, ms >= 1000);
      break; // one milestone at a time
    }
  }

  // Camera: always keep NEXT moving block at MOVING_Y_FRAC from top
  // blockY(level) = baseY - level*step + camY
  // We want blockY(newLevel) = CH * MOVING_Y_FRAC
  // → camY = CH*MOVING_Y_FRAC - baseY + newLevel*step
  const step     = BLOCK_H + BLOCK_GAP;
  const baseY    = CH * 0.82;
  const newLevel = moving.level + 1;
  if (newLevel > INIT_BLOCKS) {
    targetY = CH * MOVING_Y_FRAC - baseY + newLevel * step;
  }

  // Theme: cycle every 10 levels
  theme = THEMES[Math.floor(moving.level / 10) % THEMES.length];

  spawnMoving();
}

/* ─────────────────────────────────────
   GAME OVER
───────────────────────────────────── */
function gameOver() {
  gs.running = false;
  const score = gs.score;
  const best  = getBest();
  const isNew = score > best;
  if (isNew) saveBest(score);
  saveLast(score);

  elGoScore.textContent = score;
  elGoBest.textContent  = isNew ? score : best;
  elNewBest.classList.toggle('show', isNew);
  if (isNew) setTimeout(sfxNewRecord, 400);

  setTimeout(() => showScreen('gameover'), 350);
}


/* ─────────────────────────────────────
   MILESTONE POPUP
   Separate overlay from feedback,
   bigger animation for big moments
───────────────────────────────────── */
let msTimer = null;
function showMilestone(text, isBig) {
  const el = document.getElementById('milestone');
  if (!el) return;
  el.textContent = text;
  el.className   = 'milestone ' + (isBig ? 'big' : 'small');
  void el.offsetWidth;
  el.classList.add('show');
  clearTimeout(msTimer);
  msTimer = setTimeout(() => { el.className = 'milestone'; }, isBig ? 2600 : 2000);
}

/* ─────────────────────────────────────
   FEEDBACK POPUP
   PERFECT and COMBO always English
───────────────────────────────────── */
let fbTimer = null;
function showFeedback(text, cls) {
  elFeedback.textContent = text;
  elFeedback.className   = 'feedback';
  void elFeedback.offsetWidth; // restart animation
  elFeedback.classList.add(cls);
  clearTimeout(fbTimer);
  fbTimer = setTimeout(() => { elFeedback.className = 'feedback'; }, 900);
}

/* ─────────────────────────────────────
   MAIN LOOP
───────────────────────────────────── */
function loop(ts) {
  if (!gs.running || gs.paused) return;
  const dt  = gs.lastTs ? Math.min((ts - gs.lastTs) / 1000, 0.05) : 0.016;
  gs.lastTs = ts;
  update(dt);
  drawFrame();
  gs.animId = requestAnimationFrame(loop);
}

/* ─────────────────────────────────────
   UPDATE
───────────────────────────────────── */
function update(dt) {
  if (!moving) return;

  // Slide block
  moving.x += moving.dir * moving.speed * dt;

  // Bounce with small off-screen margin for feel
  const margin = moving.w * 0.08;
  if (moving.dir > 0 && moving.x > CW + margin) {
    moving.x  =  CW + margin;
    moving.dir = -1;
  } else if (moving.dir < 0 && moving.x + moving.w < -margin) {
    moving.x  = -margin - moving.w;
    moving.dir =  1;
  }

  // Camera lerp
  camY += (targetY - camY) * CAM_LERP;

  // Debris gravity
  for (const c of cuts) {
    c.vy    += 1800 * dt;
    c.level -= (c.vy * dt) / (BLOCK_H + BLOCK_GAP);
    c.alpha -= dt * 2.0;
  }
  cuts = cuts.filter(c => c.alpha > 0);
}

/* ─────────────────────────────────────
   DRAW
───────────────────────────────────── */
function drawFrame() {
  // Background
  const bg = ctx.createLinearGradient(0, 0, 0, CH);
  bg.addColorStop(0, theme.bg0);
  bg.addColorStop(1, theme.bg1);
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, CW, CH);

  // Stack
  for (const blk of stack) renderBlock(blk, false);

  // Debris
  ctx.save();
  for (const c of cuts) {
    ctx.globalAlpha = Math.max(0, c.alpha);
    ctx.fillStyle   = theme.mid;
    fillRR(c.x, blockY(c.level), c.w, BLOCK_H, 5);
  }
  ctx.globalAlpha = 1;
  ctx.restore();

  // Moving block
  if (moving) renderBlock(moving, true);
}

/* Level → screen Y */
function blockY(level) {
  const baseY = CH * 0.82;
  return baseY - level * (BLOCK_H + BLOCK_GAP) + camY;
}

/* Render one block with 3D shadow + highlight */
function renderBlock(blk, isMoving) {
  const x = blk.x;
  const y = blockY(blk.level);
  const w = blk.w;
  const h = BLOCK_H;

  if (y > CH + h + 10 || y < -(h + 10)) return; // frustum cull

  const depth = (stack.length - 1) - (blk.level || 0);
  const alpha = Math.max(0.28, 1 - depth * 0.055);

  ctx.save();
  ctx.globalAlpha = alpha;

  // 3D side shadow
  ctx.fillStyle = theme.bot;
  fillRR(x + 4, y + 5, w, h, 5);

  // Main face
  if (isMoving) {
    ctx.fillStyle = theme.top;
  } else {
    const fg = ctx.createLinearGradient(0, y, 0, y + h);
    fg.addColorStop(0, theme.top);
    fg.addColorStop(1, theme.mid);
    ctx.fillStyle = fg;
  }
  fillRR(x, y, w, h, 5);

  // Specular stripe
  ctx.globalAlpha = alpha * 0.30;
  ctx.fillStyle   = '#ffffff';
  fillRR(x + 6, y + 3, Math.max(0, w - 12), 5, 2.5);

  ctx.restore();
}

/* Rounded rectangle */
function fillRR(x, y, w, h, r) {
  if (w <= 0 || h <= 0) return;
  r = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.arcTo(x + w, y,      x + w, y + r,      r);
  ctx.lineTo(x + w, y + h - r);
  ctx.arcTo(x + w, y + h,  x + w - r, y + h,  r);
  ctx.lineTo(x + r, y + h);
  ctx.arcTo(x,     y + h,  x,     y + h - r,  r);
  ctx.lineTo(x,     y + r);
  ctx.arcTo(x,     y,      x + r, y,           r);
  ctx.closePath();
  ctx.fill();
}

/* ─────────────────────────────────────
   INIT
───────────────────────────────────── */
// Apply saved language on load
setLang(currentLang);
refreshMenu();
showScreen('menu');
