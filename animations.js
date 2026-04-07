// ═══════════ VISUAL ANIMATION ENGINE ═══════════

function renderVisualTables(lesson) {
  const area = document.getElementById('visual-area');
  area.innerHTML = '';

  // Label
  const label = document.createElement('div');
  label.className = 'vis-label';
  label.textContent = '📊 Database Tables';
  area.appendChild(label);

  // Render each table from the schema
  const schema = lesson.schema;
  for (const [tblName, cols] of Object.entries(schema)) {
    const wrap = document.createElement('div');
    wrap.className = 'vis-table-wrap';
    wrap.dataset.table = tblName;

    const nameEl = document.createElement('div');
    nameEl.className = 'vis-table-name';
    nameEl.innerHTML = `<span class="icon">⊞</span> ${tblName}`;
    wrap.appendChild(nameEl);

    // Get data from db
    try {
      const res = window._visDB.exec(`SELECT * FROM ${tblName}`);
      if (res.length) {
        const table = document.createElement('table');
        table.className = 'vis-table';
        table.id = `vis-${tblName}`;

        const thead = document.createElement('thead');
        thead.innerHTML = '<tr>' + res[0].columns.map(c => `<th>${c}</th>`).join('') + '</tr>';
        table.appendChild(thead);

        const tbody = document.createElement('tbody');
        res[0].values.forEach((row, idx) => {
          const tr = document.createElement('tr');
          tr.dataset.rowIdx = idx;
          row.forEach(val => {
            const td = document.createElement('td');
            td.textContent = val === null ? 'NULL' : val;
            if (val === null) td.style.opacity = '0.4';
            tr.appendChild(td);
          });
          tbody.appendChild(tr);
        });
        table.appendChild(tbody);
        wrap.appendChild(table);
      }
    } catch (e) { /* empty table is fine */ }

    area.appendChild(wrap);
  }
}

function animateQueryResult(lesson, columns, values) {
  const area = document.getElementById('visual-area');
  const visType = lesson.visType || 'highlight-all';

  // Add arrow and result section
  const arrow = document.createElement('div');
  arrow.className = 'vis-arrow';
  arrow.textContent = '⬇';
  arrow.style.opacity = '0';
  area.appendChild(arrow);
  setTimeout(() => { arrow.style.opacity = '1'; }, 100);

  // Animate source tables based on visType
  switch (visType) {
    case 'filter-rows':
      animateFilter(lesson, columns, values);
      break;
    case 'sort-rows':
      animateSort(lesson, columns, values);
      break;
    case 'limit-rows':
      animateLimit(lesson, columns, values);
      break;
    case 'highlight-cols':
      animateHighlightCols(lesson, columns, values);
      break;
    case 'group-by':
      animateGroupBy(lesson, columns, values);
      break;
    case 'join':
      animateJoin(lesson, columns, values);
      break;
    default:
      break;
  }

  // Render result table with animation
  setTimeout(() => {
    const resultLabel = document.createElement('div');
    resultLabel.className = 'vis-result-label';
    resultLabel.textContent = '✨ Query Result';
    area.appendChild(resultLabel);

    const resultWrap = document.createElement('div');
    resultWrap.className = 'vis-table-wrap';

    const table = document.createElement('table');
    table.className = 'vis-table result-table';

    const thead = document.createElement('thead');
    thead.innerHTML = '<tr>' + columns.map(c => `<th>${c}</th>`).join('') + '</tr>';
    table.appendChild(thead);

    const tbody = document.createElement('tbody');
    values.forEach((row, idx) => {
      const tr = document.createElement('tr');
      tr.className = 'add-row';
      tr.style.animationDelay = `${idx * 80}ms`;
      row.forEach(val => {
        const td = document.createElement('td');
        td.textContent = val === null ? 'NULL' : val;
        if (val === null) td.style.opacity = '0.4';
        tr.appendChild(td);
      });
      tbody.appendChild(tr);
    });
    table.appendChild(tbody);
    resultWrap.appendChild(table);
    area.appendChild(resultWrap);

    // Scroll visual area to show result
    area.scrollTop = area.scrollHeight;
  }, 500);
}

function animateFilter(lesson, columns, values) {
  // Highlight matching rows, dim non-matching
  const tables = document.querySelectorAll('.vis-table:not(.result-table)');
  tables.forEach(table => {
    const tbody = table.querySelector('tbody');
    if (!tbody) return;
    const rows = tbody.querySelectorAll('tr');
    const config = lesson.visConfig || {};

    rows.forEach((tr, idx) => {
      setTimeout(() => {
        // Simple heuristic: if this row index appears in the result values, highlight it
        const cells = tr.querySelectorAll('td');
        let matches = false;

        if (config.filterCol) {
          const headerCells = table.querySelectorAll('thead th');
          let colIdx = -1;
          headerCells.forEach((th, i) => {
            if (th.textContent.toLowerCase() === config.filterCol.toLowerCase()) colIdx = i;
          });
          if (colIdx >= 0 && cells[colIdx]) {
            const cellVal = cells[colIdx].textContent;
            const fv = config.filterVal || '';
            if (fv.includes('/')) {
              matches = fv.split('/').includes(cellVal);
            } else if (fv === 'NULL') {
              matches = cellVal === 'NULL';
            } else if (fv.startsWith('!')) {
              matches = cellVal !== fv.slice(1);
            } else if (fv.startsWith('>')) {
              matches = parseFloat(cellVal) > parseFloat(fv.slice(1));
            } else if (fv.includes('-') && !isNaN(fv.split('-')[0])) {
              const [lo, hi] = fv.split('-').map(Number);
              matches = parseFloat(cellVal) >= lo && parseFloat(cellVal) <= hi;
            } else if (fv.endsWith('%')) {
              matches = cellVal.startsWith(fv.slice(0, -1));
            } else {
              matches = cellVal === fv;
            }
          }
        }

        if (matches) {
          tr.classList.add('highlight-row');
        } else {
          tr.classList.add('dim-row');
        }
      }, idx * 120);
    });
  });
}

