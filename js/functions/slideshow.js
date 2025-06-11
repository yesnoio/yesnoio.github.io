/**
 * Slideshow template function.
 * Returns HTML to display the related image gallery as a slideshow.
 *
 * Usage:
 *
 * ${slideshow()}
 *
 * @returns {string}
 */
function slideshow(start, end) {
    // Create the elements.
    let images = [];
    if (typeof start === 'undefined') {
        start = 0;
        for (i = 0; i < 50; i++) {
            raw = getComputedStyle(document.documentElement).getPropertyValue(`--gallery-${i}`);
            if (raw === '') {
                end = i - 1;
                break;
            }
            const match = raw.match(/url\(([^)]+)\)/);
            if (match && match[1]) {
                images.push(match[1].replace('../', ''));
            }
        }
    }
    else if (typeof end === 'undefined') {
        end = start;
    }
    let html = '<div class="slideshow">';
    for (let i = start; i <= end; i++) {
        html += `<img src="${images[i]}">`;
    }
    html += '</div>';

    return html;
}

/**
 * Slideshow animation function.
 * Automatically animates the slideshow images with a Ken Burns effect.
 */
function slideshowAnimate(slideshow) {
  const images = slideshow.querySelectorAll('img');
  if (images.length === 0) {
    return;
  }
  setSlideshowHeights();

  // Allow or disallow animation based on user interaction.
  let isAnimationAllowed = true;

  // Zoom, pan, fade in & out each image using Ken Burns effect.
  let currentIndex = 0;
  let zoomIn = true;
  images[currentIndex].style.opacity = 1;
  images[currentIndex].style.scale = zoomIn ? 1.3 : 1.1;
  zoomIn = !zoomIn;
  setInterval(() => {
    if (!isAnimationAllowed) {
      return;
    }

    // Fade out, hide & reset the scale of the current image.
    images[currentIndex].style.opacity = 0;
    setTimeout((i) => {
      images[i].style.scale = 1.2;
      images[i].style.transform = 'translate(0, 0)';
    }, 2000, currentIndex);

    // Adjust the index.
    currentIndex = (currentIndex + 1) % images.length;

    // Fade in new current image.
    images[currentIndex].style.opacity = 1;

    // Zoom the new current image in or out.
    images[currentIndex].style.scale = zoomIn ? 1.3 : 1.1;
    zoomIn = !zoomIn;

    // Randomly pan the new current image.
    const panX = (Math.random() - 0.5) * 0.1;
    const panY = (Math.random() - 0.5) * 0.1;
    images[currentIndex].style.transform = `translate(${panX * 100}%, ${panY * 100}%)`;
  }, 6000);

  // Disallow animation if the user has not interacted with the site recently.
  let lastInteractionTime = Date.now();
  function resetInteractionTimer() {
    lastInteractionTime = Date.now();
    isAnimationAllowed = true;
  }
  document.addEventListener('mousemove', resetInteractionTimer);
  document.addEventListener('touchstart', resetInteractionTimer);
  setInterval(() => {
    if (Date.now() - lastInteractionTime > 180000) {
      isAnimationAllowed = false;
    } else {
      isAnimationAllowed = true;
    }
  }, 5000);
}

function setSlideshowHeights() {
  // Set the .slideshow elements to 16:9 aspect ratio.
  document.querySelectorAll('.slideshow').forEach((slideshow) => {
    const width = slideshow.offsetWidth;
    slideshow.style.height = `${(width * 9) / 16}px`;
  });
}
window.addEventListener('resize', setSlideshowHeights);
