// ═══════════ MAIN APP LOGIC ═══════════

let db = null;
let currentLesson = 0;
let currentView = 'splash'; // 'splash', 'map', 'lesson', 'achievements'
let hintVisible = false;
let hintUsedThisLesson = false;
let tutorialStep = 0;
let tutorialActive = false;
let tutorialTimers = [];

// State persisted to localStorage
let state = {
  completed: new Set(),
  xp: 0,
  streak: 0,
  noHintCount: 0,
  unlockedAchievements: new Set(),
  firstVisit: true
};

const allLessons = CHAPTERS.flatMap(c => c.lessons);
const TOTAL_XP = allLessons.reduce((s, l) => s + l.xp, 0);

// ═══════════ PERSISTENCE ═══════════
function saveState() {
  const data = {
    completed: [...state.completed],
    xp: state.xp,
    streak: state.streak,
    noHintCount: state.noHintCount,
    unlockedAchievements: [...state.unlockedAchievements],
    firstVisit: false
  };
  localStorage.setItem('sql_learn_state', JSON.stringify(data));
}

function loadState() {
  try {
    const raw = localStorage.getItem('sql_learn_state');
    if (raw) {
      const data = JSON.parse(raw);
      state.completed = new Set(data.completed || []);
      state.xp = data.xp || 0;
      state.streak = data.streak || 0;
      state.noHintCount = data.noHintCount || 0;
      state.unlockedAchievements = new Set(data.unlockedAchievements || []);
      state.firstVisit = data.firstVisit !== false ? true : false;
    }
  } catch (e) { /* fresh start */ }
}

// ═══════════ XP BAR ═══════════
function updateXPBar() {
  const pct = Math.min(100, (state.xp / TOTAL_XP) * 100);
  document.querySelector('.xp-fill').style.width = pct + '%';
  document.querySelector('.xp-text').textContent = `${state.xp} XP`;
  document.querySelector('.streak-badge').innerHTML = `🔥 ${state.streak}`;
}

// ═══════════ VIEW SWITCHING ═══════════
function showView(name) {
  currentView = name;
  document.querySelectorAll('.view').forEach(v => {
    v.classList.remove('visible');
    v.classList.add('hidden');
  });
  const target = document.getElementById(name + '-view');
  if (target) {
    target.classList.remove('hidden');
    target.classList.add('visible');
  }

  // Show/hide nav buttons
  const mapBtn = document.getElementById('nav-map-btn');
  const achBtn = document.getElementById('nav-achievements-btn');
  if (name === 'map') {
    mapBtn.style.display = 'none';
    achBtn.style.display = '';
  } else if (name === 'achievements') {
    mapBtn.style.display = '';
    achBtn.style.display = 'none';
  } else {
    mapBtn.style.display = '';
    achBtn.style.display = '';
  }
}

// ═══════════ SPLASH ═══════════
function dismissSplash() {
  document.getElementById('splash-overlay').classList.add('hidden');
  state.firstVisit = false;
  saveState();
  showView('map');
}

// ═══════════ LEVEL MAP ═══════════
function buildMap() {
  const container = document.getElementById('map-content');
  container.innerHTML = '';

  CHAPTERS.forEach((ch, chIdx) => {
    const section = document.createElement('div');
    section.className = 'chapter-section';

    const completedInChapter = ch.lessons.filter(l => state.completed.has(l.id)).length;

    section.innerHTML = `
      <div class="chapter-header">
        <div class="chapter-icon" style="background:${ch.color}22; color:${ch.color}; border:1px solid ${ch.color}44;">${ch.icon}</div>
        <div class="chapter-title" style="color:${ch.color}">${ch.name}</div>
        <div class="chapter-progress">${completedInChapter} / ${ch.lessons.length}</div>
      </div>
    `;

    const grid = document.createElement('div');
    grid.className = 'lesson-grid';

    ch.lessons.forEach(l => {
      const node = document.createElement('div');
      node.className = 'map-node' + (state.completed.has(l.id) ? ' completed' : '');
      node.onclick = () => { currentLesson = l.id; loadLesson(); showView('lesson'); openTutorial(); };
      node.innerHTML = `
        <div class="map-node-num">#${l.id + 1}</div>
        <div class="map-node-title">${l.title}</div>
        <div class="map-node-xp">+${l.xp} XP</div>
      `;
      grid.appendChild(node);
    });

    section.appendChild(grid);
    container.appendChild(section);
  });
}

