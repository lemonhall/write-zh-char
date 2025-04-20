// 动态描红功能模块

// 变量初始化
let animationId = null;
let animationProgress = 0;
let currentAnimatingStroke = 0;

// 动画绘制笔画
function animateStroke(data, strokeIndex, progress) {
    // 获取当前笔画
    const stroke = data.strokes[strokeIndex];
    
    // 绘制部分笔画
    ctx.beginPath();
    ctx.strokeStyle = '#E53935';
    ctx.lineWidth = 10;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    
    // 获取笔画长度
    const pathEl = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    pathEl.setAttribute('d', stroke.path);
    const pathLength = pathEl.getTotalLength();
    
    // 使用SVG路径API来获取部分路径
    const point = pathEl.getPointAtLength(pathLength * progress);
    const path = new Path2D(stroke.path);
    
    // 创建裁剪路径来只显示到当前进度的部分
    ctx.save();
    ctx.clip(path);
    ctx.beginPath();
    ctx.moveTo(point.x, point.y);
    ctx.lineTo(10000, point.y); // 绘制一条超出屏幕的线来裁剪
    ctx.stroke();
    ctx.restore();
}

// 绘制动态描红
function drawAnimatedTracing(data) {
    clearCanvas();
    
    const { scaleX, scaleY, offsetX, offsetY } = calculatePosition(data);
    
    // 绘制背景轮廓
    drawOutline(currentChar, data, { color: '#DDD' });
    
    // 绘制已完成的笔画
    ctx.strokeStyle = '#E53935';
    ctx.lineWidth = 10;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    
    for (let i = 0; i < currentAnimatingStroke; i++) {
        ctx.beginPath();
        const path = new Path2D(data.strokes[i].path);
        ctx.stroke(path);
    }
    
    // 绘制当前动画中的笔画
    if (currentAnimatingStroke < data.strokes.length) {
        animateStroke(data, currentAnimatingStroke, animationProgress);
    }
}

// 启动动画
function startAnimation(data) {
    // 停止之前的动画
    if (animationId) {
        cancelAnimationFrame(animationId);
    }
    
    // 重置动画进度
    animationProgress = 0;
    
    // 动画循环
    function animate() {
        animationProgress += 0.01;
        
        if (animationProgress >= 1) {
            // 完成当前笔画
            animationProgress = 0;
            currentAnimatingStroke++;
            playSound('stroke');
            
            // 检查是否完成所有笔画
            if (currentAnimatingStroke >= data.strokes.length) {
                playSound('complete');
                createFireworks(document.getElementById('drawing-container'));
                return;
            }
        }
        
        // 绘制当前状态
        drawAnimatedTracing(data);
        
        // 继续动画
        animationId = requestAnimationFrame(animate);
    }
    
    // 开始动画
    animationId = requestAnimationFrame(animate);
}

// 初始化动态描红模式
function initAnimatedTracing(container, width, height, char) {
    const drawingElements = initDrawing(container, width, height);
    
    // 加载汉字数据并开始动画
    loadCharacterData(char).then(data => {
        if (data) {
            currentAnimatingStroke = 0;
            startAnimation(data);
            
            // 添加重新开始功能
            drawingElements.canvas.addEventListener('click', () => {
                currentAnimatingStroke = 0;
                startAnimation(data);
            });
        }
    });
    
    return drawingElements;
} 