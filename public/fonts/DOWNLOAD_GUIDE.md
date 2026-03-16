# Font Download Guide

## Missing Fonts (26/26)

### HarmonyOS Sans SC (华为鸿蒙字体)
- **Source**: Huawei Developer Resources
- **URL**: https://developer.huawei.com/consumer/cn/design/resource/
- **License**: Free for commercial use
- **Files needed**: Thin, Light, Regular, Medium, Bold, Black

### HONOR Sans CN (荣耀字体)
- **Source**: Honor Official Website
- **URL**: https://www.honor.com/cn/brand-font/
- **License**: Free for commercial use
- **Files needed**: Thin, Light, Regular, Medium, Bold, Black

### JetBrains Mono
- **Source**: GitHub Releases
- **URL**: https://github.com/JetBrains/JetBrainsMono/releases
- **License**: OFL-1.1
- **Files needed**: Download the TTF package and convert to WOFF2

### Noto Sans SC (思源黑体)
- **Source**: Google Fonts
- **URL**: https://fonts.google.com/noto/specimen/Noto+Sans+SC
- **License**: OFL-1.1
- **Files needed**: Download from Google Fonts or use CDN fallback

## Conversion Instructions

### Convert TTF to WOFF2 (if needed)

Using fonttools:
```
pip install fonttools brotli
pyftsubset font.ttf --output-file=font.woff2 --flavor=woff2
```

Or using woff2 tools:
```
git clone https://github.com/google/woff2.git
cd woff2 && make clean all
./woff2_compress font.ttf
```

### Using Online Converters
- https://cloudconvert.com/ttf-to-woff2
- https://www.fontsquirrel.com/tools/webfont-generator

## File Naming Convention

`{FontName}_{Weight}.woff2`

Examples:
- `HarmonyOS_Sans_SC_Regular.woff2`
- `JetBrainsMono-Bold.woff2`
- `NotoSansSC-Medium.woff2`

## After Downloading

1. Place font files in correct directories:
   - `public/fonts/harmonyos-sans-sc/`
   - `public/fonts/honor-sans-cn/`
   - `public/fonts/jetbrains-mono/`
   - `public/fonts/noto-sans-sc/`

2. Run this script again to verify: `node prepare-fonts.js`

3. Build the project: `npm run build`
