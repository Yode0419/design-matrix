// ── Zone descriptions ──────────────────────────────────────────────────────────

const ZONE_INFO = {
  tl: {
    label: 'Q2: 學習目標',
    quote: '"I like this, but I don\'t know enough yet."',
    desc: '這裡的技能可以優先列為學習目標。在面試中，你能展現對這些領域的既有認識與學習熱忱；比較多份職缺時，也可作為評估工作符合程度的參考依據。',
  },
  tr: {
    label: 'Q1: 再次確認',
    quote: '"Double Check Your Expertise"',
    desc: '仔細重新審視你放到右上象限的技能。許多職涯初期的設計師對自身技能在真實職場中的水準缺乏認知，容易過度自信。請對照各子象限的標準，確認放置位置是否真的準確。',
  },
  bl: {
    label: 'Q3: 不感興趣',
    quote: '"I don\'t like this and I don\'t care."',
    desc: '這些是你不享受、也不想繼續發展的技能。在職缺說明和面試中留意這些項目，確保你在發揮強項。若一份職缺列出超過兩項這類技能作為職責，建議避免申請。',
  },
  br: {
    label: 'Q4: 可支援',
    quote: '"I\'m good at this and I will do it if I have to."',
    desc: '這些技能你能做、但沒有熱情。必要時可以支援團隊。在求職時提及這些技能，可以作為與其他候選人產生差異化的競爭亮點。',
  },
  danger: {
    label: '危險地帶',
    quote: 'Watch out for your "Danger Zone"',
    desc: '這些技能令你興奮，足以讓你分心於日常工作職責，甚至阻礙核心技能的精進。若想投入學習，請先制定清楚的策略，再有計畫地執行，而不是盲目追求有趣的事物。',
  },
  sweet: {
    label: '甜蜜點',
    quote: '"I\'m great at these things, and I would almost do them for free."',
    desc: '落在甜蜜點的技能是你最重要的核心——你擅長且熱愛持續深耕。在履歷、作品集和面試中以這些技能為核心主動呈現，找到令你興奮又有挑戰性的工作。Cherry on Top 圓圈內是你的絕對強項：你享受做這些事、能幫助他人學習，甚至可以在你熱愛的專案中志願貢獻！',
  },
};

// ── State ──────────────────────────────────────────────────────────────────────

const LS_KEY    = 'dsm_placements_v1';
const LS_COLLAPSED = 'dsm_collapsed_v1';
let placements   = {};     // { skillId: { x, y } }  x/y in 0–100 %
let selectedId   = null;
let activeDotId  = null;   // dot showing its remove button
let resultMode   = false;
let activeZone   = null;   // zone currently highlighted ('tl'|'danger'|'tr'|'bl'|'br'|null)
let gridVisible  = false;
let collapsed    = {};     // { catId: true } — persisted
let highlightCat = null;   // category id being highlighted on matrix
let axisHelpVisible = false;

// ── Init ───────────────────────────────────────────────────────────────────────

async function init() {
  loadStorage();
  await decodeStateFromHash();
  renderAxisNumbers();
  renderCardList();
  renderAllDots();
  updateCount();
  updateZoneCounts();
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
  placements[id] = { x: round1(x), y: round1(y) };
  save();
  removeDotEl(id);
  addDot(id, x, y);
  updateCardItem(id);
  updateCount();
  updateZoneCounts();
}

function removePlacement(id) {
  delete placements[id];
  save();
  removeDotEl(id);
  if (selectedId === id) deselect();
  updateCardItem(id);
  updateCount();
  updateZoneCounts();
}

// ── Result Mode ────────────────────────────────────────────────────────────────

function setResultMode(on) {
  resultMode = on;
  if (!resultMode && activeZone) clearZoneFocus();
  if (!resultMode) hideZoneInfoCard();
  document.body.classList.toggle('result-mode', resultMode);
  document.getElementById('btnEdit').classList.toggle('hidden', !resultMode);
  document.getElementById('btnResult').classList.toggle('hidden', resultMode);
}

function toggleResultMode() { setResultMode(!resultMode); }

