// Tauri API包装器
// 这个文件提供了在浏览器和Tauri应用中通用的API

// 检测是否在Tauri环境中运行
const isTauri = window.__TAURI__ !== undefined;

// 资源加载工具
async function getResourcePath(relativePath) {
  if (!isTauri) {
    // 在浏览器环境中直接返回相对路径
    return relativePath;
  }
  
  try {
    // 在Tauri环境中使用资源API
    const { resourceDir } = await import('@tauri-apps/api/path');
    const { convertFileSrc } = await import('@tauri-apps/api/tauri');
    
    // 获取资源目录
    const resourceDirPath = await resourceDir();
    console.log('Tauri资源目录:', resourceDirPath);
    
    // 构建完整路径
    return resourceDirPath + relativePath;
  } catch (e) {
    console.error('获取Tauri资源路径失败:', e);
    return relativePath;
  }
}

// 文件系统访问
async function readTextFile(path) {
  if (!isTauri) {
    // 在浏览器环境中使用fetch
    try {
      const response = await fetch(path);
      return await response.text();
    } catch (e) {
      console.error('读取文件失败:', e);
      return null;
    }
  } else {
    try {
      // 在Tauri环境中使用fs API
      const { readTextFile } = await import('@tauri-apps/api/fs');
      return await readTextFile(path);
    } catch (e) {
      console.error('读取文件失败:', e);
      return null;
    }
  }
}

// 导出API
window.tauriApi = {
  isTauri,
  getResourcePath,
  readTextFile
}; 