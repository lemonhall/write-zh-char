// 主程序入口文件

// 使用已存在的isTauri变量，不再重复声明
// const isTauri = window.tauriApi ? window.tauriApi.isTauri : false;

// 页面加载完成后执行初始化
document.addEventListener('DOMContentLoaded', async function() {
    // 初始化声音
    initSounds();
    
    // 配置cnchar，使用本地数据
    if (typeof cnchar !== 'undefined' && cnchar.draw) {
        try {
            // 设置数据路径
            let dataPath = './data/dict/';
            
            // 如果在Tauri环境中，使用资源目录
            if (window.tauriApi && window.tauriApi.isTauri) {
                try {
                    // 获取资源目录中的路径
                    dataPath = await window.tauriApi.getResourcePath('data/dict/');
                    console.log('使用Tauri资源路径:', dataPath);
                } catch (tauriError) {
                    console.warn('获取Tauri资源目录失败:', tauriError);
                }
            } else {
                console.log('在浏览器环境中运行，使用相对路径:', dataPath);
            }
            
            // 先设置本地数据路径
            console.log('设置cnchar数据路径为:', dataPath);
            cnchar.draw.setResourceBase(dataPath);
            
            // 完全禁用网络请求
            console.log('启用cnchar本地模式');
            
            // 劫持XMLHttpRequest，阻止对unpkg.com的请求
            const originalXHROpen = XMLHttpRequest.prototype.open;
            XMLHttpRequest.prototype.open = function(method, url, ...args) {
                if (url && typeof url === 'string' && url.includes('unpkg.com/cnchar-data')) {
                    console.warn('已拦截对cnchar-data的网络请求:', url);
                    // 将URL修改为本地路径
                    const charCode = url.split('/').pop();
                    
                    // 根据环境选择正确的路径
                    let newUrl = window.tauriApi && window.tauriApi.isTauri
                        ? `${dataPath}${charCode}` 
                        : `./data/dict/${charCode}`;
                        
                    url = newUrl;
                    console.log('已重定向到本地路径:', url);
                }
                return originalXHROpen.call(this, method, url, ...args);
            };
            
            // 检查是否有loadLocalMode方法
            if (typeof cnchar.draw.loadLocalMode === 'function') {
                cnchar.draw.loadLocalMode();
            } else {
                console.log('当前版本的cnchar.draw不支持loadLocalMode方法，已使用资源路径重定向');
            }
            
            console.log('cnchar配置完成');
        } catch (e) {
            console.warn('设置cnchar本地模式失败:', e);
        }
    }
    
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
    
    // 添加错误处理
    window.addEventListener('error', function(event) {
        console.warn('捕获到错误:', event.error);
        // 防止错误传播
        event.preventDefault();
    });
});

// 动态描红函数 (优先使用cnchar库)
function drawAnimate() {
    const hanzi = getCurrentHanzi();
    const container = clearContainer();
    const isPC = isDevicePC();
    
    if (isPC) {
        // PC版本：横排显示
        const { length, padding } = getDeviceSizeConfig();
        
        const writer = cnchar.draw(hanzi, {
            el: container,
            type: cnchar.draw.TYPE.ANIMATION,
            style: {
                length: length,
                padding: padding,
                outlineColor: '#ffcccc',
                strokeColor: '#cc0000',
                currentColor: '#ff3333'
            },
            animation: {
                strokeAnimationSpeed: 1,
                delayBetweenStrokes: 1000
            }
        });
        
        // 添加动画完成事件（如有需要）
        if (writer && typeof writer.animationEnd === 'function') {
            writer.animationEnd(() => {
                // 创建烟花效果
                try {
                    createFireworks(document.body);
                } catch (e) {
                    console.warn('创建烟花效果失败:', e);
                }
            });
        }
    } else {
        // 手机版本：竖排显示
        // 创建竖排布局容器
        const verticalContainer = document.createElement('div');
        verticalContainer.className = 'vertical-layout';
        container.appendChild(verticalContainer);
        
        // 根据设备选择合适的尺寸
        const { length, padding } = getDeviceSizeConfig();
        
        // 为每个汉字创建单独的容器并逐个绘制
        const writers = [];
        for (let i = 0; i < hanzi.length; i++) {
            const charContainer = document.createElement('div');
            verticalContainer.appendChild(charContainer);
            
            const writer = cnchar.draw(hanzi[i], {
                el: charContainer,
                type: cnchar.draw.TYPE.ANIMATION,
                style: {
                    length: length,
                    padding: padding,
                    outlineColor: '#ffcccc',
                    strokeColor: '#cc0000',
                    currentColor: '#ff3333'
                },
                animation: {
                    strokeAnimationSpeed: 1,
                    delayBetweenStrokes: 1000
                }
            });
            
            writers.push(writer);
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

    // 处理笔画测试状态回调
    function handleTestStatus(status, charIndex) {
        // 播放笔画声音 (如果不是错误状态)
        if (status.status !== 'mistake') {
            playSound('stroke');
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
            playSound('complete');

            // 显示恭喜消息
            const congrats = document.getElementById('congrats-message');
            congrats.style.display = 'block';
            
            // 创建简单烟花效果
            try {
                createFireworks(document.body);
            } catch (e) {
                console.warn('创建烟花效果失败:', e);
            }

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