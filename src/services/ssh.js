/**
 * SSH 服务，负责创建和管理SSH连接
 */
const { NodeSSH } = require('node-ssh');

class SSHService {
  /**
   * 创建新的SSH连接
   * @param {Object} config - 连接配置
   * @param {function} onData - 数据接收回调
   * @param {function} onError - 错误回调
   * @param {Object} dimensions - 终端尺寸
   * @returns {Object} - SSH连接和Shell会话
   */
  static async createConnection(config, onData, onError, dimensions) {
    try {
      const ssh = new NodeSSH();
      
      // 准备连接选项
      const connectOptions = {
        host: config.host,
        port: config.port,
        username: config.username,
        keepaliveInterval: 10000
      };
      
      // 根据认证类型设置不同的选项
      if (config.authType === 'password') {
        connectOptions.password = config.password;
      } else {
        connectOptions.privateKey = config.privateKey;
        if (config.passphrase) {
          connectOptions.passphrase = config.passphrase;
        }
      }
      
      // 连接到服务器
      await ssh.connect(connectOptions);
      
      // 打开远程Shell
      const shell = await ssh.requestShell(dimensions);
      
      // 设置数据处理
      shell.on('data', data => {
        onData(data.toString());
      });
      
      shell.on('error', err => {
        onError(err);
      });
      
      return { ssh, shell };
    } catch (error) {
      onError(error);
      throw error;
    }
  }
  
  /**
   * 关闭SSH连接
   * @param {Object} sshClient - SSH客户端
   */
  static closeConnection(sshClient) {
    if (sshClient) {
      try {
        sshClient.dispose();
      } catch (error) {
        console.error('关闭SSH连接时出错:', error);
      }
    }
  }
  
  /**
   * 调整终端窗口大小
   * @param {Object} shell - Shell会话
   * @param {number} rows - 行数
   * @param {number} cols - 列数
   */
  static resizeTerminal(shell, rows, cols) {
    if (shell && shell.setWindow) {
      shell.setWindow(rows, cols);
    }
  }
  
  /**
   * 执行远程命令
   * @param {Object} ssh - SSH客户端
   * @param {string} command - 要执行的命令
   * @returns {Promise<Object>} - 命令执行结果
   */
  static async executeCommand(ssh, command) {
    try {
      return await ssh.execCommand(command);
    } catch (error) {
      console.error('执行命令时出错:', error);
      throw error;
    }
  }
}

module.exports = SSHService;
