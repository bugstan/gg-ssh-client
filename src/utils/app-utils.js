const { app } = require('electron');
const path = require('path');
const fs = require('fs');

// 创建应用程序数据目录，用于存储SSH密钥、配置等
function setupAppDataDirectory() {
  const userDataPath = app.getPath('userData');
  const appDataPath = path.join(userDataPath, 'ssh-client-data');
  
  // 创建主目录
  if (!fs.existsSync(appDataPath)) {
    fs.mkdirSync(appDataPath, { recursive: true });
  }
  
  // 创建SSH密钥目录
  const sshKeysPath = path.join(appDataPath, 'ssh-keys');
  if (!fs.existsSync(sshKeysPath)) {
    fs.mkdirSync(sshKeysPath, { recursive: true });
  }
  
  // 创建日志目录
  const logsPath = path.join(appDataPath, 'logs');
  if (!fs.existsSync(logsPath)) {
    fs.mkdirSync(logsPath, { recursive: true });
  }
  
  return {
    appDataPath,
    sshKeysPath,
    logsPath
  };
}

// 简单日志函数
function log(message, type = 'info') {
  const timestamp = new Date().toISOString();
  const logMessage = `[${timestamp}] [${type.toUpperCase()}] ${message}\n`;
  
  try {
    const { logsPath } = setupAppDataDirectory();
    const logFile = path.join(logsPath, `${new Date().toISOString().split('T')[0]}.log`);
    
    fs.appendFileSync(logFile, logMessage);
    
    if (process.env.NODE_ENV === 'development') {
      console.log(logMessage);
    }
  } catch (error) {
    console.error('写入日志失败:', error);
  }
}

// 导出数据路径和其他工具函数
module.exports = {
  setupAppDataDirectory,
  log
};
