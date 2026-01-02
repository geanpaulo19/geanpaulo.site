// --- DARK/LIGHT MODE TOGGLE ---
const modeToggle = document.getElementById('modeToggle');
const body = document.body;

// Detect system preference
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');

// Load saved theme
const savedTheme = localStorage.getItem('theme');
if (savedTheme === 'light') {
  body.classList.add('light-mode');
  modeToggle.textContent = '☀️';
} else if (savedTheme === 'dark') {
  body.classList.remove('light-mode');
  modeToggle.textContent = '🌙';
} else {
  // No saved theme → use system preference
  if (prefersDark.matches) {
    body.classList.remove('light-mode'); // ensure dark
    modeToggle.textContent = '🌙';
  } else {
    body.classList.add('light-mode');
    modeToggle.textContent = '☀️';
  }
}

// Listen for system theme changes if user hasn't manually chosen a theme
prefersDark.addEventListener('change', e => {
  if (!localStorage.getItem('theme')) {
    if (e.matches) {
      body.classList.remove('light-mode');
      modeToggle.textContent = '🌙';
    } else {
      body.classList.add('light-mode');
      modeToggle.textContent = '☀️';
    }
  }
});

// Toggle mode on click with animation
modeToggle.addEventListener('click', () => {
  body.classList.toggle('light-mode');
  const isLight = body.classList.contains('light-mode');
  localStorage.setItem('theme', isLight ? 'light' : 'dark');
  modeToggle.textContent = isLight ? '☀️' : '🌙';

  // Add animate class for rotation & scale effect
  modeToggle.classList.add('animate');
  setTimeout(() => modeToggle.classList.remove('animate'), 400); // remove after animation
});

// --- FETCH PROJECTS AND RENDER ---
fetch('projects.json')
  .then(res => res.json())
  .then(projects => {
    const container = document.getElementById('projects');
    container.classList.add('projects-grid');

    // --- Extract unique tags for filtering ---
    const allTags = new Set();
    projects.forEach(p => p.tags?.forEach(tag => allTags.add(tag)));
    const uniqueTags = Array.from(allTags).sort();

    // --- Create filter container ---
    const filterDiv = document.createElement('div');
    filterDiv.className = 'project-filter';

    // "All" button
    const allBtn = document.createElement('button');
    allBtn.textContent = 'All';
    allBtn.classList.add('active');
    filterDiv.appendChild(allBtn);

    // Tag buttons
    uniqueTags.forEach(tag => {
      const btn = document.createElement('button');
      btn.textContent = tag;
      filterDiv.appendChild(btn);
    });

    // Insert filter below "Selected Work" heading
    const workSection = document.querySelector('.work');
    workSection.insertBefore(filterDiv, container);

    // --- Function to render projects ---
    const renderProjects = (filteredProjects) => {
      container.innerHTML = '';
      filteredProjects.forEach((project, index) => {
        const div = document.createElement('div');
        div.className = 'project fade';
        div.style.animationDelay = `${index * 0.1}s`; // staggered fade-in

        // Create tags HTML
        const tagsHTML = project.tags?.map(tag => `<span class="project-tag">${tag}</span>`).join(' ') || '';

        div.innerHTML = `
          <a href="${project.url}" target="_blank" class="project-link">
            <img class="project-icon" src="${project.image}" alt="${project.title}">
            <div class="project-info">
              <h3>${project.title}</h3>
              <div class="project-tags">
                ${tagsHTML}
              </div>
              <p>${project.description}</p>
            </div>
          </a>
        `;

        container.appendChild(div);
      });
    };

    renderProjects(projects); // initial render

    // --- Filter button click events ---
    filterDiv.querySelectorAll('button').forEach(btn => {
      btn.addEventListener('click', () => {
        filterDiv.querySelectorAll('button').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const tag = btn.textContent;
        const filtered = tag === 'All'
          ? projects
          : projects.filter(p => p.tags?.includes(tag));

        renderProjects(filtered);
      });
    });
  });

// --- CUSTOM CIRCLE CURSOR ---
if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
  const cursor = document.createElement('div');
  cursor.classList.add('cursor');
  document.body.appendChild(cursor);

  // Update cursor position
  document.addEventListener('mousemove', (e) => {
    cursor.style.top = `${e.clientY}px`;
    cursor.style.left = `${e.clientX}px`;
  });

  // Hover effect on clickable elements
  const hoverElements = ['a', '.contact-btn', '.project-link', '.mode-toggle', '.project-filter button'];
  hoverElements.forEach(selector => {
    document.querySelectorAll(selector).forEach(el => {
      el.addEventListener('mouseenter', () => cursor.classList.add('hover'));
      el.addEventListener('mouseleave', () => cursor.classList.remove('hover'));
    });
  });

  // Click effect
  document.addEventListener('mousedown', () => cursor.classList.add('click'));
  document.addEventListener('mouseup', () => cursor.classList.remove('click'));

  // Hide default cursor
  document.body.style.cursor = 'none';
} else {
  // On touch devices, show normal cursor
  document.body.style.cursor = 'auto';
}

