// 主程序入口文件

// 页面加载完成后执行初始化
document.addEventListener('DOMContentLoaded', function() {
    // 初始化声音
    initSounds();
    
    // 绑定按钮点击事件
    document.getElementById('draw-btn').addEventListener('click', function() {
        // 静态描红按钮
        drawStatic();
    });
    
    document.getElementById('animate-btn').addEventListener('click', function() {
        // 动态描红按钮
        drawAnimate();
    });
    
    document.getElementById('test-btn').addEventListener('click', function() {
        // 自主练习按钮
        drawTest();
    });
    
    // 默认执行静态描红
    drawStatic();
});

// 动态描红函数 (从animate-draw.js调用相关功能)
function drawAnimate() {
    const hanzi = getCurrentHanzi();
    const container = clearContainer();
    
    // 根据屏幕尺寸设置宽高
    const { length } = getDeviceSizeConfig();
    const width = length * 1.2;
    const height = length * 1.2;
    
    if (hanzi && hanzi.length > 0) {
        // 为每个汉字创建单独的动画区域
        for (let i = 0; i < hanzi.length; i++) {
            const charContainer = document.createElement('div');
            charContainer.className = 'drawing-container';
            container.appendChild(charContainer);
            
            // 初始化动态描红
            initAnimatedTracing(charContainer, width, height, hanzi[i]);
        }
    }
}

// 简化版静态描红函数实现，优先使用cnchar库
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

// 简化版自主练习函数实现，优先使用cnchar库
function drawTest() {
    const hanzi = getCurrentHanzi();
    const container = clearContainer();
    const isPC = isDevicePC();
    
    // 初始化完成状态检查
    let completionStatus = new Array(hanzi.length).fill(false);
    let hasCongratulated = false;

    // 创建 Audio 对象
    const strokeSound = new Audio('sounds/brush-sound.mp3');
    const cheerSound = new Audio('sounds/cheering.mp3');
    strokeSound.preload = 'auto';
    cheerSound.preload = 'auto';
    
    // 处理笔画测试状态回调
    function handleTestStatus(status, charIndex) {
        // 播放笔画声音 (如果不是错误状态)
        if (status.status !== 'mistake') {
            strokeSound.currentTime = 0;
            strokeSound.play().catch(err => console.warn('无法播放声音:', err));
        }
        
        // 如果当前字完成，更新状态数组
        if (status.status === 'complete') {
            completionStatus[charIndex] = true;
        }

        // 检查是否所有字都已完成
        const allComplete = completionStatus.every(val => val === true);

        // 如果所有字都完成且尚未恭喜过
        if (allComplete && !hasCongratulated) {
            hasCongratulated = true; // 设置已恭喜标志

            // 播放欢呼声
            cheerSound.play().catch(err => console.warn('无法播放声音:', err));

            // 显示恭喜消息
            const congrats = document.getElementById('congrats-message');
            congrats.style.display = 'block';
            
            // 创建简单烟花效果
            createFireworks(document.body);

            // 3秒后隐藏消息
            setTimeout(() => {
                congrats.style.display = 'none';
            }, 3000);
        }
    }
    
    if (isPC) {
        // PC版本：横排显示
        const { length, padding } = getDeviceSizeConfig();
        
        cnchar.draw(hanzi, {
            el: container,
            type: cnchar.draw.TYPE.TEST,
            style: {
                length: length,
                padding: padding,
                outlineColor: '#ffcccc',
                drawingColor: '#cc0000',
                highlightColor: '#ff9999'
            },
            test: {
                onTestStatus: function(status) {
                    handleTestStatus(status, status.index);
                }
            }
        });
    } else {
        // 手机版本：竖排显示
        const verticalContainer = document.createElement('div');
        verticalContainer.className = 'vertical-layout';
        container.appendChild(verticalContainer);
        
        // 根据设备选择合适的尺寸
        const { length, padding } = getDeviceSizeConfig();
        
        // 为每个汉字创建单独的容器并逐个绘制
        for (let i = 0; i < hanzi.length; i++) {
            const charContainer = document.createElement('div');
            verticalContainer.appendChild(charContainer);
            
            const charIndex = i; // 保存当前索引，供回调使用
            
            cnchar.draw(hanzi[i], {
                el: charContainer,
                type: cnchar.draw.TYPE.TEST,
                style: {
                    length: length,
                    padding: padding,
                    outlineColor: '#ffcccc',
                    drawingColor: '#cc0000',
                    highlightColor: '#ff9999'
                },
                test: {
                    onTestStatus: function(status) {
                        handleTestStatus(status, charIndex);
                    }
                }
            });
        }
    }
} 