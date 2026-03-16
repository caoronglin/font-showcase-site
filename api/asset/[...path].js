/**
 * 字体资源API路由
 * 
 * 支持的路由:
 * - /api/asset/[fontId]/[weight].woff2 - 字体文件服务
 * - /api/asset/[fontId]/index.css - 字体CSS服务
 * 
 * 查询参数:
 * - format: woff2 | woff | ttf (默认 woff2)
 * - display: auto | block | swap | fallback | optional (默认 swap)
 * - subset: latin | latin-ext | chinese-simplified (可选)
 */

import { getFontById } from '../../src/scripts/fonts-data.js';

// 字体CDN基础URL
const FONT_CDN_BASE = 'https://cdn.jsdelivr.net/npm';

// 字体映射表 - 定义每个字体的CDN路径
const FONT_SOURCES = {
  'harmony-sans': {
    name: 'HarmonyOS_Sans',
    weights: { 400: 'Regular', 500: 'Medium', 700: 'Bold' },
    cdn: 'https://s1.hdslb.com/bfs/static/jinkela/long/font/regular.css'
  },
  'honor-sans-jeb': {
    name: 'HonorSansJEB',
    weights: { 400: 'Regular', 500: 'Medium', 600: 'SemiBold', 700: 'Bold' },
    cdn: null // 使用本地或备用源
  },
  'opposans': {
    name: 'OPPOsans',
    weights: { 300: 'Light', 400: 'Regular', 500: 'Medium', 700: 'Bold' },
    cdn: 'https://cdn.jsdelivr.net/npm/oppo-sans@1.0.0'
  },
  'misans': {
    name: 'MiSans',
    weights: { 100: 'Thin', 200: 'ExtraLight', 300: 'Light', 400: 'Regular', 500: 'Medium', 600: 'SemiBold', 700: 'Bold', 800: 'ExtraBold', 900: 'Black' },
    cdn: 'https://cdn.jsdelivr.net/npm/misans@4.0.0'
  },
  'alibabapuhuiti': {
    name: 'AlibabaPuHuiTi',
    weights: { 400: 'Regular', 500: 'Medium', 700: 'Bold', 900: 'Heavy' },
    cdn: 'https://cdn.jsdelivr.net/npm/alibaba-puhuiti@1.0.0'
  },
  'sourcehansans': {
    name: 'SourceHanSansSC',
    weights: { 200: 'ExtraLight', 300: 'Light', 400: 'Regular', 500: 'Medium', 700: 'Bold', 900: 'Heavy' },
    cdn: 'https://cdn.jsdelivr.net/npm/source-han-sans-sc@2.004'
  },
  'sourcehanserifs': {
    name: 'SourceHanSerifSC',
    weights: { 200: 'ExtraLight', 300: 'Light', 400: 'Regular', 500: 'Medium', 700: 'Bold', 900: 'Heavy' },
    cdn: 'https://cdn.jsdelivr.net/npm/source-han-serif-sc@2.001'
  },
  'lxgwwenkais': {
    name: 'LXGWWenKai',
    weights: { 300: 'Light', 400: 'Regular', 700: 'Bold' },
    cdn: 'https://cdn.jsdelivr.net/npm/lxgw-wenkai-webfont@1.7.0'
  },
  'cascadiacode': {
    name: 'CascadiaCode',
    weights: { 400: 'Regular', 700: 'Bold' },
    cdn: 'https://cdn.jsdelivr.net/npm/cascadia-code@2407.24'
  },
  'smileySans': {
    name: 'SmileySans',
    weights: { 400: 'Regular' },
    cdn: 'https://cdn.jsdelivr.net/npm/smiley-sans@1.1.1'
  }
};

// 字体格式MIME类型映射
const FONT_MIME_TYPES = {
  'woff2': 'font/woff2',
  'woff': 'font/woff',
  'ttf': 'font/ttf',
  'otf': 'font/otf',
  'eot': 'application/vnd.ms-fontobject'
};

// CSS格式映射
const CSS_FORMAT_MAP = {
  'woff2': 'woff2',
  'woff': 'woff',
  'ttf': 'truetype',
  'otf': 'opentype',
  'eot': 'embedded-opentype'
};

/**
 * Vercel Serverless Function Handler
 */
