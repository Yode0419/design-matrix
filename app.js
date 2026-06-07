// ── Data ──────────────────────────────────────────────────────────────────────

const CATEGORIES = [
  { id: 'creative', label: '創意思考',   color: '#388e3c' },
  { id: 'business', label: '商業知識',   color: '#1565c0' },
  { id: 'comm',     label: '溝通合作',   color: '#c2185b' },
  { id: 'research', label: '使用者研究', color: '#e64a19' },
  { id: 'ux',       label: 'UX 設計',   color: '#7b1fa2' },
  { id: 'ui',       label: 'UI / 視覺', color: '#00796b' },
  { id: 'writing',  label: 'UX 文案',   color: '#f57c00' },
  { id: 'testing',  label: '評估測試',   color: '#c62828' },
  { id: 'frontend', label: '前端開發',   color: '#283593' },
];

const SKILLS = [
  // Creative Thinking & Creativity
  { id:  1, en: 'Problem Spotting',                                    zh: '問題發現',              cat: 'creative' },
  { id:  2, en: 'Creative Ideation / Brainstorming',                   zh: '創意發想 / 腦力激盪',   cat: 'creative' },
  { id:  3, en: 'Design Thinking Process',                             zh: '設計思考流程',           cat: 'creative' },
  { id:  4, en: 'Double Diamond Design Process',                       zh: '雙鑽石設計流程',         cat: 'creative' },
  { id:  5, en: 'Critical Thinking',                                   zh: '批判性思考',             cat: 'creative' },
  { id:  6, en: 'Hypothesis Development',                              zh: '假設發展',               cat: 'creative' },
  { id:  7, en: 'Storyboard Development',                              zh: '故事板開發',             cat: 'creative' },

  // Business Knowledge
  { id:  8, en: 'Project Management',                                  zh: '專案管理',               cat: 'business' },
  { id:  9, en: 'Time Management',                                     zh: '時間管理',               cat: 'business' },
  { id: 10, en: 'Web Analytics',                                       zh: '網站分析',               cat: 'business' },
  { id: 11, en: 'Agile Methodologies',                                 zh: '敏捷方法論',             cat: 'business' },
  { id: 12, en: 'Knowing When to Ask for Help / Clarification',        zh: '知道何時尋求協助',       cat: 'business' },

  // Communication & Teamwork
  { id: 13, en: 'Verbal Communication',                                zh: '口語溝通',               cat: 'comm' },
  { id: 14, en: 'Written Communication',                               zh: '書面溝通',               cat: 'comm' },
  { id: 15, en: 'Storytelling',                                        zh: '說故事',                 cat: 'comm' },
  { id: 16, en: 'Presenting - Public Speaking',                        zh: '公開演說 / 簡報',        cat: 'comm' },
  { id: 17, en: 'Presenting - Workshop Facilitation',                  zh: '工作坊引導',             cat: 'comm' },
  { id: 18, en: 'Teamwork - Collaboration',                            zh: '團隊合作',               cat: 'comm' },
  { id: 19, en: 'Empathy Development',                                 zh: '同理心培養',             cat: 'comm' },

  // User Research
  { id: 20, en: 'Research Objective Creation',                         zh: '研究目標制定',           cat: 'research' },
  { id: 21, en: 'Research Plan Development',                           zh: '研究計畫開發',           cat: 'research' },
  { id: 22, en: 'User Interview Plan Creation',                        zh: '訪談計畫制定',           cat: 'research' },
  { id: 23, en: 'User Interviews',                                     zh: '使用者訪談',             cat: 'research' },
  { id: 24, en: 'Stakeholder Interviews',                              zh: '利害關係人訪談',         cat: 'research' },
  { id: 25, en: 'User Observation',                                    zh: '使用者觀察',             cat: 'research' },
  { id: 26, en: 'Ethnographic Research',                               zh: '民族誌研究',             cat: 'research' },
  { id: 27, en: 'Survey Creation',                                     zh: '問卷設計',               cat: 'research' },
  { id: 28, en: 'Qualitative Research Methods',                        zh: '質性研究方法',           cat: 'research' },
  { id: 29, en: 'Quantitative Research Methods',                       zh: '量化研究方法',           cat: 'research' },
  { id: 30, en: 'Qualitative Data Analysis and Synthesis',             zh: '質性資料分析與整合',     cat: 'research' },
  { id: 31, en: 'Quantitative Data Analysis and Synthesis',            zh: '量化資料分析與整合',     cat: 'research' },
  { id: 32, en: 'Identifying User Insights',                           zh: '使用者洞察識別',         cat: 'research' },
  { id: 33, en: 'Secondary Research',                                  zh: '次級研究',               cat: 'research' },
  { id: 34, en: 'Competitive Analysis',                                zh: '競品分析',               cat: 'research' },

  // UX Design
  { id: 35, en: 'Task Analysis',                                       zh: '任務分析',               cat: 'ux' },
  { id: 36, en: 'User Scenarios',                                      zh: '使用者情境',             cat: 'ux' },
  { id: 37, en: 'Persona Creation',                                    zh: '人物誌建立',             cat: 'ux' },
  { id: 38, en: 'Affinity Diagrams',                                   zh: '親和圖',                 cat: 'ux' },
  { id: 39, en: 'User Flows',                                          zh: '使用者流程',             cat: 'ux' },
  { id: 40, en: 'Site Map Creation',                                   zh: '網站地圖建立',           cat: 'ux' },
  { id: 41, en: 'Information Architecture',                            zh: '資訊架構',               cat: 'ux' },
  { id: 42, en: 'Wireframing',                                         zh: '線框圖',                 cat: 'ux' },
  { id: 43, en: 'Wireflows',                                           zh: '線框流程圖',             cat: 'ux' },
  { id: 44, en: 'Sketching Low-Fidelity Ideas',                        zh: '低保真草圖',             cat: 'ux' },
  { id: 45, en: 'Paper Prototyping',                                   zh: '紙本原型',               cat: 'ux' },
  { id: 46, en: 'Digital Prototyping',                                 zh: '數位原型',               cat: 'ux' },
  { id: 47, en: 'Mid-Fidelity Mockups',                                zh: '中保真模型',             cat: 'ux' },
  { id: 48, en: 'High-Fidelity Mockups',                               zh: '高保真模型',             cat: 'ux' },
  { id: 49, en: 'Interaction Design',                                  zh: '互動設計',               cat: 'ux' },

  // UI / Visual Design
  { id: 50, en: 'Applying Design Theory - Elements of Design',         zh: '設計元素理論應用',       cat: 'ui' },
  { id: 51, en: 'Applying Design Theory - Principles of Design',       zh: '設計原則理論應用',       cat: 'ui' },
  { id: 52, en: 'Applying Design Theory - Gestalt Laws',               zh: '格式塔定律應用',         cat: 'ui' },
  { id: 53, en: 'Visual Design - Typography',                          zh: '視覺設計 — 字體排版',    cat: 'ui' },
  { id: 54, en: 'Visual Design - Color Theory',                        zh: '視覺設計 — 色彩理論',    cat: 'ui' },
  { id: 55, en: 'Visual Design - Layout',                              zh: '視覺設計 — 版面配置',    cat: 'ui' },
  { id: 56, en: 'Visual Design - Branding',                            zh: '視覺設計 — 品牌識別',    cat: 'ui' },
  { id: 57, en: 'Visual Design - Iconography',                         zh: '視覺設計 — 圖示設計',    cat: 'ui' },
  { id: 58, en: 'Visual Design - Illustration',                        zh: '視覺設計 — 插圖繪製',    cat: 'ui' },
  { id: 59, en: 'Visual Design - Data Visualization',                  zh: '視覺設計 — 資料視覺化',  cat: 'ui' },
  { id: 60, en: 'Visual Design - Animations',                          zh: '視覺設計 — 動態效果',    cat: 'ui' },
  { id: 61, en: 'Design Critique / Peer Review',                       zh: '設計評論 / 同儕審查',    cat: 'ui' },
  { id: 62, en: 'UI Assessment',                                       zh: 'UI 評估',               cat: 'ui' },

  // UX Writing
  { id: 63, en: 'UX Writing - Microcopy',                              zh: 'UX 文案 — 微文案',       cat: 'writing' },
  { id: 64, en: 'UX Writing - Brand Tone and Voice',                   zh: 'UX 文案 — 品牌語調',     cat: 'writing' },
  { id: 65, en: 'UX Writing - UI Specifications',                      zh: 'UX 文案 — 介面規格說明', cat: 'writing' },
  { id: 66, en: 'UX Writing - Design Documentation',                   zh: 'UX 文案 — 設計文件撰寫', cat: 'writing' },
  { id: 67, en: 'Content Design',                                      zh: '內容設計',               cat: 'writing' },

  // Assessment & Testing
  { id: 68, en: 'Usability Testing',                                   zh: '可用性測試',             cat: 'testing' },
  { id: 69, en: 'User Testing',                                        zh: '使用者測試',             cat: 'testing' },
  { id: 70, en: 'Heuristic Evaluation',                                zh: '啟發式評估',             cat: 'testing' },
  { id: 71, en: 'Card Sorting',                                        zh: '卡片分類',               cat: 'testing' },
  { id: 72, en: 'Mid/High-Fidelity Testing (A/B, 5-sec, first click)', zh: '中高保真測試',          cat: 'testing' },
  { id: 73, en: 'UI Annotations',                                      zh: 'UI 標註',               cat: 'testing' },
  { id: 74, en: 'Developer Handoff',                                   zh: '開發交接',               cat: 'testing' },

  // Front-End Development
  { id: 75, en: 'Front-End Development - HTML',                        zh: '前端開發 — HTML',        cat: 'frontend' },
  { id: 76, en: 'Front-End Development - CSS',                         zh: '前端開發 — CSS',         cat: 'frontend' },
  { id: 77, en: 'Front-End Development - Sass/SCSS',                   zh: '前端開發 — Sass/SCSS',   cat: 'frontend' },
  { id: 78, en: 'Front-End Development - JavaScript',                  zh: '前端開發 — JavaScript',  cat: 'frontend' },
  { id: 79, en: 'Front-End Development - jQuery',                      zh: '前端開發 — jQuery',      cat: 'frontend' },
  { id: 80, en: 'Front-End Development - Bootstrap',                   zh: '前端開發 — Bootstrap',   cat: 'frontend' },
  { id: 81, en: 'Front-End Development - GitHub',                      zh: '前端開發 — GitHub',      cat: 'frontend' },
  { id: 82, en: 'No-Code Solutions (Softr, Airtable, Bubble…)',        zh: '無程式碼工具',           cat: 'frontend' },
  { id: 83, en: 'Low-Code Solutions (Wix, Webflow…)',                  zh: '低程式碼工具',           cat: 'frontend' },
  { id: 84, en: 'Content Management Systems (CMS)',                    zh: '內容管理系統',           cat: 'frontend' },
];

