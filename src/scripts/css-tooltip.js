/**
 * CSS引用提示功能
 * 鼠标悬停时显示字体的CSS引用代码
 */

import { generateSimpleCSS, generateFontCSS } from './font-converter.js';

/**
 * 创建CSS提示框
 * @param {Object} font - 字体数据对象
 * @param {Object} options - 配置选项
 * @returns {HTMLElement} 提示框元素
 */
export function createCSSTooltip(font, options = {}) {
  const {
    showCDN = true,
    showFontFace = false,
    position = 'top'
  } = options;

  // 创建提示框容器
  const tooltip = document.createElement('div');
  tooltip.className = 'css-tooltip';
  tooltip.setAttribute('data-position', position);
  
  // 创建标题
  const title = document.createElement('div');
  title.className = 'css-tooltip__title';
  title.textContent = `使用 ${font.name}`;
  tooltip.appendChild(title);

  // 创建内容区域
  const content = document.createElement('div');
  content.className = 'css-tooltip__content';

  if (showCDN) {
    // 显示CDN引用方式
    const cdnSection = document.createElement('div');
    cdnSection.className = 'css-tooltip__section';
    
    const cdnLabel = document.createElement('div');
    cdnLabel.className = 'css-tooltip__label';
    cdnLabel.textContent = 'CDN 引用';
    cdnSection.appendChild(cdnLabel);

    const cdnCode = document.createElement('code');
    cdnCode.className = 'css-tooltip__code';
    cdnCode.textContent = `@import url('https://cdn.jsdelivr.net/npm/${font.id}@latest/dist/index.css');`;
    cdnSection.appendChild(cdnCode);

    // 添加复制按钮
    const copyBtn = createCopyButton(cdnCode.textContent);
    cdnSection.appendChild(copyBtn);

    content.appendChild(cdnSection);

    // 显示CSS font-family
    const fontFamilySection = document.createElement('div');
    fontFamilySection.className = 'css-tooltip__section';
    
    const familyLabel = document.createElement('div');
    familyLabel.className = 'css-tooltip__label';
    familyLabel.textContent = 'CSS font-family';
    fontFamilySection.appendChild(familyLabel);

    const familyCode = document.createElement('code');
    familyCode.className = 'css-tooltip__code';
    familyCode.textContent = `font-family: '${font.nameEn}', -apple-system, BlinkMacSystemFont, sans-serif;`;
    fontFamilySection.appendChild(familyCode);

    // 添加复制按钮
    const familyCopyBtn = createCopyButton(familyCode.textContent);
    fontFamilySection.appendChild(familyCopyBtn);

    content.appendChild(fontFamilySection);
  }

  if (showFontFace) {
    // 显示完整的@font-face规则
    const fontFaceSection = document.createElement('div');
    fontFaceSection.className = 'css-tooltip__section';
    
    const fontFaceLabel = document.createElement('div');
    fontFaceLabel.className = 'css-tooltip__label';
    fontFaceLabel.textContent = '@font-face 规则';
    fontFaceSection.appendChild(fontFaceLabel);

    const fontFaceCode = document.createElement('pre');
    fontFaceCode.className = 'css-tooltip__pre';
    fontFaceCode.textContent = generateFontCSS(font, { format: 'woff2' });
    fontFaceSection.appendChild(fontFaceCode);

    // 添加复制按钮
    const fontFaceCopyBtn = createCopyButton(fontFaceCode.textContent);
    fontFaceSection.appendChild(fontFaceCopyBtn);

    content.appendChild(fontFaceSection);
  }

  tooltip.appendChild(content);

  // 添加关闭按钮
  const closeBtn = document.createElement('button');
  closeBtn.className = 'css-tooltip__close';
  closeBtn.setAttribute('aria-label', '关闭');
  closeBtn.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>';
  closeBtn.addEventListener('click', () => {
    tooltip.remove();
  });
  tooltip.appendChild(closeBtn);

  return tooltip;
}

/**
 * 创建复制按钮
 * @param {string} text - 要复制的文本
 * @returns {HTMLElement} 复制按钮
 */
