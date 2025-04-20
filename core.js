// 核心功能模块
let canvas, ctx;
let currentChar = '';
let charWidth, charHeight;
let isMobile = false;
let characterData = {};
let currentStroke = 0;

// 初始化函数
function initDrawing(container, width, height) {
    // 检测设备类型
    isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    
    // 设置画布
    canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    ctx = canvas.getContext('2d');
    
    // 添加画布到容器
    container.appendChild(canvas);
    
    // 设置字符尺寸
    charWidth = width * 0.8;
    charHeight = height * 0.8;
    
    return {
        canvas: canvas,
        ctx: ctx
    };
}

// 加载汉字数据
async function loadCharacterData(char) {
    try {
        if (!characterData[char]) {
            const response = await fetch(`characters/${char}.json`);
            if (!response.ok) {
                throw new Error(`无法加载汉字数据: ${response.status}`);
            }
            characterData[char] = await response.json();
        }
        currentChar = char;
        currentStroke = 0;
        return characterData[char];
    } catch (error) {
        console.error('加载汉字数据错误:', error);
        return null;
    }
}

// 清除画布
function clearCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

// 绘制汉字轮廓
function drawOutline(char, data, style) {
    const { color = '#DDD', lineWidth = 2 } = style || {};
    
    clearCanvas();
    ctx.strokeStyle = color;
    ctx.lineWidth = lineWidth;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    
    // 绘制所有笔画
    for (const stroke of data.strokes) {
        ctx.beginPath();
        const path = new Path2D(stroke.path);
        ctx.stroke(path);
    }
}

// 计算汉字在画布中的居中位置
function calculatePosition(data) {
    // 原始数据通常基于1024x1024的网格
    const originalSize = 1024;
    const scaleX = charWidth / originalSize;
    const scaleY = charHeight / originalSize;
    
    // 居中位置
    const offsetX = (canvas.width - charWidth) / 2;
    const offsetY = (canvas.height - charHeight) / 2;
    
    return {
        scaleX,
        scaleY,
        offsetX,
        offsetY
    };
} 