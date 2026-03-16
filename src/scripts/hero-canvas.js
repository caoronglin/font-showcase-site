/**
 * Hero Canvas Animation - 墨韵流形 | Ink Flow Manifolds
 * 
 * 一种计算美学系统，将中国传统书法的墨韵意境与现代粒子系统动力学融合。
 * 通过多层 Perlin 噪声构建流场，粒子在其中运动模拟墨水在宣纸上自然晕染、流动的过程。
 * 
 * 算法特点:
 * - 改进的 Simplex 噪声生成流场
 * - 粒子系统模拟墨滴的生死循环
 * - 鼠标交互（排斥 - 吸引双模式）
 * - 离屏 Canvas 优化性能
 * - 平滑入场动画
 * - 暗色模式自适应
 * 
 * @version 2.0.0
 * @author Font Showcase Site
 */

// ============================================
// 配置参数 | Configuration
// ============================================
const CONFIG = {
  // 粒子系统
  particle: {
    minCount: 50,           // 最小粒子数
    maxCount: 150,          // 最大粒子数
    baseSize: 2,            // 基础大小
    sizeVariance: 1.5,      // 大小变化范围
    minSpeed: 0.2,          // 最小速度
    maxSpeed: 1.5,          // 最大速度
    inkDecay: 0.002,        // 墨量衰减率
    respawnMargin: 50       // 重生边距（像素）
  },
  
  // 流场参数
  flowField: {
    octaves: 4,             // 噪声层数
    persistence: 0.5,       // 持久度（振幅衰减）
    lacunarity: 2.0,        // 间隙度（频率增加）
    scale: 0.003,           // 基础缩放
    timeScale: 0.15,        // 时间演化速度
    zOffset: 100            // 噪声 Z 轴偏移
  },
  
  // 交互参数
  interaction: {
    attractRadius: 200,     // 吸引半径
    repelRadius: 150,       // 排斥半径
    attractStrength: 0.15,  // 吸引强度
    repelStrength: 0.8,     // 排斥强度
    moveSpeedThreshold: 2   // 鼠标移动速度阈值（区分吸引/排斥）
  },
  
  // 性能优化
  performance: {
    offscreenSyncRate: 3,   // 离屏同步频率（每 N 帧同步一次）
    spatialHashCellSize: 40,// 空间哈希单元格大小
    maxDistance: 150        // 最大连接距离
  },
  
  // 动画
  animation: {
    entranceDuration: 2500, // 入场动画时长（毫秒）
    entranceStagger: 30     // 粒子入场间隔（毫秒）
  }
};

// ============================================
// Simplex 噪声实现 | Simplex Noise Implementation
// ============================================
class SimplexNoise {
  constructor(seed = Math.random()) {
    this.p = new Uint8Array(256);
    this.perm = new Uint8Array(512);
    this.permMod12 = new Uint8Array(512);
    
    // 初始化置换表
    for (let i = 0; i < 256; i++) {
      this.p[i] = Math.floor(seed * 256);
      seed = (seed * 16807) % 2147483647;
    }
    
    for (let i = 0; i < 512; i++) {
      this.perm[i] = this.p[i & 255];
      this.permMod12[i] = this.perm[i] % 12;
    }
    
    // 梯度向量
    this.grad3 = [
      [1,1,0],[-1,1,0],[1,-1,0],[-1,-1,0],
      [1,0,1],[-1,0,1],[1,0,-1],[-1,0,-1],
      [0,1,1],[0,-1,1],[0,1,-1],[0,-1,-1]
    ];
  }
  
