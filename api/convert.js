/**
 * 字体格式转换API
 * 支持将字体文件转换为WOFF2、WOFF、TTF等格式
 */

import { exec } from 'child_process';
import { promisify } from 'util';
import path from 'path';
import fs from 'fs/promises';
import os from 'os';

const execAsync = promisify(exec);

/**
 * Vercel Serverless Function Handler
 * 处理字体格式转换请求
 */
export default async function handler(req, res) {
  // 设置CORS头
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // 处理OPTIONS请求
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // 只接受POST请求
  if (req.method !== 'POST') {
    res.status(405).json({
      success: false,
      error: '方法不允许，只接受POST请求'
    });
    return;
  }

  try {
    // 获取请求体
    const { fontData, sourceFormat, targetFormat, options = {} } = req.body;

    // 验证必要参数
    if (!fontData || !targetFormat) {
      res.status(400).json({
        success: false,
        error: '缺少必要参数: fontData 或 targetFormat'
      });
      return;
    }

    // 支持的目标格式
    const supportedFormats = ['woff2', 'woff', 'ttf', 'otf', 'eot'];
    if (!supportedFormats.includes(targetFormat.toLowerCase())) {
      res.status(400).json({
        success: false,
        error: `不支持的目标格式: ${targetFormat}。支持的格式: ${supportedFormats.join(', ')}`
      });
      return;
    }

    // 执行转换
    const result = await convertFont(fontData, sourceFormat, targetFormat, options);

    // 返回成功响应
    res.status(200).json({
      success: true,
      data: {
        fontData: result.data,
        format: targetFormat,
        originalSize: result.originalSize,
        convertedSize: result.convertedSize,
        compressionRatio: result.compressionRatio
      },
      meta: {
        timestamp: new Date().toISOString(),
        sourceFormat,
        targetFormat
      }
    });

  } catch (error) {
    console.error('字体转换错误:', error);
    res.status(500).json({
      success: false,
      error: error.message || '字体转换过程中发生错误',
      timestamp: new Date().toISOString()
    });
  }
}

/**
 * 转换字体格式
 * @param {string} fontData - Base64编码的字体数据
 * @param {string} sourceFormat - 源格式
 * @param {string} targetFormat - 目标格式
 * @param {Object} options - 转换选项
 * @returns {Promise<Object>} 转换结果
 */
async function convertFont(fontData, sourceFormat, targetFormat, options = {}) {
  const {
    preserveHints = true,
    subset = null,
    optimize = true
  } = options;

  // 创建临时目录
  const tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), 'font-convert-'));
  
  try {
    // 解码Base64字体数据
    const fontBuffer = Buffer.from(fontData, 'base64');
    
    // 确定源文件扩展名
    const sourceExt = sourceFormat || detectFontFormat(fontBuffer);
    const inputPath = path.join(tmpDir, `input.${sourceExt}`);
    const outputPath = path.join(tmpDir, `output.${targetFormat}`);
    
    // 写入输入文件
    await fs.writeFile(inputPath, fontBuffer);
    
    // 根据目标格式选择转换工具
    if (targetFormat === 'woff2') {
      // 使用 woff2_compress (如果可用) 或 sfnt2woff
      try {
        await execAsync(`woff2_compress "${inputPath}" --output "${outputPath}"`);
      } catch {
        // 回退到使用 fonttools
        await execAsync(`fonttools ttLib.woff2 compress -o "${outputPath}" "${inputPath}"`);
      }
    } else if (targetFormat === 'woff') {
      // 使用 sfnt2woff 或 fonttools
      try {
        await execAsync(`sfnt2woff "${inputPath}" > "${outputPath}"`);
      } catch {
        await execAsync(`fonttools ttLib.woff compress -o "${outputPath}" "${inputPath}"`);
      }
    } else {
      // 使用 fonttools 进行通用转换
      await execAsync(`fonttools ttLib "${inputPath}" -o "${outputPath}"`);
    }
    
    // 读取转换后的文件
    const convertedBuffer = await fs.readFile(outputPath);
    
    // 计算压缩率
    const originalSize = fontBuffer.length;
    const convertedSize = convertedBuffer.length;
    const compressionRatio = ((originalSize - convertedSize) / originalSize * 100).toFixed(2);
    
    return {
      data: convertedBuffer.toString('base64'),
      originalSize,
      convertedSize,
      compressionRatio: parseFloat(compressionRatio)
    };
    
  } finally {
    // 清理临时目录
    try {
      await fs.rm(tmpDir, { recursive: true, force: true });
    } catch (err) {
      console.error('清理临时目录失败:', err);
    }
  }
}

/**
 * 检测字体格式
 * @param {Buffer} buffer - 字体文件Buffer
 * @returns {string} 字体格式扩展名
 */
function detectFontFormat(buffer) {
  const magic = buffer.slice(0, 4).toString('hex');
  
  // WOFF2: wOF2
  if (magic === '774f4632') return 'woff2';
  
  // WOFF: wOFF
  if (magic === '774f4646') return 'woff';
  
  // TrueType/OpenType: 00010000 or OTTO
  if (magic === '00010000' || magic === '4f54544f') return 'ttf';
  
  // EOT: 50450000 (PE signature at offset 0x3C)
  const eotMagic = buffer.slice(0x3C, 0x3C + 4).toString('hex');
  if (eotMagic === '50450000') return 'eot';
  
  // 默认返回 ttf
  return 'ttf';
}

/**
 * 获取字体信息
 * @param {string} fontData - Base64编码的字体数据
 * @returns {Object} 字体信息
 */
export function getFontInfo(fontData) {
  const buffer = Buffer.from(fontData, 'base64');
  
  return {
    size: buffer.length,
    format: detectFontFormat(buffer),
    magic: buffer.slice(0, 4).toString('hex')
  };
}

/**
 * 批量转换字体
 * @param {Array<{fontData: string, targetFormat: string}>} conversions - 转换任务列表
 * @returns {Promise<Array>} 转换结果
 */
export async function batchConvert(conversions) {
  const results = [];
  
  for (const conversion of conversions) {
    try {
      const result = await convertFont(
        conversion.fontData,
        conversion.sourceFormat,
        conversion.targetFormat,
        conversion.options
      );
      results.push({
        success: true,
        data: result
      });
    } catch (error) {
      results.push({
        success: false,
        error: error.message
      });
    }
  }
  
  return results;
}

// 导出所有函数
export default {
  convertFont,
  detectFontFormat,
  getFontInfo,
  batchConvert
};
