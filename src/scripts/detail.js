/**
 * Font Detail Page Script
 * Handles font detail page interactions
 */

import { getFontById, fonts } from './fonts-data.js';

const FONT_CDN_SOURCES = {
  'harmony-sans': 'https://s1.hdslb.com/bfs/static/jinkela/long/font/regular.css',
  'misans': 'https://cdn.jsdelivr.net/npm/misans@4.0.0/lib/Normal/MiSans-Normal.min.css',
  'alibabapuhuiti': 'https://cdn.jsdelivr.net/npm/alibaba-puhuiti@1.0.0/dist/font.css',
  'sourcehansans': 'https://cdn.jsdelivr.net/npm/source-han-sans-sc@2.004/all.min.css',
  'sourcehanserifs': 'https://cdn.jsdelivr.net/npm/source-han-serif-sc@2.001/all.min.css',
  'lxgwwenkais': 'https://cdn.jsdelivr.net/npm/lxgw-wenkai-webfont@1.7.0/style.css',
  'smileySans': 'https://cdn.jsdelivr.net/npm/smiley-sans@1.1.1/dist/SmileySans-Oblique.css',
  'cascadiacode': 'https://cdn.jsdelivr.net/npm/cascadia-code@2407.24/fonts/cascadia-code.min.css'
};

function getFontIdFromUrl() {
  const params = new URLSearchParams(window.location.search);
  return params.get('id') || params.get('font') || 'harmony-sans';
}

async function loadFont(fontId) {
  const source = FONT_CDN_SOURCES[fontId];
  if (source) {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = source;
    document.head.appendChild(link);
  }
}

