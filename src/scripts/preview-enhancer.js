/**
 * Font Preview Enhancement Module
 */

export class FontPreviewEnhancer {
  constructor() {
    this.previewText = '字境字体';
    this.fontSize = 48;
    this.init();
  }
  
  init() {
    this.setupEnhancedPreviews();
  }
  
  setupEnhancedPreviews() {
    document.querySelectorAll('.font-card').forEach(card => {
      this.enhanceCard(card);
    });
  }
  
  enhanceCard(card) {
    const previewEl = card.querySelector('.font-card__preview');
    if (!previewEl) return;
    
    const fontId = card.dataset.fontId;
    import('./fonts-data.js').then(({ fonts }) => {
      const font = fonts.find(f => f.id === fontId);
      if (!font) return;
      
      this.addEditablePreview(previewEl, font);
    });
  }
  
  addEditablePreview(previewEl, font) {
    previewEl.setAttribute('contenteditable', 'true');
    previewEl.setAttribute('spellcheck', 'false');
    previewEl.style.cursor = 'text';
    previewEl.title = '点击编辑预览文本';
    
    previewEl.addEventListener('focus', () => {
      previewEl.dataset.originalText = previewEl.textContent;
      previewEl.classList.add('is-editing');
    });
    
    previewEl.addEventListener('blur', () => {
      previewEl.classList.remove('is-editing');
      if (!previewEl.textContent.trim()) {
        previewEl.textContent = previewEl.dataset.originalText || font.previewText;
      }
    });
    
    previewEl.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        previewEl.blur();
      }
      if (e.key === 'Escape') {
        previewEl.textContent = previewEl.dataset.originalText || font.previewText;
        previewEl.blur();
      }
    });
  }
  
  createFontSizeControl() {
    const control = document.createElement('div');
    control.className = 'font-size-control';
    control.innerHTML = `
      <label class="font-size-control__label">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polyline points="4 7 4 4 20 4 20 7"/>
          <line x1="9" y1="20" x2="15" y2="20"/>
          <line x1="12" y1="4" x2="12" y2="20"/>
        </svg>
        <input type="range" class="font-size-control__range" min="12" max="120" value="48">
        <span class="font-size-control__value">48px</span>
      </label>
    `;
    return control;
  }
  
  createWeightToggle(weights, currentWeight = 400) {
    if (!weights || weights.length <= 1) return null;
    
    const toggle = document.createElement('div');
    toggle.className = 'font-weight-toggle';
    toggle.innerHTML = `
      <label class="font-weight-toggle__label">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M4 7V4h16v3"/>
          <path d="M9 20h6"/>
          <path d="M12 4v16"/>
        </svg>
        <select class="font-weight-toggle__select">
          ${weights.map(weight => `
            <option value="${weight}" ${weight === currentWeight ? 'selected' : ''}>
              ${this.weightToLabel(weight)}
            </option>
          `).join('')}
        </select>
      </label>
    `;
    return toggle;
  }
  
  weightToLabel(weight) {
    const labels = {
      100: 'Thin',
      200: 'Extra Light',
      300: 'Light',
      400: 'Regular',
      500: 'Medium',
      600: 'Semi Bold',
      700: 'Bold',
      800: 'Extra Bold',
      900: 'Black'
    };
    return labels[weight] || `${weight}`;
  }
}

export const previewEnhancer = new FontPreviewEnhancer();
export default previewEnhancer;