export default async function handler(req, res) {
  // 设置CORS头
  setCorsHeaders(res);
  
  // 处理OPTIONS预检请求
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }
  
  // 只接受GET请求
  if (req.method !== 'GET') {
    res.status(405).json({
      success: false,
      error: '方法不允许，只接受GET请求'
    });
    return;
  }
  
  try {
    // 解析路径参数
    const { path: pathParts } = req.query;
    
    if (!pathParts || pathParts.length < 2) {
      res.status(400).json({
        success: false,
        error: '无效的请求路径。格式: /api/asset/[fontId]/[resource]'
      });
      return;
    }
    
    const [fontId, resource] = pathParts;
    
    // 验证字体ID
    const fontInfo = getFontById(fontId);
    if (!fontInfo) {
      res.status(404).json({
        success: false,
        error: `未找到字体: ${fontId}`
      });
      return;
    }
    
    // 获取查询参数
    const { format = 'woff2', display = 'swap', subset } = req.query;
    
    // 根据资源类型处理请求
    if (resource === 'index.css') {
      // CSS服务
      await handleCssRequest(req, res, { fontId, fontInfo, format, display, subset });
    } else if (resource.match(/^\d+\.(woff2|woff|ttf|otf)$/)) {
      // 字体文件服务
      await handleFontFileRequest(req, res, { fontId, fontInfo, resource, format });
    } else {
      res.status(400).json({
        success: false,
        error: `无效的资源类型: ${resource}。支持: index.css 或 [weight].[format]`
      });
    }
    
  } catch (error) {
    console.error('字体资源API错误:', error);
    res.status(500).json({
      success: false,
      error: error.message || '服务器内部错误',
      timestamp: new Date().toISOString()
    });
  }
}

/**
 * 设置CORS头
 */
function setCorsHeaders(res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Accept');
  res.setHeader('Access-Control-Max-Age', '86400'); // 24小时
}

/**
 * 设置缓存头
 */
function setCacheHeaders(res, type = 'font') {
  // 字体文件和CSS缓存1年
  const maxAge = type === 'font' ? 31536000 : 86400; // 字体1年，CSS 1天
  
  res.setHeader('Cache-Control', `public, max-age=${maxAge}, immutable`);
  res.setHeader('Vary', 'Accept-Encoding');
}

/**
 * 处理CSS请求
 */
async function handleCssRequest(req, res, { fontId, fontInfo, format, display, subset }) {
  const fontSource = FONT_SOURCES[fontId];
  
  if (!fontSource) {
    res.status(404).json({
      success: false,
      error: `字体源未配置: ${fontId}`
    });
    return;
  }
  
  // 生成CSS内容
  const css = generateFontFaceCss({
    fontId,
    fontName: fontInfo.name,
    fontNameEn: fontInfo.nameEn,
    weights: fontInfo.weights,
    fontSource,
    format,
    display,
    subset,
    baseUrl: getBaseUrl(req)
  });
  
  // 设置响应头
  res.setHeader('Content-Type', 'text/css; charset=utf-8');
  setCacheHeaders(res, 'css');
  
  res.status(200).send(css);
}

/**
 * 处理字体文件请求
 */
async function handleFontFileRequest(req, res, { fontId, fontInfo, resource, format }) {
  const fontSource = FONT_SOURCES[fontId];
  
  if (!fontSource) {
    res.status(404).json({
      success: false,
      error: `字体源未配置: ${fontId}`
    });
    return;
  }
  
  // 解析weight和格式
  const match = resource.match(/^(\d+)\.(woff2|woff|ttf|otf)$/);
  if (!match) {
    res.status(400).json({
      success: false,
      error: `无效的字体文件名: ${resource}`
    });
    return;
  }
  
  const weight = parseInt(match[1]);
  const fileFormat = match[2];
  
  // 验证weight是否支持
  if (!fontInfo.weights.includes(weight)) {
    res.status(404).json({
      success: false,
      error: `字体 ${fontInfo.name} 不支持 weight: ${weight}。支持的 weights: ${fontInfo.weights.join(', ')}`
    });
    return;
  }
  
  // 构建字体CDN URL
  const fontUrl = buildFontCdnUrl(fontId, weight, fileFormat);
  
  // 尝试从CDN获取字体
  try {
    const fontResponse = await fetch(fontUrl, {
      headers: {
        'User-Agent': 'Font-Showcase-Site/1.0'
      }
    });
    
    if (!fontResponse.ok) {
      // 尝试备用URL
      const fallbackUrl = buildFallbackFontUrl(fontId, weight, fileFormat);
      if (fallbackUrl) {
        const fallbackResponse = await fetch(fallbackUrl);
        if (fallbackResponse.ok) {
          return streamFontResponse(res, fallbackResponse, fileFormat);
        }
      }
      
      res.status(404).json({
        success: false,
        error: `字体文件不可用: ${resource}`,
        suggestion: `请访问字体官方页面下载: ${fontInfo.url}`
      });
      return;
    }
    
    return streamFontResponse(res, fontResponse, fileFormat);
    
  } catch (error) {
    console.error('获取字体文件失败:', error);
    res.status(502).json({
      success: false,
      error: '无法获取字体文件',
      message: error.message
    });
  }
}

/**
 * 流式返回字体响应
 */
async function streamFontResponse(res, fontResponse, format) {
  const mimeType = FONT_MIME_TYPES[format] || 'application/octet-stream';
  
  res.setHeader('Content-Type', mimeType);
  setCacheHeaders(res, 'font');
  
  // 获取字体数据并返回
  const buffer = await fontResponse.arrayBuffer();
  res.status(200).send(Buffer.from(buffer));
}

/**
 * 生成@font-face CSS
 */