function createCopyButton(text) {
  const button = document.createElement('button');
  button.className = 'css-tooltip__copy-btn';
  button.setAttribute('aria-label', '复制代码');
  button.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg><span>复制</span>';
  
  button.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(text);
      button.classList.add('copied');
      button.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"></polyline></svg><span>已复制</span>';
      
      setTimeout(() => {
        button.classList.remove('copied');
        button.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg><span>复制</span>';
      }, 2000);
    } catch (err) {
      console.error('复制失败:', err);
      button.textContent = '复制失败';
    }
  });
  
  return button;
}

/**
 * 初始化CSS提示功能
 * @param {string} selector - 字体卡片选择器
 */
export function initCSSTooltips(selector = '.font-card') {
  const cards = document.querySelectorAll(selector);
  
  cards.forEach(card => {
    // 添加hover事件
    card.addEventListener('mouseenter', (e) => {
      const fontId = card.dataset.fontId;
      if (!fontId) return;
      
      // 获取字体数据
      import('./fonts-data.js').then(({ getFontById }) => {
        const font = getFontById(fontId);
        if (!font) return;
        
        // 检查是否已存在tooltip
        if (card.querySelector('.css-tooltip')) return;
        
        // 创建tooltip
        const tooltip = createCSSTooltip(font, {
          showCDN: true,
          showFontFace: false,
          position: 'top'
        });
        
        // 设置位置
        tooltip.style.position = 'absolute';
        tooltip.style.zIndex = '1000';
        
        // 添加到卡片
        card.style.position = 'relative';
        card.appendChild(tooltip);
        
        // 调整位置
        const cardRect = card.getBoundingClientRect();
        const tooltipRect = tooltip.getBoundingClientRect();
        
        let top = -tooltipRect.height - 10;
        let left = (cardRect.width - tooltipRect.width) / 2;
        
        // 边界检查
        if (left < 0) left = 0;
        if (left + tooltipRect.width > cardRect.width) {
          left = cardRect.width - tooltipRect.width;
        }
        
        tooltip.style.top = `${top}px`;
        tooltip.style.left = `${left}px`;
      });
    });
    
    // 鼠标离开时移除tooltip
    card.addEventListener('mouseleave', () => {
      const tooltip = card.querySelector('.css-tooltip');
      if (tooltip) {
        tooltip.remove();
      }
    });
  });
}

/**
 * 显示CSS引用模态框
 * @param {Object} font - 字体数据对象
 */
export function showCSSModal(font) {
  // 创建模态框
  const modal = document.createElement('div');
  modal.className = 'css-modal';
  modal.innerHTML = `
    <div class="css-modal__overlay"></div>
    <div class="css-modal__content">
      <div class="css-modal__header">
        <h3>${font.name} - CSS 引用</h3>
        <button class="css-modal__close" aria-label="关闭">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </div>
      <div class="css-modal__body">
        <div class="css-modal__section">
          <h4>方法1: 使用 CDN (推荐)</h4>
          <pre><code>${generateSimpleCSS(font)}</code></pre>
          <button class="css-modal__copy" data-code="${encodeURIComponent(generateSimpleCSS(font))}">复制代码</button>
        </div>
        <div class="css-modal__section">
          <h4>方法2: @font-face (本地)</h4>
          <pre><code>${generateFontCSS(font, { format: 'woff2' })}</code></pre>
          <button class="css-modal__copy" data-code="${encodeURIComponent(generateFontCSS(font, { format: 'woff2' }))}">复制代码</button>
        </div>
        <div class="css-modal__section">
          <h4>方法3: JavaScript 动态加载</h4>
          <pre><code>${generateFontLoaderJS(font)}</code></pre>
          <button class="css-modal__copy" data-code="${encodeURIComponent(generateFontLoaderJS(font))}">复制代码</button>
        </div>
      </div>
    </div>
  `;
  
  // 添加关闭事件
  const closeBtn = modal.querySelector('.css-modal__close');
  const overlay = modal.querySelector('.css-modal__overlay');
  
  const closeModal = () => {
    modal.classList.add('css-modal--closing');
    setTimeout(() => modal.remove(), 300);
  };
  
  closeBtn.addEventListener('click', closeModal);
  overlay.addEventListener('click', closeModal);
  
  // 添加复制功能
  const copyBtns = modal.querySelectorAll('.css-modal__copy');
  copyBtns.forEach(btn => {
    btn.addEventListener('click', async () => {
      const code = decodeURIComponent(btn.dataset.code);
      try {
        await navigator.clipboard.writeText(code);
        const originalText = btn.textContent;
        btn.textContent = '已复制!';
        btn.classList.add('css-modal__copy--success');
        setTimeout(() => {
          btn.textContent = originalText;
          btn.classList.remove('css-modal__copy--success');
        }, 2000);
      } catch (err) {
        console.error('复制失败:', err);
        btn.textContent = '复制失败';
      }
    });
  });
  
  // 添加ESC键关闭
  const escHandler = (e) => {
    if (e.key === 'Escape') {
      closeModal();
      document.removeEventListener('keydown', escHandler);
    }
  };
  document.addEventListener('keydown', escHandler);
  
  // 添加到页面
  document.body.appendChild(modal);
  
  // 触发动画
  requestAnimationFrame(() => {
    modal.classList.add('css-modal--active');
  });
}