// ── State ──────────────────────────────────────────────────────────────────────

const LS_KEY    = 'dsm_placements_v1';
const LS_COLLAPSED = 'dsm_collapsed_v1';
let placements   = {};     // { skillId: { x, y } }  x/y in 0–100 %
let selectedId   = null;
let activeDotId  = null;   // dot showing its remove button
let resultMode   = false;
let collapsed    = {};     // { catId: true } — persisted
let highlightCat = null;   // category id being highlighted on matrix

// ── Init ───────────────────────────────────────────────────────────────────────

function init() {
  loadStorage();
  renderCardList();
  renderAllDots();
  updateCount();
  bindEvents();
}

// ── Storage ────────────────────────────────────────────────────────────────────

function loadStorage() {
  try { placements = JSON.parse(localStorage.getItem(LS_KEY)) || {}; }
  catch { placements = {}; }
  try { collapsed = JSON.parse(localStorage.getItem(LS_COLLAPSED)) || {}; }
  catch { collapsed = {}; }
}

function save() {
  localStorage.setItem(LS_KEY, JSON.stringify(placements));
}

function saveCollapsed() {
  localStorage.setItem(LS_COLLAPSED, JSON.stringify(collapsed));
}

// ── Card List (grouped by category) ───────────────────────────────────────────