// --- Quote of the Day ---
const skillsContainer = document.querySelector('.skills'); // <- change target to skills

fetch('https://proxy.geanpaulofrancois.workers.dev/')
  .then(res => res.json())
  .then(data => {
    const quoteText = data.text || 'Stay motivated!';
    const quoteAuthor = data.author ? ` — ${data.author}` : '';

    // Create title element
    const titleElem = document.createElement('p');
    titleElem.className = 'hero-quote-title fade';
    titleElem.textContent = 'Quote for the day';
    Object.assign(titleElem.style, {
      fontSize: '0.8rem',
      fontWeight: '600',
      color: '#8b8bff',
      marginTop: '1.5rem',
      marginBottom: '0.25rem',
      maxWidth: '600px',
      marginLeft: 'auto',
      marginRight: 'auto',
      textAlign: 'center',
      opacity: '0',
      transform: 'translateY(20px)',
      transition: 'opacity 0.8s ease, transform 0.8s ease'
    });

    // Create quote element
    const quoteElem = document.createElement('p');
    quoteElem.className = 'hero-quote fade';
    quoteElem.textContent = quoteText + quoteAuthor;
    Object.assign(quoteElem.style, {
      fontSize: '0.85rem',
      fontStyle: 'italic',
      color: getComputedStyle(document.body).getPropertyValue('--muted').trim(),
      margin: '0',
      maxWidth: '600px',
      marginLeft: 'auto',
      marginRight: 'auto',
      textAlign: 'center',
      opacity: '0',
      transform: 'translateY(20px)',
      transition: 'opacity 0.8s ease 0.2s, transform 0.8s ease 0.2s, color 0.5s ease'
    });

    // Insert quote **after the skills container**
    skillsContainer.insertAdjacentElement('afterend', titleElem);
    titleElem.insertAdjacentElement('afterend', quoteElem);

    // Trigger fade-in
    requestAnimationFrame(() => {
      titleElem.style.opacity = '1';
      titleElem.style.transform = 'translateY(0)';
      quoteElem.style.opacity = '1';
      quoteElem.style.transform = 'translateY(0)';
    });

    // --- Responsive alignment ---
    const mq = window.matchMedia('(max-width: 600px)');
    const updateAlignment = (e) => {
      if (e.matches) {
        titleElem.style.textAlign = 'left';
        titleElem.style.marginLeft = '0';
        titleElem.style.marginRight = '0';
        quoteElem.style.textAlign = 'left';
        quoteElem.style.marginLeft = '0';
        quoteElem.style.marginRight = '0';
      } else {
        titleElem.style.textAlign = 'center';
        titleElem.style.marginLeft = 'auto';
        titleElem.style.marginRight = 'auto';
        quoteElem.style.textAlign = 'center';
        quoteElem.style.marginLeft = 'auto';
        quoteElem.style.marginRight = 'auto';
      }
    };
    updateAlignment(mq);
    mq.addEventListener('change', updateAlignment);

    // --- Update quote color on mode toggle ---
    const updateQuoteColor = () => {
      quoteElem.style.color = getComputedStyle(document.body).getPropertyValue('--muted').trim();
    };

    updateQuoteColor();
    const modeToggle = document.getElementById('modeToggle');
    modeToggle.addEventListener('click', () => {
      setTimeout(updateQuoteColor, 50);
    });
  })
  .catch(err => console.error('Quote fetch error:', err));

const greetings = [
  "Hello",        // English
  "Hola",         // Spanish
  "Bonjour",      // French
  "Hallo",        // German / Dutch
  "Ciao",         // Italian
  "Olá",          // Portuguese
  "Привет",       // Russian
  "Здравствуйте", // Russian formal
  "こんにちは",    // Japanese
  "안녕하세요",     // Korean
  "你好",         // Mandarin Chinese
  "مرحبا",        // Arabic
  "नमस्ते",       // Hindi
  "Kamusta",      // Filipino / Cebuano
  "Jambo",        // Swahili
  "Yassas",       // Greek
  "Xin chào",     // Vietnamese
  "Hej",          // Swedish / Danish
  "Salam",        // Persian / Uzbek
  "მოგესალმებით",  // Georgian
  "Sawubona",     // Zulu
  "Kia ora",      // Māori
  "Aloha",        // Hawaiian
  "Shalom",       // Hebrew
  "Selamat",      // Malay / Indonesian
  "Cześć",        // Polish
  "Dia dhuit",    // Irish Gaelic
  "Sannu",        // Hausa
  "Sawasdee",     // Thai
  "Hallo",        // Norwegian
  "Tere",         // Estonian
  "Sveiki",       // Latvian / Lithuanian
  "Salut",        // Romanian
  "Halo",         // Indonesian
  "Hei",          // Finnish
  "Mingalaba",    // Burmese
  "Bună",         // Romanian
  "God dag",      // Norwegian / Swedish
  "Shikamoo",     // Swahili formal
  "Salve",        // Latin / Italian archaic
  "Hujambo",      // Swahili alternative
  "Zdravo",       // Serbian / Croatian / Bosnian
  "Sain baina uu",// Mongolian
  "Selam",        // Turkish / Arabic variant
  "Namaskar",     // Nepali
  "Konnichiwa",   // Japanese daytime greeting
  "Goedendag"     // Dutch
];