function toggleZoneFocus(zone) {
  if (activeZone === zone) { clearZoneFocus(); return; }
  if (activeZone) document.body.classList.remove(`zone-focus-${activeZone}`);
  activeZone = zone;
  document.body.classList.add('zone-focused', `zone-focus-${zone}`);
  document.querySelectorAll('.zone-btn').forEach(b => {
    b.classList.toggle('active', b.dataset.zone === zone);
  });
  showZoneInfoCard(zone);
}

function clearZoneFocus() {
  if (activeZone) document.body.classList.remove(`zone-focus-${activeZone}`);
  document.body.classList.remove('zone-focused');
  activeZone = null;
  document.querySelectorAll('.zone-btn').forEach(b => b.classList.remove('active'));
  hideZoneInfoCard();
}

function positionZoneCard(zone, card) {
  const panel = document.querySelector('.matrix-panel');
  const zoneEl = zone === 'sweet'
    ? document.querySelector('.sweet-spot-ellipse')
    : document.querySelector('.zone-' + zone);
  if (!zoneEl || !panel) return;

  const panelRect = panel.getBoundingClientRect();
  const zoneRect  = zoneEl.getBoundingClientRect();
  const GAP = 12;

  card.style.top    = '';
  card.style.bottom = '';
  card.style.left   = '';
  card.style.right  = '';

  const isTop = ['tl', 'danger', 'tr', 'sweet'].includes(zone);
  if (isTop) {
    card.style.top = (zoneRect.bottom - panelRect.top + GAP) + 'px';
  } else {
    card.style.bottom = (panelRect.bottom - zoneRect.top + GAP) + 'px';
  }

  const isRight = ['tr', 'br', 'sweet'].includes(zone);
  if (isRight) {
    card.style.right = Math.max(14, panelRect.right - zoneRect.right) + 'px';
  } else {
    card.style.left = Math.max(10, zoneRect.left - panelRect.left) + 'px';
  }
}

function showZoneInfoCard(zone) {
  const info = ZONE_INFO[zone];
  if (!info) return;
  const card = document.getElementById('zoneInfoCard');
  card.classList.remove('visible');
  requestAnimationFrame(() => {
    document.getElementById('zoneInfoLabel').textContent = info.label;
    document.getElementById('zoneInfoQuote').textContent = info.quote;
    document.getElementById('zoneInfoDesc').textContent = info.desc;
    card.dataset.zone = zone;
    positionZoneCard(zone, card);
    requestAnimationFrame(() => card.classList.add('visible'));
  });
}

function hideZoneInfoCard() {
  const card = document.getElementById('zoneInfoCard');
  card.classList.remove('visible');
  delete card.dataset.zone;
}

function updateZoneCounts() {
  const counts = { tl: 0, danger: 0, tr: 0, bl: 0, br: 0 };
  Object.values(placements).forEach(({ x, y }) => {
    counts[classifyZone(x, y)]++;
  });
  const sweetCount = Object.values(placements).filter(({ x, y }) => isInSweetSpot(x, y)).length;
  document.getElementById('zcount-danger').textContent = counts.danger;
  document.getElementById('zcount-sweet').textContent  = sweetCount;
  // Q2 focus highlights both tl and danger dots, so count both
  document.getElementById('zcount-tl').textContent = counts.tl + counts.danger;
  document.getElementById('zcount-tr').textContent = counts.tr;
  document.getElementById('zcount-bl').textContent = counts.bl;
  document.getElementById('zcount-br').textContent = counts.br;
}

function toggleAxisHelp() {
  axisHelpVisible = !axisHelpVisible;
  document.body.classList.toggle('axis-help', axisHelpVisible);
  document.getElementById('btnHelp').classList.toggle('active', axisHelpVisible);
  if (axisHelpVisible) positionAxisHelpCards();
}

function positionAxisHelpCards() {
  const panel = document.querySelector('.matrix-panel');
  const matrix = document.getElementById('matrix');
  if (!panel || !matrix) return;

  const panelRect  = panel.getBoundingClientRect();
  const matrixRect = matrix.getBoundingClientRect();
  const GAP = 10;

  const cardY = document.getElementById('axisHelpY');
  cardY.style.top    = (matrixRect.top  - panelRect.top  + GAP) + 'px';
  cardY.style.left   = (matrixRect.left - panelRect.left + GAP) + 'px';
  cardY.style.bottom = '';
  cardY.style.right  = '';

  const cardX = document.getElementById('axisHelpX');
  cardX.style.bottom = (panelRect.bottom - matrixRect.bottom + GAP + 4) + 'px';
  cardX.style.right  = (panelRect.right  - matrixRect.right  + GAP) + 'px';
  cardX.style.top    = '';
  cardX.style.left   = '';
}

