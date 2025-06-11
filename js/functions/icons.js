/**
 * Icons template function.
 *
 * Usage:
 *
 * ${icons({
 *     "youtube": "https://youtube.com"
 * })}
 *
 * @param list
 * @returns {string}
 */
function icons(list) {
    let html = '<div>';
    Object.keys(list).forEach(function(name, link) {
        html += '<a target="_blank" href="' + link +
            '"><i class="fa-brands fa-' + name +
            '"></i><span>' + name +
            '</span></a> ';
    });
    html += '</div>';
    return html;
}
