/**
 * Main JavaScript - Font Showcase Site
 */

import { fonts, getFeaturedFonts, searchFonts, categories } from './fonts-data.js';
import { initCSSTooltips } from './css-tooltip.js';
import { fontComparator } from './font-comparison.js';
import { fontFavorites } from './font-favorites.js';
import { previewEnhancer } from './preview-enhancer.js';
import { initHeroCanvas } from './hero-canvas.js';

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
  previewEnhancer.setupEnhancedPreviews();
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
  
  elements.fontGrid.setAttribute('aria-busy', 'true');
  
  if (paginatedFonts.length === 0) {
    elements.fontGrid.innerHTML = `
      <div class="empty-state">
        <div class="empty-state__icon" aria-hidden="true">
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
    elements.fontGrid.setAttribute('aria-busy', 'false');
    return;
  }
  
  elements.fontGrid.innerHTML = paginatedFonts.map(font => createFontCard(font)).join('');
  
  elements.fontGrid.setAttribute('aria-busy', 'false');
  elements.fontGrid.setAttribute('aria-label', `字体列表，显示 ${paginatedFonts.length} 个字体，共 ${filteredFonts.length} 个结果`);
  
  // Add click listeners to font cards
  document.querySelectorAll('.font-card').forEach(card => {
    card.addEventListener('click', (e) => {
      if (e.target.closest('[data-stop-propagation]')) {
        e.stopPropagation();
        return;
      }
      const fontId = card.dataset.fontId;
      navigateToFontDetail(fontId);
    });
    
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        const fontId = card.dataset.fontId;
        navigateToFontDetail(fontId);
      }
    });
  });
  
  previewEnhancer.setupEnhancedPreviews();
  
  // Show/hide load more button
  if (elements.loadMoreBtn) {
    elements.loadMoreBtn.style.display = 
      paginatedFonts.length < filteredFonts.length ? 'inline-flex' : 'none';
  }
}

function createFontCard(font) {
  const isInComparison = fontComparator.isInComparison(font.id);
  const isFavorite = fontFavorites.isFavorite(font.id);
  
  return `
    <article class="font-card" data-font-id="${font.id}" role="article" tabindex="0" aria-labelledby="font-title-${font.id}">
      <div class="font-card__preview" style="font-family: '${font.nameEn}', sans-serif;" aria-hidden="true">
        ${font.previewText}
      </div>
      <div class="font-card__info">
        <h3 class="font-card__name" id="font-title-${font.id}">${font.name}</h3>
        <p class="font-card__meta">
          ${categories.find(c => c.id === font.category)?.name || font.category} · 
          ${font.weights.length} 字重 · 
          ${font.license}
        </p>
        <div class="font-card__tags">
          ${font.tags.slice(0, 3).map(tag => `<span class="badge badge-secondary">${tag}</span>`).join('')}
        </div>
      </div>
      <div class="font-card__actions" role="group" aria-label="字体操作">
        <button class="btn btn-sm btn-ghost" data-action="compare" aria-label="${isInComparison ? '从对比中移除' : '添加到对比'} ${font.name}" data-font-id="${font.id}" data-font-name="${font.name}" data-stop-propagation>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
            <line x1="12" y1="8" x2="12" y2="16"/>
            <line x1="8" y1="12" x2="16" y2="12"/>
          </svg>
          ${isInComparison ? '对比中' : '对比'}
        </button>
        <button class="btn btn-sm ${isFavorite ? 'btn-accent' : 'btn-ghost'}" data-action="favorite" aria-label="${isFavorite ? '取消收藏' : '收藏'} ${font.name}" data-font-id="${font.id}" data-stop-propagation>
          <svg viewBox="0 0 24 24" fill="${isFavorite ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2" aria-hidden="true">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
          </svg>
          ${isFavorite ? '已收藏' : '收藏'}
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
  
  const favoritesToggle = document.getElementById('favorites-toggle');
  if (favoritesToggle) {
    favoritesToggle.addEventListener('click', () => {
      fontFavorites.open();
    });
  }
  
  window.addEventListener('showToast', (e) => {
    const { message, type } = e.detail;
    showToast(message, type);
  });
  
  document.addEventListener('click', (e) => {
    const compareBtn = e.target.closest('[data-action="compare"]');
    const favoriteBtn = e.target.closest('[data-action="favorite"]');
    
    if (compareBtn) {
      e.preventDefault();
      e.stopPropagation();
      const fontId = compareBtn.dataset.fontId;
      const fontName = compareBtn.dataset.fontName;
      const font = fonts.find(f => f.id === fontId);
      if (font) {
        fontComparator.toggleFont(font);
        renderFonts();
      }
    }
    
    if (favoriteBtn) {
      e.preventDefault();
      e.stopPropagation();
      const fontId = favoriteBtn.dataset.fontId;
      const font = fonts.find(f => f.id === fontId);
      if (font) {
        fontFavorites.toggleFavorite(font);
        renderFonts();
      }
    }
  });
  
  // Mobile menu toggle
  if (elements.menuToggle) {
    elements.menuToggle.addEventListener('click', () => {
      const isExpanded = elements.menuToggle.getAttribute('aria-expanded') === 'true';
      elements.menuToggle.setAttribute('aria-expanded', !isExpanded);
      elements.mobileMenu.classList.toggle('is-open');
    });
    
    // Close mobile menu on ESC
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        const isExpanded = elements.menuToggle.getAttribute('aria-expanded') === 'true';
        if (isExpanded) {
          elements.menuToggle.setAttribute('aria-expanded', 'false');
          elements.mobileMenu.classList.remove('is-open');
          elements.menuToggle.focus();
        }
      }
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
// Toast Notifications
// ============================================

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