function renderCardList() {
  const list = document.getElementById('cardList');
  list.innerHTML = '';

  CATEGORIES.forEach(cat => {
    const skills   = SKILLS.filter(s => s.cat === cat.id);
    const isCollapsed = !!collapsed[cat.id];

    // Group wrapper
    const group = document.createElement('div');
    group.className = 'cat-group' + (isCollapsed ? ' collapsed' : '');
    group.dataset.cat = cat.id;

    // Category header
    const header = document.createElement('div');
    header.className = 'cat-header';
    header.innerHTML = `
      <span class="cat-color-bar" style="background:${cat.color}"></span>
      <span class="cat-label">${esc(cat.label)}</span>
      <span class="cat-count">${skills.length}</span>
      <button class="cat-hl-btn" data-cat="${cat.id}" title="在矩陣中高亮此分類" style="color:${cat.color}">◉</button>
      <span class="cat-chevron">▾</span>
    `;
    header.addEventListener('click', () => toggleCat(cat.id));
    header.querySelector('.cat-hl-btn').addEventListener('click', e => {
      e.stopPropagation();
      setHighlightCat(highlightCat === cat.id ? null : cat.id);
    });
    group.appendChild(header);

    // Cards container
    const cardsEl = document.createElement('div');
    cardsEl.className = 'cat-cards';

    skills.forEach(skill => {
      const placed   = placements[skill.id] !== undefined;
      const selected = selectedId === skill.id;

      const item = document.createElement('div');
      item.className = 'card-item' +
        (placed   ? ' placed'   : '') +
        (selected ? ' selected' : '');
      item.dataset.id = skill.id;
      item.title = `${skill.en}　${skill.zh}`;
      item.style.borderLeftColor = cat.color;

      item.innerHTML = `
        <span class="card-color-dot" style="background:${cat.color}"></span>
        <span class="card-text">
          <span class="card-en">${esc(truncate(skill.en, 36))}</span>
          <span class="card-zh">${esc(skill.zh)}</span>
        </span>
        ${placed ? '<span class="card-placed-mark">✓</span>' : ''}
      `;

      item.addEventListener('click', () => onCardClick(skill.id));
      cardsEl.appendChild(item);
    });

    group.appendChild(cardsEl);
    list.appendChild(group);
  });
}

