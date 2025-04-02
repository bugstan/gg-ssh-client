/**
 * 终端管理服务
 */
const { Terminal } = require('xterm');
const { FitAddon } = require('xterm-addon-fit');
const { WebLinksAddon } = require('xterm-addon-web-links');

class TerminalService {
  /**
   * 创建新的终端实例
   * @param {string} elementId - DOM元素ID
   * @param {Object} options - 终端选项
   * @returns {Object} - 终端实例和相关插件
   */
  static createTerminal(elementId, options = {}) {
    // 默认选项
    const defaultOptions = {
      cursorBlink: true,
      fontSize: 14,
      fontFamily: 'Menlo, Monaco, Courier New, monospace',
      theme: {
        background: '#1e1e1e',
        foreground: '#f0f0f0'
      }
    };
    
    // 合并选项
    const terminalOptions = { ...defaultOptions, ...options };
    
    // 创建终端
    const term = new Terminal(terminalOptions);
    
    // 添加插件
    const fitAddon = new FitAddon();
    term.loadAddon(fitAddon);
    term.loadAddon(new WebLinksAddon());
    
    // 获取DOM元素
    const element = document.getElementById(elementId);
    if (!element) {
      throw new Error(`找不到ID为 ${elementId} 的元素`);
    }
    
    // 打开终端
    term.open(element);
    
    // 调整大小
    fitAddon.fit();
    
    return { term, fitAddon };
  }
  
  /**
   * 调整终端大小
   * @param {Object} terminal - 终端对象
   */
  static fitTerminal(terminal) {
    if (terminal && terminal.fitAddon) {
      try {
        terminal.fitAddon.fit();
      } catch (error) {
        console.error('调整终端大小时出错:', error);
      }
    }
  }
  
  /**
   * 写入数据到终端
   * @param {Object} term - 终端实例
   * @param {string} data - 要写入的数据
   */
  static write(term, data) {
    if (term) {
      term.write(data);
    }
  }
  
  /**
   * 清空终端
   * @param {Object} term - 终端实例
   */
  static clear(term) {
    if (term) {
      term.clear();
    }
  }
  
  /**
   * 销毁终端
   * @param {Object} term - 终端实例
   */
  static dispose(term) {
    if (term) {
      term.dispose();
    }
  }
  
  /**
   * 获取终端尺寸
   * @param {Object} term - 终端实例
   * @returns {Object} - 包含行数和列数的对象
   */
  static getTerminalSize(term) {
    if (!term) return { rows: 24, cols: 80 }; // 默认尺寸
    
    return {
      rows: term.rows,
      cols: term.cols
    };
  }
}

module.exports = TerminalService;
