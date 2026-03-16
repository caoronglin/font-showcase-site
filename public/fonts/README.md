# 字体系统配置说明

## 📁 目录结构

```
public/fonts/
├── fonts.css              # 主字体 CSS 配置（@font-face 规则）
├── FONTS_USAGE.md         # 使用指南
├── DOWNLOAD_GUIDE.md      # 下载指南（运行 prepare-fonts 后生成）
├── harmonyos-sans-sc/     # 华为鸿蒙字体
│   └── *.woff2
├── honor-sans-cn/         # 荣耀字体
│   └── *.woff2
├── jetbrains-mono/        # JetBrains Mono 编程字体
│   └── *.woff2
└── noto-sans-sc/          # 思源黑体
    └── *.woff2
```

## 🚀 快速开始

### 1. 准备字体文件

```bash
# 检查字体文件状态
npm run prepare-fonts
```

脚本会：
- 检查每个字体目录
- 列出缺失的字体文件
- 生成 `DOWNLOAD_GUIDE.md` 包含下载链接

### 2. 在 HTML 中引入

```html
<head>
  <!-- 本地字体 -->
  <link rel="stylesheet" href="/fonts/fonts.css">
  
  <!-- CDN 回退（思源黑体） -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@100;300;400;500;700;900&display=swap" media="print" onload="this.media='all'">
  
  <!-- 字体加载脚本 -->
  <script type="module">
    import { FontLoader } from '/src/scripts/font-loader.js';
    const loader = new FontLoader({ timeout: 5000, cdnFallback: true });
    loader.load();
  </script>
</head>
```

### 3. 在 CSS 中使用

```css
/* 使用 CSS 变量 */
body {
  font-family: var(--font-harmonyos);
}

code {
  font-family: var(--font-jetbrains);
}

/* 或使用工具类 */
.chinese-text {
  font-family: var(--font-noto);
}
```

## 📦 字体列表

| 字体名称 | 用途 | 许可证 | CDN 回退 |
|---------|------|--------|---------|
| HarmonyOS Sans SC | 中文显示 | 华为免费商用 | ❌ |
| HONOR Sans CN | 中文显示 | 荣耀免费商用 | ❌ |
| JetBrains Mono | 代码显示 | OFL-1.1 | ❌ |
| Noto Sans SC | 中文备用 | OFL-1.1 | ✅ Google Fonts |

## ⚡ 性能优化

### font-display: swap
所有字体都使用 `font-display: swap` 策略，确保文本立即可见，避免 FOIT（Flash of Invisible Text）。

### 预加载关键字体
```html
<link rel="preload" href="/fonts/noto-sans-sc/NotoSansSC-Regular.woff2" as="font" type="font/woff2" crossorigin>
```

### 异步加载 CSS
```html
<link rel="stylesheet" href="/fonts/fonts.css" media="print" onload="this.media='all'">
```

## 🔧 字体转换

如果下载的是 TTF/OTF 格式，需要转换为 WOFF2：

```bash
# 使用 fonttools
pip install fonttools brotli
pyftsubset font.ttf --output-file=font.woff2 --flavor=woff2

# 或使用在线工具
# https://cloudconvert.com/ttf-to-woff2
```

## 📊 字体加载状态

字体加载脚本会添加以下类到 `<html>` 元素：

- 无类名：初始状态或 JS 禁用
- `fonts-loading`: 字体加载中（页面隐藏）
- `fonts-loaded`: 字体加载完成（页面显示）

## 🎯 文件命名规范

格式：`{字体名称}_{字重}.woff2`

示例：
- `HarmonyOS_Sans_SC_Regular.woff2`
- `JetBrainsMono-Bold.woff2`
- `NotoSansSC-Medium.woff2`

字重映射：
- 100 → Thin
- 200 → ExtraLight
- 300 → Light
- 400 → Regular
- 500 → Medium
- 600 → SemiBold
- 700 → Bold
- 800 → ExtraBold
- 900 → Black

## 📝 许可证

所有字体均为免费商用：

- **HarmonyOS Sans SC**: 华为免费字体许可证
- **HONOR Sans CN**: 荣耀免费字体许可证
- **JetBrains Mono**: SIL Open Font License 1.1
- **Noto Sans SC**: SIL Open Font License 1.1

## 🛠️ 故障排除

### 字体不显示
1. 检查浏览器控制台 404 错误
2. 确认字体文件存在于正确目录
3. 验证文件格式为 WOFF2
4. 检查 CORS 配置

### CDN 回退不工作
1. 确认 HTML 中包含 CDN 链接
2. 检查网络面板 CDN 请求
3. 确保启用 JavaScript
4. 验证 `cdnFallback: true`

## 📚 相关资源

- [HarmonyOS Sans SC 下载](https://developer.huawei.com/consumer/cn/design/resource/)
- [HONOR Sans CN 下载](https://www.honor.com/cn/brand-font/)
- [JetBrains Mono 下载](https://www.jetbrains.com/lp/mono/)
- [Noto Sans SC 下载](https://fonts.google.com/noto/specimen/Noto+Sans+SC)
