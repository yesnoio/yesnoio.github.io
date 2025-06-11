/**
 * Columns template function.
 * Returns HTML to display the given content in columns.
 *
 * Usage:
 *
 * ${columns()}
 *
 * @returns {string}
 */
function columns(...cols) {
  let html = '<div class="columns">';
  cols.forEach(function(column, index) {
    html += `<div class='c${index}'>${column}</div>`;
  });
  html += "</div>";
  return html;
}
