// ── State ──────────────────────────────────────────────────────────────────────

const LS_KEY    = 'dsm_placements_v1';
const LS_COLLAPSED = 'dsm_collapsed_v1';
let placements   = {};     // { skillId: { x, y } }  x/y in 0–100 %
let selectedId   = null;
let activeDotId  = null;   // dot showing its remove button
let resultMode   = false;
let gridVisible  = false;
let collapsed    = {};     // { catId: true } — persisted
let highlightCat = null;   // category id being highlighted on matrix

// ── Init ───────────────────────────────────────────────────────────────────────

function init() {
  loadStorage();
  renderAxisNumbers();
  renderCardList();
  renderAllDots();
  updateCount();
  bindEvents();
  const sel = document.getElementById('addSkillCat');
  CATEGORIES.forEach(cat => {
    const opt = document.createElement('option');
    opt.value = cat.id;
    opt.textContent = cat.label;
    sel.appendChild(opt);
  });
}

// ── Interactions ───────────────────────────────────────────────────────────────

function onCardClick(id) {
  if (selectedId === id) { deselect(); return; }
  selectSkill(id);
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
    '點擊技能項目選取，再點矩陣放置';
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

// Update a single card item without re-rendering the full list
// ── Result Mode ────────────────────────────────────────────────────────────────

function toggleResultMode() {
  resultMode = !resultMode;
  document.body.classList.toggle('result-mode', resultMode);
  const btn = document.getElementById('btnResult');
  btn.classList.toggle('active', resultMode);
  btn.textContent = resultMode ? '📊 一般模式' : '📊 結果模式';
}

function toggleGrid() {
  gridVisible = !gridVisible;
  document.body.classList.toggle('grid-hidden', !gridVisible);
  document.getElementById('btnGrid').textContent = gridVisible ? '隱藏格線' : '顯示格線';
}

// ── Custom Skills ──────────────────────────────────────────────────────────────

function addCustomSkill(name, catId) {
  const trimmed = name.trim();
  if (!trimmed) return;
  const maxId = customSkills.reduce((m, s) => Math.max(m, s.id), 9999);
  const skill = { id: maxId + 1, en: trimmed, zh: trimmed, cat: catId, custom: true };
  SKILLS.push(skill);
  customSkills.push(skill);
  saveCustomSkills();
  renderCardList();
  updateCount();
}

function deleteCustomSkill(id) {
  if (placements[id] !== undefined) {
    delete placements[id];
    save();
    removeDotEl(id);
  }
  if (selectedId === id) deselect();
  const si = SKILLS.findIndex(s => s.id === id);
  if (si !== -1) SKILLS.splice(si, 1);
  const ci = customSkills.findIndex(s => s.id === id);
  if (ci !== -1) customSkills.splice(ci, 1);
  saveCustomSkills();
  renderCardList();
  updateCount();
}

// ── Export / Import ────────────────────────────────────────────────────────────

function exportJSON() {
  const now = new Date().toISOString();
  const data = { version: 1, exportedAt: now, placements, customSkills };
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const a = Object.assign(document.createElement('a'), {
    href: URL.createObjectURL(blob),
    download: `design-matrix-${now.slice(0,10)}.json`,
  });
  a.click();
  URL.revokeObjectURL(a.href);
}

function importJSON(file) {
  if (!file) return;
  file.text().then(text => {
    try {
      const { placements: p, customSkills: cs } = JSON.parse(text);
      if (!p || typeof p !== 'object') throw new Error();

      // Remove existing custom skills from SKILLS
      customSkills.forEach(s => {
        const i = SKILLS.findIndex(sk => sk.id === s.id);
        if (i !== -1) SKILLS.splice(i, 1);
      });
      customSkills = [];

      if (Array.isArray(cs)) {
        customSkills = cs;
        cs.forEach(s => SKILLS.push(s));
      }
      saveCustomSkills();

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
  document.getElementById('dotsLayer').innerHTML = '';
  renderCardList();
  updateCount();
  deselect();
}

// ── Events ─────────────────────────────────────────────────────────────────────

function bindEvents() {
  document.getElementById('matrix').addEventListener('click', onMatrixClick);
  document.getElementById('btnGrid').addEventListener('click', toggleGrid);
  document.getElementById('btnResult').addEventListener('click', toggleResultMode);

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

  document.getElementById('btnAddSkill').addEventListener('click', () => {
    const form = document.getElementById('addSkillForm');
    form.classList.toggle('hidden');
    if (!form.classList.contains('hidden')) document.getElementById('addSkillName').focus();
  });

  document.getElementById('btnConfirmAdd').addEventListener('click', () => {
    const name = document.getElementById('addSkillName').value;
    const catId = document.getElementById('addSkillCat').value;
    if (!name.trim()) { document.getElementById('addSkillName').focus(); return; }
    addCustomSkill(name, catId);
    document.getElementById('addSkillName').value = '';
    document.getElementById('addSkillForm').classList.add('hidden');
  });

  document.getElementById('btnCancelAdd').addEventListener('click', () => {
    document.getElementById('addSkillForm').classList.add('hidden');
    document.getElementById('addSkillName').value = '';
  });

  document.getElementById('addSkillName').addEventListener('keydown', e => {
    if (e.key === 'Enter') document.getElementById('btnConfirmAdd').click();
    if (e.key === 'Escape') document.getElementById('btnCancelAdd').click();
  });

  document.addEventListener('keydown', e => { if (e.key === 'Escape') deselect(); });

  document.getElementById('overlay').addEventListener('click', e => {
    if (e.target === e.currentTarget)
      document.getElementById('overlay').classList.add('hidden');
  });
}

// ── Start ──────────────────────────────────────────────────────────────────────

init();
