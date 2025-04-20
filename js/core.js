// 核心功能模块
let canvas, ctx;
let currentChar = '';
let charWidth, charHeight;
let isMobile = false;
let characterData = {};
let currentStroke = 0;
let useDummyData = true; // 使用虚拟数据，因为实际数据文件不存在

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

// 生成模拟汉字数据
function generateDummyData(char) {
    // 生成简单的模拟数据
    // 这不是真实的汉字笔画数据，仅用于演示
    
    const numStrokes = char === '你' ? 7 : (char === '好' ? 6 : 5);
    
    const strokes = [];
    for (let i = 0; i < numStrokes; i++) {
        strokes.push({
            path: `M ${200 + i * 50} ${200} L ${400 - i * 30} ${400 + i * 20}`,
            medians: [[200 + i * 50, 200], [400 - i * 30, 400 + i * 20]]
        });
    }
    
    return {
        character: char,
        strokes: strokes
    };
}

// 加载汉字数据
async function loadCharacterData(char) {
    try {
        if (useDummyData) {
            // 使用模拟数据
            if (!characterData[char]) {
                characterData[char] = generateDummyData(char);
            }
            currentChar = char;
            currentStroke = 0;
            return characterData[char];
        } else {
            // 尝试加载真实数据（但这些文件实际不存在）
            if (!characterData[char]) {
                try {
                    const response = await fetch(`characters/${char}.json`);
                    if (!response.ok) {
                        throw new Error(`无法加载汉字数据: ${response.status}`);
                    }
                    characterData[char] = await response.json();
                } catch (error) {
                    console.warn(`加载汉字 ${char} 数据失败，使用模拟数据`);
                    characterData[char] = generateDummyData(char);
                }
            }
            currentChar = char;
            currentStroke = 0;
            return characterData[char];
        }
    } catch (error) {
        console.error('加载汉字数据错误:', error);
        return generateDummyData(char); // 出错时返回模拟数据
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