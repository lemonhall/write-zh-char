// 静态描红模块
function drawStatic() {
    const hanzi = getCurrentHanzi();
    const container = clearContainer();
    const isPC = isDevicePC();
    
    if (isPC) {
        // PC版本：横排显示
        const { length, padding } = getDeviceSizeConfig();
        
        cnchar.draw(hanzi, {
            el: container,
            type: cnchar.draw.TYPE.NORMAL,
            style: {
                length: length,
                padding: padding,
                outlineColor: '#ffcccc',
                strokeColor: '#cc0000'
            }
        });
    } else {
        // 手机版本：竖排显示
        drawMobileVertical(hanzi, container, cnchar.draw.TYPE.NORMAL);
    }
}

// 手机竖排显示
function drawMobileVertical(hanzi, container, drawType, options = {}) {
    // 创建竖排布局容器
    const verticalContainer = document.createElement('div');
    verticalContainer.className = 'vertical-layout';
    container.appendChild(verticalContainer);
    
    // 获取尺寸配置
    const { length, padding } = getDeviceSizeConfig();
    
    // 为每个汉字创建单独的容器并逐个绘制
    const writers = [];
    
    for (let i = 0; i < hanzi.length; i++) {
        const charContainer = document.createElement('div');
        verticalContainer.appendChild(charContainer);
        
        // 基础样式配置
        const style = {
            length: length,
            padding: padding,
            outlineColor: '#ffcccc',
            strokeColor: '#cc0000',
            ...options.style
        };
        
        // 基础绘制配置
        const drawConfig = {
            el: charContainer,
            type: drawType,
            style: style
        };
        
        // 合并其他配置
        if (options.animation) {
            drawConfig.animation = options.animation;
        }
        
        if (options.test) {
            drawConfig.test = options.test;
        }
        
        // 绘制汉字
        const writer = cnchar.draw(hanzi[i], drawConfig);
        if (writer) writers.push(writer);
    }
    
    return writers;
}

// 绘制静态描红模式
function drawStaticTracing(data) {
    clearCanvas();
    
    const { scaleX, scaleY, offsetX, offsetY } = calculatePosition(data);
    
    // 绘制背景轮廓
    drawOutline(currentChar, data, { color: '#DDD' });
    
    // 设置描红样式
    ctx.strokeStyle = '#E53935';
    ctx.lineWidth = 10;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    
    // 绘制当前进度的笔画
    for (let i = 0; i < currentStroke; i++) {
        ctx.beginPath();
        const path = new Path2D(data.strokes[i].path);
        ctx.stroke(path);
    }
}

// 初始化静态描红模式
function initStaticTracing(container, width, height, char) {
    const drawingElements = initDrawing(container, width, height);
    
    // 加载汉字数据并绘制
    loadCharacterData(char).then(data => {
        if (data) {
            currentStroke = 0;
            drawStaticTracing(data);
            
            // 添加点击事件
            drawingElements.canvas.addEventListener('click', () => {
                if (currentStroke < data.strokes.length) {
                    currentStroke++;
                    drawStaticTracing(data);
                    
                    // 播放笔画声音
                    playSound('stroke');
                    
                    // 如果完成所有笔画，显示烟花效果
                    if (currentStroke === data.strokes.length) {
                        playSound('complete');
                        createFireworks(container);
                    }
                }
            });
        }
    });
    
    return drawingElements;
} 