// 特效模块
let audioElements = {};

// 初始化声音
function initSounds() {
    const sounds = {
        'success': 'sounds/success.mp3',
        'stroke': 'sounds/stroke.mp3',
        'complete': 'sounds/complete.mp3'
    };
    
    for (const [name, src] of Object.entries(sounds)) {
        const audio = new Audio(src);
        audio.preload = 'auto';
        audioElements[name] = audio;
    }
}

// 播放声音
function playSound(name) {
    if (audioElements[name]) {
        // 重置播放位置确保每次都能播放
        audioElements[name].currentTime = 0;
        audioElements[name].play().catch(err => {
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
        
        particle.style.setProperty('--angle', angle + 'rad');
        particle.style.setProperty('--distance', distance + 'px');
        particle.style.setProperty('--duration', duration + 's');
        
        fireworks.appendChild(particle);
    }
    
    // 动画结束后移除烟花
    setTimeout(() => {
        fireworks.remove();
    }, 2000);
} 