  // 2D Simplex 噪声
  noise2D(xin, yin) {
    const F2 = 0.5 * (Math.sqrt(3) - 1);
    const G2 = (3 - Math.sqrt(3)) / 6;
    
    let n0, n1, n2;
    
    // 确定单形（三角形）
    const s = (xin + yin) * F2;
    const i = Math.floor(xin + s);
    const j = Math.floor(yin + s);
    
    const t = (i + j) * G2;
    const X0 = i - t;
    const Y0 = j - t;
    const x0 = xin - X0;
    const y0 = yin - Y0;
    
    // 确定哪个单形
    let i1, j1;
    if (x0 > y0) {
      i1 = 1; j1 = 0;
    } else {
      i1 = 0; j1 = 1;
    }
    
    const x1 = x0 - i1 + G2;
    const y1 = y0 - j1 + G2;
    const x2 = x0 - 1 + 2 * G2;
    const y2 = y0 - 1 + 2 * G2;
    
    const ii = i & 255;
    const jj = j & 255;
    
    // 计算贡献值
    let t0 = 0.5 - x0 * x0 - y0 * y0;
    if (t0 < 0) {
      n0 = 0;
    } else {
      t0 *= t0;
      const gi0 = this.permMod12[ii + this.perm[jj]] * 3;
      n0 = t0 * t0 * (this.grad3[gi0][0] * x0 + this.grad3[gi0][1] * y0);
    }
    
    let t1 = 0.5 - x1 * x1 - y1 * y1;
    if (t1 < 0) {
      n1 = 0;
    } else {
      t1 *= t1;
      const gi1 = this.permMod12[ii + i1 + this.perm[jj + j1]] * 3;
      n1 = t1 * t1 * (this.grad3[gi1][0] * x1 + this.grad3[gi1][1] * y1);
    }
    
    let t2 = 0.5 - x2 * x2 - y2 * y2;
    if (t2 < 0) {
      n2 = 0;
    } else {
      t2 *= t2;
      const gi2 = this.permMod12[ii + 1 + this.perm[jj + 1]] * 3;
      n2 = t2 * t2 * (this.grad3[gi2][0] * x2 + this.grad3[gi2][1] * y2);
    }
    
    // 归一化到 [-1, 1]
    return 70 * (n0 + n1 + n2);
  }
  
  // 分形布朗运动（多层噪声叠加）
  fbm(x, y, time, octaves = 4, persistence = 0.5, lacunarity = 2.0) {
    let total = 0;
    let frequency = 1;
    let amplitude = 1;
    let maxValue = 0;
    
    for (let i = 0; i < octaves; i++) {
      total += this.noise2D(
        x * frequency + time,
        y * frequency + time * 0.5
      ) * amplitude;
      
      maxValue += amplitude;
      amplitude *= persistence;
      frequency *= lacunarity;
    }
    
    return total / maxValue;
  }
}

// ============================================
// 粒子类 | Particle Class
// ============================================
class InkParticle {
  constructor(width, height, index, total) {
    this.width = width;
    this.height = height;
    this.index = index;
    this.total = total;
    
    // 初始位置（边缘随机分布）
    this.reset();
    
    // 入场动画
    this.entranceProgress = 0;
    this.entranceDelay = index * CONFIG.animation.entranceStagger;
    this.entranceDuration = CONFIG.animation.entranceDuration;
  }
  
  reset() {
    // 从画布边缘随机位置开始
    const side = Math.floor(Math.random() * 4);
    const margin = CONFIG.particle.respawnMargin;
    
    switch (side) {
      case 0: // 上
        this.x = Math.random() * this.width;
        this.y = -margin;
        break;
      case 1: // 右
        this.x = this.width + margin;
        this.y = Math.random() * this.height;
        break;
      case 2: // 下
        this.x = Math.random() * this.width;
        this.y = this.height + margin;
        break;
      case 3: // 左
        this.x = -margin;
        this.y = Math.random() * this.height;
        break;
    }
    
    // 物理属性
    this.vx = 0;
    this.vy = 0;
    this.size = CONFIG.particle.baseSize + Math.random() * CONFIG.particle.sizeVariance;
    this.maxSpeed = CONFIG.particle.minSpeed + Math.random() * (CONFIG.particle.maxSpeed - CONFIG.particle.minSpeed);
    
    // 墨量（不透明度）
    this.ink = 0.6 + Math.random() * 0.4;
    this.maxInk = this.ink;
    
    // 历史轨迹（用于绘制平滑线条）
    this.history = [];
    this.historyMaxLength = 5;
    
    // 是否活跃
    this.active = false;
  }
  
  activate() {
    this.active = true;
  }
  
