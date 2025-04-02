/**
 * 工具函数集合
 */

/**
 * 节流函数 - 用于优化窗口调整事件
 * @param {Function} func - 要执行的函数
 * @param {number} wait - 等待时间(毫秒)
 * @returns {Function} - 节流后的函数
 */
function throttle(func, wait = 100) {
  let timeout = null;
  let previous = 0;
  
  return function(...args) {
    const now = Date.now();
    const remaining = wait - (now - previous);
    
    if (remaining <= 0 || remaining > wait) {
      if (timeout) {
        clearTimeout(timeout);
        timeout = null;
      }
      
      previous = now;
      func.apply(this, args);
    } else if (!timeout) {
      timeout = setTimeout(() => {
        previous = Date.now();
        timeout = null;
        func.apply(this, args);
      }, remaining);
    }
  };
}

/**
 * 解析SSH连接字符串
 * 格式: [username@]host[:port]
 * @param {string} connectionString - 连接字符串
 * @returns {Object} - 解析后的连接信息
 */
function parseConnectionString(connectionString) {
  const result = {
    username: '',
    host: '',
    port: 22
  };
  
  if (!connectionString) return result;
  
  // 解析端口
  const hostPortParts = connectionString.split(':');
  if (hostPortParts.length > 1) {
    result.port = parseInt(hostPortParts[1], 10) || 22;
  }
  
  // 解析用户名和主机
  const userHostParts = hostPortParts[0].split('@');
  if (userHostParts.length > 1) {
    result.username = userHostParts[0];
    result.host = userHostParts[1];
  } else {
    result.host = userHostParts[0];
  }
  
  return result;
}

/**
 * 生成唯一ID
 * @returns {string} - 唯一ID
 */
function generateId() {
  return Math.random().toString(36).substring(2, 15) + 
         Math.random().toString(36).substring(2, 15);
}

/**
 * 格式化日期时间
 * @param {Date} date - 日期对象
 * @returns {string} - 格式化后的日期时间字符串
 */
function formatDateTime(date = new Date()) {
  return date.toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });
}

/**
 * 简单加密敏感信息
 * 注意: 这不是安全的加密，只是简单的混淆
 * @param {string} text - 要加密的文本
 * @returns {string} - 加密后的文本
 */
function simpleEncrypt(text) {
  if (!text) return '';
  
  // 转为 Base64
  const base64 = Buffer.from(text).toString('base64');
  
  // 简单混淆
  return base64.split('').reverse().join('');
}

/**
 * 简单解密
 * @param {string} encrypted - 加密的文本
 * @returns {string} - 解密后的文本
 */
function simpleDecrypt(encrypted) {
  if (!encrypted) return '';
  
  // 逆向混淆
  const base64 = encrypted.split('').reverse().join('');
  
  // 从 Base64 解码
  return Buffer.from(base64, 'base64').toString();
}

module.exports = {
  throttle,
  parseConnectionString,
  generateId,
  formatDateTime,
  simpleEncrypt,
  simpleDecrypt
};
