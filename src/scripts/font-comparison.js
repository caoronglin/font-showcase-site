/**
 * Font Comparison Module
 */

export class FontComparator {
  constructor(options = {}) {
    this.maxFonts = options.maxFonts || 4;
    this.minFonts = options.minFonts || 2;
    this.comparisonFonts = [];
    this.container = null;
    this.isOpen = false;
    this.init();
  }
  
  init() {
    this.createComparisonPanel();
    this.setupEventListeners();
    this.loadFromStorage();
  }
  
  createComparisonPanel() {
    const panel = document.createElement('div');
    panel.className = 'comparison-panel';
    panel.innerHTML = `
      <div class="comparison-panel__overlay" data-action="close"></div>
      <div class="comparison-panel__content">
        <header class="comparison-panel__header">
          <h2 class="comparison-panel__title">字体对比</h2>
          <button class="comparison-panel__close btn btn-ghost btn-icon" data-action="close" aria-label="关闭对比面板">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </header>
        <div class="comparison-panel__controls">
          <div class="comparison-panel__control-group">
            <label class="comparison-panel__label" for="compare-text">对比文本</label>
            <input type="text" id="compare-text" class="comparison-panel__input" value="字境字体对比" placeholder="输入要对比的文本">
          </div>
          <div class="comparison-panel__control-group">
            <label class="comparison-panel__label" for="compare-size">字号：<span id="compare-size-value">48</span>px</label>
            <input type="range" id="compare-size" class="comparison-panel__range" min="12" max="120" value="48">
          </div>
          <div class="comparison-panel__control-group">
            <label class="comparison-panel__label">已选字体 (<span id="compare-count">0</span>/<span id="compare-max">4</span>)</label>
            <button class="btn btn-secondary btn-sm" id="clear-comparison" data-stop-propagation>清空对比</button>
          </div>
        </div>
        <div class="comparison-panel__fonts" id="comparison-fonts-container">
          <div class="comparison-empty-state">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M12 2L2 7l10 5 10-5-10-5z"/>
              <path d="M2 17l10 5 10-5"/>
              <path d="M2 12l10 5 10-5"/>
            </svg>
            <p>请选择 2-4 个字体进行对比</p>
          </div>
        </div>
        <footer class="comparison-panel__footer">
          <button class="btn btn-primary" id="save-comparison" disabled>保存对比</button>
        </footer>
      </div>
    `;
    document.body.appendChild(panel);
    this.container = panel;
    this.updateCount();
  }
  
  setupEventListeners() {
    if (!this.container) return;
    this.container.querySelectorAll('[data-action="close"]').forEach(el => {
      el.addEventListener('click', () => this.close());
    });
    const textInput = this.container.querySelector('#compare-text');
    if (textInput) textInput.addEventListener('input', (e) => this.updateComparisonText(e.target.value));
    const sizeRange = this.container.querySelector('#compare-size');
    const sizeValue = this.container.querySelector('#compare-size-value');
    if (sizeRange && sizeValue) {
      sizeRange.addEventListener('input', (e) => {
        sizeValue.textContent = e.target.value;
        this.updateComparisonSize(parseInt(e.target.value));
      });
    }
    const clearBtn = this.container.querySelector('#clear-comparison');
    if (clearBtn) clearBtn.addEventListener('click', () => this.clearComparison());
    const saveBtn = this.container.querySelector('#save-comparison');
    if (saveBtn) saveBtn.addEventListener('click', () => this.saveComparison());
    document.addEventListener('keydown', (e) => {
      if (this.isOpen && e.key === 'Escape') this.close();
    });
  }
  
  addFont(font) {
    if (!font) return;
    if (this.comparisonFonts.some(f => f.id === font.id)) {
      this.showToast('该字体已在对比列表中', 'info');
      return;
    }
    if (this.comparisonFonts.length >= this.maxFonts) {
      this.showToast(`最多只能对比 ${this.maxFonts} 个字体`, 'error');
      return;
    }
    this.comparisonFonts.push(font);
    this.updateComparison();
    this.saveToStorage();
    this.showToast(`已添加 ${font.name} 到对比`, 'success');
    if (!this.isOpen && this.comparisonFonts.length >= this.minFonts) this.open();
  }
  
  removeFont(fontId) {
    const index = this.comparisonFonts.findIndex(f => f.id === fontId);
    if (index !== -1) {
      this.comparisonFonts.splice(index, 1);
      this.updateComparison();
      this.saveToStorage();
      this.showToast('已从对比中移除', 'info');
    }
  }
  
  toggleFont(font) {
    if (this.comparisonFonts.some(f => f.id === font.id)) {
      this.removeFont(font.id);
    } else {
      this.addFont(font);
    }
  }
  
  updateComparison() {
    this.updateCount();
    this.renderComparisonFonts();
    this.updateSaveButton();
  }
  
  updateCount() {
    const countEl = this.container?.querySelector('#compare-count');
    const maxEl = this.container?.querySelector('#compare-max');
    if (countEl) countEl.textContent = this.comparisonFonts.length;
    if (maxEl) maxEl.textContent = this.maxFonts;
  }
  
