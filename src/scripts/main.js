/**
 * Main JavaScript - Font Showcase Site
 */

import { fonts, getFeaturedFonts, searchFonts, categories } from './fonts-data.js';
import { initCSSTooltips } from './css-tooltip.js';

// ============================================
// State Management
// ============================================

const state = {
  currentFilter: 'all',
  searchQuery: '',
  displayedFonts: [],
  currentPage: 1,
  itemsPerPage: 12,
  isDarkMode: false
};

// ============================================
// DOM Elements
// ============================================

const elements = {
  fontGrid: document.getElementById('font-grid'),
  filterButtons: document.querySelectorAll('.filter-btn'),
  searchInput: document.querySelector('.search-input'),
  loadMoreBtn: document.getElementById('load-more'),
  themeToggle: document.getElementById('theme-toggle'),
  exportPdfBtn: document.getElementById('export-pdf'),
  randomFontBtn: document.getElementById('random-font'),
  menuToggle: document.querySelector('.menu-toggle'),
  mobileMenu: document.querySelector('.main-nav'),
  toastContainer: document.querySelector('.toast-container')
};

// ============================================
// Initialization
// ============================================

function init() {
  loadTheme();
  setupEventListeners();
  renderFonts();
  initHeroCanvas();
  initScrollAnimations();
  initCSSTooltips();
}

// ============================================
// Theme Management
// ============================================

function loadTheme() {
  const savedTheme = localStorage.getItem('theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  
  state.isDarkMode = savedTheme === 'dark' || (!savedTheme && prefersDark);
  
  if (state.isDarkMode) {
    document.documentElement.classList.add('dark');
  }
}

function toggleTheme() {
  state.isDarkMode = !state.isDarkMode;
  
  if (state.isDarkMode) {
    document.documentElement.classList.add('dark');
    localStorage.setItem('theme', 'dark');
  } else {
    document.documentElement.classList.remove('dark');
    localStorage.setItem('theme', 'light');
  }
  
  showToast(state.isDarkMode ? '已切换到深色模式' : '已切换到浅色模式');
}

// ============================================
// Font Rendering
// ============================================

function renderFonts() {
  const filteredFonts = getFilteredFonts();
  const paginatedFonts = filteredFonts.slice(0, state.currentPage * state.itemsPerPage);
  
  if (!elements.fontGrid) return;
  
  if (paginatedFonts.length === 0) {
    elements.fontGrid.innerHTML = `
      <div class="empty-state">
        <div class="empty-state__icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="11" cy="11" r="8"/>
            <line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
        </div>
        <h3 class="empty-state__title">未找到字体</h3>
        <p class="empty-state__description">
          没有找到符合条件的字体，请尝试其他搜索词或筛选条件。
        </p>
      </div>
    `;
    if (elements.loadMoreBtn) {
      elements.loadMoreBtn.style.display = 'none';
    }
    return;
  }
  
  elements.fontGrid.innerHTML = paginatedFonts.map(font => createFontCard(font)).join('');
  
  // Add click listeners to font cards
  document.querySelectorAll('.font-card').forEach(card => {
    card.addEventListener('click', (e) => {
      // 如果点击的是带 data-stop-propagation 的元素，阻止冒泡
      if (e.target.closest('[data-stop-propagation]')) {
        e.stopPropagation();
        return;
      }
      
      const fontId = card.dataset.fontId;
      navigateToFontDetail(fontId);
    });
  });
  
  // Show/hide load more button
  if (elements.loadMoreBtn) {
    elements.loadMoreBtn.style.display = 
      paginatedFonts.length < filteredFonts.length ? 'inline-flex' : 'none';
  }
}

function createFontCard(font) {
  return `
    <article class="font-card" data-font-id="${font.id}">
      <div class="font-card__preview" style="font-family: '${font.nameEn}', sans-serif;">
        ${font.previewText}
      </div>
      <div class="font-card__info">
        <h3 class="font-card__name">${font.name}</h3>
        <p class="font-card__meta">
          ${categories.find(c => c.id === font.category)?.name || font.category} · 
          ${font.weights.length} 字重 · 
          ${font.license}
        </p>
        <div class="font-card__tags">
          ${font.tags.slice(0, 3).map(tag => `<span class="badge badge-secondary">${tag}</span>`).join('')}
        </div>
      </div>
      <div class="font-card__actions">
        <button class="btn btn-sm btn-ghost" data-action="preview" aria-label="预览字体" data-stop-propagation>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
            <circle cx="12" cy="12" r="3"/>
          </svg>
        </button>
        <button class="btn btn-sm btn-ghost" data-action="download" aria-label="下载字体" data-stop-propagation>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
            <polyline points="7 10 12 15 17 10"/>
            <line x1="12" y1="15" x2="12" y2="3"/>
          </svg>
        </button>
      </div>
    </article>
  `;
}

function getFilteredFonts() {
  let filtered = fonts;
  
  // Apply category filter
  if (state.currentFilter !== 'all') {
    filtered = filtered.filter(font => font.category === state.currentFilter);
  }
  
  // Apply search filter
  if (state.searchQuery) {
    const query = state.searchQuery.toLowerCase();
    filtered = filtered.filter(font => 
      font.name.toLowerCase().includes(query) ||
      font.nameEn.toLowerCase().includes(query) ||
      font.tags.some(tag => tag.toLowerCase().includes(query))
    );
  }
  
  return filtered;
}

// ============================================
// Navigation
// ============================================

function navigateToFontDetail(fontId) {
  window.location.href = `./pages/detail.html?id=${fontId}`;
}

// ============================================
// Event Listeners
// ============================================

function setupEventListeners() {
  // Filter buttons
  elements.filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      elements.filterButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      state.currentFilter = btn.dataset.filter;
      state.currentPage = 1;
      renderFonts();
    });
  });
  
  // Search input
  if (elements.searchInput) {
    elements.searchInput.addEventListener('input', (e) => {
      state.searchQuery = e.target.value;
      state.currentPage = 1;
      renderFonts();
    });
  }
  
  // Load more button
  if (elements.loadMoreBtn) {
    elements.loadMoreBtn.addEventListener('click', () => {
      state.currentPage++;
      renderFonts();
    });
  }
  
  // Theme toggle
  if (elements.themeToggle) {
    elements.themeToggle.addEventListener('click', toggleTheme);
  }
  
  // Export PDF
  if (elements.exportPdfBtn) {
    elements.exportPdfBtn.addEventListener('click', () => {
      showToast('正在生成 PDF...');
      // Paged.js will handle the PDF generation
      if (window.PagedPolyfill) {
        window.PagedPolyfill.preview();
      }
    });
  }
  
  // Random font
  if (elements.randomFontBtn) {
    elements.randomFontBtn.addEventListener('click', () => {
      const randomIndex = Math.floor(Math.random() * fonts.length);
      const randomFont = fonts[randomIndex];
      navigateToFontDetail(randomFont.id);
    });
  }
  
  // Mobile menu toggle
  if (elements.menuToggle) {
    elements.menuToggle.addEventListener('click', () => {
      const isExpanded = elements.menuToggle.getAttribute('aria-expanded') === 'true';
      elements.menuToggle.setAttribute('aria-expanded', !isExpanded);
      elements.mobileMenu.classList.toggle('is-open');
    });
  }
  
  // Smooth scroll for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const href = anchor.getAttribute('href');
      if (href !== '#') {
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) {
          target.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }
      }
    });
  });
}

