/**
 * Vector template function.
 * Returns HTML to display the related vector graphic stored in the graphics folder.
 *
 * Usage:
 *
 * ${vector("Name of the vector graphic without its extension")}
 *
 * @param alt
 * @returns {string}
 */
function vector(alt) {
    return '<img src="graphics/' + alt + '.svg" alt="' + alt + '">';
}
