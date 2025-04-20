// 静态描红按钮点击事件
document.getElementById('draw-btn').addEventListener('click', function() {
    const hanzi = document.getElementById('hanzi-input').value || '你好';
    const container = document.getElementById('draw-container');
    container.innerHTML = '';
    
    // 判断设备类型和屏幕尺寸
    const isMobile = window.innerWidth <= 896; // 包括所有手机设备
    const isPC = !isMobile;
    
    if (isPC) {
        // PC版本：横排显示
        let length = 200;
        let padding = 40;
        
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
        // 创建竖排布局容器
        const verticalContainer = document.createElement('div');
        verticalContainer.className = 'vertical-layout';
        container.appendChild(verticalContainer);
        
        // 根据设备选择合适的尺寸
        const availableWidth = window.innerWidth - 80;
        const length = Math.floor(availableWidth);
        const padding = Math.floor(length * 0.1);
        
        // 为每个汉字创建单独的容器并逐个绘制
        for (let i = 0; i < hanzi.length; i++) {
            const charContainer = document.createElement('div');
            verticalContainer.appendChild(charContainer);
            
            cnchar.draw(hanzi[i], {
                el: charContainer,
                type: cnchar.draw.TYPE.NORMAL,
                style: {
                    length: length,
                    padding: padding,
                    outlineColor: '#ffcccc',
                    strokeColor: '#cc0000'
                }
            });
        }
    }
});

// 动态描红按钮点击事件
document.getElementById('animate-btn').addEventListener('click', function() {
    const hanzi = document.getElementById('hanzi-input').value || '你好';
    const container = document.getElementById('draw-container');
    container.innerHTML = '';
    
    // 判断设备类型和屏幕尺寸
    const isMobile = window.innerWidth <= 896; // 包括所有手机设备
    const isPC = !isMobile;
    
    if (isPC) {
        // PC版本：横排显示
        let length = 200;
        let padding = 40;
        
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
        
        writer.startAnimation();
    } else {
        // 手机版本：竖排显示
        // 创建竖排布局容器
        const verticalContainer = document.createElement('div');
        verticalContainer.className = 'vertical-layout';
        container.appendChild(verticalContainer);
        
        // 根据设备选择合适的尺寸
        const availableWidth = window.innerWidth - 80;
        const length = Math.floor(availableWidth);
        const padding = Math.floor(length * 0.1);
        
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
                    delayBetweenStrokes: 1000,
                    autoAnimate: false // 手动控制动画播放
                }
            });
            writers.push(writer);
        }
        
        // 依次播放各个汉字的动画
        function animateSequentially(index) {
            if (index >= writers.length) return;
            
            const writer = writers[index];
            writer.startAnimation();
            
            // 等待当前汉字的所有笔画绘制完毕，然后绘制下一个
            setTimeout(() => {
                animateSequentially(index + 1);
            }, 1000 * (hanzi.charCodeAt(index) % 5 + 3)); // 根据汉字复杂度估算时间
        }
        
        // 开始顺序播放
        animateSequentially(0);
    }
});