  renderComparisonFonts() {
    const container = this.container?.querySelector('#comparison-fonts-container');
    if (!container) return;
    if (this.comparisonFonts.length === 0) {
      container.innerHTML = `
        <div class="comparison-empty-state">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M12 2L2 7l10 5 10-5-10-5z"/>
            <path d="M2 17l10 5 10-5"/>
            <path d="M2 12l10 5 10-5"/>
          </svg>
          <p>请选择 2-4 个字体进行对比</p>
        </div>
      `;
      return;
    }
    const compareText = this.container?.querySelector('#compare-text')?.value || '字境字体对比';
    const compareSize = parseInt(this.container?.querySelector('#compare-size')?.value || '48');
    container.innerHTML = `
      <div class="comparison-grid" style="grid-template-columns: repeat(${this.comparisonFonts.length}, 1fr);">
        ${this.comparisonFonts.map(font => `
          <div class="comparison-item">
            <div class="comparison-item__header">
              <h3 class="comparison-item__name">${font.name}</h3>
              <button class="comparison-item__remove btn btn-ghost btn-sm btn-icon" data-font-id="${font.id}" data-stop-propagation>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>
            <div class="comparison-item__preview" style="font-family: '${font.nameEn}', sans-serif; font-size: ${compareSize}px;">
              ${compareText}
            </div>
            <div class="comparison-item__meta">
              <span class="badge badge-secondary">${font.category}</span>
              <span class="badge badge-secondary">${font.weights.length} 字重</span>
            </div>
          </div>
        `).join('')}
      </div>
    `;
    container.querySelectorAll('.comparison-item__remove').forEach(btn => {
      btn.addEventListener('click', () => this.removeFont(btn.dataset.fontId));
    });
  }
  
  updateComparisonText(text) { this.renderComparisonFonts(); }
  updateComparisonSize(size) { this.renderComparisonFonts(); }
  updateSaveButton() {
    const saveBtn = this.container?.querySelector('#save-comparison');
    if (saveBtn) saveBtn.disabled = this.comparisonFonts.length < this.minFonts;
  }
  
  open() {
    if (!this.container) return;
    this.isOpen = true;
    this.container.classList.add('is-open');
    document.body.style.overflow = 'hidden';
  }
  
  close() {
    if (!this.container) return;
    this.isOpen = false;
    this.container.classList.remove('is-open');
    document.body.style.overflow = '';
  }
  
  clearComparison() {
    this.comparisonFonts = [];
    this.updateComparison();
    this.saveToStorage();
    this.close();
    this.showToast('已清空对比列表', 'info');
  }
  
  saveComparison() {
    if (this.comparisonFonts.length < this.minFonts) {
      this.showToast(`请至少选择 ${this.minFonts} 个字体`, 'error');
      return;
    }
    this.saveToStorage();
    this.showToast('对比已保存', 'success');
  }
  
  saveToStorage() {
    try {
      localStorage.setItem('fontComparison', JSON.stringify({
        fonts: this.comparisonFonts.map(f => f.id),
        text: this.container?.querySelector('#compare-text')?.value || '字境字体对比',
        size: parseInt(this.container?.querySelector('#compare-size')?.value || '48')
      }));
    } catch (e) { console.warn('Failed to save comparison:', e); }
  }
  
  loadFromStorage() {
    try {
      const saved = localStorage.getItem('fontComparison');
      if (saved) {
        const data = JSON.parse(saved);
        import('./fonts-data.js').then(({ fonts }) => {
          this.comparisonFonts = data.fonts.map(id => fonts.find(f => f.id === id)).filter(Boolean);
          this.updateComparison();
          const textInput = this.container?.querySelector('#compare-text');
          const sizeRange = this.container?.querySelector('#compare-size');
          const sizeValue = this.container?.querySelector('#compare-size-value');
          if (textInput && data.text) textInput.value = data.text;
          if (sizeRange && data.size) {
            sizeRange.value = data.size;
            if (sizeValue) sizeValue.textContent = data.size;
          }
          this.renderComparisonFonts();
        });
      }
    } catch (e) { console.warn('Failed to load comparison:', e); }
  }
  
  showToast(message, type = 'info') {
    window.dispatchEvent(new CustomEvent('showToast', { detail: { message, type } }));
  }
  
  isInComparison(fontId) { return this.comparisonFonts.some(f => f.id === fontId); }
  
  getComparisonButton(font, isInComparison = false) {
    return `
      <button class="btn btn-sm ${isInComparison ? 'btn-accent' : 'btn-ghost'}" 
        data-action="compare" data-font-id="${font.id}" data-font-name="${font.name}" data-stop-propagation>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
          <line x1="12" y1="8" x2="12" y2="16"/>
          <line x1="8" y1="12" x2="16" y2="12"/>
        </svg>
        ${isInComparison ? '对比中' : '对比'}
      </button>
    `;
  }
}

export const fontComparator = new FontComparator();
export default fontComparator;
