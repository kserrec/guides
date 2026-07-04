// tfl-helpers.js — shared template helpers for the TFL curricula.
// Load before curriculum.js on every TFL course page.

// TFL formula syllogism: rows/conclusion are [code, label?] or just a code string
function syl(rows, conclusion) {
  const rowHtml = rows.map(r => {
    const [c, lbl] = Array.isArray(r) ? r : [r, null];
    return `<div class="syl-row"><code>${c}</code>${lbl ? `<span class="syl-label">${lbl}</span>` : ''}</div>`;
  }).join('\n                ');
  const [cc, clbl] = Array.isArray(conclusion) ? conclusion : [conclusion, null];
  return `<div class="syllogism-display">
                ${rowHtml}
                <hr class="syl-divider">
                <div class="syl-row syl-conclusion"><span class="syl-therefore">∴</span><code>${cc}</code>${clbl ? `<span class="syl-label">${clbl}</span>` : ''}</div>
              </div>`;
}

// English-language syllogism display
function engSyl(p1, p2, conc) {
  return `<div class="syllogism-display">
                <div class="syl-row"><span class="syl-label">Premise 1:</span><span class="syl-text">${p1}</span></div>
                <div class="syl-row"><span class="syl-label">Premise 2:</span><span class="syl-text">${p2}</span></div>
                <hr class="syl-divider">
                <div class="syl-row syl-conclusion"><span class="syl-therefore">∴</span><span class="syl-text">${conc}</span></div>
              </div>`;
}

// Simple mc-prompt label + inline formula
function mcPrompt(label, formula) {
  return `<span class="mc-prompt">${label}</span> <code class="mc-expr">${formula}</code>`;
}