// ═══════════ ACHIEVEMENTS ═══════════
function buildAchievements() {
  const grid = document.getElementById('achievements-grid');
  grid.innerHTML = '';

  ACHIEVEMENTS.forEach(a => {
    const card = document.createElement('div');
    const unlocked = state.unlockedAchievements.has(a.id);
    card.className = 'achievement-card ' + (unlocked ? 'unlocked' : 'locked');
    card.innerHTML = `
      <div class="achievement-emoji">${a.emoji}</div>
      <div class="achievement-name">${a.name}</div>
      <div class="achievement-desc">${a.desc}</div>
    `;
    grid.appendChild(card);
  });
}

function checkAchievements() {
  ACHIEVEMENTS.forEach(a => {
    if (!state.unlockedAchievements.has(a.id) && a.check(state)) {
      state.unlockedAchievements.add(a.id);
      showToast(`🏅 Achievement: ${a.name}`, 'achievement');
    }
  });
}

// ═══════════ LESSON LOADING ═══════════
function loadLesson() {
  const l = allLessons[currentLesson];
  document.getElementById('lesson-num').textContent = `#${l.id + 1} of ${allLessons.length}`;
  document.getElementById('lesson-title-main').textContent = l.title;
  document.getElementById('lesson-desc').innerHTML = l.desc;
  document.getElementById('lesson-task').innerHTML = `🎯 ${l.task}`;
  document.getElementById('sql-editor').value = '';
  document.getElementById('sql-editor').placeholder = 'Write your SQL query here...';
  document.getElementById('feedback').textContent = '';
  document.getElementById('feedback').className = '';
  document.getElementById('results-table').style.display = 'none';
  document.getElementById('empty-msg').style.display = 'block';
  document.getElementById('empty-msg').textContent = 'Run a query to see results here.';
  hintVisible = false;
  hintUsedThisLesson = false;
  document.getElementById('hint-box').style.display = 'none';

  // Nav arrows
  document.getElementById('prev-btn').disabled = currentLesson <= 0;
  document.getElementById('next-btn').disabled = currentLesson >= allLessons.length - 1;

  // Schema chips
  renderSchemaChips(l.schema);

  // Init DB for running queries
  initDB(l.seed);

  // Create a separate DB for visual rendering (so user queries don't alter visuals)
  if (window._visDB) { window._visDB.close(); }
  window._visDB = new SQL.Database();
  if (l.seed) window._visDB.run(l.seed);

  // Render visual tables
  renderVisualTables(l);
}

function renderSchemaChips(schema) {
  const bar = document.getElementById('schema-bar');
  bar.innerHTML = '';
  for (const [tbl, cols] of Object.entries(schema)) {
    const chip = document.createElement('div');
    chip.className = 'schema-chip';
    chip.textContent = tbl;

    const tooltip = document.createElement('div');
    tooltip.className = 'schema-tooltip';
    cols.forEach(c => {
      const parts = c.split(' ');
      tooltip.innerHTML += `<div>${parts[0]} <span>${parts.slice(1).join(' ')}</span></div>`;
    });

    chip.appendChild(tooltip);
    bar.appendChild(chip);
  }
}

function initDB(seed) {
  if (db) { db.close(); db = null; }
  db = new SQL.Database();
  if (seed) db.run(seed);
}

