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