function toggleGrid() {
  gridVisible = !gridVisible;
  document.body.classList.toggle('grid-hidden', !gridVisible);
  document.getElementById('btnGrid').classList.toggle('active', gridVisible);
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

// ── Share via URL (binary pack v4) ────────────────────────────────────────────
//
// Binary layout (big-endian, then deflate-raw + base64):
//   1B  version = 4
//   2B  stdCount
//   stdCount × [2B skillId, 2B x×10, 2B y×10]
//   2B  customCount
//   customCount × [2B nameLen, nameLen×B name(UTF-8),
//                  1B catLen,  catLen×B cat(ASCII),
//                  1B hasPos,  if hasPos: 2B x×10, 2B y×10]
//   1B  colorCount
//   colorCount × [1B r, 1B g, 1B b]   (CATEGORIES in order)

function hexToRgb(hex) {
  const n = parseInt(hex.replace('#', ''), 16);
  return [(n >> 16) & 0xff, (n >> 8) & 0xff, n & 0xff];
}

function rgbToHex(r, g, b) {
  return '#' + [r, g, b].map(v => v.toString(16).padStart(2, '0')).join('');
}

async function encodeState() {
  const enc = new TextEncoder();
  const standardIds = new Set(SKILLS.filter(s => !s.custom).map(s => s.id));
  const placed = Object.entries(placements)
    .filter(([id]) => standardIds.has(parseInt(id)));

  const customs = customSkills.map(s => {
    const nameBytes = enc.encode(s.en);
    const catBytes  = enc.encode(s.cat);
    const pos = placements[s.id];
    return { nameBytes, catBytes, pos };
  });

  let size = 1 + 2 + placed.length * 6 + 2;
  for (const { nameBytes, catBytes, pos } of customs)
    size += 2 + nameBytes.length + 1 + catBytes.length + 1 + (pos ? 4 : 0);
  size += 1 + CATEGORIES.length * 3;

  const buf   = new ArrayBuffer(size);
  const view  = new DataView(buf);
  const bytes = new Uint8Array(buf);
  let off = 0;

  view.setUint8(off++, 4);
  view.setUint16(off, placed.length); off += 2;
  for (const [id, pos] of placed) {
    view.setUint16(off, parseInt(id)); off += 2;
    view.setUint16(off, Math.round(pos.x * 10)); off += 2;
    view.setUint16(off, Math.round(pos.y * 10)); off += 2;
  }

  view.setUint16(off, customs.length); off += 2;
  for (const { nameBytes, catBytes, pos } of customs) {
    view.setUint16(off, nameBytes.length); off += 2;
    bytes.set(nameBytes, off); off += nameBytes.length;
    view.setUint8(off++, catBytes.length);
    bytes.set(catBytes, off); off += catBytes.length;
    view.setUint8(off++, pos ? 1 : 0);
    if (pos) {
      view.setUint16(off, Math.round(pos.x * 10)); off += 2;
      view.setUint16(off, Math.round(pos.y * 10)); off += 2;
    }
  }

  view.setUint8(off++, CATEGORIES.length);
  for (const cat of CATEGORIES) {
    const [r, g, b] = hexToRgb(cat.color);
    view.setUint8(off++, r); view.setUint8(off++, g); view.setUint8(off++, b);
  }

  const stream = new Blob([buf]).stream().pipeThrough(new CompressionStream('deflate-raw'));
  const compressed = await new Response(stream).arrayBuffer();
  return btoa(String.fromCharCode(...new Uint8Array(compressed)));
}

async function decodeStateFromHash() {
  const hash = location.hash;
  if (!hash.startsWith('#share=')) return false;
  try {
    const compressed = Uint8Array.from(atob(hash.slice(7)), c => c.charCodeAt(0));
    const stream = new Blob([compressed]).stream().pipeThrough(new DecompressionStream('deflate-raw'));
    const buf   = await new Response(stream).arrayBuffer();
    const view  = new DataView(buf);
    const bytes = new Uint8Array(buf);
    const dec   = new TextDecoder();
    let off = 0;

    if (view.getUint8(off++) !== 4) return false;

    const stdCount = view.getUint16(off); off += 2;
    const newPlacements = {};
    for (let i = 0; i < stdCount; i++) {
      const id = view.getUint16(off); off += 2;
      const x  = view.getUint16(off) / 10; off += 2;
      const y  = view.getUint16(off) / 10; off += 2;
      newPlacements[id] = { x, y };
    }

    customSkills.forEach(s => {
      const i = SKILLS.findIndex(sk => sk.id === s.id);
      if (i !== -1) SKILLS.splice(i, 1);
    });
    customSkills = [];

    const customCount = view.getUint16(off); off += 2;
    let nextId = 10000;
    for (let i = 0; i < customCount; i++) {
      const nameLen = view.getUint16(off); off += 2;
      const name    = dec.decode(bytes.slice(off, off + nameLen)); off += nameLen;
      const catLen  = view.getUint8(off++);
      const cat     = dec.decode(bytes.slice(off, off + catLen)); off += catLen;
      const hasPos  = view.getUint8(off++);
      const skill   = { id: nextId++, en: name, zh: name, cat, custom: true };
      SKILLS.push(skill);
      customSkills.push(skill);
      if (hasPos) {
        const x = view.getUint16(off) / 10; off += 2;
        const y = view.getUint16(off) / 10; off += 2;
        newPlacements[skill.id] = { x, y };
      }
    }

    const colorCount = view.getUint8(off++);
    for (let i = 0; i < colorCount && i < CATEGORIES.length; i++) {
      const r = view.getUint8(off++), g = view.getUint8(off++), b = view.getUint8(off++);
      CATEGORIES[i].color = rgbToHex(r, g, b);
    }
    saveCatColors();

    placements = newPlacements;
    saveCustomSkills();
    save();
    history.replaceState(null, '', location.pathname);
    return true;
  } catch { return false; }
}

function showToast(msg) {
  const toast = document.getElementById('toast');
  toast.textContent = msg;
  toast.classList.add('show');
  clearTimeout(toast._timer);
  toast._timer = setTimeout(() => toast.classList.remove('show'), 2200);
}

async function shareURL() {
  const encoded = await encodeState();
  const url = location.origin + location.pathname + '#share=' + encoded;
  try {
    await navigator.clipboard.writeText(url);
    showToast('連結已複製到剪貼簿');
  } catch {
    const input = document.getElementById('shareUrlInput');
    input.value = url;
    document.getElementById('shareOverlay').classList.remove('hidden');
    input.select();
  }
}

function closeShareModal() {
  document.getElementById('shareOverlay').classList.add('hidden');
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
  showToast('已匯出 JSON');
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
      updateZoneCounts();
      showToast('匯入成功');
    } catch {
      showToast('無法讀取檔案，請確認格式正確');
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
  updateZoneCounts();
  deselect();
  showToast('已清除所有放置紀錄');
}

// ── Events ─────────────────────────────────────────────────────────────────────

function bindEvents() {
  document.getElementById('matrix').addEventListener('click', onMatrixClick);
  document.getElementById('btnHelp').addEventListener('click', toggleAxisHelp);
  document.getElementById('btnGrid').addEventListener('click', toggleGrid);
  document.getElementById('btnEdit').addEventListener('click',   () => setResultMode(false));
  document.getElementById('btnResult').addEventListener('click', () => setResultMode(true));

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

  document.getElementById('btnShare').addEventListener('click', shareURL);
  document.getElementById('btnCopyUrl').addEventListener('click', () => {
    const input = document.getElementById('shareUrlInput');
    navigator.clipboard.writeText(input.value).then(() => {
      const btn = document.getElementById('btnCopyUrl');
      const orig = btn.textContent;
      btn.textContent = '已複製！';
      setTimeout(() => { btn.textContent = orig; }, 1800);
    });
  });
  document.getElementById('btnCloseShare').addEventListener('click', closeShareModal);
  document.getElementById('shareOverlay').addEventListener('click', e => {
    if (e.target === e.currentTarget) closeShareModal();
  });
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

  document.querySelectorAll('.zone-btn').forEach(btn => {
    btn.addEventListener('click', () => toggleZoneFocus(btn.dataset.zone));
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