function toggleCat(catId) {
  collapsed[catId] = !collapsed[catId];
  saveCollapsed();
  const group = document.querySelector(`.cat-group[data-cat="${catId}"]`);
  if (group) group.classList.toggle('collapsed', !!collapsed[catId]);
}

function expandAll() {
  CATEGORIES.forEach(cat => { collapsed[cat.id] = false; });
  saveCollapsed();
  document.querySelectorAll('.cat-group').forEach(g => g.classList.remove('collapsed'));
}

function collapseAll() {
  CATEGORIES.forEach(cat => { collapsed[cat.id] = true; });
  saveCollapsed();
  document.querySelectorAll('.cat-group').forEach(g => g.classList.add('collapsed'));
}

// ── Dots on Matrix ─────────────────────────────────────────────────────────────

function renderAllDots() {
  document.getElementById('dotsLayer').innerHTML = '';
  Object.entries(placements).forEach(([idStr, pos]) => {
    addDot(parseInt(idStr), pos.x, pos.y);
  });
}

function addDot(id, x, y) {
  const skill = SKILLS.find(s => s.id === id);
  if (!skill) return;
  const color = catColor(skill.cat);
  const flip  = x > 68;

  const dot = document.createElement('div');
  dot.className = 'pdot' + (flip ? ' flip' : '') + (selectedId === id ? ' selected-dot' : '');
  dot.dataset.id  = id;
  dot.dataset.cat = skill.cat;
  dot.style.left  = x + '%';
  dot.style.top   = y + '%';
  dot.title = `${skill.en} / ${skill.zh}`;

  dot.innerHTML = `
    <div class="pdot-remove" title="移除">✕</div>
    <div class="pdot-circle" style="background:${color}"></div>
    <div class="pdot-label">${esc(skill.en)}</div>
  `;

  dot.querySelector('.pdot-remove').addEventListener('click', e => {
    e.stopPropagation();
    removePlacement(id);
  });

  // Prevent click from bubbling to matrix (would clear active state)
  dot.addEventListener('click', e => e.stopPropagation());

  // Drag to reposition; plain click toggles active (shows remove button)
  dot.addEventListener('mousedown', e => {
    if (e.button !== 0) return;
    e.stopPropagation();
    e.preventDefault();

    const matrix  = document.getElementById('matrix');
    const startCX = e.clientX;
    const startCY = e.clientY;
    let dragging   = false;

    const onMove = mv => {
      if (!dragging && Math.hypot(mv.clientX - startCX, mv.clientY - startCY) > 4) {
        dragging = true;
        dot.classList.add('dragging');
        setActiveDot(null);
      }
      if (!dragging) return;
      const r = matrix.getBoundingClientRect();
      const nx = Math.min(Math.max(((mv.clientX - r.left) / r.width)  * 100, 1), 99);
      const ny = Math.min(Math.max(((mv.clientY - r.top)  / r.height) * 100, 1), 99);
      dot.style.left = nx + '%';
      dot.style.top  = ny + '%';
      if (nx > 68) dot.classList.add('flip'); else dot.classList.remove('flip');
    };

    const onUp = up => {
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseup', onUp);
      if (dragging) {
        dot.classList.remove('dragging');
        const r = matrix.getBoundingClientRect();
        const nx = Math.min(Math.max(((up.clientX - r.left) / r.width)  * 100, 1), 99);
        const ny = Math.min(Math.max(((up.clientY - r.top)  / r.height) * 100, 1), 99);
        place(id, nx, ny);
      } else {
        onDotClick(id);
      }
    };

    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseup', onUp);
  });

  if (highlightCat) dot.classList.toggle('cat-match', skill.cat === highlightCat);
  document.getElementById('dotsLayer').appendChild(dot);
}

