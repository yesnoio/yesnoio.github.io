/**
 * Photo template function.
 * Returns HTML to display the related photo stored in the photos folder.
 *
 * Usage:
 *
 * ${photo("Name of the photo without its extension")}
 *
 * @param alt
 * @returns {string}
 */
function photo(alt) {
    return '<img src="photos/' + alt + '.jpg" alt="' + alt + '">';
}