  update(deltaTime, flowField, noiseGen, time, mouse) {
    // 入场动画
    if (!this.active) {
      const elapsed = Date.now() - this.entranceDelay;
      if (elapsed >= 0) {
        this.entranceProgress = Math.min(1, elapsed / this.entranceDuration);
        this.ink = this.maxInk * this.easeOutCubic(this.entranceProgress);
        if (this.entranceProgress >= 1) {
          this.active = true;
        }
      }
      return;
    }
    
    // 记录历史位置
    this.history.push({ x: this.x, y: this.y });
    if (this.history.length > this.historyMaxLength) {
      this.history.shift();
    }
    
    // 从流场获取方向
    const nx = this.x * CONFIG.flowField.scale;
    const ny = this.y * CONFIG.flowField.scale;
    const angle = flowField.getValue(nx, ny, time) * Math.PI * 4;
    
    // 应用流场力
    const targetVx = Math.cos(angle) * this.maxSpeed;
    const targetVy = Math.sin(angle) * this.maxSpeed;
    
    // 平滑过渡
    this.vx += (targetVx - this.vx) * 0.05;
    this.vy += (targetVy - this.vy) * 0.05;
    
    // 鼠标交互
    if (mouse.active) {
      const dx = this.x - mouse.x;
      const dy = this.y - mouse.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      
      // 计算鼠标移动速度
      const mouseSpeed = Math.sqrt(mouse.vx * mouse.vx + mouse.vy * mouse.vy);
      
      if (dist < (mouseSpeed > CONFIG.interaction.moveSpeedThreshold ? 
                  CONFIG.interaction.repelRadius : CONFIG.interaction.attractRadius)) {
        const force = mouseSpeed > CONFIG.interaction.moveSpeedThreshold ?
          CONFIG.interaction.repelStrength : CONFIG.interaction.attractStrength;
        const normalizedDist = dist / (mouseSpeed > CONFIG.interaction.moveSpeedThreshold ?
          CONFIG.interaction.repelRadius : CONFIG.interaction.attractRadius);
        const strength = force * (1 - normalizedDist);
        
        this.vx += (dx / dist) * strength * (mouseSpeed > CONFIG.interaction.moveSpeedThreshold ? 1 : -1);
        this.vy += (dy / dist) * strength * (mouseSpeed > CONFIG.interaction.moveSpeedThreshold ? 1 : -1);
      }
    }
    
    // 限制速度
    const speed = Math.sqrt(this.vx * this.vx + this.vy * this.vy);
    if (speed > this.maxSpeed * 1.5) {
      this.vx = (this.vx / speed) * this.maxSpeed * 1.5;
      this.vy = (this.vy / speed) * this.maxSpeed * 1.5;
    }
    
    // 更新位置
    this.x += this.vx;
    this.y += this.vy;
    
    // 墨量衰减
    this.ink -= CONFIG.particle.inkDecay;
    
    // 边界检测与重生
    if (this.ink <= 0.05 || 
        this.x < -CONFIG.particle.respawnMargin * 2 ||
        this.x > this.width + CONFIG.particle.respawnMargin * 2 ||
        this.y < -CONFIG.particle.respawnMargin * 2 ||
        this.y > this.height + CONFIG.particle.respawnMargin * 2) {
      this.reset();
      this.entranceProgress = 0;
      this.entranceDelay = 0;
      this.entranceDuration = 500 + Math.random() * 500;
      this.active = false;
    }
  }
  
  easeOutCubic(t) {
    return 1 - Math.pow(1 - t, 3);
  }
}

// ============================================
// 流场类 | Flow Field Class
// ============================================
class FlowField {
  constructor(width, height, noiseGen) {
    this.width = Math.ceil(width / CONFIG.performance.spatialHashCellSize);
    this.height = Math.ceil(height / CONFIG.performance.spatialHashCellSize);
    this.cellSize = CONFIG.performance.spatialHashCellSize;
    this.noiseGen = noiseGen;
    this.values = new Float32Array(this.width * this.height);
  }
  
  update(time) {
    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        const value = this.noiseGen.fbm(
          x / this.width,
          y / this.height,
          time * CONFIG.flowField.timeScale,
          CONFIG.flowField.octaves,
          CONFIG.flowField.persistence,
          CONFIG.flowField.lacunarity
        );
        this.values[y * this.width + x] = value;
      }
    }
  }
  
  getValue(x, y, time) {
    const gx = Math.floor(x * this.width);
    const gy = Math.floor(y * this.height);
    
    // 边界钳制
    const clampedX = Math.max(0, Math.min(this.width - 1, gx));
    const clampedY = Math.max(0, Math.min(this.height - 1, gy));
    
    return this.values[clampedY * this.width + clampedX];
  }
  
  resize(width, height) {
    this.width = Math.ceil(width / CONFIG.performance.spatialHashCellSize);
    this.height = Math.ceil(height / CONFIG.performance.spatialHashCellSize);
    this.cellSize = CONFIG.performance.spatialHashCellSize;
    this.values = new Float32Array(this.width * this.height);
  }
}

// ============================================
// 空间哈希（性能优化） | Spatial Hash
// ============================================
class SpatialHash {
  constructor(cellSize = CONFIG.performance.spatialHashCellSize) {
    this.cellSize = cellSize;
    this.grid = new Map();
  }
  
