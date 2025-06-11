/**
 * Social Links template function.
 * Returns HTML to display the social links.
 *
 * Usage:
 *
 * ${ socials }
 *
 * @returns {string}
 */
function socials() {
    if (typeof social_links === 'undefined' || !Array.isArray(social_links) || social_links.length === 0) {
        return '';
    }
    let html = '<div class="socials"><ul class="socials-list">';
    social_links.forEach((social) => {
        let icon;
        if (social.includes('facebook')) {
            icon = 'facebook';
        } else if (social.includes('bluesky')) {
            icon = 'bluesky';
        } else if (social.includes('twitter')) {
            icon = 'x';
        } else if (social.includes('instagram')) {
            icon = 'instagram';
        } else if (social.includes('youtube')) {
            icon = 'youtube';
        } else if (social.includes('tiktok')) {
            icon = 'tiktok';
        } else if (social.includes('x')) {
            icon = 'x';
        } else {
            icon = 'globe';
        }
        html += `<li class="socials-item"><a href="${social}" target="_blank" rel="noopener noreferrer" class="socials-link"><img src="images/${icon}.svg"></i></a></li>`;
    });
    html += '</ul></div>';
    return html;
}