// ═══════════ QUERY EXECUTION ═══════════
function runQuery() {
  const sql = document.getElementById('sql-editor').value.trim();
  if (!sql) return;
  const fb = document.getElementById('feedback');
  const emptyMsg = document.getElementById('empty-msg');
  const tbl = document.getElementById('results-table');
  const l = allLessons[currentLesson];

  try {
    const res = db.exec(sql);

    // For DML/DDL, validate differently
    if (l.visType === 'dml' || l.visType === 'ddl') {
      if (l.validate([], [], db)) {
        onLessonComplete(l);
        fb.textContent = '✓ Correct! Well done.';
        fb.className = 'win';
      } else {
        if (res.length === 0) {
          emptyMsg.style.display = 'block';
          emptyMsg.textContent = 'Query executed. Check if it meets the task requirements.';
          tbl.style.display = 'none';
          fb.textContent = 'Not quite right. Try again!';
          fb.className = 'err';
        }
      }

      // Show current table state after DML
      try {
        const tables = Object.keys(l.schema);
        const checkTable = tables[0] || 'employees';
        const after = db.exec(`SELECT * FROM ${checkTable}`);
        if (after.length) {
          renderResultTable(after[0].columns, after[0].values);
        }
      } catch(e) {}
      return;
    }

    if (!res.length) {
      emptyMsg.style.display = 'block';
      emptyMsg.textContent = 'Query ran successfully. No rows returned.';
      tbl.style.display = 'none';
      fb.textContent = 'No rows returned.';
      fb.className = 'ok';
      return;
    }

    const { columns, values } = res[0];
    renderResultTable(columns, values);

    // Animate visuals
    animateQueryResult(l, columns, values);

    if (l.validate(columns, values, db)) {
      onLessonComplete(l);
      fb.textContent = '✓ Correct! Well done.';
      fb.className = 'win';
    } else {
      fb.textContent = `${values.length} row${values.length !== 1 ? 's' : ''} returned. Not quite right.`;
      fb.className = '';
    }
  } catch (e) {
    emptyMsg.style.display = 'block';
    emptyMsg.textContent = e.message;
    tbl.style.display = 'none';
    fb.textContent = 'Error in query.';
    fb.className = 'err';
  }
}

function renderResultTable(columns, values) {
  const emptyMsg = document.getElementById('empty-msg');
  const tbl = document.getElementById('results-table');
  emptyMsg.style.display = 'none';
  tbl.style.display = 'table';
  tbl.innerHTML = '<thead><tr>' + columns.map(c => `<th>${c}</th>`).join('') + '</tr></thead>' +
    '<tbody>' + values.map(row => '<tr>' + row.map(v => `<td>${v ?? 'NULL'}</td>`).join('') + '</tr>').join('') + '</tbody>';
}

// ═══════════ LESSON COMPLETE ═══════════
function onLessonComplete(lesson) {
  if (state.completed.has(lesson.id)) return; // Already done

  state.completed.add(lesson.id);
  state.xp += lesson.xp;
  state.streak++;

  if (!hintUsedThisLesson) {
    state.noHintCount++;
  }

  checkAchievements();
  updateXPBar();
  saveState();

  // Show toast
  showToast(`+${lesson.xp} XP earned!`, 'xp');

  // Confetti
  launchConfetti();

  // Show completion overlay after a delay
  setTimeout(() => showCompleteOverlay(lesson), 800);
}

function showCompleteOverlay(lesson) {
  const overlay = document.getElementById('complete-overlay');
  overlay.classList.remove('hidden');
  document.getElementById('complete-xp').textContent = `+${lesson.xp} XP`;

  const msgs = ['Awesome! 🎉', 'Nailed it! 💪', 'SQL Wizard! 🧙‍♂️', 'Perfect! ⭐', 'Crushing it! 🔥', 'Brilliant! 🌟'];
  document.getElementById('complete-msg').textContent = msgs[Math.floor(Math.random() * msgs.length)];

  const hasNext = currentLesson < allLessons.length - 1;
  document.getElementById('next-lesson-btn').style.display = hasNext ? '' : 'none';
}

function closeCompleteOverlay() {
  document.getElementById('complete-overlay').classList.add('hidden');
}

function goNextLesson() {
  closeCompleteOverlay();
  if (currentLesson < allLessons.length - 1) {
    currentLesson++;
    loadLesson();
  }
}

function goBackToMap() {
  closeCompleteOverlay();
  buildMap();
  showView('map');
}