/**
 * 生成字体CSS @font-face 规则
 * @param {Object} font - 字体数据对象
 * @param {Object} options - 配置选项
 * @returns {string} CSS代码
 */
export function generateFontCSS(font, options = {}) {
  const {
    format = 'woff2',
    display = 'swap',
    weights = font.weights || [400],
    baseUrl = '/assets/fonts'
  } = options;

  let css = `/* ${font.name} - ${font.nameEn} */\n`;
  css += `/* License: ${font.license} */\n`;
  css += `/* Source: ${font.url} */\n\n`;

  weights.forEach(weight => {
    const fontUrl = `${baseUrl}/${font.id}/${font.id}-${weight}.${format}`;
    
    css += `@font-face {\n`;
    css += `  font-family: '${font.nameEn}';\n`;
    css += `  src: url('${fontUrl}') format('${format === 'woff2' ? 'woff2' : format}');\n`;
    css += `  font-weight: ${weight};\n`;
    css += `  font-style: normal;\n`;
    css += `  font-display: ${display};\n`;
    css += `}\n\n`;
  });

  return css.trim();
}

/**
 * 生成简洁的CSS引用代码
 * @param {Object} font - 字体数据对象
 * @returns {string} 简洁CSS代码
 */
export function generateSimpleCSS(font) {
  return `/* 使用 ${font.name} */
font-family: '${font.nameEn}', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;

/* 或使用 CDN */
@import url('https://cdn.jsdelivr.net/npm/${font.id}@latest/dist/index.css');`;
}

/**
 * 生成字体预览HTML
 * @param {Object} font - 字体数据对象
 * @param {string} text - 预览文本
 * @returns {string} HTML代码
 */
export function generatePreviewHTML(font, text = '字体预览') {
  return `
<div class="font-preview" style="font-family: '${font.nameEn}', sans-serif;">
  <h2 style="font-size: 48px; font-weight: 700;">${text}</h2>
  <p style="font-size: 24px; font-weight: 400;">The quick brown fox jumps over the lazy dog.</p>
  <p style="font-size: 16px; font-weight: 400;">1234567890 !@#$%^&*()</p>
</div>
`;
}

/**
 * 生成字体加载JavaScript代码
 * @param {Object} font - 字体数据对象
 * @returns {string} JavaScript代码
 */
export function generateFontLoaderJS(font) {
  return `
// 动态加载 ${font.name}
const fontUrl = '/assets/fonts/${font.id}/${font.id}-regular.woff2';

const fontFace = new FontFace('${font.nameEn}', \`url(\${fontUrl})\`, {
  weight: '400',
  style: 'normal'
});

fontFace.load().then((loadedFace) => {
  document.fonts.add(loadedFace);
  console.log('${font.name} 加载成功');
}).catch((error) => {
  console.error('${font.name} 加载失败:', error);
});
`;
}

// 导出所有工具函数
export default {
  createCSSTooltip,
  showCSSModal,
  generateFontCSS,
  generateSimpleCSS,
  generatePreviewHTML,
  generateFontLoaderJS
};
