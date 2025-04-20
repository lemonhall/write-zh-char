// 设备类型检测
function isDevicePC() {
    return window.innerWidth > 896;
}

// 获取设备尺寸配置
function getDeviceSizeConfig() {
    const isMobile = !isDevicePC();
    
    if (isMobile) {
        // 手机版本尺寸
        const availableWidth = window.innerWidth - 80;
        return {
            length: Math.floor(availableWidth),
            padding: Math.floor(availableWidth * 0.1)
        };
    } else {
        // PC版本尺寸
        return {
            length: 200,
            padding: 40
        };
    }
}

// 获取当前要显示的汉字
function getCurrentHanzi() {
    return document.getElementById('hanzi-input').value || '你好';
}

// 清空容器
function clearContainer() {
    const container = document.getElementById('draw-container');
    container.innerHTML = '';
    return container;
} 