// ═══════════ SHOW SOLUTION ═══════════
function showSolution() {
  const l = allLessons[currentLesson];
  document.getElementById('sql-editor').value = l.solution;
  hintUsedThisLesson = true;
}

// ═══════════ TUTORIAL PLAYER ═══════════
function openTutorial() {
  const tut = TUTORIALS[currentLesson];
  if (!tut) return;
  tutorialStep = 0;
  tutorialActive = true;
  clearTutorialTimers();
  document.getElementById('tutorial-overlay').classList.remove('hidden');
  document.getElementById('tutorial-title').textContent = tut.title;
  renderTutorialDots(tut.steps.length);
  renderTutorialStep();
}

function closeTutorial() {
  tutorialActive = false;
  clearTutorialTimers();
  document.getElementById('tutorial-overlay').classList.add('hidden');
}

function clearTutorialTimers() {
  tutorialTimers.forEach(t => clearTimeout(t));
  tutorialTimers = [];
}

function tutNext() {
  const tut = TUTORIALS[currentLesson];
  if (!tut) return;
  if (tutorialStep < tut.steps.length - 1) {
    tutorialStep++;
    renderTutorialStep();
  } else {
    closeTutorial();
  }
}

function tutPrev() {
  if (tutorialStep > 0) {
    tutorialStep--;
    renderTutorialStep();
  }
}

function renderTutorialDots(count) {
  const dots = document.getElementById('tutorial-dots');
  dots.innerHTML = '';
  for (let i = 0; i < count; i++) {
    const dot = document.createElement('div');
    dot.className = 'tut-dot';
    dots.appendChild(dot);
  }
}

function updateTutorialDots() {
  const dots = document.querySelectorAll('.tut-dot');
  dots.forEach((d, i) => {
    d.className = 'tut-dot' + (i === tutorialStep ? ' active' : (i < tutorialStep ? ' done' : ''));
  });
}

function renderTutorialStep() {
  const tut = TUTORIALS[currentLesson];
  if (!tut) return;
  const step = tut.steps[tutorialStep];
  clearTutorialTimers();

  // Update dots
  updateTutorialDots();

  // Update nav buttons
  document.getElementById('tut-prev-btn').disabled = tutorialStep === 0;
  const isLast = tutorialStep === tut.steps.length - 1;
  document.getElementById('tut-next-btn').textContent = isLast ? '✨ Start Exercise' : 'Next →';

  // Render text
  const textEl = document.getElementById('tutorial-text');
  textEl.innerHTML = step.text;
  textEl.style.animation = 'none';
  textEl.offsetHeight; // reflow
  textEl.style.animation = 'tutFadeIn 0.4s ease';

  // Render visual
  const visEl = document.getElementById('tutorial-visual');
  visEl.innerHTML = '';
  visEl.style.animation = 'none';
  visEl.offsetHeight;
  visEl.style.animation = 'tutFadeIn 0.5s ease 0.1s both';

  switch (step.visual) {
    case 'diagram':
      renderTutDiagram(visEl, step);
      break;
    case 'code':
      renderTutCode(visEl, step);
      break;
    case 'table':
      renderTutTable(visEl, step);
      break;
    case 'table-highlight':
      renderTutTableHighlight(visEl, step);
      break;
    case 'table-filter':
      renderTutTableFilter(visEl, step);
      break;
    case 'table-transform':
      renderTutTransform(visEl, step);
      break;
    case 'table-sort':
      renderTutTableSort(visEl, step);
      break;
    case 'table-limit':
      renderTutTableLimit(visEl, step);
      break;
    case 'table-aggregate':
      renderTutTableAggregate(visEl, step);
      break;
    case 'table-group':
      renderTutTableGroup(visEl, step);
      break;
    case 'table-rename':
      renderTutTableRename(visEl, step);
      break;
    case 'table-dml':
      renderTutTableDML(visEl, step);
      break;
    case 'two-tables':
      renderTutTwoTables(visEl, step);
      break;
    case 'join-anim':
      renderTutJoinAnim(visEl, step);
      break;
    default:
      break;
  }
}

// ═══════════ TUTORIAL VISUAL RENDERERS ═══════════

