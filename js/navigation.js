// navigation.js - Fixed to properly populate menu items
const Menu = {
  init: function() {
    this.hamburger = document.getElementById('hamburgerBtn');
    this.menu = document.getElementById('menuPanel');
    this.overlay = document.getElementById('menuOverlay');
    
    if (!this.hamburger || !this.menu || !this.overlay) return;
    
    this.setupEventListeners();
  },
  
  setupEventListeners: function() {
    this.hamburger.addEventListener('click', (e) => {
      e.stopPropagation();
      this.toggle();
    });
    
    this.overlay.addEventListener('click', () => {
      this.close();
    });
    
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.menu.classList.contains('open')) {
        this.close();
      }
    });
  },
  
  toggle: function() {
    if (this.menu.classList.contains('open')) {
      this.close();
    } else {
      this.open();
    }
  },
  
  open: function() {
    this.menu.classList.add('open');
    this.overlay.classList.add('active');
    this.hamburger.classList.add('active');
    document.body.style.overflow = 'hidden';
  },
  
  close: function() {
    this.menu.classList.remove('open');
    this.overlay.classList.remove('active');
    this.hamburger.classList.remove('active');
    document.body.style.overflow = '';
  },
  
  // Add method to update menu items
  updateMenuItems: function(sections) {
    const mobileMenuItems = document.getElementById('mobileMenuItems');
    if (!mobileMenuItems) return;
    
    let html = '';
    for (const [sectionId, section] of Object.entries(sections)) {
      html += `
        <button class="menu-item" data-section="${sectionId}">
          <i class="fas ${section.icon}"></i>
          ${section.title}
        </button>
      `;
    }
    mobileMenuItems.innerHTML = html;
    
    // Add click handlers
    mobileMenuItems.querySelectorAll('.menu-item').forEach(item => {
      item.addEventListener('click', () => {
        const sectionId = item.dataset.section;
        if (typeof window.switchSection === 'function') {
          window.switchSection(sectionId);
        }
        this.close();
      });
    });
  }
};

// Initialize menu when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    Menu.init();
  });
} else {
  Menu.init();
}

window.Menu = Menu;