// ============================================
// Toast Notifications
// ============================================

function showToast(message, type = 'info') {
  const toast = document.createElement('div');
  toast.className = `toast toast--${type}`;
  toast.textContent = message;
  
  if (elements.toastContainer) {
    elements.toastContainer.appendChild(toast);
    
    // Trigger animation
    requestAnimationFrame(() => {
      toast.classList.add('is-visible');
    });
    
    // Remove after delay
    setTimeout(() => {
      toast.classList.remove('is-visible');
      setTimeout(() => {
        toast.remove();
      }, 300);
    }, 3000);
  }
}

// ============================================
// Hero Canvas Animation
// ============================================

function initHeroCanvas() {
  const canvas = document.getElementById('hero-canvas');
  if (!canvas) return;
  
  const ctx = canvas.getContext('2d');
  let animationId;
  let particles = [];
  
  function resize() {
    canvas.width = canvas.offsetWidth * window.devicePixelRatio;
    canvas.height = canvas.offsetHeight * window.devicePixelRatio;
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
  }
  
  function createParticles() {
    particles = [];
    const count = Math.min(30, Math.floor(canvas.offsetWidth / 40));
    
    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * canvas.offsetWidth,
        y: Math.random() * canvas.offsetHeight,
        size: Math.random() * 3 + 1,
        speedX: (Math.random() - 0.5) * 0.5,
        speedY: (Math.random() - 0.5) * 0.5,
        opacity: Math.random() * 0.5 + 0.2
      });
    }
  }
  
  function draw() {
    ctx.clearRect(0, 0, canvas.offsetWidth, canvas.offsetHeight);
    
    // Draw connections
    ctx.strokeStyle = getComputedStyle(document.documentElement).getPropertyValue('--ink-200').trim();
    ctx.lineWidth = 0.5;
    
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < 150) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.globalAlpha = (1 - distance / 150) * 0.3;
          ctx.stroke();
          ctx.globalAlpha = 1;
        }
      }
    }
    
    // Draw particles
    for (const particle of particles) {
      ctx.beginPath();
      ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
      ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--ink-400').trim();
      ctx.globalAlpha = particle.opacity;
      ctx.fill();
      ctx.globalAlpha = 1;
      
      // Update position
      particle.x += particle.speedX;
      particle.y += particle.speedY;
      
      // Wrap around
      if (particle.x < 0) particle.x = canvas.offsetWidth;
      if (particle.x > canvas.offsetWidth) particle.x = 0;
      if (particle.y < 0) particle.y = canvas.offsetHeight;
      if (particle.y > canvas.offsetHeight) particle.y = 0;
    }
    
    animationId = requestAnimationFrame(draw);
  }
  
  function start() {
    resize();
    createParticles();
    draw();
  }
  
  function stop() {
    if (animationId) {
      cancelAnimationFrame(animationId);
    }
  }
  
  // Handle resize
  window.addEventListener('resize', () => {
    stop();
    start();
  });
  
  // Visibility API - pause when tab is hidden
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      stop();
    } else {
      start();
    }
  });
  
  start();
}

// ============================================
// Scroll Animations
// ============================================

function initScrollAnimations() {
  const animatedElements = document.querySelectorAll('.font-card, .feature-card, .section-header');
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });
  
  animatedElements.forEach(el => {
    el.classList.add('animate-on-scroll');
    observer.observe(el);
  });
}

// ============================================
// Start Application
// ============================================

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