function getTutTableData(tableName) {
  const lesson = allLessons[currentLesson];
  try {
    const tempDB = new SQL.Database();
    if (lesson.seed) tempDB.run(lesson.seed);
    const res = tempDB.exec('SELECT * FROM ' + tableName);
    tempDB.close();
    if (res.length) return { columns: res[0].columns, values: res[0].values };
  } catch(e) {}
  return { columns: [], values: [] };
}

function buildTutTable(tableName, opts = {}) {
  const data = getTutTableData(tableName);
  const wrap = document.createElement('div');
  wrap.className = 'tut-table-wrap';

  const label = document.createElement('div');
  label.className = 'tut-table-label';
  label.textContent = '⊞ ' + tableName;
  wrap.appendChild(label);

  const table = document.createElement('table');
  table.className = 'tut-table';
  table.dataset.name = tableName;

  const thead = document.createElement('thead');
  thead.innerHTML = '<tr>' + data.columns.map(c => '<th>' + c + '</th>').join('') + '</tr>';
  table.appendChild(thead);

  const tbody = document.createElement('tbody');
  data.values.forEach((row, idx) => {
    const tr = document.createElement('tr');
    tr.dataset.rowIdx = idx;
    row.forEach((val, ci) => {
      const td = document.createElement('td');
      td.textContent = val === null ? 'NULL' : val;
      td.dataset.colIdx = ci;
      if (val === null) td.style.opacity = '0.4';
      tr.appendChild(td);
    });
    tbody.appendChild(tr);
  });
  table.appendChild(tbody);
  wrap.appendChild(table);
  return { wrap, table, data };
}

function renderTutDiagram(container, step) {
  const div = document.createElement('div');
  div.className = 'tut-diagram';
  div.innerHTML = step.diagram.content;
  container.appendChild(div);
}

function renderTutCode(container, step) {
  const block = document.createElement('div');
  block.className = 'tut-code-block';
  block.innerHTML = step.code;
  container.appendChild(block);
  if (step.annotation) {
    const ann = document.createElement('div');
    ann.className = 'tut-code-annotation';
    ann.textContent = step.annotation;
    block.appendChild(ann);
  }
}

function renderTutTable(container, step) {
  const tName = step.table || Object.keys(allLessons[currentLesson].schema)[0];
  const { wrap, table, data } = buildTutTable(tName);
  container.appendChild(wrap);

  if (step.highlightAll) {
    const rows = table.querySelectorAll('tbody tr');
    rows.forEach((tr, i) => {
      tutorialTimers.push(setTimeout(() => tr.classList.add('tut-highlight'), i * 100));
    });
  }
}

function renderTutTableHighlight(container, step) {
  const tName = step.table || Object.keys(allLessons[currentLesson].schema)[0];
  const { wrap, table, data } = buildTutTable(tName);
  container.appendChild(wrap);

  if (step.highlightRows === 'all' && step.highlightCols === 'all') {
    // Sweep highlight all rows
    const rows = table.querySelectorAll('tbody tr');
    rows.forEach((tr, i) => {
      tutorialTimers.push(setTimeout(() => tr.classList.add('tut-highlight'), i * 150));
    });
  }

  if (step.dimCols) {
    const ths = table.querySelectorAll('thead th');
    step.dimCols.forEach(ci => {
      if (ths[ci]) ths[ci].style.opacity = '0.2';
      table.querySelectorAll('tbody tr').forEach(tr => {
        const td = tr.querySelectorAll('td')[ci];
        if (td) tutorialTimers.push(setTimeout(() => { td.style.opacity = '0.2'; }, 400));
      });
    });
  }

  if (step.highlightCols && Array.isArray(step.highlightCols)) {
    const ths = table.querySelectorAll('thead th');
    step.highlightCols.forEach(ci => {
      if (ths[ci]) {
        ths[ci].style.color = 'var(--accent-cyan)';
        ths[ci].style.background = 'rgba(6,214,160,0.15)';
      }
    });
  }
}

