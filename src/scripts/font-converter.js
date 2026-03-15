/**
 * 字体转换工具
 * 支持字体格式转换、CSS生成、WOFF2优化
 */

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
 * 转换字体格式（通过API）
 * @param {File} fontFile - 字体文件
 * @param {string} targetFormat - 目标格式 (woff2, woff, ttf)
 * @returns {Promise<Blob>} 转换后的字体Blob
 */
export async function convertFontFormat(fontFile, targetFormat = 'woff2') {
  const formData = new FormData();
  formData.append('font', fontFile);
  formData.append('format', targetFormat);

  try {
    const response = await fetch('/api/convert', {
      method: 'POST',
      body: formData
    });

    if (!response.ok) {
      throw new Error('字体转换失败');
    }

    return await response.blob();
  } catch (error) {
    console.error('字体转换错误:', error);
    throw error;
  }
}

/**
 * 获取字体文件信息
 * @param {File} fontFile - 字体文件
 * @returns {Promise<Object>} 字体信息
 */
export async function getFontInfo(fontFile) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      const arrayBuffer = e.target.result;
      const uint8Array = new Uint8Array(arrayBuffer);
      
      // 基本字体信息
      const info = {
        name: fontFile.name,
        size: fontFile.size,
        type: fontFile.type,
        format: getFontFormat(fontFile.name),
        // 简单的头部信息检测
        header: {
          sfnt: uint8Array[0] === 0x00 && uint8Array[1] === 0x01 && uint8Array[2] === 0x00 && uint8Array[3] === 0x00,
          woff: String.fromCharCode(...uint8Array.slice(0, 4)) === 'wOFF',
          woff2: String.fromCharCode(...uint8Array.slice(0, 4)) === 'wOF2'
        }
      };
      
      resolve(info);
    };
    
    reader.onerror = () => reject(new Error('读取字体文件失败'));
    reader.readAsArrayBuffer(fontFile);
  });
}

/**
 * 获取字体格式
 * @param {string} filename - 文件名
 * @returns {string} 字体格式
 */
function getFontFormat(filename) {
  const ext = filename.toLowerCase().split('.').pop();
  const formatMap = {
    'woff2': 'WOFF2',
    'woff': 'WOFF',
    'ttf': 'TrueType',
    'otf': 'OpenType',
    'eot': 'Embedded OpenType'
  };
  return formatMap[ext] || 'Unknown';
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
  generateFontCSS,
  generateSimpleCSS,
  generatePreviewHTML,
  convertFontFormat,
  getFontInfo,
  generateFontLoaderJS
};