// ── Interactions ───────────────────────────────────────────────────────────────

function onCardClick(id) {
  if (selectedId === id) { deselect(); return; }
  selectSkill(id);
}

function setHighlightCat(catId) {
  highlightCat = catId;
  document.body.classList.toggle('cat-highlight', !!catId);
  // mark matching dots
  document.querySelectorAll('.pdot').forEach(el => {
    el.classList.toggle('cat-match', !!catId && el.dataset.cat === catId);
  });
  // mark active button
  document.querySelectorAll('.cat-hl-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.cat === catId);
  });
}

function setActiveDot(id) {
  // Clear previous dot + card
  if (activeDotId) {
    const prevDot  = document.querySelector(`.pdot[data-id="${activeDotId}"]`);
    const prevCard = document.querySelector(`.card-item[data-id="${activeDotId}"]`);
    if (prevDot)  prevDot.classList.remove('active');
    if (prevCard) prevCard.classList.remove('active');
  }
  activeDotId = id;
  if (id) {
    const dot  = document.querySelector(`.pdot[data-id="${id}"]`);
    const card = document.querySelector(`.card-item[data-id="${id}"]`);
    if (dot)  dot.classList.add('active');
    if (card) {
      card.classList.add('active');
      card.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }
}

function onDotClick(id) {
  if (activeDotId === id) {
    setActiveDot(null);
    deselect();
  } else {
    setActiveDot(id);
    selectSkill(id);
  }
}

function onMatrixClick(e) {
  if (selectedId === null) { setActiveDot(null); return; }

  if (placements[selectedId] === undefined) {
    // Unplaced card: click to place
    const matrix = document.getElementById('matrix');
    const rect   = matrix.getBoundingClientRect();
    const x = Math.min(Math.max(((e.clientX - rect.left) / rect.width)  * 100, 1), 99);
    const y = Math.min(Math.max(((e.clientY - rect.top)  / rect.height) * 100, 1), 99);
    place(selectedId, x, y);
  }

  deselect();
}

function selectSkill(id) {
  selectedId = id;
  const skill = SKILLS.find(s => s.id === id);
  document.body.classList.add('selecting');
  const isPlaced = placements[id] !== undefined;
  document.getElementById('statusHint').textContent = isPlaced
    ? `已選取「${skill.en}」，拖曳圓點移動位置`
    : `已選取「${skill.en}」，點矩陣放置`;
  document.getElementById('btnCancel').classList.remove('hidden');
  syncHighlights();
}

function deselect() {
  selectedId = null;
  setActiveDot(null);
  document.body.classList.remove('selecting');
  document.getElementById('statusHint').textContent =
    '點擊卡片選取，再點矩陣放置';
  document.getElementById('btnCancel').classList.add('hidden');
  syncHighlights();
}

function place(id, x, y) {
  placements[id] = { x: round2(x), y: round2(y) };
  save();
  removeDotEl(id);
  addDot(id, x, y);
  updateCardItem(id);
  updateCount();
}

function removePlacement(id) {
  delete placements[id];
  save();
  removeDotEl(id);
  if (selectedId === id) deselect();
  updateCardItem(id);
  updateCount();
}

function removeDotEl(id) {
  document.querySelector(`.pdot[data-id="${id}"]`)?.remove();
}

// Update a single card item without re-rendering the full list
function updateCardItem(id) {
  const placed   = placements[id] !== undefined;
  const el       = document.querySelector(`.card-item[data-id="${id}"]`);
  if (!el) return;

  el.classList.toggle('placed', placed);

  // Update the placed mark
  let mark = el.querySelector('.card-placed-mark');
  if (placed && !mark) {
    mark = document.createElement('span');
    mark.className = 'card-placed-mark';
    mark.textContent = '✓';
    el.appendChild(mark);
  } else if (!placed && mark) {
    mark.remove();
  }
}

function syncHighlights() {
  document.querySelectorAll('.card-item').forEach(el => {
    el.classList.toggle('selected', parseInt(el.dataset.id) === selectedId);
  });
  document.querySelectorAll('.pdot').forEach(el => {
    el.classList.toggle('selected-dot', parseInt(el.dataset.id) === selectedId);
  });
}

// ── Result Mode ────────────────────────────────────────────────────────────────

function toggleResultMode() {
  resultMode = !resultMode;
  document.body.classList.toggle('result-mode', resultMode);
  const btn = document.getElementById('btnResult');
  btn.classList.toggle('active', resultMode);
  btn.textContent = resultMode ? '📊 一般模式' : '📊 結果模式';
}

// ── Reset ──────────────────────────────────────────────────────────────────────

function resetAll() {
  placements = {};
  save();
  selectedId = null;
  document.body.classList.remove('selecting');
  document.getElementById('dotsLayer').innerHTML = '';
  renderCardList();
  updateCount();
  deselect();
}

// ── Helpers ────────────────────────────────────────────────────────────────────

function catColor(catId) {
  return CATEGORIES.find(c => c.id === catId)?.color ?? '#888';
}

function truncate(str, len) {
  return str.length > len ? str.slice(0, len) + '…' : str;
}

function round2(n) { return Math.round(n * 100) / 100; }

function esc(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function updateCount() {
  const n = Object.keys(placements).length;
  document.getElementById('countBadge').textContent = `${n} / ${SKILLS.length} 已放置`;
}

// ── Events ─────────────────────────────────────────────────────────────────────

function bindEvents() {
  document.getElementById('matrix').addEventListener('click', onMatrixClick);
  document.getElementById('btnResult').addEventListener('click', toggleResultMode);

  document.getElementById('btnLabels').addEventListener('click', () => {
    const on = document.body.classList.toggle('labels-visible');
    document.getElementById('btnLabels').textContent = on ? '隱藏標籤' : '標籤';
  });

  document.getElementById('btnReset').addEventListener('click', () => {
    document.getElementById('overlay').classList.remove('hidden');
  });
  document.getElementById('btnConfirmReset').addEventListener('click', () => {
    resetAll();
    document.getElementById('overlay').classList.add('hidden');
  });
  document.getElementById('btnCancelReset').addEventListener('click', () => {
    document.getElementById('overlay').classList.add('hidden');
  });

  document.getElementById('btnCancel').addEventListener('click', deselect);
  document.getElementById('btnExpandAll').addEventListener('click', expandAll);
  document.getElementById('btnCollapseAll').addEventListener('click', collapseAll);

  document.addEventListener('keydown', e => { if (e.key === 'Escape') deselect(); });

  document.getElementById('overlay').addEventListener('click', e => {
    if (e.target === e.currentTarget)
      document.getElementById('overlay').classList.add('hidden');
  });
}

// ── Start ──────────────────────────────────────────────────────────────────────

init();
