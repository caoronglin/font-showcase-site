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
    <p>更多信息请访问: <a href="${font.url}" target="_blank" rel="noopener">${font.url}</a></p>
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
      <h4>中文字符</h4>
      <p class="charset-text" style="font-family: '${font.name}', '${font.nameEn}', sans-serif;">
        永远相信美好的事情即将发生<br>
        天地玄黄 宇宙洪荒 日月盈昃 辰宿列张
      </p>
    </div>
  `;

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

  document.getElementById('btn-download').addEventListener('click', () => {
    window.open(font.url, '_blank');
  });
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