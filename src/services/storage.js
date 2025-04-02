/**
 * 存储服务 - 负责本地连接信息的持久化
 */
const Store = require('electron-store');

class StorageService {
  constructor() {
    this.store = new Store();
  }
  
  /**
   * 获取所有保存的连接
   * @returns {Array} - 连接列表
   */
  getConnections() {
    return this.store.get('connections') || [];
  }
  
  /**
   * 保存连接信息
   * @param {Object} connection - 连接信息
   * @returns {Array} - 更新后的连接列表
   */
  saveConnection(connection) {
    const connections = this.getConnections();
    
    // 检查是否已存在相同名称的连接
    const existingIndex = connections.findIndex(c => c.name === connection.name);
    
    if (existingIndex >= 0) {
      connections[existingIndex] = connection;
    } else {
      connections.push(connection);
    }
    
    this.store.set('connections', connections);
    return connections;
  }
  
  /**
   * 删除连接
   * @param {string} name - 连接名称
   * @returns {Array} - 更新后的连接列表
   */
  deleteConnection(name) {
    let connections = this.getConnections();
    connections = connections.filter(c => c.name !== name);
    this.store.set('connections', connections);
    return connections;
  }
  
  /**
   * 获取用户设置
   * @returns {Object} - 用户设置
   */
  getSettings() {
    return this.store.get('settings') || {
      fontSize: 14,
      fontFamily: 'Menlo, Monaco, Courier New, monospace',
      theme: 'dark',
      cursorBlink: true
    };
  }
  
  /**
   * 保存用户设置
   * @param {Object} settings - 用户设置
   * @returns {Object} - 更新后的设置
   */
  saveSettings(settings) {
    this.store.set('settings', settings);
    return settings;
  }
}

module.exports = StorageService;
