/**
 * Gallery template function.
 * Returns HTML to display the related image gallery.
 *
 * Usage:
 *
 * ${gallery()}
 *
 * @returns {string}
 */
function gallery(offset, limit) {
    let images = [];
    let raw;
    for (i = 0; i < 50; i++) {
        raw = getComputedStyle(document.documentElement).getPropertyValue(`--gallery-${i}`);
        if (raw) {
          const match = raw.match(/url\(([^)]+)\)/);
          if (match && match[1]) {
              images.push(match[1].replace('../', ''));
          }
        }
    }
    if (!images.length) {
        return '';
    }
    if (typeof offset === 'undefined') {
        offset = 0;
    }
    if (typeof limit === 'undefined') {
        limit = images.length - offset;
    }
    let classes = ['gallery'];
    if ((limit - offset) > 1) {
      classes.push('multiple');
    }
    else {
      classes.push('solo');
    }
    let html = `<div class="${classes.join(' ')}">`;
    for (let i = offset; i < (offset + limit); i++) {
        if (images[i]) {
            html += `<img src="${images[i].replace('../', '')}">`;
        }
    }
    html += '</div>';
    return html;
}
