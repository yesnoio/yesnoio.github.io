let functions = {
    'columns': false,
    'contactForm': false,
    'copyright': false,
    'credit': false,
    'gallery': false,
    'icons': false,
    'logo': false,
    'photo': false,
    'raster': false,
    'slideshow': false,
    'socials': false,
    'vector': false,
};
let markdown = {};
let isNavAnimating = false;

// Set a $-like alias for query selector functionality.
function $(selector) {
    return document.querySelectorAll(selector);
}

/**
 * Stores given Markdown markup into the global markdown object.
 *
 * @param markup
 */
function md(strings, ...values) {
  // Evaluate values: call if function, else keep as is
  const evaluated = values.map(v => (typeof v === 'function' ? v() : v));

  // Join strings + evaluated values to get final markup
  const markup = strings.reduce((acc, str, i) => acc + str + (evaluated[i] ?? ''), '');

  const name = document.currentScript.getAttribute('data-name').replace('_template', '');
  markdown[name] = markup;
}

function changeActiveLink() {
    if (isNavAnimating) {
        return;
    }

    // calculate whether the region is at the top of the viewport
    const regionElements = $('.region');
    let regionIndex = 0;
    regionElements.forEach((regionElement, index) => {
        const rect = regionElement.getBoundingClientRect();
        if (rect.top >= 0 && rect.top < window.innerHeight / 2) {
            regionIndex = index;
        }
    });
    if (regionIndex) {
      if (regionIndex >= navLinks.length) {
        regionIndex = 0;
      }
      navLinks.forEach((link) => link.classList.remove('active'));
      navLinks[regionIndex].classList.add('active');
    }
}

let isAllFunctionsLoadedCalled = false;
function allFunctionsLoaded() {
  isAllFunctionsLoadedCalled = true;
  setTimeout(function() {
    $('.region.loading').forEach(function (regionElement) {
        if (typeof regionElement.id === 'undefined') {
            return;
        }
        if ($('script[data-name=' + regionElement.id +'_template]').length) {
            return;
        }

        const template = 'templates/' + regionElement.id + '.md.js';
        const script = document.createElement('script');
        script.src = template;
        script.setAttribute('data-name', regionElement.id + '_template');
        script.setAttribute('async', true);
        document.body.appendChild(script);
        script.onload = function () {
          let regionContentElement = regionElement.querySelector('.content');
          regionElement.querySelector('.content').innerHTML = marked.parse(markdown[regionElement.id]);
          regionElement.classList.remove('loading');

          // Ensure animate hooks are called, if any.
          Object.keys(functions).forEach(function(func) {
            // Check if there is a related animate function.
            const animateFunction = func + 'Animate';
            if (typeof window[animateFunction] !== 'function') {
              return;
            }

            // Animate matching elements.
            const elements = regionContentElement.querySelectorAll('.' + func);
            if (elements.length) {
              elements.forEach(function(element) {
                window[animateFunction](element);
              });
            }
          });

          let f = 'on' + regionElement.id.charAt(0).toUpperCase() + regionElement.id.slice(1) + 'TemplateLoad';
          if (typeof window[f] === 'function') {
              window[f](regionContentElement);
          }
        };
        script.onerror = function () {
          regionElement.classList.remove('loading');
          regionElement.querySelector('.content')[0].innerHTML = '<pre>' + template + '</pre> load error';
        };
    });
  }, 500);
}

function onContactTemplateLoad(e) {
    const script = document.createElement('script');
    script.src = 'https://littletown.pro/forms/v1/form';
    script.setAttribute('async', true);
    document.body.appendChild(script);
    script.onload = function() {
        initContactForm(e);
    };
    script.onerror = function() {
        let form = e.querySelector('form');
        if (form) {
            form.classList.remove('hidden');
            form.addEventListener('submit', function(event) {
              event.preventDefault();
              if (validateFormData(this)) {
                const to = 'user@example.com';
                const name = encodeURIComponent(this.name.value);
                const body = encodeURIComponent(`${this.body.value}\n\n${this.name.value}\n${this.phone.value}`);
                const mailtoLink = `mailto:${to}?subject=${organizationTitle} inquiry from ${name}&body=${body}`;
                window.location.href = mailtoLink;
              }
            });
        }
    };
}

function getEmptyFields(formData) {
    let fields = [];
    for (let [name, value] of formData.entries()) {
        if (!value.trim()) {
            fields.push(name);
        }
    }
    return fields;
}

function validateFormData(formElement) {
    const formData = new FormData(formElement);
    for (let [name, value] of formData.entries()) {
        if (!value.trim()) {
            alert(`${name} is empty.`);
            return false;
        }
    }
    return true;
}

