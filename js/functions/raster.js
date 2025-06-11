/**
 * Raster template function.
 * Returns HTML to display the related raster graphic stored in the graphics folder.
 *
 * Usage:
 *
 * ${raster("Name of the raster graphic without its extension")}
 *
 * @param alt
 * @returns {string}
 */
function raster(alt) {
    return '<img src="graphics/' + alt + '.png" alt="' + alt + '">';
}