function renderTutTableFilter(container, step) {
  const tName = step.table || Object.keys(allLessons[currentLesson].schema)[0];
  const { wrap, table, data } = buildTutTable(tName);
  container.appendChild(wrap);

  const checkCol = step.checkCol || 0;
  const checkVal = step.checkVal || '';
  const rows = table.querySelectorAll('tbody tr');

  rows.forEach((tr, i) => {
    tutorialTimers.push(setTimeout(() => {
      const cells = tr.querySelectorAll('td');
      const cellVal = cells[checkCol] ? cells[checkCol].textContent : '';
      let passes = false;

      if (checkVal.includes('/')) {
        passes = checkVal.split('/').includes(cellVal);
      } else if (checkVal === 'NULL') {
        passes = cellVal === 'NULL';
      } else if (checkVal.startsWith('!')) {
        passes = cellVal !== checkVal.slice(1);
      } else if (checkVal.startsWith('>')) {
        passes = parseFloat(cellVal) > parseFloat(checkVal.slice(1));
      } else if (checkVal.includes('-') && !isNaN(checkVal.split('-')[0])) {
        const [lo, hi] = checkVal.split('-').map(Number);
        passes = parseFloat(cellVal) >= lo && parseFloat(cellVal) <= hi;
      } else if (checkVal.endsWith('%')) {
        passes = cellVal.startsWith(checkVal.slice(0, -1));
      } else {
        passes = cellVal === checkVal;
      }

      tr.classList.add('tut-check');
      tr.classList.add(passes ? 'tut-pass' : 'tut-fail');
    }, i * 400));
  });
}

function renderTutTransform(container, step) {
  const div = document.createElement('div');
  div.className = 'tut-transform';

  const before = document.createElement('div');
  before.className = 'tut-transform-box before';
  before.innerHTML = '<div class="label">' + (step.before.label || 'Before') + '</div>' +
    '<div class="value">' + (step.before.count || step.before.cols || step.before.data || '?') + '</div>';

  const arrow = document.createElement('div');
  arrow.className = 'tut-transform-arrow';
  arrow.textContent = '→';

  const after = document.createElement('div');
  after.className = 'tut-transform-box after';
  after.innerHTML = '<div class="label">' + (step.after.label || 'After') + '</div>' +
    '<div class="value">' + (step.after.count || step.after.cols || step.after.data || '?') + '</div>';

  div.appendChild(before);
  div.appendChild(arrow);
  div.appendChild(after);
  container.appendChild(div);
}

function renderTutTableSort(container, step) {
  const tName = step.table || Object.keys(allLessons[currentLesson].schema)[0];
  const { wrap, table, data } = buildTutTable(tName);
  container.appendChild(wrap);

  const sortCol = step.sortCol || 0;
  const tbody = table.querySelector('tbody');
  const rows = Array.from(tbody.querySelectorAll('tr'));

  // After a delay, rearrange rows
  tutorialTimers.push(setTimeout(() => {
    const sorted = [...rows].sort((a, b) => {
      const av = parseFloat(a.querySelectorAll('td')[sortCol].textContent) || 0;
      const bv = parseFloat(b.querySelectorAll('td')[sortCol].textContent) || 0;
      return step.sortDir === 'desc' ? bv - av : av - bv;
    });
    tbody.innerHTML = '';
    sorted.forEach((tr, i) => {
      tr.classList.add('tut-sort-move');
      tr.style.animationDelay = (i * 100) + 'ms';
      tbody.appendChild(tr);
    });
  }, 500));
}

function renderTutTableLimit(container, step) {
  const tName = step.table || Object.keys(allLessons[currentLesson].schema)[0];
  const { wrap, table, data } = buildTutTable(tName);
  container.appendChild(wrap);

  const keep = step.keepRows || 3;
  const rows = table.querySelectorAll('tbody tr');
  rows.forEach((tr, i) => {
    tutorialTimers.push(setTimeout(() => {
      if (i < keep) {
        tr.classList.add('tut-highlight');
      } else {
        tr.classList.add('tut-dim');
      }
    }, i * 200));
  });
}

