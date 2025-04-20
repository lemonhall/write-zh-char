// 特效模块
let audioElements = {};
let soundsEnabled = false; // 默认关闭声音

// 初始化声音
function initSounds() {
    try {
        // 检查是否存在音频文件
        // 由于文件不存在，这里改为使用现有的音频文件，或者忽略音频
        const sounds = {
            'brush-sound': 'sounds/brush-sound.mp3', // 使用已存在的文件
            'cheering': 'sounds/cheering.mp3',       // 使用已存在的文件
            'success': 'sounds/brush-sound.mp3',     // 复用已有文件
            'stroke': 'sounds/brush-sound.mp3',      // 复用已有文件
            'complete': 'sounds/cheering.mp3',       // 复用已有文件
            'stroke-start': 'sounds/brush-sound.mp3' // 复用已有文件
        };
        
        // 检查这些文件是否真的存在
        // 这里使用fetch来检测文件是否存在
        for (const [name, src] of Object.entries(sounds)) {
            fetch(src)
                .then(response => {
                    if (response.ok) {
                        const audio = new Audio(src);
                        audio.preload = 'auto';
                        audioElements[name] = audio;
                        soundsEnabled = true;
                    } else {
                        console.warn(`音频文件 ${src} 不可用`);
                    }
                })
                .catch(() => {
                    console.warn(`无法加载音频文件 ${src}`);
                });
        }
    } catch (e) {
        console.warn('初始化声音失败:', e);
    }
}

// 播放声音
function playSound(name) {
    if (!soundsEnabled) return;
    
    // 如果指定的音效不存在，尝试使用默认音效
    const audio = audioElements[name] || 
                 (name.includes('stroke') ? audioElements['brush-sound'] : 
                 (name.includes('complete') ? audioElements['cheering'] : null));
    
    if (audio) {
        // 重置播放位置确保每次都能播放
        audio.currentTime = 0;
        audio.play().catch(err => {
            console.warn('无法播放声音:', err);
        });
    }
}

// 创建烟花效果
function createFireworks(container) {
    const fireworks = document.createElement('div');
    fireworks.className = 'fireworks';
    container.appendChild(fireworks);
    
    // 创建多个烟花粒子
    for (let i = 0; i < 40; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        
        // 随机颜色
        const hue = Math.floor(Math.random() * 360);
        particle.style.backgroundColor = `hsl(${hue}, 100%, 50%)`;
        
        // 随机位置和移动
        const angle = Math.random() * Math.PI * 2;
        const distance = Math.random() * 100 + 50;
        const duration = Math.random() * 1 + 0.5;
        
        // 直接设置粒子样式
        particle.style.position = 'absolute';
        particle.style.width = `${Math.random() * 10 + 5}px`;
        particle.style.height = particle.style.width;
        particle.style.borderRadius = '50%';
        particle.style.left = '50%';
        particle.style.top = '50%';
        particle.style.transform = 'translate(-50%, -50%)';
        particle.style.boxShadow = `0 0 10px 2px hsl(${hue}, 100%, 70%)`;
        
        // 添加烟花动画
        const anim = particle.animate([
            { transform: 'translate(-50%, -50%)' },
            { 
                transform: `translate(
                    calc(-50% + ${Math.cos(angle) * distance}px), 
                    calc(-50% + ${Math.sin(angle) * distance}px)
                )`,
                opacity: 0
            }
        ], {
            duration: duration * 1000,
            easing: 'cubic-bezier(0.1, 0.8, 0.2, 1)'
        });
        
        fireworks.appendChild(particle);
        
        // 动画结束后移除粒子
        anim.onfinish = () => particle.remove();
    }
    
    // 动画结束后移除烟花容器
    setTimeout(() => {
        fireworks.remove();
    }, 2000);
} 