let index = 0;
const navHello = document.getElementById("navHello");

function rotateGreeting() {
  // fade out
  navHello.style.transition = "opacity 0.5s ease, transform 0.5s ease";
  navHello.style.opacity = 0;
  navHello.style.transform = "translateY(-5px)";

  setTimeout(() => {
    // change text
    navHello.textContent = greetings[index];
    // fade in
    navHello.style.opacity = 1;
    navHello.style.transform = "translateY(0)";
    index = (index + 1) % greetings.length;
  }, 500); // fade duration
}

// initialize
rotateGreeting();
setInterval(rotateGreeting, 5000); // slower rotation (every 5s)

document.addEventListener("DOMContentLoaded", () => {
  const footnotes = [
  "From Manila, with ❤️… and a bit of chaos 💻",
  "Powered by coffee ☕ and occasional panic!",
  "Debugging is my cardio 🏃‍♂️",
  "100% chaos, 0% boredom 🎉",
  "Made with love and mild insomnia 🌙",
  "Turning bugs into features… sometimes 🐛➡️✨",
  "Will code for tacos 🌮",
  "Ctrl + S is my life mantra 💾",
  "Procrastination level: expert 🕰️",
  "Powered by caffeine, curiosity, and chaos ⚡",
  "Pixel perfectionist with slight OCD 🎨",
  "Coffee in one hand, code in the other ☕💻",
  "If it works, it works… if not, debug harder 🔧"
];

  let index = 0;
  const footerSpan = document.querySelector(".footer-rotate");

  if (!footerSpan) return; // extra safety

  setInterval(() => {
    // Fade out
    footerSpan.style.opacity = 0;
    footerSpan.style.transform = "translateY(-5px)";

    setTimeout(() => {
      // Change text
      index = (index + 1) % footnotes.length;
      footerSpan.textContent = footnotes[index];

      // Fade in
      footerSpan.style.opacity = 1;
      footerSpan.style.transform = "translateY(0)";
    }, 500); // match transition duration
  }, 5000); // rotate every 5 seconds
});

/* =========================
   DYNAMIC VH + MODAL FIX FOR MOBILE
========================= */
function setVhProperty() {
  const vh = window.innerHeight * 0.01;
  document.documentElement.style.setProperty('--vh', `${vh}px`);
  updateModalHeight(); // adjust modal heights whenever viewport changes
}

// Set on page load
setVhProperty();

// Update on resize/orientation change
window.addEventListener('resize', setVhProperty);
window.addEventListener('orientationchange', setVhProperty);

/* =========================
   MODAL HEIGHT FIX
========================= */
function updateModalHeight() {
  const vh = window.innerHeight;
  const modalBackdrop = document.querySelector('.modal-backdrop');
  const modalCard = document.querySelector('.modal-card');

  if (modalBackdrop) {
    modalBackdrop.style.height = `${vh}px`;
    modalBackdrop.style.minHeight = '-webkit-fill-available'; // Safari fix
  }
  if (modalCard) modalCard.style.maxHeight = `${vh * 0.8}px`;
}

/* =========================
   ABOUT MODAL LOGIC
========================= */
const modal = document.getElementById("aboutModal");
const openTrigger = document.getElementById("openAbout");
const closeBtn = modal.querySelector(".modal-close");

let mobileOverlay = null;

function createMobileOverlay() {
  if (!mobileOverlay) {
    mobileOverlay = document.createElement("div");
    mobileOverlay.style.position = "fixed";
    mobileOverlay.style.top = 0;
    mobileOverlay.style.left = 0;
    mobileOverlay.style.width = "100vw";
    mobileOverlay.style.height = "100vh";
    mobileOverlay.style.background = "transparent";
    mobileOverlay.style.zIndex = "1999"; // just below modal
    document.body.appendChild(mobileOverlay);
  }
}

function removeMobileOverlay() {
  if (mobileOverlay) {
    mobileOverlay.remove();
    mobileOverlay = null;
  }
}

function openModal() {
  updateModalHeight(); // immediately adjust height
  createMobileOverlay(); // fix persistent bars on mobile

  modal.classList.add("active");
  modal.setAttribute("aria-hidden", "false");

  // Lock scroll only on non-mobile
  if (!/Mobi|Android/i.test(navigator.userAgent)) {
    document.body.style.overflow = "hidden";
  }
}

function closeModal() {
  modal.classList.remove("active");
  modal.setAttribute("aria-hidden", "true");

  removeMobileOverlay();

  // Unlock scroll
  document.body.style.overflow = "";
}

// Open modal when hero name is clicked
openTrigger.addEventListener("click", openModal);

// Close modal when close button is clicked
closeBtn.addEventListener("click", closeModal);

// Close modal when clicking outside the card
modal.addEventListener("click", (e) => {
  if (e.target === modal) closeModal();
});

// Close modal on Escape key
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && modal.classList.contains("active")) closeModal();
});
