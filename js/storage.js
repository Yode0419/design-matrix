// Storage

const LS_CUSTOM     = 'dm-custom';
const LS_CAT_COLORS = 'dm-cat-colors';
let customSkills = [];

function loadStorage() {
  try { placements = JSON.parse(localStorage.getItem(LS_KEY)) || {}; }
  catch { placements = {}; }
  try { collapsed = JSON.parse(localStorage.getItem(LS_COLLAPSED)) || {}; }
  catch { collapsed = {}; }
  try {
    customSkills = JSON.parse(localStorage.getItem(LS_CUSTOM)) || [];
    customSkills.forEach(s => SKILLS.push(s));
  } catch { customSkills = []; }
  try {
    const saved = JSON.parse(localStorage.getItem(LS_CAT_COLORS)) || {};
    Object.entries(saved).forEach(([id, color]) => {
      const cat = CATEGORIES.find(c => c.id === id);
      if (cat) cat.color = color;
    });
  } catch {}
}

function saveCatColors() {
  const map = {};
  CATEGORIES.forEach(c => { map[c.id] = c.color; });
  localStorage.setItem(LS_CAT_COLORS, JSON.stringify(map));
}

function save() {
  localStorage.setItem(LS_KEY, JSON.stringify(placements));
}

function saveCollapsed() {
  localStorage.setItem(LS_COLLAPSED, JSON.stringify(collapsed));
}

function saveCustomSkills() {
  localStorage.setItem(LS_CUSTOM, JSON.stringify(customSkills));
}