function renderTutTableAggregate(container, step) {
  const tName = step.table || Object.keys(allLessons[currentLesson].schema)[0];
  const { wrap, table, data } = buildTutTable(tName);
  container.appendChild(wrap);

  // Highlight the aggregated column
  if (step.aggCol !== undefined) {
    const ths = table.querySelectorAll('thead th');
    if (ths[step.aggCol]) {
      ths[step.aggCol].style.color = 'var(--accent-cyan)';
      ths[step.aggCol].style.background = 'rgba(6,214,160,0.15)';
    }
  }

  // Show aggregate result below
  if (step.result) {
    tutorialTimers.push(setTimeout(() => {
      const rows = table.querySelectorAll('tbody tr');
      rows.forEach(tr => tr.classList.add('tut-dim'));

      const result = document.createElement('div');
      result.className = 'tut-aggregate-result';
      result.innerHTML = '<div class="label">' + (step.aggType || 'Result').toUpperCase() + '</div>' +
        '<div class="value">' + step.result + '</div>';
      container.appendChild(result);
    }, 800));
  }
}

function renderTutTableGroup(container, step) {
  const tName = step.table || Object.keys(allLessons[currentLesson].schema)[0];
  const { wrap, table, data } = buildTutTable(tName);
  container.appendChild(wrap);

  const groupCol = step.groupCol || 0;
  const rows = table.querySelectorAll('tbody tr');
  const groupMap = {};
  let groupIdx = 0;

  rows.forEach((tr, i) => {
    tutorialTimers.push(setTimeout(() => {
      const cells = tr.querySelectorAll('td');
      const val = cells[groupCol] ? cells[groupCol].textContent : '';
      if (!(val in groupMap)) {
        groupMap[val] = groupIdx;
        groupIdx++;
      }
      tr.classList.add('tut-group-' + groupMap[val]);
    }, i * 250));
  });
}

function renderTutTableRename(container, step) {
  const tName = step.table || Object.keys(allLessons[currentLesson].schema)[0];
  const { wrap, table, data } = buildTutTable(tName);
  container.appendChild(wrap);

  if (step.oldName && step.newName) {
    tutorialTimers.push(setTimeout(() => {
      const ths = table.querySelectorAll('thead th');
      ths.forEach(th => {
        if (th.textContent.toLowerCase() === step.oldName.toLowerCase()) {
          th.style.transition = 'all 0.5s';
          th.style.color = 'var(--accent-cyan)';
          th.style.background = 'rgba(6,214,160,0.15)';
          th.textContent = step.newName;
        }
      });
    }, 600));
  }
}

function renderTutTableDML(container, step) {
  const tName = step.table || Object.keys(allLessons[currentLesson].schema)[0] || 'employees';
  const { wrap, table, data } = buildTutTable(tName);
  container.appendChild(wrap);

  if (step.action === 'insert' && step.newRow) {
    tutorialTimers.push(setTimeout(() => {
      const tbody = table.querySelector('tbody');
      const tr = document.createElement('tr');
      tr.className = 'tut-insert';
      step.newRow.forEach(v => {
        const td = document.createElement('td');
        td.textContent = v;
        tr.appendChild(td);
      });
      tbody.appendChild(tr);
    }, 600));
  }

  if (step.action === 'delete' && step.targetRow !== undefined) {
    tutorialTimers.push(setTimeout(() => {
      const rows = table.querySelectorAll('tbody tr');
      if (rows[step.targetRow]) {
        rows[step.targetRow].classList.add('tut-delete');
      }
    }, 600));
  }

  if (step.action === 'update' && step.targetRow !== undefined) {
    tutorialTimers.push(setTimeout(() => {
      const rows = table.querySelectorAll('tbody tr');
      if (rows[step.targetRow]) {
        const cells = rows[step.targetRow].querySelectorAll('td');
        if (cells[step.targetCol]) {
          cells[step.targetCol].textContent = step.newVal;
          cells[step.targetCol].classList.add('tut-changed');
          rows[step.targetRow].classList.add('tut-update');
        }
      }
    }, 600));
  }
}

