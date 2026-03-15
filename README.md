# 字境 | Font Showcase Site

一个基于 paged.js 架构的高端字体展示静态网站，集成 Harmony Sans、Honor Sans JEB 等优质字体资源。

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Status](https://img.shields.io/badge/status-active-success.svg)

## 特性

- **精选字体库** - 收录 HarmonyOS Sans、Honor Sans JEB、MiSans 等 12+ 款优质字体
- **实时预览** - 输入任意文字即可实时预览字体效果
- **PDF 导出** - 基于 paged.js 一键导出精美 PDF 字体样本
- **响应式设计** - 完美适配桌面、平板、移动设备
- **深色模式** - 支持浅色/深色主题切换
- **无障碍访问** - 遵循 WCAG 标准，支持键盘导航和屏幕阅读器

## 技术栈

- **构建工具**: Vite
- **PDF 渲染**: Paged.js
- **样式**: 原生 CSS + CSS Variables
- **字体加载**: Web Font Loader
- **模块系统**: ES Modules

## 项目结构

```
font-showcase-site/
├── docs/                   # 文档
│   ├── design_philosophy.md
│   ├── findings.md
│   └── task_plan.md
├── public/                 # 静态资源
├── src/
│   ├── components/         # 组件
│   ├── pages/             # 页面
│   │   ├── about.html
│   │   └── detail.html
│   ├── scripts/           # JavaScript
│   │   ├── main.js
│   │   ├── fonts-data.js
│   │   ├── hero-canvas.js
│   │   ├── detail.js
│   │   └── about.js
│   ├── styles/            # CSS
│   │   ├── variables.css
│   │   ├── reset.css
│   │   ├── typography.css
│   │   ├── layout.css
│   │   ├── components.css
│   │   ├── paged.css
│   │   ├── main.css
│   │   ├── detail.css
│   │   ├── about.css
│   │   └── algorithms.css
│   ├── index.html
├── package.json
├── vite.config.js
└── README.md
```

## 开发

### 安装依赖

```bash
npm install
```

### 开发服务器

```bash
npm run dev
```

### 构建

```bash
npm run build
```

### 预览生产构建

```bash
npm run preview
```

### 生成 PDF

```bash
npm run generate-pdf
```

## 部署

### Vercel

```bash
vercel --prod
```

### 静态托管

构建后的 `dist/` 目录可以部署到任何静态托管服务：

- Vercel
- Netlify
- GitHub Pages
- Cloudflare Pages

## 字体授权

本网站展示的所有字体均遵循其各自的授权协议：

- **HarmonyOS Sans**: 华为授权
- **Honor Sans JEB**: 荣耀授权
- **MiSans**: 小米授权
- **OPPO Sans**: OPPO 授权
- **Alibaba PuHuiTi**: 免费商用
- **Source Han Sans/Serif**: OFL-1.1
- **LXGW WenKai**: OFL-1.1
- **Cascadia Code**: OFL-1.1
- **Smiley Sans**: OFL-1.1

## 贡献

欢迎提交 Issue 和 Pull Request。

## 许可证

[MIT](LICENSE)

## 致谢

- [Paged.js](https://pagedjs.org/) - PDF 渲染引擎
- [Vite](https://vitejs.dev/) - 构建工具
- [HarmonyOS Sans](https://developer.harmonyos.com/) - 华为字体
- 所有开源字体项目的贡献者

---

Made with ❤️ by 字境团队
