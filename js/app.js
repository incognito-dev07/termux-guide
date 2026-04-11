let tutorialData = {};
let isBeginnerPage = window.location.pathname.includes('beginner.html') || window.location.pathname === '/beginner';

async function loadData() {
  try {
    const response = await fetch('/data/tutorials.json');
    const fullData = await response.json();
    if (isBeginnerPage) {
      tutorialData = fullData['beginner-sections'];
    } else {
      tutorialData = fullData['main-sections'];
    }
    initApp();
  } catch (error) {
    console.error('Failed to load tutorial data:', error);
    document.getElementById('contentContainer').innerHTML = '<div class="error">Failed to load content. Please refresh the page.</div>';
  }
}

function renderItem(item) {
  const hasCode = item.code && item.code.trim();
  const highlightedCode = hasCode ? highlightCode(item.code) : '';
  const safeCode = item.code ? item.code.replace(/'/g, "\\'").replace(/"/g, '&quot;') : '';
  
  return `
    <div class="command-card expanded">
      <div class="command-header" onclick="toggleCommand(this)">
        <div class="command-title">
          <i class="fas fa-terminal"></i>
          <span>${escapeHtml(item.title)}</span>
        </div>
        <i class="fas fa-chevron-down command-arrow"></i>
      </div>
      <div class="command-content">
        <p class="command-desc">${escapeHtml(item.description)}</p>
        ${hasCode ? `
          <div class="code-block">
            <div class="code-header">
              <span><i class="fas fa-code"></i></span>
              <button class="copy-code-btn" data-code="${safeCode}">
                <i class="fas fa-copy"></i> Copy
              </button>
            </div>
            <pre><code>${highlightedCode}</code></pre>
          </div>
        ` : ''}
      </div>
    </div>
  `;
}

function renderBeginnerGuideSection() {
  return `
    <div class="section-container" id="section-beginner-guide">
      <div class="section-header">
        <i class="fas fa-graduation-cap"></i>
        <h2>Absolute Beginner Guide</h2>
      </div>
      <p class="section-description">Never used a terminal before? Start here. No prior knowledge needed.</p>
      <div class="goto-beginner">
        <a href="/beginner.html" class="goto-beginner-btn">
          <span><i class="fas fa-arrow-right"></i> Go to Beginner Guide</span>
          <i class="fas fa-chevron-right"></i>
        </a>
      </div>
    </div>
  `;
}

function renderSection(sectionId, section) {
  const itemsHtml = section.items.map(item => renderItem(item)).join('');
  
  return `
    <div class="section-container" id="section-${sectionId}">
      <div class="section-header">
        <i class="fas ${section.icon}"></i>
        <h2>${escapeHtml(section.title)}</h2>
      </div>
      <div class="commands-list">
        ${itemsHtml}
      </div>
    </div>
  `;
}

let currentSearchTerm = '';

function searchContent(searchTerm) {
  if (!searchTerm) {
    document.querySelectorAll('.section-container').forEach(el => el.style.display = '');
    document.querySelectorAll('.command-card').forEach(el => el.style.display = '');
    const noResults = document.querySelector('.no-results');
    if (noResults) noResults.remove();
    return;
  }
  
  const term = searchTerm.toLowerCase();
  let hasResults = false;
  
  document.querySelectorAll('.command-card').forEach(card => {
    const text = card.innerText.toLowerCase();
    if (text.includes(term)) {
      card.style.display = '';
      hasResults = true;
      const section = card.closest('.section-container');
      if (section) section.style.display = '';
    } else {
      card.style.display = 'none';
    }
  });
  
  document.querySelectorAll('.section-container').forEach(section => {
    const visibleCards = section.querySelectorAll('.command-card:not([style*="display: none"])');
    if (visibleCards.length === 0 && section.querySelectorAll('.command-card').length > 0) {
      section.style.display = 'none';
    } else {
      section.style.display = '';
    }
  });
  
  const container = document.getElementById('contentContainer');
  const existingNoResults = document.querySelector('.no-results');
  
  if (!hasResults && searchTerm) {
    if (!existingNoResults) {
      const noResultsHtml = `
        <div class="no-results">
          <i class="fas fa-search"></i>
          <p>No results found for "${escapeHtml(searchTerm)}"</p>
          <button class="btn btn-primary" onclick="clearSearch()">Clear Search</button>
        </div>
      `;
      container.insertAdjacentHTML('beforeend', noResultsHtml);
    }
  } else if (existingNoResults) {
    existingNoResults.remove();
  }
}