function generateFontFaceCss({ fontId, fontName, fontNameEn, weights, fontSource, format, display, subset, baseUrl }) {
  const cssFormat = CSS_FORMAT_MAP[format] || 'woff2';
  const lines = [];
  
  // 为每个weight生成@font-face
  weights.forEach(weight => {
    const weightName = fontSource.weights[weight] || getWeightName(weight);
    const fontUrl = `${baseUrl}/api/asset/${fontId}/${weight}.${format}`;
    
    lines.push(`/* ${fontName} - ${weightName} (${weight}) */`);
    lines.push('@font-face {');
    lines.push(`  font-family: '${fontName}';`);
    lines.push(`  font-family: '${fontNameEn}';`);
    lines.push(`  font-weight: ${weight};`);
    lines.push(`  font-style: normal;`);
    lines.push(`  font-display: ${display};`);
    lines.push(`  src: url('${fontUrl}') format('${cssFormat}');`);
    
    if (subset) {
      lines.push(`  unicode-range: ${getUnicodeRange(subset)};`);
    }
    
    lines.push('}');
    lines.push('');
  });
  
  // 添加使用示例注释
  lines.push(`/*`);
  lines.push(` * 使用示例:`);
  lines.push(` * font-family: '${fontName}', '${fontNameEn}', sans-serif;`);
  lines.push(` * font-weight: ${weights.join(' | ')};`);
  lines.push(` */`);
  
  return lines.join('\n');
}

/**
 * 构建字体CDN URL
 */
function buildFontCdnUrl(fontId, weight, format) {
  const source = FONT_SOURCES[fontId];
  if (!source || !source.cdn) {
    return null;
  }
  
  const weightName = source.weights[weight] || getWeightName(weight);
  const fileName = `${source.name}-${weightName}.${format}`;
  
  // 特殊处理不同字体的CDN路径
  switch (fontId) {
    case 'misans':
      return `https://cdn.jsdelivr.net/npm/misans@4.0.0/lib/Normal/${weightName}/MiSans-Normal.${format}`;
    case 'sourcehansans':
      return `https://cdn.jsdelivr.net/npm/source-han-sans-sc@2.004/SubsetOTF/SC/${weightName}/SourceHanSansSC-${weightName}.${format}`;
    case 'sourcehanserifs':
      return `https://cdn.jsdelivr.net/npm/source-han-serif-sc@2.001/SubsetOTF/SC/${weightName}/SourceHanSerifSC-${weightName}.${format}`;
    case 'lxgwwenkais':
      return `https://cdn.jsdelivr.net/npm/lxgw-wenkai-webfont@1.7.0/lxgwwenkai-${weightName}.${format}`;
    case 'cascadiacode':
      return `https://cdn.jsdelivr.net/npm/cascadia-code@2407.24/fonts/static/CascadiaCode-${weightName}.${format}`;
    default:
      return `${source.cdn}/fonts/${fileName}`;
  }
}

/**
 * 构建备用字体URL
 */
function buildFallbackFontUrl(fontId, weight, format) {
  const weightName = getWeightName(weight);
  
  // 常用备用CDN
  const fallbacks = {
    'misans': `https://font.sec.miui.com/font/css?family=MiSans:${weightName}:${format}`,
    'sourcehansans': `https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@${weight}`,
    'sourcehanserifs': `https://fonts.googleapis.com/css2?family=Noto+Serif+SC:wght@${weight}`
  };
  
  return fallbacks[fontId] || null;
}

/**
 * 获取weight名称
 */
function getWeightName(weight) {
  const names = {
    100: 'Thin',
    200: 'ExtraLight',
    300: 'Light',
    400: 'Regular',
    500: 'Medium',
    600: 'SemiBold',
    700: 'Bold',
    800: 'ExtraBold',
    900: 'Black'
  };
  return names[weight] || 'Regular';
}

/**
 * 获取Unicode范围
 */
function getUnicodeRange(subset) {
  const ranges = {
    'latin': 'U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD',
    'latin-ext': 'U+0100-024F, U+0259, U+1E00-1EFF, U+2020, U+20A0-20AB, U+20AD-20CF, U+2113, U+2C60-2C7F, U+A720-A7FF',
    'chinese-simplified': 'U+4E00-9FFF, U+3400-4DBF, U+20000-2A6DF, U+2A700-2B73F, U+2B740-2B81F, U+2B820-2CEAF, U+F900-FAFF, U+2F800-2FA1F'
  };
  return ranges[subset] || '';
}

/**
 * 获取API基础URL
 */
function getBaseUrl(req) {
  const protocol = req.headers['x-forwarded-proto'] || 'https';
  const host = req.headers['x-forwarded-host'] || req.headers.host || 'localhost:3000';
  return `${protocol}://${host}`;
}

/**
 * API信息端点
 */
export function getApiInfo() {
  return {
    name: 'Font Asset API',
    version: '1.0.0',
    endpoints: {
      css: '/api/asset/[fontId]/index.css',
      font: '/api/asset/[fontId]/[weight].[format]'
    },
    queryParams: {
      format: 'woff2 | woff | ttf',
      display: 'auto | block | swap | fallback | optional',
      subset: 'latin | latin-ext | chinese-simplified'
    },
    supportedFonts: Object.keys(FONT_SOURCES)
  };
}