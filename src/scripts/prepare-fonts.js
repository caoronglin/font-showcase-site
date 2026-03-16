#!/usr/bin/env node

/**
 * Font Preparation Script
 * Downloads and prepares WOFF2 font files for the showcase
 * 
 * Usage: node prepare-fonts.js
 */

import { mkdir, writeFile, readFile, readdir } from 'fs/promises';
import { existsSync } from 'fs';
import { join } from 'path';
import { execSync } from 'child_process';

const FONT_DIR = new URL('../../public/fonts', import.meta.url).pathname;
const FONTS = {
  'harmonyos-sans-sc': {
    name: 'HarmonyOS Sans SC',
    weights: ['Thin', 'Light', 'Regular', 'Medium', 'Bold', 'Black'],
    source: 'manual',
    note: 'Download from https://developer.huawei.com/consumer/cn/design/resource/'
  },
  'honor-sans-cn': {
    name: 'HONOR Sans CN',
    weights: ['Thin', 'Light', 'Regular', 'Medium', 'Bold', 'Black'],
    source: 'manual',
    note: 'Download from https://www.honor.com/cn/brand-font/'
  },
  'jetbrains-mono': {
    name: 'JetBrains Mono',
    weights: ['Thin', 'ExtraLight', 'Light', 'Regular', 'Medium', 'SemiBold', 'Bold', 'ExtraBold'],
    source: 'github',
    url: 'https://github.com/JetBrains/JetBrainsMono/releases'
  },
  'noto-sans-sc': {
    name: 'Noto Sans SC',
    weights: ['Thin', 'Light', 'Regular', 'Medium', 'Bold', 'Black'],
    source: 'google-fonts',
    url: 'https://fonts.google.com/noto/specimen/Noto+Sans+SC'
  }
};

async function checkFontFiles() {
  console.log('🔍 Checking font files...\n');
  
  const results = {
    total: 0,
    missing: [],
    present: []
  };

  for (const [dir, config] of Object.entries(FONTS)) {
    const fontDir = join(FONT_DIR, dir);
    
    if (!existsSync(fontDir)) {
      await mkdir(fontDir, { recursive: true });
    }

    const files = await readdir(fontDir).catch(() => []);
    
    for (const weight of config.weights) {
      const fileName = `${config.name.replace(/\s+/g, '_')}-${weight}.woff2`;
      const filePath = join(fontDir, fileName);
      
      results.total++;
      
      if (existsSync(filePath)) {
        results.present.push({ font: config.name, weight, file: fileName });
        console.log(`✅ ${config.name} - ${weight}`);
      } else {
        results.missing.push({ font: config.name, weight, file: fileName });
        console.log(`❌ ${config.name} - ${weight} (missing)`);
      }
    }
    
    console.log('');
  }

  return results;
}

function generateDownloadGuide(results) {
  const guide = `# Font Download Guide

## Missing Fonts (${results.missing.length}/${results.total})

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
\`\`\`
pip install fonttools brotli
pyftsubset font.ttf --output-file=font.woff2 --flavor=woff2
\`\`\`

Or using woff2 tools:
\`\`\`
git clone https://github.com/google/woff2.git
cd woff2 && make clean all
./woff2_compress font.ttf
\`\`\`

### Using Online Converters
- https://cloudconvert.com/ttf-to-woff2
- https://www.fontsquirrel.com/tools/webfont-generator

## File Naming Convention

\`{FontName}_{Weight}.woff2\`

Examples:
- \`HarmonyOS_Sans_SC_Regular.woff2\`
- \`JetBrainsMono-Bold.woff2\`
- \`NotoSansSC-Medium.woff2\`

## After Downloading

1. Place font files in correct directories:
   - \`public/fonts/harmonyos-sans-sc/\`
   - \`public/fonts/honor-sans-cn/\`
   - \`public/fonts/jetbrains-mono/\`
   - \`public/fonts/noto-sans-sc/\`

2. Run this script again to verify: \`node prepare-fonts.js\`

3. Build the project: \`npm run build\`
`;

  return guide;
}

async function main() {
  console.log('🎨 Font Showcase - Font Preparation\n');
  console.log('=' .repeat(50));
  console.log('');

  const results = await checkFontFiles();

  console.log('=' .repeat(50));
  console.log(`\n📊 Summary: ${results.present.length}/${results.total} fonts present`);
  
  if (results.missing.length > 0) {
    console.log(`\n⚠️  ${results.missing.length} fonts are missing\n`);
    
    const guidePath = join(FONT_DIR, 'DOWNLOAD_GUIDE.md');
    const guide = generateDownloadGuide(results);
    
    await writeFile(guidePath, guide);
    console.log(`📝 Download guide saved to: ${guidePath}\n`);
    
    console.log('Next steps:');
    console.log('1. Download missing fonts using the guide');
    console.log('2. Place files in the correct directories');
    console.log('3. Run this script again to verify\n');
  } else {
    console.log('\n✅ All fonts are present!\n');
  }
}

main().catch(console.error);
