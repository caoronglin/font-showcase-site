/**
 * 字体随机API - 返回随机字体数据
 * 支持通过/api/random路径访问
 */

import { fonts } from '../src/scripts/fonts-data.js';

/**
 * 获取随机字体
 * @returns {Object} 随机字体对象
 */
export function getRandomFont() {
  const randomIndex = Math.floor(Math.random() * fonts.length);
  return fonts[randomIndex];
}

/**
 * 获取多个随机字体
 * @param {number} count - 数量
 * @returns {Array} 随机字体数组
 */
export function getRandomFonts(count = 1) {
  const shuffled = [...fonts].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, Math.min(count, fonts.length));
}

/**
 * 根据分类获取随机字体
 * @param {string} category - 字体分类
 * @returns {Object|null} 随机字体对象
 */
export function getRandomFontByCategory(category) {
  const filtered = fonts.filter(font => font.category === category);
  if (filtered.length === 0) return null;
  const randomIndex = Math.floor(Math.random() * filtered.length);
  return filtered[randomIndex];
}

/**
 * Vercel Serverless Function Handler
 */
export default function handler(req, res) {
  // 设置CORS头
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // 处理OPTIONS请求
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    const { query } = req;
    
    // 获取数量参数
    const count = parseInt(query.count) || 1;
    
    // 获取分类参数
    const category = query.category;
    
    // 根据参数返回数据
    let result;
    if (category) {
      // 返回指定分类的随机字体
      if (count === 1) {
        result = getRandomFontByCategory(category);
      } else {
        // 获取多个指定分类的随机字体
        const filtered = fonts.filter(font => font.category === category);
        const shuffled = [...filtered].sort(() => Math.random() - 0.5);
        result = shuffled.slice(0, Math.min(count, filtered.length));
      }
    } else {
      // 返回任意随机字体
      if (count === 1) {
        result = getRandomFont();
      } else {
        result = getRandomFonts(count);
      }
    }

    // 返回JSON响应
    res.status(200).json({
      success: true,
      data: result,
      meta: {
        count: Array.isArray(result) ? result.length : 1,
        total: fonts.length,
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    // 错误处理
    res.status(500).json({
      success: false,
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
}
