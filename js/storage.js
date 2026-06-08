// Storage

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