function clearSearch() {
  const searchInput = document.getElementById('searchInput');
  const clearBtn = document.getElementById('searchClear');
  if (searchInput) {
    searchInput.value = '';
    currentSearchTerm = '';
    clearBtn.style.display = 'none';
    searchContent('');
  }
}

function toggleCommand(header) {
  const card = header.closest('.command-card');
  card.classList.toggle('expanded');
}

function populateSidebar() {
  const sidebarItems = document.getElementById('sidebarItems');
  if (!sidebarItems) return;
  
  let html = '';
  for (const [sectionId, section] of Object.entries(tutorialData)) {
    html += `
      <button class="sidebar-item" data-section="${sectionId}">
        <i class="fas ${section.icon}"></i>
        ${section.title}
      </button>
    `;
  }
  sidebarItems.innerHTML = html;
  
  sidebarItems.querySelectorAll('.sidebar-item').forEach(item => {
    item.addEventListener('click', () => {
      const sectionId = item.dataset.section;
      switchSection(sectionId);
    });
  });
}

function populateMobileMenu() {
  const mobileMenuItems = document.getElementById('mobileMenuItems');
  if (!mobileMenuItems) return;
  
  let html = '';
  for (const [sectionId, section] of Object.entries(tutorialData)) {
    html += `
      <button class="menu-item" data-section="${sectionId}">
        <i class="fas ${section.icon}"></i>
        ${section.title}
      </button>
    `;
  }
  mobileMenuItems.innerHTML = html;
  
  mobileMenuItems.querySelectorAll('.menu-item').forEach(item => {
    item.addEventListener('click', () => {
      const sectionId = item.dataset.section;
      switchSection(sectionId);
      if (typeof Menu !== 'undefined') {
        Menu.close();
      }
    });
  });
}

function initApp() {
  const container = document.getElementById('contentContainer');
  if (!container) return;
  
  let content = '';
  
  if (!isBeginnerPage) {
    content += renderBeginnerGuideSection();
  }
  
  for (const [sectionId, section] of Object.entries(tutorialData)) {
    content += renderSection(sectionId, section);
  }
  
  container.innerHTML = content;
  
  container.querySelectorAll('.copy-code-btn').forEach(btn => {
    btn.addEventListener('click', function(e) {
      e.stopPropagation();
      const code = this.getAttribute('data-code');
      if (code) {
        copyToClipboard(code);
      }
    });
  });
  
  populateSidebar();
  populateMobileMenu();
  
  const urlSection = getUrlParam('section');
  const sectionIds = Object.keys(tutorialData);
  const defaultSection = urlSection && tutorialData[urlSection] ? urlSection : sectionIds[0];
  setActiveSection(defaultSection);
  
  if (urlSection && tutorialData[urlSection]) {
    setTimeout(() => scrollToElement(`section-${urlSection}`), 100);
  } else {
    setTimeout(() => scrollToElement(`section-${sectionIds[0]}`), 100);
  }
  
  const searchInput = document.getElementById('searchInput');
  const clearBtn = document.getElementById('searchClear');
  
  if (searchInput) {
    const debouncedSearch = debounce(() => {
      currentSearchTerm = searchInput.value;
      if (clearBtn) clearBtn.style.display = currentSearchTerm ? 'flex' : 'none';
      searchContent(currentSearchTerm);
    }, 300);
    searchInput.addEventListener('input', debouncedSearch);
  }
  
  if (clearBtn) clearBtn.addEventListener('click', clearSearch);
}

function setActiveSection(sectionId) {
  document.querySelectorAll('.sidebar-item[data-section]').forEach(item => {
    if (item.dataset.section === sectionId) {
      item.classList.add('active');
    } else {
      item.classList.remove('active');
    }
  });
  
  document.querySelectorAll('.menu-item[data-section]').forEach(item => {
    if (item.dataset.section === sectionId) {
      item.classList.add('active');
    } else {
      item.classList.remove('active');
    }
  });
}

function switchSection(sectionId) {
  setActiveSection(sectionId);
  updateUrl('section', sectionId);
  scrollToElement(`section-${sectionId}`);
}

window.copyToClipboard = copyToClipboard;
window.toggleCommand = toggleCommand;
window.clearSearch = clearSearch;
window.scrollToTop = scrollToTop;
window.switchSection = switchSection;

loadData();