function getSeason() {
    const date = new Date();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    if ((month === 12 && day >= 21) || (month === 1) || (month === 2) || (month === 3 && day < 20)) {
        return 'winter';
    } else if ((month === 3 && day >= 20) || (month === 4) || (month === 5) || (month === 6 && day < 21)) {
        return 'spring';
    } else if ((month === 6 && day >= 21) || (month === 7) || (month === 8) || (month === 9 && day < 22)) {
        return 'summer';
    } else {
        return 'fall';
    }
}

function getPeriod() {
    const date = new Date();
    const hours = date.getHours();
    if (hours >= 6 && hours < 18) {
        return 'day';
    } else {
        return 'night';
    }
}

function fetchJSON(url, callback) {
    fetch(url, {
        method: 'GET',
        headers: {
            'Accept': 'application/json'
        }
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            callback(null, data);
        })
        .catch(error => {
            callback(error, null);
        });
}

let root = window.location.origin + window.location.pathname;
if (root.endsWith('index.html')) {
    root = root.slice(0, -'index.html'.length);
}

let navLinks;
document.addEventListener("DOMContentLoaded", function() {
    navLinks = document.querySelectorAll('nav a');
    const backgroundWrapper = document.querySelector('body > #background');
    const backgroundImage = backgroundWrapper.querySelector('div');

    // Set background image height to the document body height.
    let i = 0;
    const interval = setInterval(() => {
      backgroundWrapper.style.height = `${document.body.scrollHeight}px`;
      if (i > 20) {
        clearInterval(interval);
      }
      i++;
    }, 100);

    // Adjust backgrounds Y positions based on scroll.
    window.addEventListener('scroll', () => {
        backgroundWrapper.style.height = `${document.body.scrollHeight}px`;
        const isPortrait = window.matchMedia('(orientation: portrait)').matches;
        const content = document.querySelector('body > .content');
        const increment = backgroundImage.offsetHeight / document.body.scrollHeight * -.3;
        if (isPortrait) {
            backgroundImage.style.top = 0;
            content.style.backgroundPosition = 0;
        }
        else {
            const scrolled = window.scrollY;
            backgroundImage.style.top = `${scrolled * increment}px`;
            content.style.backgroundPosition = `0 ${scrolled * -.03}px`;
        }
    });

    const period = getPeriod();

    // Add season & period classes to HTML tag.
    document.documentElement.classList.add(getSeason());
    document.documentElement.classList.add(period);

    // Support night mode selector.
    if (periods.length > 1) {
      const nightModeWrapper = document.querySelector('#nightmode-wrapper');
      nightModeWrapper.style.display = 'block';
      const nightModeCheckbox = nightModeWrapper.querySelector('input#nightmode');
      if (period === 'night') {
        nightModeCheckbox.checked = true;
      }
      nightModeCheckbox.addEventListener('change', function(event) {
          if (event.target.checked) {
              document.documentElement.classList.add('night');
              document.documentElement.classList.remove('day');
          } else {
              document.documentElement.classList.add('day');
              document.documentElement.classList.remove('night');
          }
      });
    }

    // Load template functions.
    const functionKeys = Object.keys(functions);
    functionKeys.forEach(function(func) {
        if ($('script[data-name=' + func +'_function]').length) {
            return;
        }
        const script = document.createElement('script');
        script.src = root + '/js/functions/' + func + '.js';
        script.setAttribute('async', true);
        script.setAttribute('data-name', func + '_function');
        document.body.appendChild(script);
        script.onload = function() {
            functions[func] = true;
            let isAllFunctionsLoaded = true;
            Object.keys(functions).forEach(function(loaded) {
                if (!loaded) {
                    isAllFunctionsLoaded = false;
                }
            });
            if (isAllFunctionsLoaded && !isAllFunctionsLoadedCalled) {
                allFunctionsLoaded();
            }
        };
    });

    // Support making menu active if logo is clicked.
    const nav = document.querySelector('nav');
    nav.querySelectorAll('a').forEach(function(link) {
      link.addEventListener('click', function(event) {
        isNavAnimating = true;
        setTimeout(() => {
          isNavAnimating = false;
        }, 500);

        navLinks.forEach((otherLink) => otherLink.classList.remove('active'));
        event.target.classList.add('active');
        const isLogo = event.target.classList.contains('logo');
        if (isLogo) {
          if (nav.classList.contains('active')) {
            nav.classList.remove('active');
          }
          else {
            nav.classList.add('active');
          }
        }
        else {
          nav.classList.remove('active');
        }
      });
    });
    nav.addEventListener('mouseout', function() {
      nav.classList.remove('active');
    });
    document.addEventListener('click', function(event) {
      if (!nav.contains(event.target) && !event.target.classList.contains('logo')) {
        nav.classList.remove('active');
      }
    });

    // Highlight active region in nav.
    window.addEventListener('scroll', changeActiveLink);
    window.addEventListener('load', changeActiveLink);
});
