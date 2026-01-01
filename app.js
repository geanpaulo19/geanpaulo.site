// --- DARK/LIGHT MODE TOGGLE ---
const modeToggle = document.getElementById('modeToggle');
const body = document.body;

// Load saved theme
const savedTheme = localStorage.getItem('theme');
if (savedTheme === 'light') {
  body.classList.add('light-mode');
  modeToggle.textContent = '☀️';
} else {
  modeToggle.textContent = '🌙';
}

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

// CUSTOM CIRCLE CURSOR
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

// --- Quote of the Day ---
const heroAbout = document.querySelector('.hero-about');

fetch('https://proxy.geanpaulofrancois.workers.dev/')
  .then(res => res.json())
  .then(data => {
    const quoteText = data.text || 'Stay motivated!';
    const quoteAuthor = data.author ? ` — ${data.author}` : '';

    // Remove existing quote container if present
    const existingContainer = document.querySelector('.hero-quote-container');
    if (existingContainer) existingContainer.remove();

    // Create container
    const container = document.createElement('div');
    container.className = 'hero-quote-container fade';
    container.style.background = 'rgba(139, 139, 255, 0.05)';
    container.style.borderLeft = '3px solid var(--accent)';
    container.style.padding = '0.75rem 1rem';
    container.style.borderRadius = '8px';
    container.style.marginTop = '1.5rem';
    container.style.display = 'flex';
    container.style.flexDirection = 'column';
    container.style.gap = '0.25rem';
    container.style.opacity = '0';
    container.style.transform = 'translateY(20px)';
    container.style.transition = 'opacity 0.8s ease, transform 0.8s ease';

    // Make width match hero-about
    container.style.maxWidth = heroAbout.offsetWidth + 'px';
    container.style.marginLeft = '0';
    container.style.marginRight = '0';

    // Create title
    const titleElem = document.createElement('p');
    titleElem.className = 'hero-quote-title';
    titleElem.textContent = 'Motivation for the day';
    titleElem.style.fontSize = '0.8rem';
    titleElem.style.fontWeight = '600';
    titleElem.style.color = 'var(--accent)';
    titleElem.style.margin = '0';

    // Create quote
    const quoteElem = document.createElement('p');
    quoteElem.className = 'hero-quote';
    quoteElem.textContent = quoteText + quoteAuthor;
    quoteElem.style.fontSize = '0.85rem';
    quoteElem.style.fontStyle = 'italic';
    quoteElem.style.color = 'var(--muted)';
    quoteElem.style.margin = '0';

    // Append title and quote to container
    container.appendChild(titleElem);
    container.appendChild(quoteElem);

    // Insert container after hero-about
    heroAbout.insertAdjacentElement('afterend', container);

    // Trigger fade-in animation
    requestAnimationFrame(() => {
      container.style.opacity = '1';
      container.style.transform = 'translateY(0)';
    });
  })
  .catch(err => console.error('Quote fetch error:', err));
