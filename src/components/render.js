// render.js — takes parsed roast JSON and builds the results UI

function renderResults(data) {
  const resultsSection = document.getElementById('resultsSection');

  // Overall score
  document.getElementById('overallScore').textContent = `${data.overall}/100`;

  // Score cards
  const scoreLabels = {
    hierarchy: 'hierarchy',
    spacing: 'spacing',
    color: 'color',
    typography: 'type',
    contrast: 'contrast',
    ux: 'ux',
  };

  const grid = document.getElementById('scoresGrid');
  grid.innerHTML = '';

  for (const [key, label] of Object.entries(scoreLabels)) {
    const val = data.scores?.[key] ?? 0;
    const tier = val >= 75 ? 'good' : val >= 50 ? 'warn' : 'bad';
    const fillColor = tier === 'good' ? '#5dbb7e' : tier === 'warn' ? '#e8b84b' : '#e85454';

    const card = document.createElement('div');
    card.className = 'score-card';
    card.innerHTML = `
      <span class="score-card-label">${label}</span>
      <span class="score-card-value ${tier}">${val}</span>
      <div class="score-card-bar">
        <div class="score-card-fill" style="width: 0%; background: ${fillColor};" data-target="${val}"></div>
      </div>
    `;
    grid.appendChild(card);
  }

  // Animate bars after render
  requestAnimationFrame(() => {
    setTimeout(() => {
      document.querySelectorAll('.score-card-fill').forEach(bar => {
        bar.style.width = bar.dataset.target + '%';
      });
    }, 100);
  });

  // Summary
  document.getElementById('summaryCard').textContent = `"${data.summary}"`;

  // Issues
  const issuesList = document.getElementById('issuesList');
  issuesList.innerHTML = '';

  (data.issues || []).forEach(issue => {
    const item = document.createElement('div');
    item.className = 'issue-item';
    item.innerHTML = `
      <span class="issue-severity ${issue.severity}">${issue.severity}</span>
      <div class="issue-body">
        <div class="issue-title">${escHtml(issue.title)}</div>
        <div class="issue-desc">${escHtml(issue.description)}</div>
        <div class="issue-fix">${escHtml(issue.fix)}</div>
      </div>
    `;
    issuesList.appendChild(item);
  });

  // Show results
  resultsSection.style.display = 'block';
  resultsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function escHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