// 自主练习按钮点击事件
document.getElementById('test-btn').addEventListener('click', function() {
    const hanzi = document.getElementById('hanzi-input').value || '你好';
    const container = document.getElementById('draw-container');
    container.innerHTML = '';
    
    // 初始化每个字的状态数组和完成标志
    let completionStatus = new Array(hanzi.length).fill(false);
    let hasCongratulated = false;

    // 创建 Audio 对象
    const strokeSound = new Audio('sounds/brush-sound.mp3');
    const cheerSound = new Audio('sounds/cheering.mp3');
    // 可选：预加载声音，减少延迟 (浏览器可能会忽略)
    strokeSound.preload = 'auto';
    cheerSound.preload = 'auto';
    
    // 判断设备类型和屏幕尺寸
    const isMobile = window.innerWidth <= 896; // 包括所有手机设备
    const isPC = !isMobile;
    
    const handleTestStatus = function(status, charIndex) {
        // 播放笔画声音 (如果不是错误状态)
        if (status.status !== 'mistake') {
            strokeSound.currentTime = 0;
            strokeSound.play();
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
            cheerSound.play();

            const congrats = document.getElementById('congrats-message');
            congrats.style.display = 'block';
            
            // --- 改进的烟花效果 --- 
            const fireworksContainer = document.createElement('div');
            fireworksContainer.id = 'fireworks';
            fireworksContainer.style.position = 'fixed';
            fireworksContainer.style.top = '0';
            fireworksContainer.style.left = '0';
            fireworksContainer.style.width = '100%';
            fireworksContainer.style.height = '100%';
            fireworksContainer.style.pointerEvents = 'none';
            fireworksContainer.style.zIndex = '99';
            document.body.appendChild(fireworksContainer);

            const numBursts = 8; // 增加爆炸次数
            const particlesPerBurst = 50; // 增加每次爆炸粒子数

            for (let i = 0; i < numBursts; i++) {
                // 随机延迟每次爆炸
                setTimeout(() => {
                    // 随机爆炸中心点
                    const burstX = Math.random() * window.innerWidth;
                    const burstY = Math.random() * window.innerHeight * 0.7; // 偏上部区域

                    for (let j = 0; j < particlesPerBurst; j++) {
                        const particle = document.createElement('div');
                        particle.style.position = 'absolute';
                        particle.style.left = `${burstX}px`;
                        particle.style.top = `${burstY}px`;
                        particle.style.width = `${Math.random() * 5 + 2}px`; // 随机大小
                        particle.style.height = particle.style.width;
                        particle.style.borderRadius = '50%';
                        const color = `hsl(${Math.random() * 360}, 100%, ${Math.random() * 50 + 50}%)`; // 随机亮色
                        particle.style.backgroundColor = color;
                        particle.style.boxShadow = `0 0 8px 1px ${color}`;
                        fireworksContainer.appendChild(particle);

                        // 计算粒子运动
                        const angle = Math.random() * Math.PI * 2;
                        const speed = Math.random() * 250 + 150; // 再次增加粒子运动距离
                        const gravity = 1.0; // 再减小一点重力
                        const duration = Math.random() * 1500 + 1500; // 再次增加持续时间

                        const moveX = Math.cos(angle) * speed;
                        const moveY = Math.sin(angle) * speed;

                        const anim = particle.animate([
                            { transform: 'translate(0, 0) scale(1)', opacity: 1 },
                            // 模拟向外扩散和下落
                            { transform: `translate(${moveX}px, ${moveY + gravity * duration * 0.05}px) scale(0.5)`, opacity: 1, offset: 0.7 }, 
                            { transform: `translate(${moveX * 1.2}px, ${moveY + gravity * duration * 0.1}px) scale(0)`, opacity: 0 }
                        ], {
                            duration: duration,
                            easing: 'cubic-bezier(0.1, 0.5, 0.1, 1)', // 缓出效果
                        });

                        anim.onfinish = () => particle.remove();
                    }
                }, i * 150); // 稍微缩短爆炸间隔，让场面更密集
            }

            // 移除烟花容器并隐藏消息
            setTimeout(() => {
                congrats.style.display = 'none';
                fireworksContainer.remove(); 
            }, 5000); // 再次延长总时长
        }
    };

    if (isPC) {
        // PC版本：横排显示
        let length = 200;
        let padding = 40;
        
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
        // 创建竖排布局容器
        const verticalContainer = document.createElement('div');
        verticalContainer.className = 'vertical-layout';
        container.appendChild(verticalContainer);
        
        // 根据设备选择合适的尺寸
        const availableWidth = window.innerWidth - 80;
        const length = Math.floor(availableWidth);
        const padding = Math.floor(length * 0.1);
        
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
});

// 页面加载完成后默认显示静态描红
document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('draw-btn').click();
}); 