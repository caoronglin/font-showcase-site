/**
 * Font Data - Font Showcase Site
 * Contains all font information and metadata
 */

export const fonts = [
  {
    id: 'harmony-sans',
    name: 'HarmonyOS Sans',
    nameEn: 'HarmonyOS Sans',
    category: 'sans',
    tags: ['无衬线', '现代', '界面'],
    designer: '华为',
    year: 2021,
    description: '华为鸿蒙系统官方字体，专为数字界面设计，具有出色的可读性和现代感。',
    previewText: 'Harmony 鸿蒙',
    sampleText: '鸿蒙初辟，天地始开。万物互联，智慧生活。',
    weights: [400, 500, 700],
    license: '免费商用',
    url: 'https://developer.harmonyos.com/',
    featured: true,
    downloads: [
      { format: 'woff2', url: 'https://cdn.jsdelivr.net/npm/harmonyos-sans@1.0.0/dist/HarmonyOS_Sans_SC_Regular.woff2', size: '2.4MB' },
      { format: 'ttf', url: 'https://cdn.jsdelivr.net/npm/harmonyos-sans@1.0.0/dist/HarmonyOS_Sans_SC_Regular.ttf', size: '4.1MB' }
    ],
    cssCode: `font-family: 'HarmonyOS Sans', sans-serif;`,
    characterSet: '简体中文、繁体中文、拉丁、西里尔、希腊、阿拉伯',
    openTypeFeatures: ['kern', 'liga', 'calt', 'mark', 'mkmk']
  },
  {
    id: 'honor-sans-jeb',
    name: 'Honor Sans JEB',
    nameEn: 'Honor Sans JEB',
    category: 'sans',
    tags: ['无衬线', '现代', '品牌'],
    designer: '荣耀',
    year: 2022,
    description: '荣耀品牌定制字体，融合了科技感与人文关怀，适用于品牌展示和界面设计。',
    previewText: 'Honor 荣耀',
    sampleText: '勇敢做自己，创造属于我们的荣耀时刻。',
    weights: [400, 500, 600, 700],
    license: '免费商用',
    url: 'https://www.hihonor.com/',
    featured: true,
    downloads: [
      { format: 'woff2', url: 'https://cdn.jsdelivr.net/gh/honor/font/HonorSansJEB-Regular.woff2', size: '2.6MB' },
      { format: 'ttf', url: 'https://cdn.jsdelivr.net/gh/honor/font/HonorSansJEB-Regular.ttf', size: '4.3MB' },
      { format: 'otf', url: 'https://cdn.jsdelivr.net/gh/honor/font/HonorSansJEB-Regular.otf', size: '5.1MB' }
    ],
    cssCode: `@import url('https://cdn.jsdelivr.net/gh/honor/font/HonorSansJEB.css');\n\nfont-family: 'Honor Sans JEB', sans-serif;`,
    characterSet: '简体中文、拉丁、西里尔',
    openTypeFeatures: ['kern', 'liga']
  },
  {
    id: 'opposans',
    name: 'OPPO Sans',
    nameEn: 'OPPO Sans',
    category: 'sans',
    tags: ['无衬线', '现代', '品牌'],
    designer: 'OPPO',
    year: 2019,
    description: 'OPPO 品牌字体，以简洁现代的风格著称，在移动设备上表现优异。',
    previewText: 'OPPO Sans',
    sampleText: '科技以人为本，美学与功能的完美融合。',
    weights: [300, 400, 500, 700],
    license: '免费商用',
    url: 'https://www.oppo.com/',
    featured: false,
    downloads: [
      { format: 'woff2', url: 'https://cdn.jsdelivr.net/gh/oppo/OPPO-Sans/OPPOSans-Regular.woff2', size: '2.5MB' },
      { format: 'ttf', url: 'https://cdn.jsdelivr.net/gh/oppo/OPPO-Sans/OPPOSans-Regular.ttf', size: '4.0MB' },
      { format: 'otf', url: 'https://cdn.jsdelivr.net/gh/oppo/OPPO-Sans/OPPOSans-Regular.otf', size: '4.8MB' }
    ],
    cssCode: `@import url('https://cdn.jsdelivr.net/gh/oppo/OPPO-Sans/OPPOSans.css');\n\nfont-family: 'OPPO Sans', sans-serif;`,
    characterSet: '简体中文、拉丁、希腊、西里尔',
    openTypeFeatures: ['kern', 'liga']
  },
  {
    id: 'misans',
    name: 'MiSans',
    nameEn: 'MiSans',
    category: 'sans',
    tags: ['无衬线', '现代', '界面'],
    designer: '小米',
    year: 2021,
    description: '小米系统字体 MIUI 13 全新定制，更加现代简洁，在屏幕显示上更加清晰锐利。',
    previewText: 'MiSans',
    sampleText: '永远相信美好的事情即将发生，让每个人都能享受科技的乐趣。',
    weights: [100, 200, 300, 400, 500, 600, 700, 800, 900],
    license: '免费商用',
    url: 'https://miui.com/',
    featured: true,
    downloads: [
      { format: 'woff2', url: 'https://cdn.jsdelivr.net/npm/misans@4.0.0/lib/Normal/MiSans-Normal.woff2', size: '3.1MB' },
      { format: 'ttf', url: 'https://cdn.jsdelivr.net/npm/misans@4.0.0/lib/Normal/MiSans-Normal.ttf', size: '5.2MB' },
      { format: 'otf', url: 'https://cdn.jsdelivr.net/npm/misans@4.0.0/lib/Normal/MiSans-Normal.otf', size: '6.0MB' }
    ],
    cssCode: `@import url('https://cdn.jsdelivr.net/npm/misans@4.0.0/lib/Normal/MiSans-Normal.min.css');\n\nfont-family: 'MiSans', sans-serif;`,
    characterSet: '简体中文、繁体中文、拉丁、西里尔、希腊、日文',
    openTypeFeatures: ['kern', 'liga', 'calt']
  },
  {
    id: 'alibabapuhuiti',
    name: '阿里巴巴普惠体',
    nameEn: 'Alibaba PuHuiTi',
    category: 'sans',
    tags: ['无衬线', '现代', '通用'],
    designer: '阿里巴巴',
    year: 2019,
    description: '阿里巴巴首款免费商用字体，普惠设计，永久免费授权，让商业更美好。',
    previewText: '普惠体',
    sampleText: '让天下没有难做的生意，设计让商业更美好。',
    weights: [400, 500, 700, 900],
    license: '免费商用',
    url: 'https://fonts.alibabadesign.com/',
    featured: true,
    downloads: [
      { format: 'woff2', url: 'https://cdn.jsdelivr.net/npm/alibaba-puhuiti@1.0.0/dist/AlibabaPuHuiTi-Regular.woff2', size: '2.7MB' },
      { format: 'ttf', url: 'https://cdn.jsdelivr.net/npm/alibaba-puhuiti@1.0.0/dist/AlibabaPuHuiTi-Regular.ttf', size: '4.5MB' },
      { format: 'otf', url: 'https://cdn.jsdelivr.net/npm/alibaba-puhuiti@1.0.0/dist/AlibabaPuHuiTi-Regular.otf', size: '5.3MB' }
    ],
    cssCode: `@import url('https://cdn.jsdelivr.net/npm/alibaba-puhuiti@1.0.0/dist/font.css');\n\nfont-family: 'Alibaba PuHuiTi', sans-serif;`,
    characterSet: '简体中文、繁体中文、拉丁、西里尔、希腊、阿拉伯、泰文',
    openTypeFeatures: ['kern', 'liga', 'calt']
  },
  {
    id: 'sourcehansans',
    name: '思源黑体',
    nameEn: 'Source Han Sans',
    category: 'sans',
    tags: ['无衬线', '专业', '多语言'],
    designer: 'Adobe & Google',
    year: 2014,
    description: 'Adobe 与 Google 联合开发的开源泛中日韩字体，覆盖多种语言，专业可靠。',
    previewText: '思源黑体',
    sampleText: '思源黑体是 Adobe 与 Google 联合开发的开源字体。',
    weights: [200, 300, 400, 500, 700, 900],
    license: 'OFL-1.1',
    url: 'https://github.com/adobe-fonts/source-han-sans/',
    featured: true,
    downloads: [
      { format: 'woff2', url: 'https://cdn.jsdelivr.net/npm/source-han-sans-sc@2.004/woff2/SourceHanSansSC-Regular.woff2', size: '4.2MB' },
      { format: 'ttf', url: 'https://cdn.jsdelivr.net/npm/source-han-sans-sc@2.004/ttf/SourceHanSansSC-Regular.ttf', size: '6.8MB' },
      { format: 'otf', url: 'https://cdn.jsdelivr.net/npm/source-han-sans-sc@2.004/otf/SourceHanSansSC-Regular.otf', size: '7.5MB' }
    ],
    cssCode: `@import url('https://cdn.jsdelivr.net/npm/source-han-sans-sc@2.004/all.min.css');\n\nfont-family: 'Source Han Sans SC', sans-serif;`,
    characterSet: '简体中文、繁体中文、日文、韩文、拉丁、西里尔、希腊、泰文',
    openTypeFeatures: ['kern', 'liga', 'calt', 'halt', 'vhal']
  },
  {
    id: 'sourcehanserifs',
    name: '思源宋体',
    nameEn: 'Source Han Serif',
    category: 'serif',
    tags: ['衬线', '专业', '多语言'],
    designer: 'Adobe & Google',
    year: 2017,
    description: '思源黑体的衬线伴侣，同样覆盖多种语言，适合正式与学术排版。',
    previewText: '思源宋体',
    sampleText: '思源宋体是思源黑体的衬线伴侣，适合正式排版。',
    weights: [200, 300, 400, 500, 700, 900],
    license: 'OFL-1.1',
    url: 'https://github.com/adobe-fonts/source-han-serif/',
    featured: false,
    downloads: [
      { format: 'woff2', url: 'https://cdn.jsdelivr.net/npm/source-han-serif-sc@2.001/woff2/SourceHanSerifSC-Regular.woff2', size: '4.5MB' },
      { format: 'ttf', url: 'https://cdn.jsdelivr.net/npm/source-han-serif-sc@2.001/ttf/SourceHanSerifSC-Regular.ttf', size: '7.2MB' },
      { format: 'otf', url: 'https://cdn.jsdelivr.net/npm/source-han-serif-sc@2.001/otf/SourceHanSerifSC-Regular.otf', size: '8.0MB' }
    ],
    cssCode: `@import url('https://cdn.jsdelivr.net/npm/source-han-serif-sc@2.001/all.min.css');\n\nfont-family: 'Source Han Serif SC', serif;`,
    characterSet: '简体中文、繁体中文、日文、韩文、拉丁、西里尔、希腊',
    openTypeFeatures: ['kern', 'liga', 'calt', 'palt', 'vpal']
  },
  {
    id: 'lxgwwenkais',
    name: '霞鹜文楷',
    nameEn: 'LXGW WenKai',
    category: 'serif',
    tags: ['衬线', '手写', '文艺'],
    designer: 'LXGW',
    year: 2021,
    description: '基于 Klee One 的衍生字体，带有手写楷体风格，文艺清新。',
    previewText: '霞鹜文楷',
    sampleText: '落霞与孤鹜齐飞，秋水共长天一色。',
    weights: [300, 400, 700],
    license: 'OFL-1.1',
    url: 'https://github.com/lxgw/LxgwWenKai/',
    featured: true,
    downloads: [
      { format: 'woff2', url: 'https://cdn.jsdelivr.net/npm/lxgw-wenkai-webfont@1.7.0/LXGWWenKai-Regular.woff2', size: '3.8MB' },
      { format: 'ttf', url: 'https://cdn.jsdelivr.net/npm/lxgw-wenkai-webfont@1.7.0/LXGWWenKai-Regular.ttf', size: '6.1MB' },
      { format: 'otf', url: 'https://cdn.jsdelivr.net/npm/lxgw-wenkai-webfont@1.7.0/LXGWWenKai-Regular.otf', size: '7.0MB' }
    ],
    cssCode: `@import url('https://cdn.jsdelivr.net/npm/lxgw-wenkai-webfont@1.7.0/style.css');\n\nfont-family: 'LXGW WenKai', cursive;`,
    characterSet: '简体中文、繁体中文、拉丁、西里尔、日文假名',
    openTypeFeatures: ['kern', 'liga']
  },
  {
    id: 'cascadiacode',
    name: 'Cascadia Code',
    nameEn: 'Cascadia Code',
    category: 'mono',
    tags: ['等宽', '编程', '现代'],
    designer: 'Microsoft',
    year: 2019,
    description: '微软为 Windows Terminal 开发的等宽字体，专为代码优化，包含连字支持。',
    previewText: 'Cascadia Code',
    sampleText: 'function hello() { console.log("Hello, World!"); }',
    weights: [400, 700],
    license: 'OFL-1.1',
    url: 'https://github.com/microsoft/cascadia-code/',
    featured: false,
    downloads: [
      { format: 'woff2', url: 'https://cdn.jsdelivr.net/npm/cascadia-code@2407.24/fonts/CascadiaCode-Regular.woff2', size: '1.9MB' },
      { format: 'ttf', url: 'https://cdn.jsdelivr.net/npm/cascadia-code@2407.24/fonts/CascadiaCode-Regular.ttf', size: '3.2MB' },
      { format: 'otf', url: 'https://cdn.jsdelivr.net/npm/cascadia-code@2407.24/fonts/CascadiaCode-Regular.otf', size: '3.8MB' }
    ],
    cssCode: `@import url('https://cdn.jsdelivr.net/npm/cascadia-code@2407.24/fonts/cascadia-code.min.css');\n\nfont-family: 'Cascadia Code', monospace;`,
    characterSet: '拉丁、西里尔、希腊、编程连字、Powerline 符号',
    openTypeFeatures: ['liga', 'calt', 'zero', 'ss01', 'ss02', 'ss03']
  },
  {
    id: 'smileySans',
    name: '得意黑',
    nameEn: 'Smiley Sans',
    category: 'display',
    tags: ['展示', '几何', '独特'],
    designer: 'atelierAnchor',
    year: 2022,
    description: '一款具有明显几何特征的展示字体，带有独特的斜切角度，极具个性。',
    previewText: '得意黑',
    sampleText: '得意黑是一款具有几何特征的展示字体。',
    weights: [400],
    license: 'OFL-1.1',
    url: 'https://github.com/atelier-anchor/smiley-sans/',
    featured: true,
    downloads: [
      { format: 'woff2', url: 'https://cdn.jsdelivr.net/npm/smiley-sans@1.1.1/dist/SmileySans-Oblique.woff2', size: '2.1MB' },
      { format: 'ttf', url: 'https://cdn.jsdelivr.net/npm/smiley-sans@1.1.1/dist/SmileySans-Oblique.ttf', size: '3.5MB' },
      { format: 'otf', url: 'https://cdn.jsdelivr.net/npm/smiley-sans@1.1.1/dist/SmileySans-Oblique.otf', size: '4.2MB' }
    ],
    cssCode: `@import url('https://cdn.jsdelivr.net/npm/smiley-sans@1.1.1/dist/SmileySans-Oblique.css');\n\nfont-family: 'Smiley Sans', sans-serif;`,
    characterSet: '简体中文、拉丁、标点符号',
    openTypeFeatures: ['liga', 'calt', 'dlig']
  }
];

/**
 * Get featured fonts
 */
export function getFeaturedFonts() {
  return fonts.filter(font => font.featured);
}

/**
 * Get fonts by category
 */
export function getFontsByCategory(category) {
  return fonts.filter(font => font.category === category);
}

/**
 * Get font by ID
 */
export function getFontById(id) {
  return fonts.find(font => font.id === id);
}

/**
 * Search fonts
 */
export function searchFonts(query) {
  const lowercaseQuery = query.toLowerCase();
  return fonts.filter(font => 
    font.name.toLowerCase().includes(lowercaseQuery) ||
    font.nameEn.toLowerCase().includes(lowercaseQuery) ||
    font.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery))
  );
}

/**
 * Get all categories
 */
export const categories = [
  { id: 'sans', name: '无衬线', nameEn: 'Sans-serif' },
  { id: 'serif', name: '衬线', nameEn: 'Serif' },
  { id: 'mono', name: '等宽', nameEn: 'Monospace' },
  { id: 'display', name: '展示', nameEn: 'Display' }
];

export default fonts;
