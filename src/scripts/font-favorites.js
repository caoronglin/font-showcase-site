/**
 * Font Favorites Module
 */

export class FontFavorites {
  constructor() {
    this.favorites = [];
    this.container = null;
    this.init();
  }
  
  init() {
    this.loadFromStorage();
    this.createFavoritesPanel();
    this.setupEventListeners();
  }
  
  createFavoritesPanel() {
    const panel = document.createElement('div');
    panel.className = 'favorites-panel';
    panel.innerHTML = `
      <div class="favorites-panel__overlay" data-action="close"></div>
      <div class="favorites-panel__content">
        <header class="favorites-panel__header">
          <h2 class="favorites-panel__title">收藏的字体</h2>
          <button class="favorites-panel__close btn btn-ghost btn-icon" data-action="close" aria-label="关闭收藏面板">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </header>
        <div class="favorites-panel__list" id="favorites-list">
          <div class="favorites-empty-state">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
            </svg>
            <p>暂无收藏字体</p>
            <p class="text-sm text-muted">点击字体卡片上的收藏按钮</p>
          </div>
        </div>
      </div>
    `;
    document.body.appendChild(panel);
    this.container = panel;
    this.updateFavoritesList();
  }
  
  setupEventListeners() {
    if (!this.container) return;
    this.container.querySelectorAll('[data-action="close"]').forEach(el => {
      el.addEventListener('click', () => this.close());
    });
    document.addEventListener('keydown', (e) => {
      if (this.isOpen && e.key === 'Escape') this.close();
    });
  }
  
  addFavorite(font) {
    if (!font) return;
    if (this.favorites.some(f => f.id === font.id)) {
      this.showToast('该字体已在收藏列表中', 'info');
      return;
    }
    this.favorites.push(font);
    this.saveToStorage();
    this.updateFavoritesList();
    this.updateBadge();
    this.showToast(`已收藏 ${font.name}`, 'success');
  }
  
  removeFavorite(fontId) {
    const index = this.favorites.findIndex(f => f.id === fontId);
    if (index !== -1) {
      this.favorites.splice(index, 1);
      this.saveToStorage();
      this.updateFavoritesList();
      this.updateBadge();
      this.showToast('已取消收藏', 'info');
    }
  }
  
  toggleFavorite(font) {
    if (this.favorites.some(f => f.id === font.id)) {
      this.removeFavorite(font.id);
    } else {
      this.addFavorite(font);
    }
  }
  
  isFavorite(fontId) {
    return this.favorites.some(f => f.id === fontId);
  }
  
  updateFavoritesList() {
    const container = this.container?.querySelector('#favorites-list');
    if (!container) return;
    
    if (this.favorites.length === 0) {
      container.innerHTML = `
        <div class="favorites-empty-state">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
          </svg>
          <p>暂无收藏字体</p>
        </div>
      `;
      return;
    }
    
    container.innerHTML = `
      <div class="favorites-grid">
        ${this.favorites.map(font => `
          <div class="favorites-item" data-font-id="${font.id}">
            <div class="favorites-item__preview" style="font-family: '${font.nameEn}', sans-serif;">
              ${font.previewText}
            </div>
            <div class="favorites-item__info">
              <h3 class="favorites-item__name">${font.name}</h3>
              <p class="favorites-item__meta">${font.category} · ${font.weights.length} 字重</p>
            </div>
            <button class="favorites-item__remove btn btn-ghost btn-sm btn-icon" data-font-id="${font.id}" aria-label="取消收藏" data-stop-propagation>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>
        `).join('')}
      </div>
    `;
    
    container.querySelectorAll('.favorites-item__remove').forEach(btn => {
      btn.addEventListener('click', () => {
        this.removeFavorite(btn.dataset.fontId);
      });
    });
    
    container.querySelectorAll('.favorites-item').forEach(item => {
      item.addEventListener('click', (e) => {
        if (e.target.closest('[data-stop-propagation]')) return;
        const fontId = item.dataset.fontId;
        window.location.href = `./pages/detail.html?id=${fontId}`;
      });
    });
  }
  
  open() {
    if (!this.container) return;
    this.container.classList.add('is-open');
    document.body.style.overflow = 'hidden';
  }
  
  close() {
    if (!this.container) return;
    this.container.classList.remove('is-open');
    document.body.style.overflow = '';
  }
  
  saveToStorage() {
    try {
      localStorage.setItem('fontFavorites', JSON.stringify(
        this.favorites.map(f => f.id)
      ));
    } catch (e) { console.warn('Failed to save favorites:', e); }
  }
  
  loadFromStorage() {
    try {
      const saved = localStorage.getItem('fontFavorites');
      if (saved) {
        const favoriteIds = JSON.parse(saved);
        import('./fonts-data.js').then(({ fonts }) => {
          this.favorites = favoriteIds
            .map(id => fonts.find(f => f.id === id))
            .filter(Boolean);
          this.updateFavoritesList();
          this.updateBadge();
        });
      }
    } catch (e) { console.warn('Failed to load favorites:', e); }
  }
  
  updateBadge() {
    const badge = document.querySelector('.favorites-badge');
    if (badge) {
      badge.textContent = this.favorites.length;
      badge.style.display = this.favorites.length > 0 ? 'inline-flex' : 'none';
    }
  }
  
  showToast(message, type = 'info') {
    window.dispatchEvent(new CustomEvent('showToast', { detail: { message, type } }));
  }
  
  getFavoriteButton(font, isFavorite = false) {
    return `
      <button class="btn btn-sm ${isFavorite ? 'btn-accent' : 'btn-ghost'}" 
        data-action="favorite" data-font-id="${font.id}" data-stop-propagation>
        <svg viewBox="0 0 24 24" fill="${isFavorite ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2">
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
        </svg>
        ${isFavorite ? '已收藏' : '收藏'}
      </button>
    `;
  }
}

export const fontFavorites = new FontFavorites();
export default fontFavorites;
