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

// ── Export / Import ────────────────────────────────────────────────────────────

function exportJSON() {
  const data = { version: 1, exportedAt: new Date().toISOString(), placements };
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const a = Object.assign(document.createElement('a'), {
    href: URL.createObjectURL(blob),
    download: `design-matrix-${new Date().toISOString().slice(0,10)}.json`,
  });
  a.click();
  URL.revokeObjectURL(a.href);
}

function importJSON(file) {
  if (!file) return;
  file.text().then(text => {
    try {
      const { placements: p } = JSON.parse(text);
      if (!p || typeof p !== 'object') throw new Error();
      placements = p;
      save();
      renderAllDots();
      renderCardList();
      updateCount();
    } catch {
      alert('無法讀取檔案，請確認是由本工具匯出的 JSON。');
    }
  });
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

  document.getElementById('btnExport').addEventListener('click', exportJSON);
  document.getElementById('btnImport').addEventListener('click', () => {
    document.getElementById('fileImport').click();
  });
  document.getElementById('fileImport').addEventListener('change', e => {
    importJSON(e.target.files[0]);
    e.target.value = '';
  });

  document.addEventListener('keydown', e => { if (e.key === 'Escape') deselect(); });

  document.getElementById('overlay').addEventListener('click', e => {
    if (e.target === e.currentTarget)
      document.getElementById('overlay').classList.add('hidden');
  });
}

// ── Start ──────────────────────────────────────────────────────────────────────

init();