function animateSort(lesson, columns, values) {
  const tables = document.querySelectorAll('.vis-table:not(.result-table)');
  tables.forEach(table => {
    const tbody = table.querySelector('tbody');
    if (!tbody) return;
    const rows = Array.from(tbody.querySelectorAll('tr'));
    rows.forEach((tr, idx) => {
      setTimeout(() => {
        tr.classList.add('highlight-row');
        setTimeout(() => tr.classList.remove('highlight-row'), 300);
      }, idx * 150);
    });
  });
}

function animateLimit(lesson, columns, values) {
  const tables = document.querySelectorAll('.vis-table:not(.result-table)');
  tables.forEach(table => {
    const tbody = table.querySelector('tbody');
    if (!tbody) return;
    const rows = tbody.querySelectorAll('tr');
    rows.forEach((tr, idx) => {
      setTimeout(() => {
        if (idx < values.length) {
          tr.classList.add('highlight-row');
        } else {
          tr.classList.add('dim-row');
        }
      }, idx * 120);
    });
  });
}

function animateHighlightCols(lesson, columns, values) {
  const tables = document.querySelectorAll('.vis-table:not(.result-table)');
  tables.forEach(table => {
    const headerCells = table.querySelectorAll('thead th');
    const resultCols = columns.map(c => c.toLowerCase());

    headerCells.forEach((th, colIdx) => {
      const isSelected = resultCols.includes(th.textContent.toLowerCase());
      if (!isSelected) {
        th.style.opacity = '0.3';
        const tbody = table.querySelector('tbody');
        if (tbody) {
          tbody.querySelectorAll('tr').forEach(tr => {
            const cells = tr.querySelectorAll('td');
            if (cells[colIdx]) cells[colIdx].style.opacity = '0.3';
          });
        }
      } else {
        th.style.color = 'var(--accent-cyan)';
        th.style.background = 'rgba(6,214,160,0.15)';
      }
    });
  });
}

function animateGroupBy(lesson, columns, values) {
  const config = lesson.visConfig || {};
  const tables = document.querySelectorAll('.vis-table:not(.result-table)');
  tables.forEach(table => {
    const headerCells = table.querySelectorAll('thead th');
    let colIdx = -1;
    headerCells.forEach((th, i) => {
      if (th.textContent.toLowerCase() === (config.groupCol || '').toLowerCase()) colIdx = i;
    });

    if (colIdx < 0) return;

    const tbody = table.querySelector('tbody');
    if (!tbody) return;
    const rows = tbody.querySelectorAll('tr');
    const colors = ['rgba(6,214,160,0.15)', 'rgba(139,92,246,0.15)', 'rgba(236,72,153,0.15)', 'rgba(59,130,246,0.15)'];
    const groupMap = {};
    let colorIdx = 0;

    rows.forEach((tr, idx) => {
      setTimeout(() => {
        const cells = tr.querySelectorAll('td');
        if (cells[colIdx]) {
          const groupVal = cells[colIdx].textContent;
          if (!(groupVal in groupMap)) {
            groupMap[groupVal] = colors[colorIdx % colors.length];
            colorIdx++;
          }
          cells.forEach(td => { td.style.background = groupMap[groupVal]; });
        }
      }, idx * 150);
    });
  });
}

function animateJoin(lesson, columns, values) {
  const tables = document.querySelectorAll('.vis-table:not(.result-table)');
  if (tables.length >= 2) {
    tables.forEach(table => {
      const tbody = table.querySelector('tbody');
      if (!tbody) return;
      const rows = tbody.querySelectorAll('tr');
      rows.forEach((tr, idx) => {
        setTimeout(() => {
          tr.classList.add('highlight-row');
          setTimeout(() => tr.classList.remove('highlight-row'), 600);
        }, idx * 200);
      });
    });
  }
}

// ═══════════ CONFETTI ═══════════
function launchConfetti() {
  const canvas = document.getElementById('confetti-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const particles = [];
  const colors = ['#06d6a0', '#8b5cf6', '#3b82f6', '#ec4899', '#f59e0b', '#ef4444'];

  for (let i = 0; i < 120; i++) {
    particles.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height * -1,
      w: Math.random() * 8 + 4,
      h: Math.random() * 4 + 2,
      color: colors[Math.floor(Math.random() * colors.length)],
      vx: (Math.random() - 0.5) * 4,
      vy: Math.random() * 4 + 2,
      rotation: Math.random() * 360,
      rotSpeed: (Math.random() - 0.5) * 10,
      opacity: 1
    });
  }

  let frame = 0;
  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    let alive = false;

    particles.forEach(p => {
      if (p.opacity <= 0) return;
      alive = true;
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.08;
      p.rotation += p.rotSpeed;
      if (frame > 60) p.opacity -= 0.012;

      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rotation * Math.PI / 180);
      ctx.globalAlpha = Math.max(0, p.opacity);
      ctx.fillStyle = p.color;
      ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
      ctx.restore();
    });

    frame++;
    if (alive && frame < 200) {
      requestAnimationFrame(animate);
    } else {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  }
  animate();
}

// ═══════════ TOAST SYSTEM ═══════════
function showToast(message, type = 'xp') {
  const container = document.getElementById('toast-container');
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.textContent = message;
  container.appendChild(toast);
  setTimeout(() => toast.remove(), 3000);
}