  clear() {
    this.grid.clear();
  }
  
  getKey(x, y) {
    const gx = Math.floor(x / this.cellSize);
    const gy = Math.floor(y / this.cellSize);
    return `${gx},${gy}`;
  }
  
  add(particle) {
    const key = this.getKey(particle.x, particle.y);
    if (!this.grid.has(key)) {
      this.grid.set(key, []);
    }
    this.grid.get(key).push(particle);
  }
  
  getNearby(particle, radius) {
    const nearby = [];
    const cellRadius = Math.ceil(radius / this.cellSize);
    const gx = Math.floor(particle.x / this.cellSize);
    const gy = Math.floor(particle.y / this.cellSize);
    
    for (let dy = -cellRadius; dy <= cellRadius; dy++) {
      for (let dx = -cellRadius; dx <= cellRadius; dx++) {
        const key = `${gx + dx},${gy + dy}`;
        if (this.grid.has(key)) {
          nearby.push(...this.grid.get(key));
        }
      }
    }
    
    return nearby;
  }
}

// ============================================
// 主动画系统 | Main Animation System
// ============================================
export function initHeroCanvas() {
  const canvas = document.getElementById('hero-canvas');
  if (!canvas) return;
  
  const ctx = canvas.getContext('2d');
  
  // 离屏 Canvas（用于优化）
  let offscreenCanvas;
  let offscreenCtx;
  
  // 系统状态
  let particles = [];
  let flowField;
  let spatialHash;
  let noiseGen;
  let animationId;
  let frameCount = 0;
  let startTime = Date.now();
  let lastMouseX = 0;
  let lastMouseY = 0;
  
  // 鼠标状态
  const mouse = {
    x: -1000,
    y: -1000,
    vx: 0,
    vy: 0,
    active: false
  };
  
  // 颜色缓存
  let colorCache = {
    particle: '115, 115, 115',
    line: '0, 0, 0',
    isDark: false
  };
  
  // ============================================
  // 初始化函数
  // ============================================
  function init() {
    // 初始化噪声生成器（固定种子保证可重现性）
    noiseGen = new SimplexNoise(12345);
    
    // 调整 Canvas 尺寸
    resize();
    
    // 创建粒子
    createParticles();
    
    // 初始化流场
    flowField = new FlowField(canvas.offsetWidth, canvas.offsetHeight, noiseGen);
    
    // 初始化空间哈希
    spatialHash = new SpatialHash();
    
    // 创建离屏 Canvas
    offscreenCanvas = document.createElement('canvas');
    offscreenCanvas.width = canvas.width;
    offscreenCanvas.height = canvas.height;
    offscreenCtx = offscreenCanvas.getContext('2d');
    
    // 开始动画
    startTime = Date.now();
    animate();
  }
  
  function resize() {
    const dpr = window.devicePixelRatio || 1;
    canvas.width = canvas.offsetWidth * dpr;
    canvas.height = canvas.offsetHeight * dpr;
    ctx.scale(dpr, dpr);
    
    // 重置粒子位置
    if (particles.length > 0) {
      particles.forEach(p => {
        p.width = canvas.offsetWidth;
        p.height = canvas.offsetHeight;
      });
    }
  }
  
  function createParticles() {
    const count = Math.min(
      CONFIG.particle.maxCount,
      Math.max(
        CONFIG.particle.minCount,
        Math.floor(canvas.offsetWidth / 8)
      )
    );
    
    particles = [];
    for (let i = 0; i < count; i++) {
      particles.push(new InkParticle(
        canvas.offsetWidth,
        canvas.offsetHeight,
        i,
        count
      ));
    }
  }
  
  // ============================================
  // 颜色系统
  // ============================================
  function updateColors() {
    const isDark = document.documentElement.classList.contains('dark') ||
                   window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (isDark !== colorCache.isDark) {
      colorCache.isDark = isDark;
      colorCache.particle = isDark ? '180, 180, 180' : '80, 80, 80';
      colorCache.line = isDark ? '255, 255, 255' : '0, 0, 0';
    }
    
    return colorCache;
  }
  
  // ============================================
  // 绘制函数
  // ============================================
  function draw() {
    const colors = updateColors();
    const time = (Date.now() - startTime) * 0.001;
    
    // 更新流场（每 3 帧更新一次以优化性能）
    if (frameCount % CONFIG.performance.offscreenSyncRate === 0) {
      flowField.update(time);
    }
    
    // 更新粒子
    particles.forEach(particle => {
      particle.update(16, flowField, noiseGen, time, mouse);
    });
    
    // 更新鼠标速度
    mouse.vx = mouse.x - lastMouseX;
    mouse.vy = mouse.y - lastMouseY;
    lastMouseX = mouse.x;
    lastMouseY = mouse.y;
    
    // 清空主画布
    ctx.clearRect(0, 0, canvas.offsetWidth, canvas.offsetHeight);
    
    // 清空离屏画布
    offscreenCtx.clearRect(0, 0, canvas.offsetWidth, canvas.offsetHeight);
    
    // 构建空间哈希
    spatialHash.clear();
    particles.forEach(particle => {
      if (particle.active) {
        spatialHash.add(particle);
      }
    });
    
    // 在离屏画布上绘制连接线和粒子
    particles.forEach((particle, i) => {
      if (!particle.active) return;
      
      // 查找附近的粒子
      const nearby = spatialHash.getNearby(particle, CONFIG.performance.maxDistance);
      
      // 绘制连接线
      nearby.forEach(other => {
        if (other.index <= particle.index) return; // 避免重复绘制
        
        const dx = particle.x - other.x;
        const dy = particle.y - other.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < CONFIG.performance.maxDistance) {
          const alpha = (1 - distance / CONFIG.performance.maxDistance) * 0.15;
          offscreenCtx.beginPath();
          offscreenCtx.moveTo(particle.x, particle.y);
          offscreenCtx.lineTo(other.x, other.y);
          offscreenCtx.strokeStyle = `rgba(${colors.line}, ${alpha})`;
          offscreenCtx.lineWidth = 0.5;
          offscreenCtx.stroke();
        }
      });
      
      // 绘制粒子轨迹（使用历史位置）
      if (particle.history.length > 1) {
        offscreenCtx.beginPath();
        offscreenCtx.moveTo(particle.history[0].x, particle.history[0].y);
        for (let i = 1; i < particle.history.length; i++) {
          offscreenCtx.lineTo(particle.history[i].x, particle.history[i].y);
        }
        const trailAlpha = particle.ink * 0.3;
        offscreenCtx.strokeStyle = `rgba(${colors.particle}, ${trailAlpha})`;
        offscreenCtx.lineWidth = particle.size * 0.5;
        offscreenCtx.lineCap = 'round';
        offscreenCtx.stroke();
      }
      
      // 绘制粒子主体
      offscreenCtx.beginPath();
      offscreenCtx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
      offscreenCtx.fillStyle = `rgba(${colors.particle}, ${particle.ink})`;
      offscreenCtx.fill();
    });
    
    // 将离屏画布内容复制到主画布
    ctx.drawImage(offscreenCanvas, 0, 0);
    
    // 增加帧计数
    frameCount++;
    
    // 继续动画循环
    animationId = requestAnimationFrame(draw);
  }
  
  // ============================================
  // 事件监听器
  // ============================================
  function setupEventListeners() {
    // 窗口大小变化
    window.addEventListener('resize', () => {
      resize();
      createParticles();
      flowField.resize(canvas.offsetWidth, canvas.offsetHeight);
      
      // 重置离屏 Canvas
      offscreenCanvas.width = canvas.width;
      offscreenCanvas.height = canvas.height;
    }, { passive: true });
    
    // 鼠标移动
    canvas.addEventListener('mousemove', (e) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
      mouse.active = true;
    });
    
    // 鼠标离开
    canvas.addEventListener('mouseleave', () => {
      mouse.active = false;
      mouse.x = -1000;
      mouse.y = -1000;
    });
    
    // 触摸支持
    canvas.addEventListener('touchmove', (e) => {
      e.preventDefault();
      const rect = canvas.getBoundingClientRect();
      const touch = e.touches[0];
      mouse.x = touch.clientX - rect.left;
      mouse.y = touch.clientY - rect.top;
      mouse.active = true;
    }, { passive: false });
    
    canvas.addEventListener('touchend', () => {
      mouse.active = false;
    });
    
    // 页面可见性
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        if (animationId) {
          cancelAnimationFrame(animationId);
        }
      } else {
        startTime = Date.now() - frameCount * 16; // 保持时间连续性
        draw();
      }
    });
    
    // 暗色模式监听
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    mediaQuery.addEventListener('change', updateColors);
  }
  
  // ============================================
  // 启动
  // ============================================
  setupEventListeners();
  init();
}

export default initHeroCanvas;
