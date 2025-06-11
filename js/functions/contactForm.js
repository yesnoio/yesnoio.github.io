/**
 * Contact form function.
 *
 * Usage:
 *
 * ${contactForm("email@example.com")}
 *
 * @returns {string}
 */
function contactForm() {
    let html = "<div id='contact-form'>";
    html += `<form class='simple hidden'>`;
    html += "<label for='name'>Name:</label>";
    html += "<input type='text' id='name' name='name' required>";
    html += "<label for='phone'>Phone:</label>";
    html += "<input type='text' id='phone' name='phone' required>";
    html += "<label for='body'>Message:</label>";
    html += "<textarea id='body' name='body' rows='5' required></textarea>";
    html += "<input type='submit' value='Send'>";
    html += "</form>";
    html += "</div>";
    return html;
}
