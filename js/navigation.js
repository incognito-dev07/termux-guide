// Navigation and Menu Controller

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
  }
};

window.addEventListener('popstate', () => {
  const urlSection = getUrlParam('section');
  if (urlSection) {
    scrollToElement(`section-${urlSection}`);
  }
});

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    Menu.init();
  });
} else {
  Menu.init();
}

window.Menu = Menu;