function renderFontDetail(font) {
  if (!font) {
    document.getElementById('font-name').textContent = '字体未找到';
    return;
  }

  document.getElementById('breadcrumb-font-name').textContent = font.name;
  document.getElementById('font-name').textContent = font.name;
  document.getElementById('font-description').textContent = font.description;
  
  const previewSample = document.getElementById('preview-sample');
  previewSample.style.fontFamily = `'${font.name}', '${font.nameEn}', sans-serif`;
  previewSample.querySelector('.preview-sample__text').textContent = font.previewText;

  const infoList = document.getElementById('font-info-list');
  infoList.innerHTML = `
    <dt>设计师</dt><dd>${font.designer}</dd>
    <dt>发布年份</dt><dd>${font.year}</dd>
    <dt>分类</dt><dd>${getCategoryName(font.category)}</dd>
    <dt>授权</dt><dd>${font.license}</dd>
    <dt>字重</dt><dd>${font.weights.join(', ')}</dd>
    <dt>字符集</dt><dd>${font.characterSet || '基本拉丁、中文'}</dd>
  `;

  const weightsGrid = document.getElementById('weights-grid');
  weightsGrid.innerHTML = font.weights.map(weight => `
    <div class="weight-item" style="font-family: '${font.name}', '${font.nameEn}', sans-serif; font-weight: ${weight};">
      <span class="weight-label">${getWeightName(weight)}</span>
      <span class="weight-value">${weight}</span>
      <p class="weight-sample">${font.sampleText}</p>
    </div>
  `).join('');

  const licenseInfo = document.getElementById('license-info');
  licenseInfo.innerHTML = `
    <p><strong>${font.license}</strong></p>
    <p>更多信息请访问：<a href="${font.url}" target="_blank" rel="noopener">${font.url}</a></p>
  `;

  const specimenDisplay = document.getElementById('specimen-display');
  specimenDisplay.style.fontFamily = `'${font.name}', '${font.nameEn}', sans-serif`;
  specimenDisplay.textContent = font.sampleText;

  const charsetPreview = document.getElementById('charset-preview');
  charsetPreview.innerHTML = `
    <div class="charset-section">
      <h4>拉丁字母</h4>
      <p class="charset-text" style="font-family: '${font.name}', '${font.nameEn}', sans-serif;">
        ABCDEFGHIJKLMNOPQRSTUVWXYZ<br>
        abcdefghijklmnopqrstuvwxyz<br>
        0123456789
      </p>
    </div>
    <div class="charset-section">
      <h4>标点符号</h4>
      <p class="charset-text" style="font-family: '${font.name}', '${font.nameEn}', sans-serif;">
        ，。、；：？！""''（）《》【】…—·
      </p>
    </div>
    <div class="charset-section">
      <h4>中文字符</h4>
      <p class="charset-text" style="font-family: '${font.name}', '${font.nameEn}', sans-serif;">
        永远相信美好的事情即将发生<br>
        天地玄黄 宇宙洪荒 日月盈昃 辰宿列张
      </p>
    </div>
  `;

  const cssCodeSection = document.getElementById('css-code-section');
  if (cssCodeSection) {
    const cssCode = font.cssCode || `font-family: '${font.name}', '${font.nameEn}', sans-serif;`;
    cssCodeSection.innerHTML = `
      <div class="css-code-block">
        <pre><code id="css-code-text">${escapeHtml(cssCode)}</code></pre>
        <button class="btn btn-ghost btn-sm" id="copy-css-btn" aria-label="复制 CSS 代码">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
          </svg>
          复制代码
        </button>
      </div>
    `;
    
    document.getElementById('copy-css-btn').addEventListener('click', () => {
      copyToClipboard(cssCode);
      showToast('CSS 代码已复制到剪贴板', 'success');
    });
  }

  const otFeatures = document.getElementById('ot-features');
  if (otFeatures && font.openTypeFeatures) {
    const featureDescriptions = {
      'kern': '字距调整 - 优化字符间距',
      'liga': '连字 - 自动替换为连字形式',
      'calt': '上下文替代 - 根据上下文选择字形',
      'mark': '标记定位 - 正确定位重音符号',
      'mkmk': '标记到标记 - 多重标记定位',
      'halt': '水平替代 - 半角字符替代',
      'vhal': '垂直替代 - 直排标点',
      'palt': '比例替代 - 比例间距假名',
      'vpal': '垂直比例 - 垂直排比例间距',
      'zero': '零替代 - 带点零形式',
      'ss01': '风格组合 1 - 替代字形集合',
      'ss02': '风格组合 2 - 替代字形集合',
      'ss03': '风格组合 3 - 替代字形集合',
      'dlig': '自由连字 - 装饰性连字'
    };
    
    otFeatures.innerHTML = font.openTypeFeatures.map(feature => `
      <div class="ot-feature-tag">
        <span class="ot-feature-code">${feature}</span>
        <span class="ot-feature-desc">${featureDescriptions[feature] || 'OpenType 特性'}</span>
      </div>
    `).join('');
  }

  const usageScenarios = document.getElementById('usage-scenarios');
  if (usageScenarios) {
    const scenarios = getUsageScenarios(font.category);
    usageScenarios.innerHTML = scenarios.map(scenario => `
      <div class="scenario-item">
        <span class="scenario-icon">${scenario.icon}</span>
        <span class="scenario-text">${scenario.text}</span>
      </div>
    `).join('');
  }

  const sizeSamples = document.getElementById('size-samples');
  if (sizeSamples) {
    sizeSamples.innerHTML = `
      <h3 class="size-samples__title">不同字号下的渲染效果</h3>
      <div class="size-samples__grid">
        <div class="size-sample" style="font-family: '${font.name}', '${font.nameEn}', sans-serif; font-size: 12px;">
          <span class="size-label">12px</span>
          <span class="size-text">天地玄黄</span>
        </div>
        <div class="size-sample" style="font-family: '${font.name}', '${font.nameEn}', sans-serif; font-size: 16px;">
          <span class="size-label">16px</span>
          <span class="size-text">天地玄黄</span>
        </div>
        <div class="size-sample" style="font-family: '${font.name}', '${font.nameEn}', sans-serif; font-size: 24px;">
          <span class="size-label">24px</span>
          <span class="size-text">天地玄黄</span>
        </div>
        <div class="size-sample" style="font-family: '${font.name}', '${font.nameEn}', sans-serif; font-size: 48px;">
          <span class="size-label">48px</span>
          <span class="size-text">天地玄黄</span>
        </div>
        <div class="size-sample" style="font-family: '${font.name}', '${font.nameEn}', sans-serif; font-size: 72px;">
          <span class="size-label">72px</span>
          <span class="size-text">天地玄黄</span>
        </div>
      </div>
    `;
  }

  const relatedFonts = fonts
    .filter(f => f.category === font.category && f.id !== font.id)
    .slice(0, 3);
  
  const relatedGrid = document.getElementById('related-fonts-grid');
  relatedGrid.innerHTML = relatedFonts.map(f => `
    <a href="/font/${f.id}" class="font-card">
      <div class="font-card__preview" style="font-family: '${f.name}', '${f.nameEn}', sans-serif;">
        ${f.previewText}
      </div>
      <h3 class="font-card__name">${f.name}</h3>
      <p class="font-card__category">${getCategoryName(f.category)}</p>
    </a>
  `).join('');

  const btnDownload = document.getElementById('btn-download');
  if (btnDownload) {
    btnDownload.addEventListener('click', () => {
      openDownloadModal(font);
    });
  }

  const btnPreview = document.getElementById('btn-preview');
  if (btnPreview) {
    btnPreview.addEventListener('click', () => {
      document.getElementById('specimen-display').scrollIntoView({ behavior: 'smooth' });
    });
  }
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

function copyToClipboard(text) {
  if (navigator.clipboard && window.isSecureContext) {
    navigator.clipboard.writeText(text);
  } else {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);
  }
}

