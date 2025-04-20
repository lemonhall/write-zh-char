// 自主练习模块
function drawTest() {
    const hanzi = getCurrentHanzi();
    const container = clearContainer();
    const isPC = isDevicePC();
    
    if (isPC) {
        // PC版本：横排显示
        const { length, padding } = getDeviceSizeConfig();
        
        cnchar.draw(hanzi, {
            el: container,
            type: cnchar.draw.TYPE.TEST,
            style: {
                length: length,
                padding: padding,
                outlineColor: '#ccccff',
                strokeColor: '#0000cc',
                backgroundColor: '#f8f8ff',
                showOutline: true,
                showCharacter: false
            },
            test: {
                strokeMaxScale: 3,   // 笔画辨别的最大缩放
                checkOnComplete: true,  // 完成所有笔画后展示结果
                onComplete: function(result) {
                    showTestResult(hanzi, result);
                }
            }
        });
    } else {
        // 手机版本：竖排显示
        drawMobileVertical(hanzi, container, cnchar.draw.TYPE.TEST, {
            style: {
                backgroundColor: '#f8f8ff',
                showOutline: true,
                showCharacter: false
            },
            test: {
                strokeMaxScale: 3,
                checkOnComplete: true,
                onComplete: function(result) {
                    showTestResult(hanzi, result);
                }
            }
        });
    }
}

// 显示测试结果
function showTestResult(hanzi, result) {
    const score = Math.round(result.score);
    let message = '';
    
    if (score >= 90) {
        message = `恭喜！你的"${hanzi}"写得很棒！得分：${score}分`;
        playSound('success');
    } else if (score >= 70) {
        message = `不错！你的"${hanzi}"写得还行，继续练习吧！得分：${score}分`;
    } else {
        message = `加油！你的"${hanzi}"需要更多练习。得分：${score}分`;
    }
    
    // 显示消息
    const resultElement = document.createElement('div');
    resultElement.className = 'test-result';
    resultElement.textContent = message;
    document.querySelector('.drawing-container').appendChild(resultElement);
    
    // 3秒后自动消失
    setTimeout(() => {
        resultElement.remove();
    }, 3000);
}

// 自主练习功能模块

// 变量初始化
let isDrawing = false;
let currentPath = [];
let userStrokes = [];
let startTime;
let endTime;

// 绘制用户笔画
function drawUserStrokes() {
    clearCanvas();
    
    // 绘制背景轮廓（淡色）
    drawOutline(currentChar, currentCharData, { color: '#EEEEEE' });
    
    // 绘制用户笔画
    ctx.strokeStyle = '#2196F3';
    ctx.lineWidth = 10;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    
    // 绘制已完成的用户笔画
    for (const stroke of userStrokes) {
        drawPath(stroke);
    }
    
    // 绘制当前笔画
    if (currentPath.length > 0) {
        drawPath(currentPath);
    }
}

// 绘制路径
function drawPath(path) {
    if (path.length < 2) return;
    
    ctx.beginPath();
    ctx.moveTo(path[0].x, path[0].y);
    
    for (let i = 1; i < path.length; i++) {
        ctx.lineTo(path[i].x, path[i].y);
    }
    
    ctx.stroke();
}

// 计算评分
function calculateScore(userStrokes, originalData) {
    // 基础得分
    let score = 100;
    
    // 笔画数量差异惩罚（每差一个笔画扣10分）
    const strokeDiff = Math.abs(userStrokes.length - originalData.strokes.length);
    score -= strokeDiff * 10;
    
    // 笔顺正确性检查（简化版）
    // 此处可以添加更复杂的评分算法
    
    // 确保分数在0-100之间
    return Math.max(0, Math.min(100, score));
}

// 处理鼠标按下事件
function handleMouseDown(e) {
    isDrawing = true;
    startTime = new Date();
    
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    currentPath = [{ x, y }];
    playSound('stroke-start');
}

// 处理鼠标移动事件
function handleMouseMove(e) {
    if (!isDrawing) return;
    
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    currentPath.push({ x, y });
    drawUserStrokes();
}

// 处理鼠标松开事件
function handleMouseUp() {
    if (!isDrawing) return;
    
    isDrawing = false;
    endTime = new Date();
    
    if (currentPath.length > 1) {
        userStrokes.push([...currentPath]);
        playSound('stroke');
        
        // 检查是否完成当前汉字（根据笔画数量）
        if (userStrokes.length >= currentCharData.strokes.length) {
            const score = calculateScore(userStrokes, currentCharData);
            showResult(score);
            createFireworks(document.getElementById('drawing-container'));
            playSound('complete');
        }
    }
    
    currentPath = [];
}

// 显示结果
function showResult(score) {
    const resultElement = document.createElement('div');
    resultElement.className = 'result';
    resultElement.innerHTML = `
        <h2>练习完成！</h2>
        <p>得分: ${score}</p>
        <button id="retry-btn">重新练习</button>
    `;
    
    document.getElementById('drawing-container').appendChild(resultElement);
    
    document.getElementById('retry-btn').addEventListener('click', () => {
        resultElement.remove();
        userStrokes = [];
        drawUserStrokes();
    });
}

// 初始化自主练习模式
function initTestingMode(container, width, height, char) {
    const drawingElements = initDrawing(container, width, height);
    const { canvas } = drawingElements;
    
    // 加载汉字数据
    loadCharacterData(char).then(data => {
        if (data) {
            currentCharData = data;
            
            // 清空用户笔画
            userStrokes = [];
            
            // 绘制初始状态
            drawUserStrokes();
            
            // 添加事件监听器
            canvas.addEventListener('mousedown', handleMouseDown);
            canvas.addEventListener('mousemove', handleMouseMove);
            canvas.addEventListener('mouseup', handleMouseUp);
            canvas.addEventListener('mouseleave', handleMouseUp);
            
            // 触摸设备支持
            canvas.addEventListener('touchstart', (e) => {
                e.preventDefault();
                const touch = e.touches[0];
                const mouseEvent = new MouseEvent('mousedown', {
                    clientX: touch.clientX,
                    clientY: touch.clientY
                });
                canvas.dispatchEvent(mouseEvent);
            });
            
            canvas.addEventListener('touchmove', (e) => {
                e.preventDefault();
                const touch = e.touches[0];
                const mouseEvent = new MouseEvent('mousemove', {
                    clientX: touch.clientX,
                    clientY: touch.clientY
                });
                canvas.dispatchEvent(mouseEvent);
            });
            
            canvas.addEventListener('touchend', (e) => {
                e.preventDefault();
                const mouseEvent = new MouseEvent('mouseup');
                canvas.dispatchEvent(mouseEvent);
            });
        }
    });
    
    return drawingElements;
} 