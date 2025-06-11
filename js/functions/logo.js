/**
 * Logo template function.
 * Returns HTML to display the logo graphic stored in the graphics folder.
 *
 * Usage:
 *
 * ${logo()}
 *
 * @param useVector
 *   Whether a vector version of the logo in the graphics folder should be used.
 *   Defaults to true.
 * @returns {string}
 */
function logo(useVector = true) {
    return useVector ? vector('logo') : raster('logo');
}