function showToast(message, type = 'info') {
  const container = document.querySelector('.toast-container');
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.textContent = message;
  container.appendChild(toast);
  
  setTimeout(() => {
    toast.classList.add('toast-hidden');
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

function getUsageScenarios(category) {
  const scenarios = {
    'sans': [
      { icon: '🖥️', text: '界面设计 - 数字产品 UI' },
      { icon: '📱', text: '移动应用 - APP 界面' },
      { icon: '🌐', text: '网页设计 - 正文排版' },
      { icon: '📊', text: '数据展示 - 图表标签' }
    ],
    'serif': [
      { icon: '📖', text: '书籍排版 - 长篇阅读' },
      { icon: '🎓', text: '学术论文 - 正式文档' },
      { icon: '📰', text: '新闻媒体 - 传统媒体' },
      { icon: '🏛️', text: '品牌标识 - 高端定位' }
    ],
    'mono': [
      { icon: '💻', text: '代码编辑 - 编程开发' },
      { icon: '⌨️', text: '终端显示 - 命令行' },
      { icon: '📝', text: '数据对齐 - 表格数据' },
      { icon: '🔧', text: '技术文档 - API 文档' }
    ],
    'display': [
      { icon: '🎨', text: '创意设计 - 海报设计' },
      { icon: '🏷️', text: '品牌标识 - Logo 设计' },
      { icon: '📢', text: '广告宣传 - 营销材料' },
      { icon: '✨', text: '标题展示 - 吸睛标题' }
    ]
  };
  
  return scenarios[category] || scenarios['sans'];
}

function getCategoryName(category) {
  const names = {
    'sans': '无衬线',
    'serif': '衬线',
    'mono': '等宽',
    'display': '展示'
  };
  return names[category] || category;
}

function getWeightName(weight) {
  const names = {
    100: 'Thin', 200: 'ExtraLight', 300: 'Light', 400: 'Regular',
    500: 'Medium', 600: 'SemiBold', 700: 'Bold', 800: 'ExtraBold', 900: 'Black'
  };
  return names[weight] || weight;
}

function openDownloadModal(font) {
  const modal = document.getElementById('download-modal');
  const downloadOptions = document.getElementById('download-options');
  
  if (!font.downloads || font.downloads.length === 0) {
    downloadOptions.innerHTML = `
      <div class="download-option">
        <p>暂无可用下载链接</p>
        <a href="${font.url}" target="_blank" class="btn btn-primary">前往官网下载</a>
      </div>
    `;
  } else {
    downloadOptions.innerHTML = font.downloads.map((download, index) => `
      <div class="download-option">
        <div class="download-option__header">
          <span class="download-option__format">${download.format.toUpperCase()}</span>
          <span class="download-option__size">${download.size}</span>
        </div>
        <p class="download-option__desc">${getFormatDescription(download.format)}</p>
        <a href="${download.url}" download class="btn btn-primary btn-sm" data-format="${download.format}">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
            <polyline points="7 10 12 15 17 10"/>
            <line x1="12" y1="15" x2="12" y2="3"/>
          </svg>
          下载 ${download.format.toUpperCase()}
        </a>
      </div>
    `).join('');
  }
  
  modal.hidden = false;
  modal.classList.add('modal-overlay--visible');
  
  const closeBtn = document.getElementById('modal-close');
  const cancelBtn = document.getElementById('modal-cancel');
  
  const closeModal = () => {
    modal.classList.remove('modal-overlay--visible');
    setTimeout(() => {
      modal.hidden = true;
    }, 200);
  };
  
  closeBtn.addEventListener('click', closeModal);
  cancelBtn.addEventListener('click', closeModal);
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });
  
  downloadOptions.querySelectorAll('a[download]').forEach(link => {
    link.addEventListener('click', () => {
      showToast('开始下载...', 'success');
    });
  });
}

function getFormatDescription(format) {
  const descriptions = {
    'woff2': 'Web Open Font Format 2.0，现代浏览器推荐格式，压缩率高',
    'woff': 'Web Open Font Format，Web 字体标准格式，兼容性好',
    'ttf': 'TrueType Font，Windows/macOS 通用格式，兼容性最佳',
    'otf': 'OpenType Font，专业排版格式，支持高级特性'
  };
  return descriptions[format] || '字体文件';
}

function initSpecimenControls() {
  const specimenText = document.getElementById('specimen-text');
  const specimenSize = document.getElementById('specimen-size');
  const specimenSizeValue = document.getElementById('specimen-size-value');
  const specimenDisplay = document.getElementById('specimen-display');

  specimenText.addEventListener('input', (e) => {
    specimenDisplay.textContent = e.target.value;
  });

  specimenSize.addEventListener('input', (e) => {
    const size = e.target.value;
    specimenSizeValue.textContent = `${size}px`;
    specimenDisplay.style.fontSize = `${size}px`;
  });
}

async function init() {
  const fontId = getFontIdFromUrl();
  const font = getFontById(fontId);
  
  if (font) {
    await loadFont(fontId);
    renderFontDetail(font);
    initSpecimenControls();
  }
}

document.addEventListener('DOMContentLoaded', init);
