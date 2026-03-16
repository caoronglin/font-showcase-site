/**
 * Font Loader Utility
 * Handles font loading with CDN fallback and performance optimization
 */

class FontLoader {
  constructor(options = {}) {
    this.timeout = options.timeout || 5000;
    this.cdnFallback = options.cdnFallback || true;
    this.fonts = [
      { name: 'HarmonyOS Sans SC', weights: [100, 300, 400, 500, 700, 900] },
      { name: 'HONOR Sans CN', weights: [100, 300, 400, 500, 700, 900] },
      { name: 'JetBrains Mono', weights: [100, 200, 300, 400, 500, 600, 700, 800] },
      { name: 'Noto Sans SC', weights: [100, 300, 400, 500, 700, 900] }
    ];
    this.loadedFonts = new Set();
    this.failedFonts = new Set();
  }

  async load() {
    document.documentElement.classList.add('fonts-loading');

    const loadPromises = this.fonts.flatMap(font =>
      font.weights.map(weight => this.loadFont(font.name, weight))
    );

    try {
      await Promise.allSettled(loadPromises);
      document.documentElement.classList.add('fonts-loaded');
      document.documentElement.classList.remove('fonts-loading');
      this.onFontsLoaded();
    } catch (error) {
      console.error('Font loading error:', error);
      this.handleLoadingError();
    }
  }

  async loadFont(fontFamily, fontWeight) {
    const fontKey = `${fontFamily}-${fontWeight}`;
    
    if (this.loadedFonts.has(fontKey)) {
      return true;
    }

    try {
      const font = new FontFace(fontFamily, `url(/fonts/${this.getFontPath(fontFamily)}/${this.getFontFileName(fontFamily, fontWeight)}) format('woff2')`, {
        weight: fontWeight,
        display: 'swap'
      });

      const loadedFont = await Promise.race([
        font.load(),
        this.createTimeout(this.timeout)
      ]);

      document.fonts.add(loadedFont);
      this.loadedFonts.add(fontKey);
      return true;
    } catch (error) {
      this.failedFonts.add(fontKey);
      
      if (this.cdnFallback) {
        return this.loadCDNFallback(fontFamily, fontWeight);
      }
      
      throw error;
    }
  }

  async loadCDNFallback(fontFamily, fontWeight) {
    if (fontFamily !== 'Noto Sans SC') {
      return false;
    }

    try {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = `https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@${fontWeight}&display=swap`;
      link.media = 'print';
      
      return new Promise((resolve, reject) => {
        link.onload = () => {
          link.media = 'all';
          this.loadedFonts.add(`${fontFamily}-${fontWeight}-cdn`);
          resolve(true);
        };
        link.onerror = reject;
        document.head.appendChild(link);
      });
    } catch (error) {
      console.warn(`CDN fallback failed for ${fontFamily}:`, error);
      return false;
    }
  }

  getFontPath(fontFamily) {
    const paths = {
      'HarmonyOS Sans SC': 'harmonyos-sans-sc',
      'HONOR Sans CN': 'honor-sans-cn',
      'JetBrains Mono': 'jetbrains-mono',
      'Noto Sans SC': 'noto-sans-sc'
    };
    return paths[fontFamily] || '';
  }

  getFontFileName(fontFamily, fontWeight) {
    const weightMap = {
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

    const weightName = weightMap[fontWeight] || 'Regular';
    const familyPrefix = fontFamily.replace(/\s+/g, '_');
    return `${familyPrefix}-${weightName}.woff2`;
  }

  createTimeout(ms) {
    return new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Font loading timeout')), ms);
    });
  }

  onFontsLoaded() {
    console.log('All fonts loaded successfully');
    if (this.failedFonts.size > 0) {
      console.warn('Some fonts failed to load:', Array.from(this.failedFonts));
    }
  }

  handleLoadingError() {
    document.documentElement.classList.remove('fonts-loading');
    document.documentElement.classList.add('fonts-loaded');
    console.warn('Font loading completed with errors, using fallbacks');
  }

  getLoadingStatus() {
    return {
      loaded: Array.from(this.loadedFonts),
      failed: Array.from(this.failedFonts),
      successRate: `${((this.loadedFonts.size / (this.loadedFonts.size + this.failedFonts.size)) * 100).toFixed(1)}%`
    };
  }
}

export { FontLoader };