function renderTutTwoTables(container, step) {
  const tables = step.tables || [];
  tables.forEach(tName => {
    const { wrap } = buildTutTable(tName);
    container.appendChild(wrap);
    const spacer = document.createElement('div');
    spacer.style.height = '12px';
    container.appendChild(spacer);
  });
}

function renderTutJoinAnim(container, step) {
  // Show simplified join result description
  const div = document.createElement('div');
  div.className = 'tut-diagram';
  const jt = step.joinType || 'inner';
  const msgs = {
    'inner': 'INNER JOIN: Only matching rows from <span class="hl">both tables</span> appear in the result.',
    'left': 'LEFT JOIN: <span class="hl">All rows from the left table</span> appear. Non-matching right columns show NULL.',
    'self': 'Self Join: The table references <span class="hl">itself</span> using two different aliases.',
    'cross': 'CROSS JOIN: Every combination of rows → <span class="hl">Cartesian product</span>!',
    'multi': 'Multiple JOINs chain together to connect <span class="hl">3+ tables</span> in one query.'
  };
  div.innerHTML = msgs[jt] || msgs['inner'];
  container.appendChild(div);
}

// ═══════════ EVENT BINDINGS ═══════════
function setupEvents() {
  document.getElementById('run-btn').onclick = runQuery;

  document.getElementById('sql-editor').addEventListener('keydown', e => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') { e.preventDefault(); runQuery(); }
    // Tab indentation
    if (e.key === 'Tab') {
      e.preventDefault();
      const ta = e.target;
      const start = ta.selectionStart;
      ta.value = ta.value.substring(0, start) + '  ' + ta.value.substring(ta.selectionEnd);
      ta.selectionStart = ta.selectionEnd = start + 2;
    }
  });

  document.getElementById('hint-btn').onclick = () => {
    hintVisible = !hintVisible;
    hintUsedThisLesson = true;
    const hb = document.getElementById('hint-box');
    hb.style.display = hintVisible ? 'block' : 'none';
    hb.textContent = '💡 ' + allLessons[currentLesson].hint;
  };

  document.getElementById('solution-btn').onclick = showSolution;

  document.getElementById('back-btn').onclick = () => { buildMap(); showView('map'); };
  document.getElementById('nav-map-btn').onclick = () => { buildMap(); showView('map'); };
  document.getElementById('nav-achievements-btn').onclick = () => { buildAchievements(); showView('achievements'); };

  document.getElementById('prev-btn').onclick = () => {
    if (currentLesson > 0) { currentLesson--; loadLesson(); }
  };
  document.getElementById('next-btn').onclick = () => {
    if (currentLesson < allLessons.length - 1) { currentLesson++; loadLesson(); }
  };

  document.getElementById('splash-start').onclick = dismissSplash;
  document.getElementById('next-lesson-btn').onclick = goNextLesson;
  document.getElementById('back-to-map-btn').onclick = goBackToMap;

  // Tutorial events
  document.getElementById('learn-btn').onclick = openTutorial;
  document.getElementById('tutorial-skip').onclick = closeTutorial;
  document.getElementById('tut-next-btn').onclick = tutNext;
  document.getElementById('tut-prev-btn').onclick = tutPrev;
  // Keyboard nav in tutorial
  document.addEventListener('keydown', e => {
    if (!tutorialActive) return;
    if (e.key === 'ArrowRight' || e.key === 'Enter') { e.preventDefault(); tutNext(); }
    if (e.key === 'ArrowLeft') { e.preventDefault(); tutPrev(); }
    if (e.key === 'Escape') { e.preventDefault(); closeTutorial(); }
  });
}

// ═══════════ BOOT ═══════════
function boot() {
  initSqlJs({
    locateFile: f => `https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.10.2/${f}`
  }).then(SQLLib => {
    window.SQL = SQLLib;
    loadState();
    updateXPBar();
    setupEvents();
    buildMap();
    buildAchievements();

    if (state.firstVisit) {
      showView('map');
      document.getElementById('splash-overlay').classList.remove('hidden');
    } else {
      document.getElementById('splash-overlay').classList.add('hidden');
      showView('map');
    }
  });
}

boot();
