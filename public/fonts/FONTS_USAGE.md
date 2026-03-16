# Font CDN Fallback Configuration

## Quick Start

### 1. Add to HTML `<head>`

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  
  <!-- Primary: Local Fonts -->
  <link rel="stylesheet" href="/fonts/fonts.css">
  
  <!-- CDN Fallback: Noto Sans SC (Google Fonts) -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@100;300;400;500;700;900&display=swap" media="print" onload="this.media='all'">
  
  <!-- Font Loading Script -->
  <script type="module">
    import { FontLoader } from '/src/scripts/font-loader.js';
    
    const fontLoader = new FontLoader({
      timeout: 5000,
      cdnFallback: true
    });
    
    fontLoader.load();
  </script>
</head>
```

### 2. Use in CSS

```css
/* Use CSS custom properties */
body {
  font-family: var(--font-harmonyos);
}

.code-block {
  font-family: var(--font-jetbrains);
}

/* Or use utility classes */
.chinese-text {
  font-family: var(--font-noto);
}
```

### 3. Use in HTML

```html
<!-- Using utility classes -->
<p class="font-harmonyos">华为鸿蒙字体</p>
<p class="font-honor">荣耀字体</p>
<code class="font-jetbrains">const foo = 'bar';</code>
<p class="font-noto">思源黑体</p>
```

## CDN Fallback Strategy

### Priority Order

1. **Local WOFF2 files** (primary) - Fast, no external dependencies
2. **Google Fonts CDN** (fallback for Noto Sans SC only) - Reliable, globally cached
3. **System fonts** (final fallback) - Always available

### Why Only Noto Sans SC Has CDN Fallback?

- **HarmonyOS Sans SC**: Proprietary font, not available on public CDNs
- **HONOR Sans CN**: Proprietary font, not available on public CDNs
- **JetBrains Mono**: Available on GitHub, but local files preferred for performance
- **Noto Sans SC**: Available on Google Fonts with excellent CDN coverage

### Performance Optimization

```html
<!-- Preconnect to CDN domains -->
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>

<!-- Load CSS asynchronously -->
<link rel="stylesheet" href="https://fonts.googleapis.com/..." media="print" onload="this.media='all'">

<!-- Fallback for no-JS -->
<noscript>
  <link rel="stylesheet" href="https://fonts.googleapis.com/...">
</noscript>
```

## Font Loading States

The font loader adds these classes to `<html>`:

- `fonts-loading`: Fonts are being loaded (visibility: hidden)
- `fonts-loaded`: Fonts have loaded (visibility: visible)
- No class: Initial state or JS disabled

## License Summary

| Font | License | Commercial Use |
|------|---------|----------------|
| HarmonyOS Sans SC | Huawei Free License | ✅ Yes |
| HONOR Sans CN | Honor Free License | ✅ Yes |
| JetBrains Mono | OFL-1.1 | ✅ Yes |
| Noto Sans SC | OFL-1.1 | ✅ Yes |

## File Structure

```
public/fonts/
├── fonts.css                 # Main font configuration
├── harmonyos-sans-sc/        # Huawei HarmonyOS fonts
│   └── *.woff2              # (Place font files here)
├── honor-sans-cn/           # Honor fonts
│   └── *.woff2              # (Place font files here)
├── jetbrains-mono/          # JetBrains Mono fonts
│   └── *.woff2              # (Place font files here)
└── noto-sans-sc/            # Noto Sans SC fonts
    └── *.woff2              # (Place font files here)
```

## Download Links

- **HarmonyOS Sans SC**: https://developer.huawei.com/consumer/cn/design/resource/
- **HONOR Sans CN**: https://www.honor.com/cn/brand-font/
- **JetBrains Mono**: https://www.jetbrains.com/lp/mono/
- **Noto Sans SC**: https://fonts.google.com/noto/specimen/Noto+Sans+SC

## Troubleshooting

### Fonts not loading?

1. Check browser console for 404 errors
2. Verify font files exist in correct directories
3. Ensure WOFF2 format (not TTF or OTF)
4. Check CORS headers if serving from different domain

### Fallback not working?

1. Verify CDN link is in `<head>`
2. Check network tab for CDN requests
3. Ensure JavaScript is enabled
4. Test with `cdnFallback: true` in FontLoader options
