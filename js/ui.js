// UI rendering and DOM updates

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

      if (skill.custom) {
        const delBtn = document.createElement('button');
        delBtn.className = 'card-delete-btn';
        delBtn.title = '刪除此技能';
        delBtn.textContent = '✕';
        delBtn.addEventListener('click', e => {
          e.stopPropagation();
          deleteCustomSkill(skill.id);
        });
        item.appendChild(delBtn);
      }

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

function expandAll()   { setAllCollapsed(false); }
function collapseAll() { setAllCollapsed(true);  }

function setAllCollapsed(value) {
  CATEGORIES.forEach(cat => { collapsed[cat.id] = value; });
  saveCollapsed();
  document.querySelectorAll('.cat-group').forEach(g => g.classList.toggle('collapsed', value));
}

function renderAllDots() {
  document.getElementById('dotsLayer').innerHTML = '';
  Object.entries(placements).forEach(([idStr, pos]) => {
    addDot(parseInt(idStr), pos.x, pos.y);
  });
  updateGuides();
}

function renderAxisNumbers() {
  const xAxis = document.getElementById('axisNumbersX');
  const yAxis = document.getElementById('axisNumbersY');
  if (!xAxis || !yAxis) return;

  xAxis.innerHTML = '';
  yAxis.innerHTML = '';

  for (let value = -10; value <= 10; value += 1) {
    const xLabel = document.createElement('span');
    xLabel.style.left = `${(value + 10) * 5}%`;
    xLabel.textContent = value;
    xAxis.appendChild(xLabel);

    const yLabel = document.createElement('span');
    yLabel.style.top = `${(10 - value) * 5}%`;
    yLabel.textContent = value;
    yAxis.appendChild(yLabel);
  }
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
      if (selectedId === id) updateGuides({ x: nx, y: ny });
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

function removeDotEl(id) {
  document.querySelector(`.pdot[data-id="${id}"]`)?.remove();
  updateGuides();
}

function updateGuides(posOverride) {
  const layer = document.getElementById('guideLayer');
  if (!layer) return;

  layer.innerHTML = '';
  if (selectedId === null) return;

  const pos = posOverride ?? placements[selectedId];
  if (!pos) return;

  const x = Math.min(Math.max(pos.x, 1), 99);
  const y = Math.min(Math.max(pos.y, 1), 99);

  const hLine = document.createElement('div');
  hLine.className = 'guide-line guide-line-h';
  hLine.style.left = `${Math.min(x, 50)}%`;
  hLine.style.top = `${y}%`;
  hLine.style.width = `${Math.abs(x - 50)}%`;

  const vLine = document.createElement('div');
  vLine.className = 'guide-line guide-line-v';
  vLine.style.left = `${x}%`;
  vLine.style.top = `${Math.min(y, 50)}%`;
  vLine.style.height = `${Math.abs(y - 50)}%`;

  layer.appendChild(hLine);
  layer.appendChild(vLine);
}

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
  updateGuides();
}

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
