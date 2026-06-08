// Storage

const LS_CUSTOM = 'dm-custom';
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
