// 游戏配置
const CONFIG = {
    canvasWidth: 1200,
    canvasHeight: 800,
    targetKills: 2500, // 需要击杀2500个敌人通关
    bossSpawnChance: 0.02, // Boss随机生成概率（每帧2%）
    upgradeKills: 10, // 每击杀10个敌人升级一次
    enemySpawnRate: 3000, // 每3秒生成一批敌人
    enemySpawnCount: 3, // 每次生成的敌人数量
    enemySpawnDistance: 100, // 敌人生成距离屏幕边缘的距离
    
    // 子弹大小配置
    bulletSize: {
        initial: 6,        // 初始子弹大小
        upgrade1: 9,      // 第1次升级后的子弹大小
        upgrade2: 11,     // 第2次升级后的子弹大小
        upgrade3: 12,     // 第3次升级后的子弹大小
    },
    
    // 生命值衰减缓动配置
    healthEasingDuration: 1000, // 生命值衰减动画持续时间（毫秒）
};

// 绘制像素风格血条
function drawPixelHealthBar(ctx, x, y, currentHp, maxHp, isEnemy = false, isHit = false, isHeal = false, pixelsPerHp = 1) {
    // pixelsPerHp: 每多少点生命值显示1个像素（用于压缩血条长度）
    const displayMaxHp = Math.ceil(maxHp / pixelsPerHp);
    const displayCurrentHp = Math.ceil(currentHp / pixelsPerHp);
    
    const pixelSize = 0.8;
    const gap = 0.15;
    const padding = 0.3;
    const borderWidth = 0.5;
    
    // 计算容器尺寸
    const containerWidth = displayMaxHp * pixelSize + (displayMaxHp - 1) * gap + padding * 2;
    const containerHeight = pixelSize + padding * 2;
    
    // 绘制背景容器
    ctx.fillStyle = '#111';
    ctx.fillRect(x, y, containerWidth, containerHeight);
    
    // 绘制边框
    ctx.strokeStyle = '#444';
    ctx.lineWidth = borderWidth;
    ctx.strokeRect(x, y, containerWidth, containerHeight);
    
    // 计算低血量闪烁效果
    const isDanger = currentHp <= 5;
    const blinkTime = Date.now() / 600; // 0.6秒周期
    const blinkBrightness = isDanger && Math.floor(blinkTime) % 2 === 0 ? 1.6 : 1.0;
    
    // 绘制每个像素
    for (let i = 1; i <= displayMaxHp; i++) {
        const pixelX = x + padding + (i - 1) * (pixelSize + gap);
        const pixelY = y + padding;
        
        let pixelColor;
        
        if (i <= displayCurrentHp) {
            // 有生命值的像素
            if (isHit) {
                // 受击闪白
                pixelColor = '#fff';
            } else if (isHeal) {
                // 治疗闪绿
                pixelColor = '#7bff7b';
            } else {
                // 正常颜色
                if (isEnemy) {
                    pixelColor = '#d64545'; // 敌人红色
                } else {
                    pixelColor = '#4caf50'; // 玩家绿色
                }
                
                // 应用低血量闪烁
                if (isDanger && blinkBrightness > 1.0) {
                    const rgb = hexToRgb(pixelColor);
                    if (rgb) {
                        pixelColor = `rgb(${Math.min(255, rgb.r * blinkBrightness)}, ${Math.min(255, rgb.g * blinkBrightness)}, ${Math.min(255, rgb.b * blinkBrightness)})`;
                    }
                }
            }
        } else {
            // 空的生命值像素
            pixelColor = '#000';
        }
        
        ctx.fillStyle = pixelColor;
        ctx.fillRect(pixelX, pixelY, pixelSize, pixelSize);
    }
}

// 绘制像素风格经验值条
function drawPixelExpBar(ctx, x, y, currentExp, maxExp) {
    // 每1点经验值显示1个像素
    const displayMaxExp = Math.ceil(maxExp);
    const displayCurrentExp = Math.ceil(currentExp);
    
    const pixelSize = 0.8;
    const gap = 0.15;
    const padding = 0.3;
    const borderWidth = 0.5;
    
    // 计算容器尺寸
    const containerWidth = displayMaxExp * pixelSize + (displayMaxExp - 1) * gap + padding * 2;
    const containerHeight = pixelSize + padding * 2;
    
    // 绘制背景容器
    ctx.fillStyle = '#111';
    ctx.fillRect(x, y, containerWidth, containerHeight);
    
    // 绘制边框
    ctx.strokeStyle = '#444';
    ctx.lineWidth = borderWidth;
    ctx.strokeRect(x, y, containerWidth, containerHeight);
    
    // 绘制每个像素
    for (let i = 1; i <= displayMaxExp; i++) {
        const pixelX = x + padding + (i - 1) * (pixelSize + gap);
        const pixelY = y + padding;
        
        let pixelColor;
        
        if (i <= displayCurrentExp) {
            // 有经验值的像素（蓝色）
            pixelColor = '#4a90e2';
        } else {
            // 空的经验值像素
            pixelColor = '#000';
        }
        
        ctx.fillStyle = pixelColor;
        ctx.fillRect(pixelX, pixelY, pixelSize, pixelSize);
    }
}

// 绘制像素风格血条（支持缩放）
function drawPixelHealthBarScaled(ctx, x, y, currentHp, maxHp, isEnemy = false, isHit = false, isHeal = false, pixelsPerHp = 1, scale = 1.0, customColor = null) {
    // pixelsPerHp: 每多少点生命值显示1个像素（用于压缩血条长度）
    const displayMaxHp = Math.ceil(maxHp / pixelsPerHp);
    const displayCurrentHp = Math.ceil(currentHp / pixelsPerHp);
    
    const pixelSize = 0.8 * scale;
    const gap = 0.15 * scale;
    const padding = 0.3 * scale;
    const borderWidth = 0.5 * scale;
    
    // 计算容器尺寸
    const containerWidth = displayMaxHp * pixelSize + (displayMaxHp - 1) * gap + padding * 2;
    const containerHeight = pixelSize + padding * 2;
    
    // 绘制背景容器
    ctx.fillStyle = '#111';
    ctx.fillRect(x, y, containerWidth, containerHeight);
    
    // 绘制边框
    ctx.strokeStyle = '#444';
    ctx.lineWidth = borderWidth;
    ctx.strokeRect(x, y, containerWidth, containerHeight);
    
    // 计算低血量闪烁效果
    const isDanger = currentHp <= 5;
    const blinkTime = Date.now() / 600; // 0.6秒周期
    const blinkBrightness = isDanger && Math.floor(blinkTime) % 2 === 0 ? 1.6 : 1.0;
    
    // 绘制每个像素
    for (let i = 1; i <= displayMaxHp; i++) {
        const pixelX = x + padding + (i - 1) * (pixelSize + gap);
        const pixelY = y + padding;
        
        let pixelColor;
        
        if (i <= displayCurrentHp) {
            // 有生命值的像素
            if (isHit) {
                // 受击闪白
                pixelColor = '#fff';
            } else if (isHeal) {
                // 治疗闪绿
                pixelColor = '#7bff7b';
            } else {
                // 正常颜色
                if (customColor !== null) {
                    // 使用自定义颜色
                    pixelColor = customColor;
                } else if (isEnemy) {
                    pixelColor = '#d64545'; // 敌人红色
                } else {
                    pixelColor = '#4caf50'; // 玩家绿色
                }
                
                // 应用低血量闪烁
                if (isDanger && blinkBrightness > 1.0) {
                    const rgb = hexToRgb(pixelColor);
                    if (rgb) {
                        pixelColor = `rgb(${Math.min(255, rgb.r * blinkBrightness)}, ${Math.min(255, rgb.g * blinkBrightness)}, ${Math.min(255, rgb.b * blinkBrightness)})`;
                    }
                }
            }
        } else {
            // 空的生命值像素
            pixelColor = '#000';
        }
        
        ctx.fillStyle = pixelColor;
        ctx.fillRect(pixelX, pixelY, pixelSize, pixelSize);
    }
}

// 绘制像素风格经验值条（支持缩放）
function drawPixelExpBarScaled(ctx, x, y, currentExp, maxExp, scale = 1.0) {
    // 每1点经验值显示1个像素
    const displayMaxExp = Math.ceil(maxExp);
    const displayCurrentExp = Math.ceil(currentExp);
    
    const pixelSize = 0.8 * scale;
    const gap = 0.15 * scale;
    const padding = 0.3 * scale;
    const borderWidth = 0.5 * scale;
    
    // 计算容器尺寸
    const containerWidth = displayMaxExp * pixelSize + (displayMaxExp - 1) * gap + padding * 2;
    const containerHeight = pixelSize + padding * 2;
    
    // 绘制背景容器
    ctx.fillStyle = '#111';
    ctx.fillRect(x, y, containerWidth, containerHeight);
    
    // 绘制边框
    ctx.strokeStyle = '#444';
    ctx.lineWidth = borderWidth;
    ctx.strokeRect(x, y, containerWidth, containerHeight);
    
    // 绘制每个像素
    for (let i = 1; i <= displayMaxExp; i++) {
        const pixelX = x + padding + (i - 1) * (pixelSize + gap);
        const pixelY = y + padding;
        
        let pixelColor;
        
        if (i <= displayCurrentExp) {
            // 有经验值的像素（蓝色）
            pixelColor = '#4a90e2';
        } else {
            // 空的经验值像素
            pixelColor = '#000';
        }
        
        ctx.fillStyle = pixelColor;
        ctx.fillRect(pixelX, pixelY, pixelSize, pixelSize);
    }
}

// 绘制BOSS像素风格血条
function drawBossPixelHealthBar(ctx, x, y, currentHp, maxHp, isHit = false, pixelsPerHp = 10) {
    // BOSS血条：默认每10点生命值1个像素（增大血条）
    // 装甲坦克使用3.75，使1500血量显示400像素（与其他boss一致）
    const displayMaxHp = Math.ceil(maxHp / pixelsPerHp);
    const displayCurrentHp = Math.ceil(currentHp / pixelsPerHp);
    
    const pixelWidth = 0.8; // 像素宽度（增大）
    const pixelHeight = 8; // 像素高度（增大）
    const gap = 0.15;
    const padding = 0.3;
    const borderWidth = 0.5;
    
    // 计算容器尺寸
    const containerWidth = displayMaxHp * pixelWidth + (displayMaxHp - 1) * gap + padding * 2;
    const containerHeight = pixelHeight + padding * 2;
    
    // 绘制背景容器
    ctx.fillStyle = '#111';
    ctx.fillRect(x, y, containerWidth, containerHeight);
    
    // 绘制边框
    ctx.strokeStyle = '#444';
    ctx.lineWidth = borderWidth;
    ctx.strokeRect(x, y, containerWidth, containerHeight);
    
    // 计算低血量闪烁效果
    const isDanger = currentHp <= maxHp * 0.2; // 20%以下为危险
    const blinkTime = Date.now() / 600; // 0.6秒周期
    const blinkBrightness = isDanger && Math.floor(blinkTime) % 2 === 0 ? 1.6 : 1.0;
    
    // 绘制每个像素
    for (let i = 1; i <= displayMaxHp; i++) {
        const pixelX = x + padding + (i - 1) * (pixelWidth + gap);
        const pixelY = y + padding;
        
        let pixelColor;
        
        if (i <= displayCurrentHp) {
            // 有生命值的像素
            if (isHit) {
                // 受击闪白
                pixelColor = '#fff';
            } else {
                // 正常颜色（BOSS为红色）
                pixelColor = '#d64545';
                
                // 应用低血量闪烁
                if (isDanger && blinkBrightness > 1.0) {
                    const rgb = hexToRgb(pixelColor);
                    if (rgb) {
                        pixelColor = `rgb(${Math.min(255, rgb.r * blinkBrightness)}, ${Math.min(255, rgb.g * blinkBrightness)}, ${Math.min(255, rgb.b * blinkBrightness)})`;
                    }
                }
            }
        } else {
            // 空的生命值像素
            pixelColor = '#000';
        }
        
        ctx.fillStyle = pixelColor;
        ctx.fillRect(pixelX, pixelY, pixelWidth, pixelHeight);
    }
}

// 辅助函数：将十六进制颜色转换为RGB
function hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
}

// 生命值衰减缓动函数
// 基于CSS linear(0, 1 44.7%, 0.898 51.8%, 0.874 55.1%, 0.866 58.4%, 0.888 64.3%, 1 77.4%, 0.98 84.5%, 1)
function healthEasing(t) {
    // t是0-1之间的进度值
    // 将CSS linear()函数转换为JavaScript函数
    if (t <= 0) return 0;
    if (t >= 1) return 1;
    
    // 定义关键点
    const keyframes = [
        { t: 0, value: 0 },
        { t: 0.447, value: 1 },
        { t: 0.518, value: 0.898 },
        { t: 0.551, value: 0.874 },
        { t: 0.584, value: 0.866 },
        { t: 0.643, value: 0.888 },
        { t: 0.774, value: 1 },
        { t: 0.845, value: 0.98 },
        { t: 1, value: 1 }
    ];
    
    // 找到t所在的两个关键点之间
    for (let i = 0; i < keyframes.length - 1; i++) {
        const current = keyframes[i];
        const next = keyframes[i + 1];
        
        if (t >= current.t && t <= next.t) {
            // 线性插值
            const localT = (t - current.t) / (next.t - current.t);
            return current.value + (next.value - current.value) * localT;
        }
    }
    
    return 1;
}

// 获取canvas和context
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
canvas.width = CONFIG.canvasWidth;
canvas.height = CONFIG.canvasHeight;

// 背景图片
let bgImage = new Image();
bgImage.src = 'bg.png';
let bgImageLoaded = false;

bgImage.onload = function() {
    bgImageLoaded = true;
};

bgImage.onerror = function() {
    console.warn('背景图片加载失败，使用默认背景');
    bgImageLoaded = false;
};

// 坦克图片
let tankImage1 = new Image(); // 待机状态
tankImage1.src = 'tank_1.png';
let tankImage1Loaded = false;

tankImage1.onload = function() {
    tankImage1Loaded = true;
};

tankImage1.onerror = function() {
    console.warn('坦克图片1加载失败，使用默认绘制');
    tankImage1Loaded = false;
};

let tankImage2 = new Image(); // 11-20级
tankImage2.src = 'tank_2.png';
let tankImage2Loaded = false;

tankImage2.onload = function() {
    tankImage2Loaded = true;
};

tankImage2.onerror = function() {
    console.warn('坦克图片2加载失败，使用默认绘制');
    tankImage2Loaded = false;
};

let tankImage3 = new Image(); // 21-30级
tankImage3.src = 'tank_3.png';
let tankImage3Loaded = false;

tankImage3.onload = function() {
    tankImage3Loaded = true;
};

tankImage3.onerror = function() {
    console.warn('坦克图片3加载失败，使用默认绘制');
    tankImage3Loaded = false;
};

let tankImage4 = new Image(); // 31-40级
tankImage4.src = 'tank_4.png';
let tankImage4Loaded = false;

tankImage4.onload = function() {
    tankImage4Loaded = true;
};

tankImage4.onerror = function() {
    console.warn('坦克图片4加载失败，使用默认绘制');
    tankImage4Loaded = false;
};

// 子弹图片
let bulletImage1 = new Image(); // 普通子弹
bulletImage1.src = 'bullet_yellow.png';
let bulletImage1Loaded = false;

bulletImage1.onload = function() {
    bulletImage1Loaded = true;
};

bulletImage1.onerror = function() {
    console.warn('子弹图片1加载失败，使用默认绘制');
    bulletImage1Loaded = false;
};

let bulletImage2 = new Image(); // 暴击子弹
bulletImage2.src = 'bullet_red.png';
let bulletImage2Loaded = false;

bulletImage2.onload = function() {
    bulletImage2Loaded = true;
};

bulletImage2.onerror = function() {
    console.warn('子弹图片2加载失败，使用默认绘制');
    bulletImage2Loaded = false;
};

let bulletImage3 = new Image(); // 冰冻子弹
bulletImage3.src = 'bullet_blue.png';
let bulletImage3Loaded = false;

bulletImage3.onload = function() {
    bulletImage3Loaded = true;
};

bulletImage3.onerror = function() {
    console.warn('子弹图片3加载失败，使用默认绘制');
    bulletImage3Loaded = false;
};

// 敌人图片
let enemyImage1 = new Image(); // 初级敌人
enemyImage1.src = 'enemy_1.png';
let enemyImage1Loaded = false;

enemyImage1.onload = function() {
    enemyImage1Loaded = true;
};

enemyImage1.onerror = function() {
    console.warn('敌人图片1加载失败，使用默认绘制');
    enemyImage1Loaded = false;
};

let enemyImage2 = new Image(); // 中级敌人
enemyImage2.src = 'enemy_2.png';
let enemyImage2Loaded = false;

enemyImage2.onload = function() {
    enemyImage2Loaded = true;
};

enemyImage2.onerror = function() {
    console.warn('敌人图片2加载失败，使用默认绘制');
    enemyImage2Loaded = false;
};

let enemyImage3 = new Image(); // 高级敌人
enemyImage3.src = 'enemy_3.png';
let enemyImage3Loaded = false;

enemyImage3.onload = function() {
    enemyImage3Loaded = true;
};

enemyImage3.onerror = function() {
    console.warn('敌人图片3加载失败，使用默认绘制');
    enemyImage3Loaded = false;
};

let enemyImageCold = new Image(); // 冰冻状态的敌人
enemyImageCold.src = 'enemy_cold.png';
let enemyImageColdLoaded = false;

enemyImageCold.onload = function() {
    enemyImageColdLoaded = true;
};

enemyImageCold.onerror = function() {
    console.warn('敌人冰冻图片加载失败，使用默认绘制');
    enemyImageColdLoaded = false;
};

// 敌人子弹图片
let enemyBulletImage1 = new Image(); // 初级敌人子弹
enemyBulletImage1.src = 'enemy_1_bullet.png';
let enemyBulletImage1Loaded = false;

enemyBulletImage1.onload = function() {
    enemyBulletImage1Loaded = true;
};

enemyBulletImage1.onerror = function() {
    console.warn('敌人子弹图片1加载失败，使用默认绘制');
    enemyBulletImage1Loaded = false;
};

let enemyBulletImage2 = new Image(); // 中级敌人子弹
enemyBulletImage2.src = 'enemy_2_bullet.png';
let enemyBulletImage2Loaded = false;

enemyBulletImage2.onload = function() {
    enemyBulletImage2Loaded = true;
};

enemyBulletImage2.onerror = function() {
    console.warn('敌人子弹图片2加载失败，使用默认绘制');
    enemyBulletImage2Loaded = false;
};

let enemyBulletImage3 = new Image(); // 高级敌人子弹
enemyBulletImage3.src = 'enemy_3_bullet.png';
let enemyBulletImage3Loaded = false;

enemyBulletImage3.onload = function() {
    enemyBulletImage3Loaded = true;
};

enemyBulletImage3.onerror = function() {
    console.warn('敌人子弹图片3加载失败，使用默认绘制');
    enemyBulletImage3Loaded = false;
};

// Boss图片（复用enemy图片）
let bossImage4 = new Image(); // 弹幕坦克Boss
bossImage4.src = 'enemy_4.png';
let bossImage4Loaded = false;

bossImage4.onload = function() {
    bossImage4Loaded = true;
};

bossImage4.onerror = function() {
    console.warn('Boss图片4加载失败，使用默认绘制');
    bossImage4Loaded = false;
};

let bossImage5 = new Image(); // 冲撞坦克Boss
bossImage5.src = 'enemy_5.png';
let bossImage5Loaded = false;

bossImage5.onload = function() {
    bossImage5Loaded = true;
};

bossImage5.onerror = function() {
    console.warn('Boss图片5加载失败，使用默认绘制');
    bossImage5Loaded = false;
};

// Boss子弹图片
let bossBulletImage4 = new Image(); // 弹幕坦克Boss子弹
bossBulletImage4.src = 'enemy_4_bullet.png';
let bossBulletImage4Loaded = false;

bossBulletImage4.onload = function() {
    bossBulletImage4Loaded = true;
};

bossBulletImage4.onerror = function() {
    console.warn('Boss子弹图片4加载失败，使用默认绘制');
    bossBulletImage4Loaded = false;
};

let bossBulletImage5 = new Image(); // 冲撞坦克Boss子弹
bossBulletImage5.src = 'enemy_5_bullet.png';
let bossBulletImage5Loaded = false;

bossBulletImage5.onload = function() {
    bossBulletImage5Loaded = true;
};

bossBulletImage5.onerror = function() {
    console.warn('Boss子弹图片5加载失败，使用默认绘制');
    bossBulletImage5Loaded = false;
};

// 道具图片
let itemImageHealth = new Image(); // 回复生命值道具
itemImageHealth.src = 'item_health.png';
let itemImageHealthLoaded = false;

itemImageHealth.onload = function() {
    itemImageHealthLoaded = true;
};

itemImageHealth.onerror = function() {
    console.warn('道具图片-生命值加载失败，使用默认绘制');
    itemImageHealthLoaded = false;
};

let itemImageCriticalStrike = new Image(); // 暴击子弹道具
itemImageCriticalStrike.src = 'item_critical_strike.png';
let itemImageCriticalStrikeLoaded = false;

itemImageCriticalStrike.onload = function() {
    itemImageCriticalStrikeLoaded = true;
};

itemImageCriticalStrike.onerror = function() {
    console.warn('道具图片-暴击子弹加载失败，使用默认绘制');
    itemImageCriticalStrikeLoaded = false;
};

let itemImageColdBullet = new Image(); // 冰冻子弹道具
itemImageColdBullet.src = 'item_cold_bullet.png';
let itemImageColdBulletLoaded = false;

itemImageColdBullet.onload = function() {
    itemImageColdBulletLoaded = true;
};

itemImageColdBullet.onerror = function() {
    console.warn('道具图片-冰冻子弹加载失败，使用默认绘制');
    itemImageColdBulletLoaded = false;
};

let itemImageSpread = new Image(); // 子弹扩散道具
itemImageSpread.src = 'item_spread.png';
let itemImageSpreadLoaded = false;

itemImageSpread.onload = function() {
    itemImageSpreadLoaded = true;
};

itemImageSpread.onerror = function() {
    console.warn('道具图片-子弹扩散加载失败，使用默认绘制');
    itemImageSpreadLoaded = false;
};

// 音频
// 背景音乐
let bgm = new Audio('bgm.mp3');
bgm.loop = true; // 循环播放
bgm.volume = 0.4; // 音量设置为40%
let bgmStarted = false; // 背景音乐是否已启动

// 启动背景音乐（只在游戏已开始时调用）
function startBGM() {
    if (!gameState.started || gameState.paused) return; // 如果游戏未开始或已暂停，不播放
    
    bgm.play().then(() => {
        bgmStarted = true;
    }).catch(err => {
        console.warn('背景音乐播放失败:', err);
    });
}

// 游戏状态
let gameState = {
    running: false, // 游戏是否运行中
    started: false, // 游戏是否已开始
    paused: false, // 暂停状态
    kills: 0,
    level: 1,
    lastUpgradeKills: 0,
    lastEnemySpawn: 0,
    experience: 0, // 当前经验值
    lastUpgradeExp: 0, // 上次升级时的经验值
    bossKills: 0, // Boss击杀计数
    lastBossSpawnTime: 0, // 上次生成Boss的时间
    startTime: 0, // 游戏开始时间（毫秒）
    pauseStartTime: 0, // 暂停开始时间（毫秒）
    totalPauseTime: 0, // 总暂停时间（毫秒）
    splitSlowEndTime: 0, // 分裂Boss被击杀后，用于减缓刷怪的结束时间戳
    splitSlowEndTime: 0, // 分裂Boss被击杀后，用于减缓刷怪的结束时间戳
    upgradeModules: {
        LASER: 0,
        SPREAD: 0,
        BOUNCE: 0,
        FREEZE: 0,
        CRIT: 0,
        REGEN: 0
    }, // 技能模块等级
    pendingUpgrade: false // 是否有待处理的升级
};

// 坦克类
class Tank {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.baseWidth = 40;
        this.baseHeight = 40;
        this.width = 40;
        this.height = 40;
        this.baseSpeed = 3; // 基础移动速度
        this.speed = 3;
        this.angle = 0;
        this.health = 100;
        this.maxHealth = 100;
        this.displayHealth = 100; // 显示生命值（用于缓动动画）
        this.healthAnimationStart = null; // 生命值动画开始时间
        this.healthAnimationStartValue = 100; // 生命值动画开始值
        this.isHit = false; // 受击状态
        this.isHeal = false; // 治疗状态
        this.hitTimer = 0; // 受击计时器
        this.healTimer = 0; // 治疗计时器
        
        // 武器属性
        this.damage = 60; // 每发子弹60伤害（从50提升到60，增加清怪效率）
        this.bulletCount = 1; // 单次发射子弹数量
        this.baseFireRate = 500; // 基础射击间隔（毫秒）
        this.fireRate = 500; // 当前射击间隔（毫秒）
        this.lastFireTime = 0;
        this.bulletSpeed = 8;
        this.bulletSize = CONFIG.bulletSize.initial; // 子弹大小
        this.bulletSpread = 0; // 子弹扩散角度
        this.fullCircleShoot = false; // 是否全方位射击
        this.upgradeLevel = 0; // 升级等级
        
        // 道具效果
        this.hasSpread = false; // 子弹扩散效果
        this.spreadStack = 0; // 子弹扩散叠加次数（最多2次）
        this.spreadDuration = 0; // 子弹扩散持续时间
        this.hasFreeze = false; // 冰冻子弹效果
        this.freezeDuration = 0; // 冰冻持续时间
        this.lastFreezeShootTime = 0; // 上次冰冻子弹射击时间
        
        // 肉鸽技能属性
        // 激光模组
        this.hasLaser = false;
        this.laserWidth = 20; // 增加基础宽度，使其更明显
        this.laserDamage = 0;
        this.laserFireRate = 0;
        this.laserSweep = false;
        this.laserSweepDuration = 0;
        this.activeLasers = []; // 活跃的激光
        
        // 扩容弹舱（已在上面定义bulletCount和bulletSpread）
        
        // 智能跳弹（已有hasBounce和bounceStack）
        this.bounceDamageReduction = 1.0;
        this.laserRefraction = false;
        
        // 液氮弹头
        this.freezeSlowPercent = 0;
        this.freezeDuration = 0;
        this.freezeStack = 0;
        this.freezeFreezeDuration = 0;
        this.freezeAOE = false;
        this.freezeExplosion = false;
        this.enemyFreezeCount = new Map(); // 跟踪每个敌人的冰冻计数
        
        // 贫铀核心
        this.critRate = 0;
        this.critDamage = 1.0;
        this.critKnockback = 1.0;
        this.critPenetrate = false;
        
        // 纳米修复
        this.hasRegen = false;
        this.regenInterval = 0;
        this.regenPercent = 0;
        this.lastRegenTime = 0;
        this.invincibleOnHit = false;
        this.invincibleDuration = 0;
        this.invincibleTimer = 0;
        this.invincibleUntil = 0; // 无敌结束时间
        this.reactiveArmor = false;
        this.hasCrit = false; // 暴击效果
        this.critDuration = 0; // 暴击持续时间
        this.critStack = 0; // 暴击叠加次数
        this.hasBounce = false; // 子弹反弹效果
        this.bounceStack = 0; // 反弹叠加次数
        this.bounceDuration = 0; // 反弹持续时间（毫秒）
        this.hasPenetrate = false; // 子弹穿透效果
        this.penetrateStack = 0; // 穿透叠加次数
        this.hasLowHealthBoost = false; // 低生命值加速效果
        this.lowHealthBoostStack = 0; // 低生命值加速叠加次数
        
        // 开火动画效果
        this.muzzleFlash = null; // 炮口闪光效果
        this.recoilOffset = 0; // 后坐力偏移
        
        // 移动动画效果
        this.isMoving = false; // 是否正在移动
        this.moveAnimationTime = 0; // 移动动画时间
        this.lastX = x; // 上一帧的x位置
        this.lastY = y; // 上一帧的y位置
    }
    
    update() {
        // WASD控制移动
        let dx = 0;
        let dy = 0;
        
        // 键盘控制
        if (keys['w'] || keys['ArrowUp']) dy -= 1;
        if (keys['s'] || keys['ArrowDown']) dy += 1;
        if (keys['a'] || keys['ArrowLeft']) dx -= 1;
        if (keys['d'] || keys['ArrowRight']) dx += 1;
        
        // 摇杆控制（如果摇杆有输入，优先使用摇杆）
        if (joystickInput.x !== 0 || joystickInput.y !== 0) {
            dx = joystickInput.x;
            dy = joystickInput.y;
        }
        
        // 归一化对角线移动
        if (dx !== 0 && dy !== 0) {
            dx *= 0.707;
            dy *= 0.707;
        }
        
        // 检测是否在移动
        const wasMoving = this.isMoving;
        this.isMoving = dx !== 0 || dy !== 0;
        
        // 更新移动动画时间
        if (this.isMoving) {
            this.moveAnimationTime += 16; // 假设60fps，每帧约16ms
        } else {
            // 停止移动时，逐渐减少动画时间
            this.moveAnimationTime *= 0.9;
            if (this.moveAnimationTime < 1) {
                this.moveAnimationTime = 0;
            }
        }
        
        // 根据是否移动调整射速：移动时射速下降，静止时保持原射速
        // 移动时射速为静止时的1.5倍（射速变慢）
        const moveFireRateMultiplier = this.isMoving ? 1.5 : 1.0;
        
        // 低生命值加速效果（根据叠加次数增强）
        if (this.hasLowHealthBoost && this.health / this.maxHealth <= 0.5) {
            const boostMultiplier = 1 + (this.lowHealthBoostStack * 0.5); // 每次叠加增加50%效果
            this.speed = this.baseSpeed * 1.5 * boostMultiplier; // 移速加快
            this.fireRate = this.baseFireRate * (0.5 / boostMultiplier) * moveFireRateMultiplier; // 射速加快，但仍受移动影响
        } else {
            // 正常状态：根据移动状态调整速度
            this.speed = this.baseSpeed;
            this.fireRate = this.baseFireRate * moveFireRateMultiplier;
        }
        
        this.x += dx * this.speed;
        this.y += dy * this.speed;
        
        // 边界限制
        this.x = Math.max(this.width / 2, Math.min(CONFIG.canvasWidth - this.width / 2, this.x));
        this.y = Math.max(this.height / 2, Math.min(CONFIG.canvasHeight - this.height / 2, this.y));
        
        // 计算朝向准星的角度（用于射击方向）
        const crosshairDx = crosshair.x - this.x;
        const crosshairDy = crosshair.y - this.y;
        if (crosshairDx !== 0 || crosshairDy !== 0) {
            this.angle = Math.atan2(crosshairDy, crosshairDx);
        }
        
        // 自动射击
        const now = Date.now();
        const currentFireRate = this.hasLaser ? (this.laserFireRate || this.fireRate) : this.fireRate;
        if (now - this.lastFireTime >= currentFireRate) {
            this.shoot();
            this.lastFireTime = now;
            // 触发开火动画效果
            this.triggerMuzzleFlash();
            this.triggerRecoil();
        }
        
        // 冰冻子弹独立射击系统（每3秒射击一次）
        if (this.hasFreeze && now - this.lastFreezeShootTime >= 3000) {
            this.shootFreezeBullet();
            this.lastFreezeShootTime = now;
        }
        
        // 更新开火动画效果
        this.updateMuzzleFlash(now);
        this.updateRecoil(now);
        
        // 保存当前位置用于下一帧比较
        this.lastX = this.x;
        this.lastY = this.y;
        
        // 更新显示生命值（使用缓动函数）
        this.updateDisplayHealth();
    }
    
    updateDisplayHealth() {
        const now = Date.now();
        
        // 如果实际生命值发生变化
        if (this.displayHealth !== this.health) {
            // 如果生命值增加，立即更新（不使用缓动）
            if (this.health > this.displayHealth) {
                this.displayHealth = this.health;
                this.healthAnimationStart = null;
            } else {
                // 如果生命值减少，使用缓动动画
                if (this.healthAnimationStart === null) {
                    this.healthAnimationStart = now;
                    this.healthAnimationStartValue = this.displayHealth;
                }
                
                const elapsed = now - this.healthAnimationStart;
                const progress = Math.min(1, elapsed / CONFIG.healthEasingDuration);
                const easedProgress = healthEasing(progress);
                
                // 计算目标生命值和起始生命值的差值
                const healthDiff = this.health - this.healthAnimationStartValue;
                this.displayHealth = this.healthAnimationStartValue + healthDiff * easedProgress;
                
                // 如果动画完成，重置
                if (progress >= 1) {
                    this.displayHealth = this.health;
                    this.healthAnimationStart = null;
                }
            }
        } else {
            // 如果生命值没有变化，重置动画状态
            this.healthAnimationStart = null;
        }
    }
    
    shoot() {
        // 如果有激光模组，发射激光
        if (this.hasLaser) {
            this.shootLaser();
            return;
        }
        
        // 判断是否暴击（使用技能系统的暴击率，而不是道具）
        let isCrit = false;
        let critMultiplier = 1;
        if (this.critRate > 0) {
            // 使用技能系统的暴击率
            if (Math.random() < this.critRate) {
                isCrit = true;
                critMultiplier = this.critDamage;
            }
        }
        // 道具系统的暴击（临时效果）
        if (this.hasCrit && this.critDuration > 0) {
            const propCrit = Math.random() < 0.5; // 道具暴击率50%
            if (propCrit) {
                isCrit = true;
                critMultiplier = Math.pow(2, this.critStack);
            }
        }
        const actualDamage = this.damage * critMultiplier;
        
        // 计算炮口位置（子弹发射位置）
        const muzzleOffset = this.width / 2 + 15; // 炮口距离坦克中心的距离
        const muzzleX = this.x + Math.cos(this.angle) * muzzleOffset;
        const muzzleY = this.y + Math.sin(this.angle) * muzzleOffset;
        
        if (this.fullCircleShoot) {
            // Lv 5 全弹发射：向坦克四周 360 度发射一圈子弹，总共15发均匀分布
            const bulletCount = this.bulletCount; // 15发
            
            for (let i = 0; i < bulletCount; i++) {
                // 均匀分布在360度
                const bulletAngle = (Math.PI * 2 / bulletCount) * i;
                const dynamicBulletSize = this.bulletSize;
                // Lv 5 红死神：如果暴击且critPenetrate为true，子弹穿透
                const shouldPenetrate = isCrit && this.critPenetrate ? true : this.hasPenetrate;
                const penetrateCount = isCrit && this.critPenetrate ? 1 : (this.penetrateStack || 1);
                
                // 检查是否有液氮弹头模块且没有激光（子弹使用bullet_blue.png）
                const hasFreezeModule = gameState.upgradeModules.FREEZE > 0;
                const isFreezeBullet = hasFreezeModule && !this.hasLaser;
                
                bullets.push(new Bullet(
                    muzzleX,
                    muzzleY,
                    bulletAngle,
                    this.bulletSpeed,
                    actualDamage,
                    dynamicBulletSize,
                    isFreezeBullet, // 如果有液氮弹头模块且没有激光，使用冰冻子弹
                    isCrit,
                    this.hasBounce,
                    shouldPenetrate,
                    this.hasBounce ? (this.bounceStack || 1) : 0, // 最大折射次数（只有在有折射能力时才使用）
                    penetrateCount
                ));
            }
        } else {
            // 正常射击
            let angleStep = 0;
            let bulletCount = this.bulletCount;
            
            // 如果有扩散道具，根据叠加次数增加子弹数量和扩散角度
            if (this.hasSpread && this.spreadStack > 0) {
                // 1次叠加：3发子弹，30度扩散
                // 2次叠加：5发子弹，45度扩散
                if (this.spreadStack >= 2) {
                    bulletCount = Math.max(5, bulletCount);
                    angleStep = Math.PI / 4; // 45度扩散
                } else {
                    bulletCount = Math.max(3, bulletCount);
                    angleStep = Math.PI / 6; // 30度扩散
                }
            } else if (this.bulletSpread > 0) {
                angleStep = this.bulletSpread / (this.bulletCount - 1 || 1);
            } else if (this.bulletCount > 1) {
                angleStep = Math.PI / 8;
            }
            
            const startAngle = this.angle - (angleStep * (bulletCount - 1) / 2);
            
            for (let i = 0; i < bulletCount; i++) {
                const bulletAngle = startAngle + (angleStep * i);
                // 子弹大小使用固定值，不再随坦克体型动态变化（避免过大）
                const dynamicBulletSize = this.bulletSize;
                // Lv 5 红死神：如果暴击且critPenetrate为true，子弹穿透
                const shouldPenetrate = isCrit && this.critPenetrate ? true : this.hasPenetrate;
                const penetrateCount = isCrit && this.critPenetrate ? 1 : (this.penetrateStack || 1);
                
                // 检查是否有液氮弹头模块且没有激光（子弹使用bullet_blue.png）
                const hasFreezeModule = gameState.upgradeModules.FREEZE > 0;
                const isFreezeBullet = hasFreezeModule && !this.hasLaser;
                
                bullets.push(new Bullet(
                    muzzleX,
                    muzzleY,
                    bulletAngle,
                    this.bulletSpeed,
                    actualDamage,
                    dynamicBulletSize,
                    isFreezeBullet, // 如果有液氮弹头模块且没有激光，使用冰冻子弹
                    isCrit,
                    this.hasBounce,
                    shouldPenetrate,
                    this.hasBounce ? (this.bounceStack || 1) : 0, // 最大反弹次数（只有在有反弹能力时才使用）
                    penetrateCount // 最大穿透次数
                ));
            }
        }
        
        // 更新道具持续时间
        if (this.hasSpread) {
            this.spreadDuration -= this.fireRate;
            if (this.spreadDuration <= 0) {
                this.hasSpread = false;
                this.spreadStack = 0;
            }
        }
        if (this.hasCrit) {
            this.critDuration -= this.fireRate;
            if (this.critDuration <= 0) {
                this.hasCrit = false;
                this.critStack = 0; // 重置叠加次数
            }
        }
        if (this.hasBounce) {
            this.bounceDuration -= 16; // 假设60fps，每帧约16ms
            if (this.bounceDuration <= 0) {
                this.hasBounce = false;
                this.bounceStack = 0; // 重置叠加次数
            }
        }
    }
    
    // 激光射击方法
    shootLaser() {
        const muzzleOffset = this.width / 2 + 15;
        const muzzleX = this.x + Math.cos(this.angle) * muzzleOffset;
        const muzzleY = this.y + Math.sin(this.angle) * muzzleOffset;
        
        // 触发炮口闪光动画，模拟激光发射
        this.triggerMuzzleFlash();
        
        // 计算激光伤害（确保使用正确的伤害值）
        // 如果laserDamage为0或未设置，使用普通子弹伤害
        let baseLaserDamage = this.laserDamage > 0 ? this.laserDamage : this.damage;
        
        // 根据子弹数量发射多条激光
        let laserCount = this.bulletCount;
        
        if (this.fullCircleShoot) {
            // Lv 5 全弹发射：向坦克四周 360 度发射一圈激光，总共15发均匀分布
            const laserCount = this.bulletCount; // 15发
            
            for (let i = 0; i < laserCount; i++) {
                // 均匀分布在360度
                const laserAngle = (Math.PI * 2 / laserCount) * i;
                const duration = this.laserSweep ? this.laserSweepDuration : 100;
                
                // 每条激光独立计算暴击
                let laserDamage = baseLaserDamage;
                if (this.critRate > 0 && Math.random() < this.critRate) {
                    laserDamage = laserDamage * this.critDamage;
                }
                
                lasers.push(new Laser(
                    muzzleX,
                    muzzleY,
                    laserAngle,
                    this.laserWidth,
                    laserDamage,
                    duration,
                    this.laserSweep
                ));
            }
        } else {
            // 正常扇形发射
            let angleStep = 0;
            if (laserCount > 1) {
                angleStep = this.bulletSpread / (laserCount - 1 || 1);
            }
            
            const startAngle = this.angle - (angleStep * (laserCount - 1) / 2);
            
            for (let i = 0; i < laserCount; i++) {
                const laserAngle = startAngle + (angleStep * i);
                // 如果是扫射模式（Lv 5），使用扫射持续时间；否则使用短暂持续时间（100毫秒）让玩家能看到激光效果
                const duration = this.laserSweep ? this.laserSweepDuration : 100;
                
                // 每条激光独立计算暴击（更真实）
                let laserDamage = baseLaserDamage;
                if (this.critRate > 0 && Math.random() < this.critRate) {
                    laserDamage = laserDamage * this.critDamage;
                }
                
                lasers.push(new Laser(
                    muzzleX,
                    muzzleY,
                    laserAngle,
                    this.laserWidth,
                    laserDamage,
                    duration,
                    this.laserSweep
                ));
            }
        }
    }
    
    // 冰冻子弹独立射击方法
    shootFreezeBullet() {
        const muzzleOffset = this.width / 2 + 15;
        const muzzleX = this.x + Math.cos(this.angle) * muzzleOffset;
        const muzzleY = this.y + Math.sin(this.angle) * muzzleOffset;
        // 冰冻子弹大小使用固定值，不再随坦克体型动态变化（避免过大）
        const dynamicBulletSize = this.bulletSize;
        
        bullets.push(new Bullet(
            muzzleX,
            muzzleY,
            this.angle,
            this.bulletSpeed,
            this.damage,
            dynamicBulletSize,
            true, // 冰冻子弹
            false,
            false,
            false,
            0, // 冰冻子弹无反弹
            0 // 冰冻子弹无穿透
        ));
    }
    
    draw() {
        ctx.save();
        ctx.translate(this.x, this.y);
        
        // 移动动画效果：上下浮动和轻微倾斜
        let moveOffsetY = 0;
        let moveRotation = 0;
        
        if (this.moveAnimationTime > 0) {
            // 上下浮动效果（模拟履带震动，降低抖动程度）
            moveOffsetY = Math.sin(this.moveAnimationTime / 50) * 0.8; // 从1.5降低到0.8
            
            // 轻微倾斜效果（模拟移动时的惯性，降低抖动程度）
            moveRotation = Math.sin(this.moveAnimationTime / 80) * 0.025; // 从0.05降低到0.025
        }
        
        // 应用移动动画偏移
        ctx.translate(0, moveOffsetY);
        
        // 应用旋转（先应用移动倾斜，再应用朝向角度）
        ctx.rotate(this.angle + moveRotation);
        
        // 应用后坐力偏移
        const recoilX = Math.cos(this.angle + Math.PI) * this.recoilOffset;
        const recoilY = Math.sin(this.angle + Math.PI) * this.recoilOffset;
        ctx.translate(recoilX, recoilY);
        
        // 根据等级选择坦克图片
        // 0-10级使用tank_1.png, 11-20级使用tank_2.png, 21-30级使用tank_3.png, 31+级使用tank_4.png
        let currentTankImage = null;
        let currentTankImageLoaded = false;
        
        if (this.upgradeLevel <= 10) {
            currentTankImage = tankImage1;
            currentTankImageLoaded = tankImage1Loaded;
        } else if (this.upgradeLevel <= 20) {
            currentTankImage = tankImage2;
            currentTankImageLoaded = tankImage2Loaded;
        } else if (this.upgradeLevel <= 30) {
            currentTankImage = tankImage3;
            currentTankImageLoaded = tankImage3Loaded;
        } else {
            currentTankImage = tankImage4;
            currentTankImageLoaded = tankImage4Loaded;
        }
        
        // 绘制坦克
        if (currentTankImageLoaded && currentTankImage) {
            // 使用图片绘制坦克
            ctx.drawImage(currentTankImage, -this.width / 2, -this.height / 2, this.width, this.height);
        } else {
            // 如果图片未加载，使用默认绘制
            // 坦克主体
            ctx.fillStyle = '#4CAF50';
            ctx.fillRect(-this.width / 2, -this.height / 2, this.width, this.height);
            
            // 坦克炮管
            ctx.fillStyle = '#2E7D32';
            ctx.fillRect(this.width / 2 - 5, -5, 30, 10);
            
            // 坦克装饰
            ctx.fillStyle = '#66BB6A';
            ctx.fillRect(-this.width / 2 + 5, -this.height / 2 + 5, this.width - 10, this.height - 10);
        }
        
        ctx.restore();
        
        // 绘制炮口闪光效果
        this.drawMuzzleFlash();
        
        // 不再绘制玩家头上的血条（血条显示在左上角UI中）
    }
    
    takeDamage(amount) {
        // 纳米修复：无敌时间检查
        const now = Date.now();
        if (this.invincibleOnHit && now < this.invincibleUntil) {
            return; // 无敌时间内不受伤害
        }
        
        // 确保伤害值是有效数字
        const damage = isNaN(amount) || amount <= 0 ? 0 : amount;
        this.health -= damage;
        
        // 纳米修复：受伤后获得无敌时间
        if (this.invincibleOnHit) {
            this.invincibleUntil = now + this.invincibleDuration;
        }
        
        // 触发受击效果
        this.isHit = true;
        this.hitTimer = 70; // 70ms受击闪烁时间
        if (this.health <= 0) {
            this.health = 0;
            gameState.running = false;
            showGameOver(false);
        }
        // 确保生命值不是NaN
        if (isNaN(this.health)) {
            this.health = this.maxHealth;
        }
    }
    
    heal(amount) {
        const oldHealth = this.health;
        this.health = Math.min(this.maxHealth, this.health + amount);
        if (this.health > oldHealth) {
            // 触发治疗效果
            this.isHeal = true;
            this.healTimer = 70; // 70ms治疗闪烁时间
        }
    }
    
    // 触发炮口闪光
    triggerMuzzleFlash() {
        this.muzzleFlash = {
            active: true,
            startTime: Date.now(),
            duration: 100, // 闪光持续时间100ms
            intensity: 1.0
        };
    }
    
    // 更新炮口闪光
    updateMuzzleFlash(now) {
        if (this.muzzleFlash && this.muzzleFlash.active) {
            const elapsed = now - this.muzzleFlash.startTime;
            if (elapsed >= this.muzzleFlash.duration) {
                this.muzzleFlash.active = false;
            } else {
                // 闪光强度逐渐减弱
                this.muzzleFlash.intensity = 1 - (elapsed / this.muzzleFlash.duration);
            }
        }
    }
    
    // 绘制炮口闪光
    drawMuzzleFlash() {
        if (this.muzzleFlash && this.muzzleFlash.active) {
            ctx.save();
            
            // 计算炮口位置
            const muzzleX = this.x + Math.cos(this.angle) * (this.width / 2 + 20);
            const muzzleY = this.y + Math.sin(this.angle) * (this.width / 2 + 20);
            
            // 如果是激光模式，使用绿色/蓝色闪光效果
            if (this.hasLaser) {
                // 检查是否有液氮弹头模块（激光变蓝色）
                const hasFreezeModule = gameState.upgradeModules.FREEZE > 0;
                const isFreezeLaser = hasFreezeModule;
                
                if (isFreezeLaser) {
                    // 绘制液氮激光闪光外层（蓝色，降低亮度和半径）
                    const outerRadius = 20 * this.muzzleFlash.intensity;
                    const gradient1 = ctx.createRadialGradient(muzzleX, muzzleY, 0, muzzleX, muzzleY, outerRadius);
                    gradient1.addColorStop(0, `rgba(0, 150, 255, ${0.6 * this.muzzleFlash.intensity})`);
                    gradient1.addColorStop(0.5, `rgba(50, 200, 255, ${0.4 * this.muzzleFlash.intensity})`);
                    gradient1.addColorStop(1, `rgba(100, 220, 255, 0)`);
                    ctx.fillStyle = gradient1;
                    ctx.beginPath();
                    ctx.arc(muzzleX, muzzleY, outerRadius, 0, Math.PI * 2);
                    ctx.fill();
                    
                    // 绘制液氮激光闪光内层（白色/蓝色）
                    const innerRadius = 8 * this.muzzleFlash.intensity;
                    const gradient2 = ctx.createRadialGradient(muzzleX, muzzleY, 0, muzzleX, muzzleY, innerRadius);
                    gradient2.addColorStop(0, `rgba(255, 255, 255, ${0.7 * this.muzzleFlash.intensity})`);
                    gradient2.addColorStop(0.5, `rgba(200, 220, 255, ${0.5 * this.muzzleFlash.intensity})`);
                    gradient2.addColorStop(1, `rgba(100, 180, 255, 0)`);
                    ctx.fillStyle = gradient2;
                    ctx.beginPath();
                    ctx.arc(muzzleX, muzzleY, innerRadius, 0, Math.PI * 2);
                    ctx.fill();
                    
                    // 绘制液氮激光发射形状（细长的椭圆形，朝向射击方向）
                    ctx.save();
                    ctx.translate(muzzleX, muzzleY);
                    ctx.rotate(this.angle);
                    const laserWidth = 16 * this.muzzleFlash.intensity;
                    const laserHeight = 5 * this.muzzleFlash.intensity;
                    const laserGradient = ctx.createRadialGradient(0, 0, 0, 0, 0, laserWidth);
                    laserGradient.addColorStop(0, `rgba(255, 255, 255, ${0.7 * this.muzzleFlash.intensity})`);
                    laserGradient.addColorStop(0.2, `rgba(0, 150, 255, ${0.7 * this.muzzleFlash.intensity})`);
                    laserGradient.addColorStop(0.5, `rgba(50, 200, 255, ${0.45 * this.muzzleFlash.intensity})`);
                    laserGradient.addColorStop(1, `rgba(100, 220, 255, 0)`);
                    ctx.fillStyle = laserGradient;
                    ctx.beginPath();
                    ctx.ellipse(laserWidth / 2, 0, laserWidth, laserHeight, 0, 0, Math.PI * 2);
                    ctx.fill();
                    ctx.restore();
                } else {
                    // 绘制普通激光闪光外层（深绿色，亮度降低）
                    const outerRadius = 20 * this.muzzleFlash.intensity;
                    const gradient1 = ctx.createRadialGradient(muzzleX, muzzleY, 0, muzzleX, muzzleY, outerRadius);
                    gradient1.addColorStop(0, `rgba(0, 160, 40, ${0.7 * this.muzzleFlash.intensity})`);
                    gradient1.addColorStop(0.5, `rgba(30, 190, 70, ${0.45 * this.muzzleFlash.intensity})`);
                    gradient1.addColorStop(1, `rgba(60, 210, 100, 0)`);
                    ctx.fillStyle = gradient1;
                    ctx.beginPath();
                    ctx.arc(muzzleX, muzzleY, outerRadius, 0, Math.PI * 2);
                    ctx.fill();
                    
                    // 绘制普通激光闪光内层（白色/深绿色）
                    const innerRadius = 10 * this.muzzleFlash.intensity;
                    const gradient2 = ctx.createRadialGradient(muzzleX, muzzleY, 0, muzzleX, muzzleY, innerRadius);
                    gradient2.addColorStop(0, `rgba(255, 255, 255, ${0.8 * this.muzzleFlash.intensity})`);
                    gradient2.addColorStop(0.5, `rgba(200, 235, 200, ${0.6 * this.muzzleFlash.intensity})`);
                    gradient2.addColorStop(1, `rgba(80, 200, 90, 0)`);
                    ctx.fillStyle = gradient2;
                    ctx.beginPath();
                    ctx.arc(muzzleX, muzzleY, innerRadius, 0, Math.PI * 2);
                    ctx.fill();
                    
                    // 绘制普通激光发射形状（细长的椭圆形，朝向射击方向）
                    ctx.save();
                    ctx.translate(muzzleX, muzzleY);
                    ctx.rotate(this.angle);
                    const laserWidth = 16 * this.muzzleFlash.intensity;
                    const laserHeight = 5 * this.muzzleFlash.intensity;
                    const laserGradient = ctx.createRadialGradient(0, 0, 0, 0, 0, laserWidth);
                    laserGradient.addColorStop(0, `rgba(255, 255, 255, ${0.8 * this.muzzleFlash.intensity})`);
                    laserGradient.addColorStop(0.2, `rgba(0, 180, 60, ${0.7 * this.muzzleFlash.intensity})`);
                    laserGradient.addColorStop(0.5, `rgba(40, 200, 80, ${0.5 * this.muzzleFlash.intensity})`);
                    laserGradient.addColorStop(1, `rgba(70, 215, 110, 0)`);
                    ctx.fillStyle = laserGradient;
                    ctx.beginPath();
                    ctx.ellipse(laserWidth / 2, 0, laserWidth, laserHeight, 0, 0, Math.PI * 2);
                    ctx.fill();
                    ctx.restore();
                }
            } else {
                // 普通子弹模式：绘制闪光外层（橙色/黄色）
                const outerRadius = 15 * this.muzzleFlash.intensity;
                const gradient1 = ctx.createRadialGradient(muzzleX, muzzleY, 0, muzzleX, muzzleY, outerRadius);
                gradient1.addColorStop(0, `rgba(255, 200, 0, ${0.8 * this.muzzleFlash.intensity})`);
                gradient1.addColorStop(0.5, `rgba(255, 150, 0, ${0.5 * this.muzzleFlash.intensity})`);
                gradient1.addColorStop(1, `rgba(255, 100, 0, 0)`);
                ctx.fillStyle = gradient1;
                ctx.beginPath();
                ctx.arc(muzzleX, muzzleY, outerRadius, 0, Math.PI * 2);
                ctx.fill();
                
                // 绘制闪光内层（白色/黄色）
                const innerRadius = 8 * this.muzzleFlash.intensity;
                const gradient2 = ctx.createRadialGradient(muzzleX, muzzleY, 0, muzzleX, muzzleY, innerRadius);
                gradient2.addColorStop(0, `rgba(255, 255, 255, ${this.muzzleFlash.intensity})`);
                gradient2.addColorStop(0.5, `rgba(255, 255, 200, ${0.7 * this.muzzleFlash.intensity})`);
                gradient2.addColorStop(1, `rgba(255, 200, 0, 0)`);
                ctx.fillStyle = gradient2;
                ctx.beginPath();
                ctx.arc(muzzleX, muzzleY, innerRadius, 0, Math.PI * 2);
                ctx.fill();
                
                // 绘制炮口火焰形状（椭圆形，朝向射击方向）
                ctx.save();
                ctx.translate(muzzleX, muzzleY);
                ctx.rotate(this.angle);
                const flameWidth = 12 * this.muzzleFlash.intensity;
                const flameHeight = 8 * this.muzzleFlash.intensity;
                const flameGradient = ctx.createRadialGradient(0, 0, 0, 0, 0, flameWidth);
                flameGradient.addColorStop(0, `rgba(255, 255, 255, ${this.muzzleFlash.intensity})`);
                flameGradient.addColorStop(0.3, `rgba(255, 200, 0, ${0.8 * this.muzzleFlash.intensity})`);
                flameGradient.addColorStop(0.6, `rgba(255, 100, 0, ${0.5 * this.muzzleFlash.intensity})`);
                flameGradient.addColorStop(1, `rgba(255, 50, 0, 0)`);
                ctx.fillStyle = flameGradient;
                ctx.beginPath();
                ctx.ellipse(flameWidth / 2, 0, flameWidth, flameHeight, 0, 0, Math.PI * 2);
                ctx.fill();
                ctx.restore();
            }
            
            ctx.restore();
        }
    }
    
    // 触发后坐力
    triggerRecoil() {
        this.recoilOffset = 3; // 后坐力偏移量
    }
    
    // 更新后坐力
    updateRecoil(now) {
        if (this.recoilOffset > 0) {
            // 后坐力逐渐恢复
            this.recoilOffset *= 0.85; // 每帧减少15%
            if (this.recoilOffset < 0.1) {
                this.recoilOffset = 0;
            }
        }
    }
}

// 敌人类型
const EnemyType = {
    BASIC: { health: 50, baseDamage: 3, color: '#FF6B6B', size: 25, speed: 1.2, score: 1, exp: 1 }, // 初级敌人：1 XP（伤害降低）
    MEDIUM: { health: 100, baseDamage: 6, color: '#FFA500', size: 30, speed: 1.5, score: 2, exp: 4 }, // 中级敌人：4 XP（伤害降低）
    ADVANCED: { health: 170, baseDamage: 9, color: '#9C27B0', size: 35, speed: 1.8, score: 3, exp: 10 }, // 高级敌人：10 XP（略微降低血量）
};

// Boss类型
const BossType = {
    ARMOR: 'ARMOR',      // 装甲坦克Boss
    LIFESTEAL: 'LIFESTEAL', // 吸血坦克Boss
    SPLIT: 'SPLIT',      // 分裂坦克Boss
    CHARGE: 'CHARGE',    // 冲撞坦克Boss
    BARRAGE: 'BARRAGE'   // 弹幕坦克Boss
};

// 肉鸽技能模块定义
const UPGRADE_MODULES = {
    LASER: {
        id: 'LASER',
        name: '激光模组',
        category: '主炮改造',
        levels: [
            { level: 1, description: '主炮变为激光。' },
            { level: 2, description: '激光变粗。' },
            { level: 3, description: '激光攻击间隔减少。' },
            { level: 4, description: '激光伤害增加。' },
            { level: 5, description: '激光击杀会回复生命值。', isSpecial: true }
        ]
    },
    SPREAD: {
        id: 'SPREAD',
        name: '扩容弹舱',
        category: '主炮改造',
        levels: [
            { level: 1, description: '发射物 +1。' },
            { level: 2, description: '发射物 +1。' },
            { level: 3, description: '发射物 +2。' },
            { level: 4, description: '发射角度覆盖前方 120 度。' },
            { level: 5, description: '向坦克四周 360 度发射。', isSpecial: true }
        ]
    },
    BOUNCE: {
        id: 'BOUNCE',
        name: '智能跳弹',
        category: '物理修正',
        levels: [
            { level: 1, description: '发射物击中墙壁后，反弹 1 次，伤害减半。' },
            { level: 2, description: '反弹伤害不再减半。' },
            { level: 3, description: '反弹次数 +1。' },
            { level: 4, description: '子弹飞行速度/激光射程 +30%。' },
            { level: 5, description: '反弹次数 +2。', isSpecial: true }
        ]
    },
    FREEZE: {
        id: 'FREEZE',
        name: '液氮弹头',
        category: '元素附魔',
        levels: [
            { level: 1, description: '击中敌人造成 30% 减速，持续 1 秒。' },
            { level: 2, description: '减速效果提升至 60%。' },
            { level: 3, description: '连续击中同一敌人 3 次，将其冻结 2 秒（BOSS 效果减半）。' },
            { level: 4, description: '击中敌人时，周围敌人有概率也被冻结。' },
            { level: 5, description: '被冻结的敌人死亡时会碎裂，向周围发射 4 枚冰刺。', isSpecial: true }
        ]
    },
    CRIT: {
        id: 'CRIT',
        name: '贫铀核心',
        category: '数值爆发',
        levels: [
            { level: 1, description: '暴击率 +10%，暴击伤害 150%。' },
            { level: 2, description: '暴击率 +15%，暴击伤害 180%。' },
            { level: 3, description: '暴击率 +20%，暴击伤害 200%。' },
            { level: 4, description: '暴击击退力 +100%。' },
            { level: 5, description: '暴击率 +25%，触发暴击时，子弹穿透当前目标，直接打击身后的敌人。', isSpecial: true }
        ]
    },
    REGEN: {
        id: 'REGEN',
        name: '纳米修复',
        category: '生存',
        levels: [
            { level: 1, description: '每 5 秒回复 5% 最大生命值。' },
            { level: 2, description: '回复频率提升至每 4 秒。' },
            { level: 3, description: '最大生命值 +30%。' },
            { level: 4, description: '受到伤害后，获得 1 秒无敌时间。' },
            { level: 5, description: '每当回复生命值时，基于已损失生命值造成伤害。', isSpecial: true }
        ]
    }
};

// 等级表：每个等级所需的经验值
const LEVEL_TABLE = [
    { level: 1, requiredExp: 5, description: '只有初级敌人' },
    { level: 2, requiredExp: 10, description: '初级敌人稀疏刷新' },
    { level: 3, requiredExp: 20, description: '初级敌人变多' },
    { level: 4, requiredExp: 35, description: '初级敌人成群' },
    { level: 5, requiredExp: 50, description: 'BOSS 1出现' },
    { level: 6, requiredExp: 0, description: '击杀 BOSS 1，获得 100 XP，直接升到 Lv 6.5' }, // BOSS掉落
    { level: 7, requiredExp: 80, description: '中级敌人' },
    { level: 8, requiredExp: 110, description: '初级和中级敌人混合' },
    { level: 9, requiredExp: 150, description: '怪物密度中等，伤害开始不足，怪稍微有点堆积' },
    { level: 10, requiredExp: 200, description: 'BOSS 2出现' },
    { level: 11, requiredExp: 0, description: '击杀 BOSS 2，获得 300 XP，直接升到 Lv 11' }, // BOSS掉落
    { level: 12, requiredExp: 300, description: '高级敌人加入' },
    { level: 13, requiredExp: 400, description: '初中高级敌人混合，屏幕开始变乱，子弹乱飞' },
    { level: 14, requiredExp: 550, description: '铁桶阵，考验穿透能力' },
    { level: 15, requiredExp: 700, description: 'BOSS 3出现' },
    { level: 16, requiredExp: 0, description: '击杀 BOSS 3，获得 800 XP，直接冲过 Lv 16' }, // BOSS掉落
    { level: 17, requiredExp: 900, description: '狂潮，全员变异 (高攻速)，玩家火力全开' },
    { level: 18, requiredExp: 1200, description: '怪物如潮水' },
    { level: 19, requiredExp: 1500, description: '满屏弹幕，此时每秒获取XP约100点' },
    { level: 20, requiredExp: 1800, description: 'BOSS 4出现' },
    { level: 21, requiredExp: 0, description: '击杀 BOSS 4，获得 2000 XP，直升 Lv 21' }, // BOSS掉落
    { level: 22, requiredExp: 2500, description: '决战，只有高级敌人，升级只为了回血或补强属性' },
    { level: 23, requiredExp: 3500, description: '怪物极难杀死，压力测试阶段' },
    { level: 24, requiredExp: 5000, description: '生存大逃杀，几乎升不动了，除非有超强清屏' },
    { level: 25, requiredExp: 0, description: 'BOSS5出现，全力击杀最终BOSS' } // MAX
];

// 获取当前等级所需的经验值
function getRequiredExpForLevel(level) {
    if (level <= 0 || level > LEVEL_TABLE.length) {
        return Infinity; // 超出范围返回无穷大
    }
    const levelData = LEVEL_TABLE[level - 1];
    return levelData.requiredExp;
}

// 计算敌人实际伤害（随等级增强）
function getEnemyDamage(type, level) {
    const damageMultiplier = 1 + (level - 1) * 0.15; // 每级增加15%伤害（降低增长速度）
    return Math.floor(type.baseDamage * damageMultiplier);
}

// 计算敌人实际生命值（随击杀数增强，越后期越难打）
function getEnemyHealth(type, kills) {
    // 每击杀50个敌人，敌人生命值增加20%
    const healthMultiplier = 1 + Math.floor(kills / 50) * 0.2;
    return Math.floor(type.health * healthMultiplier);
}

// 敌人类
class Enemy {
    constructor(x, y, type = EnemyType.BASIC) {
        this.x = x;
        this.y = y;
        this.type = type;
        // 根据击杀数计算生命值，越后期越难打
        const calculatedHealth = getEnemyHealth(type, gameState.kills);
        this.maxHealth = calculatedHealth;
        this.health = calculatedHealth;
        this.displayHealth = calculatedHealth; // 显示生命值（用于缓动动画）
        this.healthAnimationStart = null; // 生命值动画开始时间
        this.healthAnimationStartValue = calculatedHealth; // 生命值动画开始值
        this.isHit = false; // 受击状态
        this.hitTimer = 0; // 受击计时器
        this.damage = getEnemyDamage(type, gameState.level); // 根据等级计算伤害
        this.size = type.size;
        this.baseSpeed = type.speed;
        this.speed = type.speed;
        this.color = type.color;
        this.score = type.score;
        this.exp = type.exp; // 击杀获得的经验值
        this.isFrozen = false; // 是否被冰冻
        this.freezeTime = 0; // 冰冻剩余时间
        this.lastDamageTime = null; // 上次造成伤害的时间
        
        // 射击属性
        this.fireRate = 2000; // 射击间隔（毫秒），2秒一次
        this.lastFireTime = 0;
        this.bulletSpeed = 4; // 敌人子弹速度
        this.bulletDamage = this.damage * 0.5; // 子弹伤害为碰撞伤害的一半（使用计算后的damage）
        
        // 攻击动画效果
        this.muzzleFlash = null; // 炮口闪光效果
        this.angle = 0; // 敌人朝向角度
        
        // 移动动画效果
        this.isMoving = false; // 是否正在移动
        this.moveAnimationTime = 0; // 移动动画时间
        this.lastX = x; // 上一帧的x位置
        this.lastY = y; // 上一帧的y位置
    }
    
    update() {
        // 更新冰冻状态
        if (this.isFrozen) {
            this.freezeTime -= 16; // 假设60fps，每帧约16ms
            if (this.freezeTime <= 0) {
                this.isFrozen = false;
                this.speed = this.baseSpeed;
            } else {
                this.speed = 0; // 冰冻时无法移动
            }
        }
        
        // 朝向坦克移动（如果未被冰冻）
        if (!this.isFrozen) {
            const dx = tank.x - this.x;
            const dy = tank.y - this.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            
            if (dist > 0) {
                this.x += (dx / dist) * this.speed;
                this.y += (dy / dist) * this.speed;
                // 计算朝向坦克的角度
                this.angle = Math.atan2(dy, dx);
            }
            
            // 碰撞检测 - 敌人碰到坦克
            const collisionDist = this.size / 2 + tank.width / 2;
            if (dist < collisionDist) {
                // 每60帧造成一次伤害（约每秒一次）
                if (!this.lastDamageTime) {
                    this.lastDamageTime = Date.now();
                }
                const now = Date.now();
                if (now - this.lastDamageTime >= 1000) {
                    tank.takeDamage(this.damage);
                    this.lastDamageTime = now;
                }
            } else {
                this.lastDamageTime = null;
            }
            
            // 敌人射击
            const now = Date.now();
            if (now - this.lastFireTime >= this.fireRate && dist > 0) {
                this.shoot();
                this.lastFireTime = now;
                // 触发攻击动画效果
                this.triggerMuzzleFlash();
            }
            
            // 更新攻击动画效果
            this.updateMuzzleFlash(now);
        }
        
        // 检测是否在移动
        const currentX = this.x;
        const currentY = this.y;
        this.isMoving = (currentX !== this.lastX || currentY !== this.lastY);
        
        // 更新移动动画时间
        if (this.isMoving) {
            this.moveAnimationTime += 16; // 假设60fps，每帧约16ms
        } else {
            // 停止移动时，逐渐减少动画时间
            this.moveAnimationTime *= 0.9;
            if (this.moveAnimationTime < 1) {
                this.moveAnimationTime = 0;
            }
        }
        
        // 保存当前位置用于下一帧比较
        this.lastX = currentX;
        this.lastY = currentY;
        
        // 更新受击计时器
        if (this.hitTimer > 0) {
            this.hitTimer -= 16; // 假设60fps
            if (this.hitTimer <= 0) {
                this.isHit = false;
            }
        }
        
        // 更新显示生命值（使用缓动函数）
        this.updateDisplayHealth();
    }
    
    updateDisplayHealth() {
        const now = Date.now();
        
        // 如果实际生命值发生变化
        if (this.displayHealth !== this.health) {
            // 如果生命值增加，立即更新（不使用缓动）
            if (this.health > this.displayHealth) {
                this.displayHealth = this.health;
                this.healthAnimationStart = null;
            } else {
                // 如果生命值减少，使用缓动动画
                if (this.healthAnimationStart === null) {
                    this.healthAnimationStart = now;
                    this.healthAnimationStartValue = this.displayHealth;
                }
                
                const elapsed = now - this.healthAnimationStart;
                const progress = Math.min(1, elapsed / CONFIG.healthEasingDuration);
                const easedProgress = healthEasing(progress);
                
                // 计算目标生命值和起始生命值的差值
                const healthDiff = this.health - this.healthAnimationStartValue;
                this.displayHealth = this.healthAnimationStartValue + healthDiff * easedProgress;
                
                // 如果动画完成，重置
                if (progress >= 1) {
                    this.displayHealth = this.health;
                    this.healthAnimationStart = null;
                }
            }
        } else {
            // 如果生命值没有变化，重置动画状态
            this.healthAnimationStart = null;
        }
    }
    
    shoot() {
        // 发射子弹（使用已计算的angle）
        enemyBullets.push(new EnemyBullet(
            this.x,
            this.y,
            this.angle,
            this.bulletSpeed,
            this.bulletDamage,
            this.type // 传递敌人类型
        ));
    }
    
    // 触发炮口闪光
    triggerMuzzleFlash() {
        this.muzzleFlash = {
            active: true,
            startTime: Date.now(),
            duration: 100, // 闪光持续时间100ms
            intensity: 1.0
        };
    }
    
    // 更新炮口闪光
    updateMuzzleFlash(now) {
        if (this.muzzleFlash && this.muzzleFlash.active) {
            const elapsed = now - this.muzzleFlash.startTime;
            if (elapsed >= this.muzzleFlash.duration) {
                this.muzzleFlash.active = false;
            } else {
                // 闪光强度逐渐减弱
                this.muzzleFlash.intensity = 1 - (elapsed / this.muzzleFlash.duration);
            }
        }
    }
    
    // 绘制炮口闪光
    drawMuzzleFlash() {
        if (this.muzzleFlash && this.muzzleFlash.active) {
            ctx.save();
            
            // 计算炮口位置
            const muzzleX = this.x + Math.cos(this.angle) * (this.size / 2 + 10);
            const muzzleY = this.y + Math.sin(this.angle) * (this.size / 2 + 10);
            
            // 绘制闪光外层（橙色/红色）
            const outerRadius = 10 * this.muzzleFlash.intensity;
            const gradient1 = ctx.createRadialGradient(muzzleX, muzzleY, 0, muzzleX, muzzleY, outerRadius);
            gradient1.addColorStop(0, `rgba(255, 100, 0, ${0.8 * this.muzzleFlash.intensity})`);
            gradient1.addColorStop(0.5, `rgba(255, 50, 0, ${0.5 * this.muzzleFlash.intensity})`);
            gradient1.addColorStop(1, `rgba(255, 0, 0, 0)`);
            ctx.fillStyle = gradient1;
            ctx.beginPath();
            ctx.arc(muzzleX, muzzleY, outerRadius, 0, Math.PI * 2);
            ctx.fill();
            
            // 绘制闪光内层（白色/黄色）
            const innerRadius = 5 * this.muzzleFlash.intensity;
            const gradient2 = ctx.createRadialGradient(muzzleX, muzzleY, 0, muzzleX, muzzleY, innerRadius);
            gradient2.addColorStop(0, `rgba(255, 255, 255, ${this.muzzleFlash.intensity})`);
            gradient2.addColorStop(0.5, `rgba(255, 200, 100, ${0.7 * this.muzzleFlash.intensity})`);
            gradient2.addColorStop(1, `rgba(255, 100, 0, 0)`);
            ctx.fillStyle = gradient2;
            ctx.beginPath();
            ctx.arc(muzzleX, muzzleY, innerRadius, 0, Math.PI * 2);
            ctx.fill();
            
            ctx.restore();
        }
    }
    
    draw() {
        ctx.save();
        ctx.translate(this.x, this.y);
        
        // 移动动画效果：移除抖动，直接应用朝向角度
        ctx.rotate(this.angle);
        
        // 根据敌人类型和状态选择图片
        let currentEnemyImage = null;
        let currentEnemyImageLoaded = false;
        
        // 如果被冰冻，使用冰冻图片
        if (this.isFrozen && enemyImageColdLoaded) {
            currentEnemyImage = enemyImageCold;
            currentEnemyImageLoaded = true;
        } else if (this.type === EnemyType.BASIC && enemyImage1Loaded) {
            currentEnemyImage = enemyImage1;
            currentEnemyImageLoaded = true;
        } else if (this.type === EnemyType.MEDIUM && enemyImage2Loaded) {
            currentEnemyImage = enemyImage2;
            currentEnemyImageLoaded = true;
        } else if (this.type === EnemyType.ADVANCED && enemyImage3Loaded) {
            currentEnemyImage = enemyImage3;
            currentEnemyImageLoaded = true;
        }
        
        // 绘制敌人
        if (currentEnemyImageLoaded && currentEnemyImage) {
            // 使用图片绘制敌人
            ctx.drawImage(currentEnemyImage, -this.size / 2, -this.size / 2, this.size, this.size);
        } else {
            // 使用默认绘制（其他类型或图片未加载）
            // 敌人主体
            ctx.fillStyle = this.isFrozen ? '#87CEEB' : this.color; // 冰冻时变蓝色
            ctx.beginPath();
            ctx.arc(0, 0, this.size / 2, 0, Math.PI * 2);
            ctx.fill();
            
            // 敌人边框
            ctx.strokeStyle = this.isFrozen ? '#00BFFF' : '#fff';
            ctx.lineWidth = 2;
            ctx.stroke();
            
        }
        
        ctx.restore();
        
        // 绘制炮口闪光效果
        this.drawMuzzleFlash();
        
        // 绘制敌人血条（在敌人头上，像素风格，根据敌人类型设置压缩比例）
        const currentHp = Math.ceil(this.displayHealth);
        const maxHp = this.maxHealth;
        // 根据敌人类型设置固定的参考最大生命值和压缩比例（用于保持血条长度不变）
        let refMaxHp = maxHp;
        let pixelsPerHp = 1;
        if (this.type === EnemyType.BASIC) {
            refMaxHp = 50;  // 以 50 作为血条长度参考
            pixelsPerHp = 2; // 每2点生命值1个像素
        } else if (this.type === EnemyType.MEDIUM) {
            refMaxHp = 100; // 以 100 作为血条长度参考
            pixelsPerHp = 5; // 每5点生命值1个像素
        } else if (this.type === EnemyType.ADVANCED) {
            refMaxHp = 200; // 以 200 作为血条长度参考（保持原来视觉长度）
            pixelsPerHp = 10; // 每10点生命值1个像素
        }
        // 将实际生命值按比例缩放到参考生命值范围，保持正确的填充比例
        // 这样血条长度固定（基于 refMaxHp），但填充比例正确（基于 currentHp / maxHp）
        const adjustedCurrentHp = (currentHp / maxHp) * refMaxHp;
        const pixelSize = 0.8;
        const gap = 0.15;
        const padding = 0.3;
        const barWidth = (Math.ceil(refMaxHp / pixelsPerHp) * pixelSize) + ((Math.ceil(refMaxHp / pixelsPerHp) - 1) * gap) + padding * 2;
        const barX = this.x - barWidth / 2; // 居中计算
        const barY = this.y - this.size / 2 - 15;
        // 传入调整后的生命值，使用 refMaxHp 作为 maxHp，保持血条长度固定
        drawPixelHealthBar(ctx, barX, barY, adjustedCurrentHp, refMaxHp, true, this.isHit, false, pixelsPerHp);
    }
    
    takeDamage(amount) {
        this.health -= amount;
        // 触发受击效果
        this.isHit = true;
        this.hitTimer = 70; // 70ms受击闪烁时间
        return this.health <= 0;
    }
}

// 分裂Boss的小坦克类
class SplitTankMinion {
    constructor(x, y, parentBoss) {
        this.x = x;
        this.y = y;
        this.parentBoss = parentBoss;
        this.maxHealth = 200;
        this.health = 200;
        this.size = 25;
        this.speed = 1.5;
        this.color = '#9C27B0';
        this.angle = 0;
        this.lastDamageTime = null; // 上次造成伤害的时间
        
        // 射击属性
        this.fireRate = 1500; // 射击间隔（毫秒），1.5秒一次
        this.lastFireTime = 0;
        this.bulletSpeed = 3.5;
        this.bulletDamage = 9; // 降低伤害（从15降低到9）
        this.damage = 20; // 碰撞伤害
        
        // 射击动画效果
        this.muzzleFlash = null; // 炮口闪光效果
        
        // 移动动画效果
        this.isMoving = false; // 是否正在移动
        this.moveAnimationTime = 0; // 移动动画时间
        this.lastX = x; // 上一帧的x位置
        this.lastY = y; // 上一帧的y位置
    }
    
    update() {
        // 如果父Boss不存在，小坦克仍然可以行动
        const hasParent = this.parentBoss && this.parentBoss.health > 0;
        
        // 朝向玩家移动
        const dx = tank.x - this.x;
        const dy = tank.y - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        
        if (dist > 0) {
            this.angle = Math.atan2(dy, dx);
            this.x += (dx / dist) * this.speed;
            this.y += (dy / dist) * this.speed;
        }
        
        // 检测是否在移动
        const currentX = this.x;
        const currentY = this.y;
        this.isMoving = (currentX !== this.lastX || currentY !== this.lastY);
        
        // 更新移动动画时间
        if (this.isMoving) {
            this.moveAnimationTime += 16; // 假设60fps，每帧约16ms
        } else {
            // 停止移动时，逐渐减少动画时间
            this.moveAnimationTime *= 0.9;
            if (this.moveAnimationTime < 1) {
                this.moveAnimationTime = 0;
            }
        }
        
        // 保存当前位置用于下一帧比较
        this.lastX = currentX;
        this.lastY = currentY;
        
        // 碰撞伤害
        const collisionDist = this.size / 2 + tank.width / 2;
        if (dist < collisionDist) {
            if (!this.lastDamageTime) {
                this.lastDamageTime = Date.now();
            }
            const now = Date.now();
            if (now - this.lastDamageTime >= 1000) {
                tank.takeDamage(this.damage);
                this.lastDamageTime = now;
            }
        } else {
            this.lastDamageTime = null;
        }
        
        // 射击
        const now = Date.now();
        if (dist > 0 && now - this.lastFireTime >= this.fireRate) {
            this.shoot();
            this.lastFireTime = now;
            // 触发攻击动画效果
            this.triggerMuzzleFlash();
        }
        
        // 更新攻击动画效果
        this.updateMuzzleFlash(now);
        
        return this.health > 0;
    }
    
    shoot() {
        // 发射子弹（使用已计算的angle）
        enemyBullets.push(new EnemyBullet(
            this.x,
            this.y,
            this.angle,
            this.bulletSpeed,
            this.bulletDamage,
            EnemyType.ADVANCED, // 保持兼容性
            BossType.SPLIT // 传递分裂Boss类型
        ));
    }
    
    // 触发炮口闪光
    triggerMuzzleFlash() {
        this.muzzleFlash = {
            active: true,
            startTime: Date.now(),
            duration: 100, // 闪光持续时间100ms
            intensity: 1.0
        };
    }
    
    // 更新炮口闪光
    updateMuzzleFlash(now) {
        if (this.muzzleFlash && this.muzzleFlash.active) {
            const elapsed = now - this.muzzleFlash.startTime;
            if (elapsed >= this.muzzleFlash.duration) {
                this.muzzleFlash.active = false;
            } else {
                // 闪光强度逐渐减弱
                this.muzzleFlash.intensity = 1 - (elapsed / this.muzzleFlash.duration);
            }
        }
    }
    
    // 绘制炮口闪光
    drawMuzzleFlash() {
        if (this.muzzleFlash && this.muzzleFlash.active) {
            ctx.save();
            
            // 计算炮口位置
            const muzzleX = this.x + Math.cos(this.angle) * (this.size / 2 + 10);
            const muzzleY = this.y + Math.sin(this.angle) * (this.size / 2 + 10);
            
            // 绘制闪光外层（橙色/红色）
            const outerRadius = 8 * this.muzzleFlash.intensity;
            const gradient1 = ctx.createRadialGradient(muzzleX, muzzleY, 0, muzzleX, muzzleY, outerRadius);
            gradient1.addColorStop(0, `rgba(255, 100, 0, ${0.8 * this.muzzleFlash.intensity})`);
            gradient1.addColorStop(0.5, `rgba(255, 50, 0, ${0.5 * this.muzzleFlash.intensity})`);
            gradient1.addColorStop(1, `rgba(255, 0, 0, 0)`);
            ctx.fillStyle = gradient1;
            ctx.beginPath();
            ctx.arc(muzzleX, muzzleY, outerRadius, 0, Math.PI * 2);
            ctx.fill();
            
            // 绘制闪光内层（白色/黄色）
            const innerRadius = 4 * this.muzzleFlash.intensity;
            const gradient2 = ctx.createRadialGradient(muzzleX, muzzleY, 0, muzzleX, muzzleY, innerRadius);
            gradient2.addColorStop(0, `rgba(255, 255, 255, ${this.muzzleFlash.intensity})`);
            gradient2.addColorStop(0.5, `rgba(255, 200, 100, ${0.7 * this.muzzleFlash.intensity})`);
            gradient2.addColorStop(1, `rgba(255, 100, 0, 0)`);
            ctx.fillStyle = gradient2;
            ctx.beginPath();
            ctx.arc(muzzleX, muzzleY, innerRadius, 0, Math.PI * 2);
            ctx.fill();
            
            ctx.restore();
        }
    }
    
    draw() {
        ctx.save();
        ctx.translate(this.x, this.y);
        
        // 移动动画效果：移除抖动，直接应用朝向角度
        ctx.rotate(this.angle);
        
        // 使用相同的图片（enemyImage3）
        if (enemyImage3Loaded) {
            // 使用图片绘制小坦克
            ctx.drawImage(enemyImage3, -this.size / 2, -this.size / 2, this.size, this.size);
        } else {
            // 如果图片未加载，使用默认绘制
            ctx.fillStyle = this.color;
            ctx.beginPath();
            ctx.arc(0, 0, this.size / 2, 0, Math.PI * 2);
            ctx.fill();
            
            ctx.strokeStyle = '#FFD700';
            ctx.lineWidth = 2;
            ctx.stroke();
        }
        
        ctx.restore();
        
        // 绘制小坦克血条（简单矩形血条）
        const barWidth = 30;
        const barHeight = 4;
        const barX = this.x - barWidth / 2;
        const barY = this.y - this.size / 2 - 10;
        const hpPercent = Math.max(0, Math.min(1, this.health / this.maxHealth));
        
        ctx.save();
        // 背景条
        ctx.fillStyle = '#400';
        ctx.fillRect(barX, barY, barWidth, barHeight);
        // 前景血量
        ctx.fillStyle = '#f00';
        ctx.fillRect(barX, barY, barWidth * hpPercent, barHeight);
        ctx.restore();
        
        // 绘制炮口闪光效果
        this.drawMuzzleFlash();
    }
    
    takeDamage(amount) {
        this.health -= amount;
        return this.health <= 0;
    }
}

// 小型坦克类（玩家辅助坦克）
class MiniTank {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.width = 20; // 小型坦克大小为原坦克的一半
        this.height = 20;
        this.speed = 3;
        this.angle = 0;
        this.fireRate = 500;
        this.lastFireTime = 0;
        this.bulletSpeed = 8;
        this.damage = 50;
        this.bulletSize = 6;
        this.followDistance = 60; // 跟随距离
    }
    
    update() {
        // 跟随主角坦克
        const dx = tank.x - this.x;
        const dy = tank.y - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        
        if (dist > this.followDistance) {
            // 移动到跟随位置
            const angle = Math.atan2(dy, dx);
            this.x += Math.cos(angle) * this.speed;
            this.y += Math.sin(angle) * this.speed;
        }
        
        // 计算朝向准星的角度
        const crosshairDx = crosshair.x - this.x;
        const crosshairDy = crosshair.y - this.y;
        if (crosshairDx !== 0 || crosshairDy !== 0) {
            this.angle = Math.atan2(crosshairDy, crosshairDx);
        }
        
        // 自动射击
        const now = Date.now();
        if (now - this.lastFireTime >= this.fireRate) {
            this.shoot();
            this.lastFireTime = now;
        }
    }
    
    shoot() {
        const muzzleOffset = this.width / 2 + 10;
        const muzzleX = this.x + Math.cos(this.angle) * muzzleOffset;
        const muzzleY = this.y + Math.sin(this.angle) * muzzleOffset;
        
        // 子弹大小使用固定值，不再随坦克体型动态变化（避免过大）
        const dynamicBulletSize = this.bulletSize;
        bullets.push(new Bullet(
            muzzleX,
            muzzleY,
            this.angle,
            this.bulletSpeed,
            this.damage,
            dynamicBulletSize,
            false,
            false,
            tank.hasBounce,
            tank.hasPenetrate,
            tank.hasBounce ? (tank.bounceStack || 1) : 0, // 最大反弹次数（只有在有反弹能力时才使用）
            tank.penetrateStack || 1 // 最大穿透次数
        ));
    }
    
    draw() {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.angle);
        
        // 使用主角坦克的图片（缩小版）
        let currentTankImage = null;
        let currentTankImageLoaded = false;
        
        if (tankImage1Loaded) {
            currentTankImage = tankImage1;
            currentTankImageLoaded = true;
        }
        
        if (currentTankImageLoaded && currentTankImage) {
            ctx.drawImage(currentTankImage, -this.width / 2, -this.height / 2, this.width, this.height);
        } else {
            // 默认绘制
            ctx.fillStyle = '#4CAF50';
            ctx.fillRect(-this.width / 2, -this.height / 2, this.width, this.height);
            ctx.strokeStyle = '#2E7D32';
            ctx.lineWidth = 2;
            ctx.strokeRect(-this.width / 2, -this.height / 2, this.width, this.height);
        }
        
        ctx.restore();
    }
}

// Boss类
class Boss {
    constructor(x, y, type = BossType.ARMOR) {
        this.x = x;
        this.y = y;
        this.type = type;
        this.angle = 0; // Boss朝向角度
        
        // 根据类型设置属性
        switch(type) {
            case BossType.ARMOR:
                this.maxHealth = 1500; // 生命值
                this.health = 1500;
                this.speed = 0.5;
                this.size = 65;
                this.color = '#8B4513'; // 棕色
                this.name = '装甲坦克';
                this.bulletFireRate = 2500; // 2.5秒一发，给玩家反应时间
                this.bulletSpeed = 3.5;
                this.bulletDamage = 20; // 降低伤害（从35降低到20）
                break;
            case BossType.LIFESTEAL:
                this.maxHealth = 4500; // 生命值控制在4000-5000之间
                this.health = 4500;
                this.speed = 1.2;
                this.size = 60;
                this.color = '#DC143C'; // 深红色
                this.name = '吸血坦克';
                this.bulletFireRate = 2000;
                this.bulletSpeed = 4;
                this.bulletDamage = 18; // 降低伤害（从30降低到18）
                this.isHealing = false; // 是否正在回血
                this.lastHitTime = 0; // 上次击中玩家的时间
                break;
            case BossType.SPLIT:
                this.maxHealth = 4200; // 生命值控制在4000-5000之间
                this.health = 4200;
                this.speed = 1.0;
                this.size = 60;
                this.color = '#9C27B0'; // 紫色
                this.name = '分裂坦克';
                this.bulletFireRate = 2200;
                this.bulletSpeed = 3.8;
                this.bulletDamage = 17; // 降低伤害（从28降低到17）
                break;
            case BossType.CHARGE:
                this.maxHealth = 4800; // 生命值控制在4000-5000之间
                this.health = 4800;
                this.baseSpeed = 1.5;
                this.speed = 1.5;
                this.size = 70;
                this.color = '#FF4500'; // 橙红色
                this.name = '冲撞坦克';
                this.bulletFireRate = 3000; // 不常用子弹
                this.bulletSpeed = 5;
                this.bulletDamage = 24; // 降低伤害（从40降低到24）
                this.chargeState = 'idle'; // idle, charging, charging_ready, dashing, stunned
                this.chargeTime = 0;
                this.chargeDuration = 1500; // 蓄力1.5秒
                this.chargeSpeed = 8;
                this.chargeDirection = 0;
                this.stunDuration = 2000; // 眩晕2秒
                this.stunTime = 0;
                break;
            case BossType.BARRAGE:
                this.maxHealth = 4400; // 生命值控制在4000-5000之间
                this.health = 4400;
                this.speed = 0.8;
                this.size = 55;
                this.color = '#00CED1'; // 深青色
                this.name = '弹幕坦克';
                this.bulletFireRate = 300; // 每0.3秒一发
                this.bulletSpeed = 4.5;
                this.bulletDamage = 13; // 降低伤害（从22降低到13）
                this.rotationAngle = 0; // 旋转角度
                this.rotationSpeed = 0.08; // 旋转速度
                this.shootAngle = 0; // 当前射击角度
                break;
        }
        
        this.displayHealth = this.maxHealth;
        this.healthAnimationStart = null;
        this.healthAnimationStartValue = this.maxHealth;
        this.isHit = false;
        this.hitTimer = 0;
        this.damage = 40; // 增加碰撞伤害
        this.score = 10;
        this.lastDamageTime = null;
        this.pulseOffset = 0;
        this.lastFireTime = 0;
        
        // 冰冻属性
        this.isFrozen = false; // 是否被冰冻
        this.freezeTime = 0; // 冰冻剩余时间
        this.baseSpeed = this.speed; // 保存基础速度（用于减速效果）
        
        // 射击动画效果
        this.muzzleFlash = null; // 炮口闪光效果
        
        // 移动动画效果
        this.isMoving = false; // 是否正在移动
        this.moveAnimationTime = 0; // 移动动画时间
        this.lastX = x; // 上一帧的x位置
        this.lastY = y; // 上一帧的y位置
    }
    
    update() {
        // 如果boss已经死亡，不再更新
        if (this.health <= 0) {
            return;
        }
        
        // 更新冰冻状态
        if (this.isFrozen) {
            this.freezeTime -= 16; // 假设60fps，每帧约16ms
            if (this.freezeTime <= 0) {
                this.isFrozen = false;
                this.speed = this.baseSpeed;
            } else {
                this.speed = 0; // 冰冻时无法移动
            }
        }
        
        const dx = tank.x - this.x;
        const dy = tank.y - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        
        if (dist > 0) {
            this.angle = Math.atan2(dy, dx);
        }
        
        // 根据类型执行不同的更新逻辑
        switch(this.type) {
            case BossType.ARMOR:
                this.updateArmor(dist, dx, dy);
                break;
            case BossType.LIFESTEAL:
                this.updateLifesteal(dist, dx, dy);
                break;
            case BossType.SPLIT:
                this.updateSplit(dist, dx, dy);
                break;
            case BossType.CHARGE:
                this.updateCharge(dist, dx, dy);
                break;
            case BossType.BARRAGE:
                this.updateBarrage(dist, dx, dy);
                break;
        }
        
        // 检测是否在移动
        const wasMoving = this.isMoving;
        const currentX = this.x;
        const currentY = this.y;
        this.isMoving = (currentX !== this.lastX || currentY !== this.lastY);
        
        // 更新移动动画时间
        if (this.isMoving) {
            this.moveAnimationTime += 16; // 假设60fps，每帧约16ms
        } else {
            // 停止移动时，逐渐减少动画时间
            this.moveAnimationTime *= 0.9;
            if (this.moveAnimationTime < 1) {
                this.moveAnimationTime = 0;
            }
        }
        
        // 保存当前位置用于下一帧比较
        this.lastX = currentX;
        this.lastY = currentY;
        
        // 更新受击计时器
        if (this.hitTimer > 0) {
            this.hitTimer -= 16;
            if (this.hitTimer <= 0) {
                this.isHit = false;
            }
        }
        
        // 更新显示生命值
        this.updateDisplayHealth();
        
        // 更新脉冲效果
        this.pulseOffset = Math.sin(Date.now() / 200) * 3;
        
        // 更新射击动画效果
        this.updateMuzzleFlash(Date.now());
    }
    
    // 装甲Boss更新
    updateArmor(dist, dx, dy) {
        // 慢速移动
        if (dist > 0) {
            this.x += (dx / dist) * this.speed;
            this.y += (dy / dist) * this.speed;
        }
        
        // 碰撞伤害
        const collisionDist = this.size / 2 + tank.width / 2;
        if (dist < collisionDist) {
            if (!this.lastDamageTime) {
                this.lastDamageTime = Date.now();
            }
            const now = Date.now();
            if (now - this.lastDamageTime >= 1000) {
                tank.takeDamage(this.damage);
                this.lastDamageTime = now;
            }
        } else {
            this.lastDamageTime = null;
        }
        
        // 射击
        const now = Date.now();
        if (dist > 0 && now - this.lastFireTime >= this.bulletFireRate) {
            this.shootBullet(this.angle);
            this.lastFireTime = now;
        }
    }
    
    // 吸血Boss更新
    updateLifesteal(dist, dx, dy) {
        // 移动
        if (dist > 0) {
            this.x += (dx / dist) * this.speed;
            this.y += (dy / dist) * this.speed;
        }
        
        // 碰撞伤害
        const collisionDist = this.size / 2 + tank.width / 2;
        if (dist < collisionDist) {
            if (!this.lastDamageTime) {
                this.lastDamageTime = Date.now();
            }
            const now = Date.now();
            if (now - this.lastDamageTime >= 1000) {
                const damage = this.damage;
                tank.takeDamage(damage);
                // 回血（伤害的50%），但只有在boss还活着时才能回血
                if (this.health > 0) {
                    this.health = Math.min(this.maxHealth, this.health + damage * 0.5);
                    this.isHealing = true;
                    this.lastHitTime = now;
                }
                this.lastDamageTime = now;
            }
        } else {
            this.lastDamageTime = null;
        }
        
        // 如果3秒内没有击中玩家，停止回血状态
        const now = Date.now();
        if (this.isHealing && now - this.lastHitTime > 3000) {
            this.isHealing = false;
        }
        
        // 射击
        if (dist > 0 && now - this.lastFireTime >= this.bulletFireRate) {
            this.shootBullet(this.angle);
            this.lastFireTime = now;
        }
    }
    
    // 分裂Boss更新
    updateSplit(dist, dx, dy) {
        // 移动
        if (dist > 0) {
            this.x += (dx / dist) * this.speed;
            this.y += (dy / dist) * this.speed;
        }
        
        // 碰撞伤害
        const collisionDist = this.size / 2 + tank.width / 2;
        if (dist < collisionDist) {
            if (!this.lastDamageTime) {
                this.lastDamageTime = Date.now();
            }
            const now = Date.now();
            if (now - this.lastDamageTime >= 1000) {
                tank.takeDamage(this.damage);
                this.lastDamageTime = now;
            }
        } else {
            this.lastDamageTime = null;
        }
        
        // 射击
        const now = Date.now();
        if (dist > 0 && now - this.lastFireTime >= this.bulletFireRate) {
            this.shootBullet(this.angle);
            this.lastFireTime = now;
        }
    }
    
    // 分裂函数（每次受到伤害时调用）
    split() {
        // 生成1个小坦克
        const angle = Math.random() * Math.PI * 2;
        const offset = 50;
        const minionX = this.x + Math.cos(angle) * offset;
        const minionY = this.y + Math.sin(angle) * offset;
        splitTankMinions.push(new SplitTankMinion(minionX, minionY, this));
    }
    
    // 冲撞Boss更新
    updateCharge(dist, dx, dy) {
        const now = Date.now();
        
        if (this.chargeState === 'idle') {
            // 正常移动
            if (dist > 0) {
                this.x += (dx / dist) * this.speed;
                this.y += (dy / dist) * this.speed;
            }
            
            // 每隔2.5秒开始蓄力（提高频率）
            if (now - this.lastFireTime > 2500) {
                this.chargeState = 'charging';
                this.chargeTime = now;
                this.lastFireTime = now;
            }
        } else if (this.chargeState === 'charging') {
            // 蓄力阶段，停止移动
            if (now - this.chargeTime >= this.chargeDuration) {
                this.chargeState = 'charging_ready';
                this.chargeDirection = this.angle;
            }
        } else if (this.chargeState === 'charging_ready') {
            // 准备冲撞，短暂延迟后开始冲撞
            this.chargeState = 'dashing';
        } else if (this.chargeState === 'dashing') {
            // 冲撞阶段
            this.x += Math.cos(this.chargeDirection) * this.chargeSpeed;
            this.y += Math.sin(this.chargeDirection) * this.chargeSpeed;
            
            // 检查是否撞墙
            if (this.x < this.size/2 || this.x > CONFIG.canvasWidth - this.size/2 ||
                this.y < this.size/2 || this.y > CONFIG.canvasHeight - this.size/2) {
                this.chargeState = 'stunned';
                this.stunTime = now;
                // 限制在屏幕内
                this.x = Math.max(this.size/2, Math.min(CONFIG.canvasWidth - this.size/2, this.x));
                this.y = Math.max(this.size/2, Math.min(CONFIG.canvasHeight - this.size/2, this.y));
            }
            
            // 碰撞伤害（冲撞时伤害更高）
            const collisionDist = this.size / 2 + tank.width / 2;
            if (dist < collisionDist) {
                if (!this.lastDamageTime) {
                    this.lastDamageTime = now;
                }
                if (now - this.lastDamageTime >= 500) {
                    tank.takeDamage(this.damage * 2); // 冲撞伤害翻倍
                    this.lastDamageTime = now;
                }
            }
        } else if (this.chargeState === 'stunned') {
            // 眩晕阶段
            if (now - this.stunTime >= this.stunDuration) {
                this.chargeState = 'idle';
                this.lastFireTime = now;
            }
        }
    }
    
    // 弹幕Boss更新
    updateBarrage(dist, dx, dy) {
        // 慢速移动向玩家
        if (dist > 150) { // 保持一定距离
            if (dist > 0) {
                this.x += (dx / dist) * this.speed;
                this.y += (dy / dist) * this.speed;
            }
        }
        
        // 碰撞伤害
        const collisionDist = this.size / 2 + tank.width / 2;
        if (dist < collisionDist) {
            if (!this.lastDamageTime) {
                this.lastDamageTime = Date.now();
            }
            const now = Date.now();
            if (now - this.lastDamageTime >= 1000) {
                tank.takeDamage(this.damage);
                this.lastDamageTime = now;
            }
        } else {
            this.lastDamageTime = null;
        }
        
        // 旋转射击
        const now = Date.now();
        this.rotationAngle += this.rotationSpeed;
        if (now - this.lastFireTime >= this.bulletFireRate) {
            this.shootBullet(this.rotationAngle);
            this.lastFireTime = now;
            this.rotationAngle += this.rotationSpeed * 2; // 每次射击后稍微增加角度
        }
    }
    
    // 发射子弹
    shootBullet(angle) {
        // 触发射击动画
        this.triggerMuzzleFlash();
        
        // 计算炮口位置（与drawMuzzleFlash中的位置一致）
        const muzzleX = this.x + Math.cos(this.angle) * (this.size / 2 + 15);
        const muzzleY = this.y + Math.sin(this.angle) * (this.size / 2 + 15);
        
        // 分裂boss保持原来的单方向射击，其他boss向四面八方发射
        if (this.type === BossType.SPLIT) {
            // 分裂boss：从炮口位置单方向射击
            enemyBullets.push(new EnemyBullet(
                muzzleX,
                muzzleY,
                this.angle,
                this.bulletSpeed,
                this.bulletDamage,
                EnemyType.ADVANCED, // 保持兼容性
                this.type // 传递Boss类型
            ));
        } else {
            // 其他boss：从炮口位置向四面八方发射（8个方向）
            const bulletCount = 8;
            for (let i = 0; i < bulletCount; i++) {
                const bulletAngle = (Math.PI * 2 / bulletCount) * i;
                enemyBullets.push(new EnemyBullet(
                    muzzleX,
                    muzzleY,
                    bulletAngle,
                    this.bulletSpeed,
                    this.bulletDamage,
                    EnemyType.ADVANCED, // 保持兼容性
                    this.type // 传递Boss类型
                ));
            }
        }
    }
    
    // 触发炮口闪光
    triggerMuzzleFlash() {
        this.muzzleFlash = {
            active: true,
            startTime: Date.now(),
            duration: 150, // 闪光持续时间150ms
            intensity: 1.0
        };
    }
    
    // 更新炮口闪光
    updateMuzzleFlash(now) {
        if (this.muzzleFlash && this.muzzleFlash.active) {
            const elapsed = now - this.muzzleFlash.startTime;
            if (elapsed >= this.muzzleFlash.duration) {
                this.muzzleFlash.active = false;
            } else {
                // 闪光强度逐渐减弱
                this.muzzleFlash.intensity = 1 - (elapsed / this.muzzleFlash.duration);
            }
        }
    }
    
    // 绘制炮口闪光
    drawMuzzleFlash() {
        if (this.muzzleFlash && this.muzzleFlash.active) {
            ctx.save();
            
            // 计算炮口位置
            const muzzleX = this.x + Math.cos(this.angle) * (this.size / 2 + 15);
            const muzzleY = this.y + Math.sin(this.angle) * (this.size / 2 + 15);
            
            // 绘制闪光外层（橙色/红色）
            const outerRadius = 15 * this.muzzleFlash.intensity;
            const gradient1 = ctx.createRadialGradient(muzzleX, muzzleY, 0, muzzleX, muzzleY, outerRadius);
            gradient1.addColorStop(0, `rgba(255, 150, 0, ${0.9 * this.muzzleFlash.intensity})`);
            gradient1.addColorStop(0.5, `rgba(255, 100, 0, ${0.6 * this.muzzleFlash.intensity})`);
            gradient1.addColorStop(1, `rgba(255, 50, 0, 0)`);
            ctx.fillStyle = gradient1;
            ctx.beginPath();
            ctx.arc(muzzleX, muzzleY, outerRadius, 0, Math.PI * 2);
            ctx.fill();
            
            // 绘制闪光内层（白色/黄色）
            const innerRadius = 8 * this.muzzleFlash.intensity;
            const gradient2 = ctx.createRadialGradient(muzzleX, muzzleY, 0, muzzleX, muzzleY, innerRadius);
            gradient2.addColorStop(0, `rgba(255, 255, 255, ${this.muzzleFlash.intensity})`);
            gradient2.addColorStop(0.5, `rgba(255, 220, 150, ${0.8 * this.muzzleFlash.intensity})`);
            gradient2.addColorStop(1, `rgba(255, 150, 0, 0)`);
            ctx.fillStyle = gradient2;
            ctx.beginPath();
            ctx.arc(muzzleX, muzzleY, innerRadius, 0, Math.PI * 2);
            ctx.fill();
            
            ctx.restore();
        }
    }
    
    updateDisplayHealth() {
        const now = Date.now();
        
        if (this.displayHealth !== this.health) {
            if (this.health > this.displayHealth) {
                this.displayHealth = this.health;
                this.healthAnimationStart = null;
            } else {
                if (this.healthAnimationStart === null) {
                    this.healthAnimationStart = now;
                    this.healthAnimationStartValue = this.displayHealth;
                }
                
                const elapsed = now - this.healthAnimationStart;
                const progress = Math.min(1, elapsed / CONFIG.healthEasingDuration);
                const easedProgress = healthEasing(progress);
                
                const healthDiff = this.health - this.healthAnimationStartValue;
                this.displayHealth = this.healthAnimationStartValue + healthDiff * easedProgress;
                
                if (progress >= 1) {
                    this.displayHealth = this.health;
                    this.healthAnimationStart = null;
                }
            }
        } else {
            this.healthAnimationStart = null;
        }
    }
    
    draw() {
        const pulseSize = this.size / 2 + this.pulseOffset;
        
        // 根据状态绘制
        if (this.type === BossType.CHARGE) {
            if (this.chargeState === 'charging' || this.chargeState === 'charging_ready') {
                // 蓄力效果
                const chargeProgress = this.chargeState === 'charging_ready' ? 1 : 
                    (Date.now() - this.chargeTime) / this.chargeDuration;
                ctx.fillStyle = `rgba(255, 69, 0, ${0.3 + 0.7 * chargeProgress})`;
                ctx.beginPath();
                ctx.arc(this.x, this.y, pulseSize + 15 * chargeProgress, 0, Math.PI * 2);
                ctx.fill();
            } else if (this.chargeState === 'stunned') {
                // 眩晕效果
                ctx.fillStyle = 'rgba(255, 255, 0, 0.3)';
                ctx.beginPath();
                ctx.arc(this.x, this.y, pulseSize + 10, 0, Math.PI * 2);
                ctx.fill();
            }
        }
        
        // 根据Boss类型选择图片
        let currentBossImage = null;
        let currentBossImageLoaded = false;
        
        if (this.type === BossType.ARMOR && enemyImage1Loaded) {
            currentBossImage = enemyImage1;
            currentBossImageLoaded = true;
        } else if (this.type === BossType.LIFESTEAL && enemyImage2Loaded) {
            currentBossImage = enemyImage2;
            currentBossImageLoaded = true;
        } else if (this.type === BossType.SPLIT && enemyImage3Loaded) {
            currentBossImage = enemyImage3;
            currentBossImageLoaded = true;
        } else if (this.type === BossType.BARRAGE && bossImage4Loaded) {
            currentBossImage = bossImage4;
            currentBossImageLoaded = true;
        } else if (this.type === BossType.CHARGE && bossImage5Loaded) {
            currentBossImage = bossImage5;
            currentBossImageLoaded = true;
        }
        
        // 绘制Boss主体
        ctx.save();
        ctx.translate(this.x, this.y);
        
        // 移动动画效果：移除抖动，直接应用朝向角度
        ctx.rotate(this.angle);
        
        if (currentBossImageLoaded && currentBossImage) {
            // 使用图片绘制Boss
            ctx.drawImage(currentBossImage, -pulseSize, -pulseSize, pulseSize * 2, pulseSize * 2);
        } else {
            // 如果图片未加载，使用默认绘制
            ctx.fillStyle = this.color;
            ctx.beginPath();
            ctx.arc(0, 0, pulseSize, 0, Math.PI * 2);
            ctx.fill();
            
            // Boss边框
            ctx.strokeStyle = '#FF0000';
            ctx.lineWidth = 4;
            ctx.stroke();
            
            // Boss内部装饰
            ctx.strokeStyle = '#FFD700';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.arc(0, 0, pulseSize * 0.7, 0, Math.PI * 2);
            ctx.stroke();
        }
        ctx.restore();
        
        // 绘制射击动画
        this.drawMuzzleFlash();
        
        // 状态文字
        if (this.type === BossType.CHARGE) {
            ctx.font = 'bold 12px Arial';
            if (this.chargeState === 'charging') {
                ctx.fillText('蓄力中...', this.x, this.y + 20);
            } else if (this.chargeState === 'charging_ready') {
                ctx.fillText('准备冲撞！', this.x, this.y + 20);
            } else if (this.chargeState === 'dashing') {
                ctx.fillText('冲撞！', this.x, this.y + 20);
            } else if (this.chargeState === 'stunned') {
                ctx.fillText('眩晕', this.x, this.y + 20);
            }
        }
    }
    
    takeDamage(amount, bulletAngle = null) {
        // 装甲Boss：正面减伤70%，背后伤害150%
        if (this.type === BossType.ARMOR && bulletAngle !== null) {
            const hitAngle = Math.atan2(Math.sin(bulletAngle - this.angle), Math.cos(bulletAngle - this.angle));
            const isFront = Math.abs(hitAngle) < Math.PI / 2; // 前方180度
            if (isFront) {
                amount *= 0.3; // 正面只受30%伤害
            } else {
                amount *= 1.5; // 背后受150%伤害
            }
        }
        
        // 分裂坦克：每次受到伤害时分裂
        if (this.type === BossType.SPLIT) {
            this.split();
        }
        
        this.health -= amount;
        this.isHit = true;
        this.hitTimer = 70;
        
        // 如果生命值降到0或以下，立即将显示生命值设为0，确保血条立即归零
        if (this.health <= 0) {
            this.health = Math.max(0, this.health); // 确保health不会小于0
            this.displayHealth = 0;
            this.healthAnimationStart = null; // 停止动画
        }
        
        return this.health <= 0;
    }
}

// 子弹类
class Bullet {
    constructor(x, y, angle, speed, damage, radius = 10, isFreeze = false, isCrit = false, hasBounce = false, hasPenetrate = false, maxBounceCount = 1, maxPenetrateCount = 1, isShock = false) {
        this.x = x;
        this.y = y;
        this.angle = angle;
        this.speed = speed;
        this.damage = damage;
        this.radius = radius;
        this.isFreeze = isFreeze; // 冰冻子弹
        this.isCrit = isCrit; // 暴击子弹
        this.hasBounce = hasBounce; // 反弹效果
        this.bounceCount = 0; // 折射次数
        this.maxBounceCount = maxBounceCount; // 最大折射次数
        this.hasPenetrate = hasPenetrate; // 穿透效果
        this.penetrateCount = 0; // 穿透敌人数量
        this.maxPenetrateCount = maxPenetrateCount; // 最大穿透次数
        this.isShock = isShock; // 电击子弹
        this.shockAnimationTime = Date.now(); // 电击动画时间
        this.isPlayerBullet = true; // 默认标记为玩家子弹，只攻击敌人，不攻击玩家
    }
    
    update() {
        // 先移动
        this.x += Math.cos(this.angle) * this.speed;
        this.y += Math.sin(this.angle) * this.speed;
        
        // 折射逻辑（智能跳弹）
        if (this.hasBounce && this.bounceCount < this.maxBounceCount) {
            let refracted = false;
            
            // 检测是否撞击边界并修正位置（子弹延伸到边界时折射）
            // 使用更宽松的边界检测，确保能检测到边界碰撞
            if (this.x - this.radius <= 0) {
                // 撞击左边界 - 折射
                this.x = this.radius; // 修正位置
                this.angle = Math.PI - this.angle;
                this.bounceCount++;
                refracted = true;
            } else if (this.x + this.radius >= CONFIG.canvasWidth) {
                // 撞击右边界 - 折射
                this.x = CONFIG.canvasWidth - this.radius; // 修正位置
                this.angle = Math.PI - this.angle;
                this.bounceCount++;
                refracted = true;
            }
            
            if (!refracted) {
                if (this.y - this.radius <= 0) {
                    // 撞击上边界 - 折射
                    this.y = this.radius; // 修正位置
                    this.angle = -this.angle;
                    this.bounceCount++;
                } else if (this.y + this.radius >= CONFIG.canvasHeight) {
                    // 撞击下边界 - 折射
                    this.y = CONFIG.canvasHeight - this.radius; // 修正位置
                    this.angle = -this.angle;
                    this.bounceCount++;
                }
            }
        }
    }
    
    draw() {
        // 电击子弹特殊绘制
        if (this.isShock) {
            const elapsed = Date.now() - this.shockAnimationTime;
            const pulseSpeed = 0.01; // 脉冲速度
            const pulse = Math.sin(elapsed * pulseSpeed) * 0.3 + 1; // 0.7 到 1.3 之间脉冲
            
            ctx.save();
            
            // 绘制电击效果（蓝色/紫色，带闪烁）
            const alpha = 0.8 + Math.sin(elapsed * 0.02) * 0.2; // 闪烁效果
            ctx.globalAlpha = alpha;
            
            // 外层电击光环
            const gradient = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.radius * pulse);
            gradient.addColorStop(0, '#00FFFF'); // 青色中心
            gradient.addColorStop(0.5, '#0080FF'); // 蓝色中间
            gradient.addColorStop(1, '#4000FF'); // 紫色边缘
            
            ctx.fillStyle = gradient;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius * pulse, 0, Math.PI * 2);
            ctx.fill();
            
            // 内层核心
            ctx.fillStyle = '#FFFFFF';
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius * 0.5, 0, Math.PI * 2);
            ctx.fill();
            
            // 电击线条效果（随机方向的短线条）
            ctx.strokeStyle = '#00FFFF';
            ctx.lineWidth = 2;
            for (let i = 0; i < 4; i++) {
                const lineAngle = (Math.PI * 2 / 4) * i + (elapsed * 0.001);
                const startDist = this.radius * 0.6;
                const endDist = this.radius * pulse * 1.2;
                ctx.beginPath();
                ctx.moveTo(
                    this.x + Math.cos(lineAngle) * startDist,
                    this.y + Math.sin(lineAngle) * startDist
                );
                ctx.lineTo(
                    this.x + Math.cos(lineAngle) * endDist,
                    this.y + Math.sin(lineAngle) * endDist
                );
                ctx.stroke();
            }
            
            ctx.restore();
            return;
        }
        
        // 根据子弹类型选择图片
        let currentImage = null;
        let imageLoaded = false;
        
        if (this.isCrit && bulletImage2Loaded) {
            // 暴击子弹使用 bullet_red.png
            currentImage = bulletImage2;
            imageLoaded = true;
        } else if (this.isFreeze && bulletImage3Loaded) {
            // 冰冻子弹使用 bullet_blue.png
            currentImage = bulletImage3;
            imageLoaded = true;
        } else if (bulletImage1Loaded) {
            // 普通子弹使用 bullet_yellow.png
            currentImage = bulletImage1;
            imageLoaded = true;
        }
        
        if (imageLoaded && currentImage) {
            // 使用图片绘制子弹
            ctx.save();
            ctx.translate(this.x, this.y);
            ctx.rotate(this.angle); // 根据移动方向旋转
            const size = this.radius * 2; // 显示尺寸
            ctx.drawImage(currentImage, -size / 2, -size / 2, size, size);
            ctx.restore();
            
        } else {
            // 如果图片未加载，使用默认绘制
            if (this.isCrit) {
                ctx.fillStyle = '#FF0000'; // 暴击子弹为红色
                ctx.strokeStyle = '#FF6B6B';
            } else if (this.isFreeze) {
                ctx.fillStyle = '#00BFFF'; // 冰冻子弹为蓝色
                ctx.strokeStyle = '#87CEEB';
            } else {
                ctx.fillStyle = '#FFD700'; // 普通子弹为金色
                ctx.strokeStyle = '#FFA500';
            }
            
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.fill();
            
            ctx.lineWidth = 2;
            ctx.stroke();
            
        }
    }
    
    isOffScreen() {
        // 如果有折射能力且还有折射次数，即使出界也不移除（让它折射回来）
        if (this.hasBounce && this.bounceCount < this.maxBounceCount) {
            return false;
        }
        return this.x < 0 || this.x > CONFIG.canvasWidth ||
               this.y < 0 || this.y > CONFIG.canvasHeight;
    }
}

// 激光类
class Laser {
    constructor(x, y, angle, width, damage, duration = 0, isSweep = false) {
        this.startX = x;
        this.startY = y;
        this.angle = angle;
        this.width = width;
        this.damage = damage;
        this.length = 0;
        // 最大长度（屏幕对角线），如果有跳弹Lv 4，射程+30%
        let baseMaxLength = CONFIG.canvasWidth + CONFIG.canvasHeight;
        this.maxLength = tank.hasBounce && gameState.upgradeModules.BOUNCE >= 4 
            ? baseMaxLength * 1.3 
            : baseMaxLength;
        this.duration = duration; // 持续时间（毫秒），0表示瞬间
        this.startTime = Date.now();
        this.isSweep = isSweep; // 是否扫射模式
        this.hitEnemies = new Set(); // 已击中的敌人（避免重复伤害）
        this.isActive = true;
        this.hasProcessed = false; // 标记是否已处理过（用于瞬间激光）
        this.bounceCount = 0; // 激光折射次数
        this.maxBounceCount = tank.hasBounce ? (tank.bounceStack || 1) : 0; // 最大折射次数（如果没有折射能力则为0，如果有但bounceStack为0则默认为1）
        this.hasBounced = false; // 是否已经折射过（用于伤害减半）
        this.hasCreatedBounce = false; // 是否已经创建了折射激光（防止重复创建）
        this.hitWallType = null; // 碰到的墙壁类型：'left', 'right', 'top', 'bottom'
        // 在创建时确定是否为暴击，避免绘制时颜色闪烁
        this.isCrit = tank.critRate > 0 && Math.random() < tank.critRate;
        
        // 立即计算终点，确保第一帧就能进行碰撞检测和绘制
        // 在构造函数中不创建反弹激光，防止无限递归
        this.calculateEndPoint(false);
    }
    
    // 计算激光终点（从update中提取出来，可以在构造函数中调用）
    calculateEndPoint(allowBounce = true) {
        const cosAngle = Math.cos(this.angle);
        const sinAngle = Math.sin(this.angle);
        
        // 计算激光与四个墙壁的交点
        let minDistance = this.maxLength;
        let hitWallType = null; // 记录碰到的墙壁类型：'left', 'right', 'top', 'bottom'
        
        // 左墙 (x = 0)
        if (cosAngle < 0) {
            const t = -this.startX / cosAngle;
            if (t > 0 && t < minDistance) {
                const y = this.startY + sinAngle * t;
                if (y >= 0 && y <= CONFIG.canvasHeight) {
                    minDistance = t;
                    hitWallType = 'left';
                }
            }
        }
        
        // 右墙 (x = CONFIG.canvasWidth)
        if (cosAngle > 0) {
            const t = (CONFIG.canvasWidth - this.startX) / cosAngle;
            if (t > 0 && t < minDistance) {
                const y = this.startY + sinAngle * t;
                if (y >= 0 && y <= CONFIG.canvasHeight) {
                    minDistance = t;
                    hitWallType = 'right';
                }
            }
        }
        
        // 上墙 (y = 0)
        if (sinAngle < 0) {
            const t = -this.startY / sinAngle;
            if (t > 0 && t < minDistance) {
                const x = this.startX + cosAngle * t;
                if (x >= 0 && x <= CONFIG.canvasWidth) {
                    minDistance = t;
                    hitWallType = 'top';
                }
            }
        }
        
        // 下墙 (y = CONFIG.canvasHeight)
        if (sinAngle > 0) {
            const t = (CONFIG.canvasHeight - this.startY) / sinAngle;
            if (t > 0 && t < minDistance) {
                const x = this.startX + cosAngle * t;
                if (x >= 0 && x <= CONFIG.canvasWidth) {
                    minDistance = t;
                    hitWallType = 'bottom';
                }
            }
        }
        
        // 设置激光的实际长度和终点
        this.length = minDistance;
        this.x = this.startX + cosAngle * this.length;
        this.y = this.startY + sinAngle * this.length;
        this.hitWallType = hitWallType; // 保存碰到的墙壁类型
        
        // 检查是否需要折射（如果有折射能力且还有折射次数）
        // 使用一个标记来防止重复创建折射激光
        // 只有在allowBounce为true时才创建折射激光（防止在构造函数中创建导致无限递归）
        if (allowBounce && this.maxBounceCount > 0 && this.bounceCount < this.maxBounceCount && !this.hasCreatedBounce) {
            // 检查是否碰到墙壁（激光延伸到墙壁时检测）
            // 如果hitWallType不为null，说明激光延伸到了墙壁
            const hitWall = this.hitWallType !== null;
            const hitLeftWall = this.hitWallType === 'left';
            const hitRightWall = this.hitWallType === 'right';
            const hitTopWall = this.hitWallType === 'top';
            const hitBottomWall = this.hitWallType === 'bottom';
            
            if (hitWall) {
                // 标记已创建折射，防止重复创建
                this.hasCreatedBounce = true;
                this.hasBounced = true;
                this.bounceCount++;
                
                // 计算折射角度（反射角度）
                let newAngle = this.angle;
                if (hitLeftWall || hitRightWall) {
                    // 碰到左右墙壁，折射x方向
                    newAngle = Math.PI - this.angle;
                    // 修正位置，确保在边界内
                    if (hitLeftWall) {
                        this.x = 0;
                    } else {
                        this.x = CONFIG.canvasWidth;
                    }
                } else if (hitTopWall || hitBottomWall) {
                    // 碰到上下墙壁，折射y方向
                    newAngle = -this.angle;
                    // 修正位置，确保在边界内
                    if (hitTopWall) {
                        this.y = 0;
                    } else {
                        this.y = CONFIG.canvasHeight;
                    }
                }
                
                // 如果是Lv 5折射网，创建多个折射激光
                if (tank.laserRefraction && this.bounceCount === 1) {
                    // 创建折射网：从折射点向多个方向发射激光
                    const refractionCount = 3; // 3条折射激光
                    const refractionSpread = Math.PI / 6; // 30度扩散
                    const startRefractionAngle = newAngle - (refractionSpread * (refractionCount - 1) / 2);
                    
                    for (let i = 0; i < refractionCount; i++) {
                        const refractionAngle = startRefractionAngle + (refractionSpread * i);
                        const duration = this.duration;
                        
                        // 创建折射激光（可以继续折射，但剩余次数减少）
                        const refractedLaser = new Laser(
                            this.x,
                            this.y,
                            refractionAngle,
                            this.width,
                            this.damage * 0.7, // 折射激光伤害降低30%
                            duration,
                            false // 折射激光不跟随炮塔
                        );
                        // 折射激光可以继续折射，但剩余次数要减少
                        refractedLaser.bounceCount = 0; // 新激光从0开始
                        refractedLaser.maxBounceCount = Math.max(0, this.maxBounceCount - this.bounceCount); // 剩余折射次数
                        refractedLaser.hasBounced = true; // 标记为已折射，应用伤害减半
                        lasers.push(refractedLaser);
                    }
                } else if (this.bounceCount <= this.maxBounceCount) {
                    // 普通折射：创建一条折射激光
                    // 注意：这里使用 <= 而不是 <，因为bounceCount已经增加了
                    const duration = this.duration;
                    
                    const refractedLaser = new Laser(
                        this.x,
                        this.y,
                        newAngle,
                        this.width,
                        this.damage,
                        duration,
                        false // 折射激光不跟随炮塔
                    );
                    // 继承剩余折射次数（新激光从0开始计数，但最大次数要减去已使用的次数）
                    refractedLaser.bounceCount = 0; // 新激光从0开始
                    refractedLaser.maxBounceCount = Math.max(0, this.maxBounceCount - this.bounceCount); // 剩余折射次数
                    refractedLaser.hasBounced = true; // 标记为已折射，应用伤害减半
                    lasers.push(refractedLaser);
                }
            }
        }
    }
    
    update() {
        if (!this.isActive) return;
        
        // 如果是扫射模式，更新角度跟随坦克
        if (this.isSweep) {
            this.angle = tank.angle;
            this.startX = tank.x + Math.cos(tank.angle) * (tank.width / 2 + 15);
            this.startY = tank.y + Math.sin(tank.angle) * (tank.width / 2 + 15);
        }
        
        // 重新计算激光终点（检测墙壁碰撞）
        // 在update中允许创建反弹激光
        this.calculateEndPoint(true);
        
        // 检查是否过期
        if (this.duration > 0) {
            const elapsed = Date.now() - this.startTime;
            if (elapsed >= this.duration) {
                this.isActive = false;
            }
        } else {
            // 瞬间激光：至少存在一帧，确保碰撞检测和绘制完成
            // 使用一个标记来确保只在一帧后失效
            if (this.hasProcessed) {
                // 已经处理过一帧，现在可以失效
                this.isActive = false;
            } else {
                // 第一帧，标记为已处理，保持激活状态以便碰撞检测和绘制
                this.hasProcessed = true;
            }
        }
    }
    
    draw() {
        if (!this.isActive) return;
        
        ctx.save();
        
        // 绘制激光光束（从起点到终点的一条完整线段）
        const gradient = ctx.createLinearGradient(
            this.startX, this.startY,
            this.x, this.y
        );
        
        // 检查是否有液氮弹头模块且选择了激光（激光变蓝色）
        const hasFreezeModule = gameState.upgradeModules.FREEZE > 0;
        const isFreezeLaser = hasFreezeModule && tank.hasLaser;
        
        // 激光默认使用绿色系，如果有液氮弹头模块则使用蓝色系
        // 整体降低不透明度，减弱刺眼感
        if (isFreezeLaser) {
            // 液氮弹头激光：蓝色系（整体偏柔和）
            if (this.isCrit) {
                // 暴击激光：略微更亮，但不过曝
                gradient.addColorStop(0, 'rgba(0, 150, 255, 0.9)');
                gradient.addColorStop(0.3, 'rgba(50, 200, 255, 0.7)');
                gradient.addColorStop(0.7, 'rgba(100, 220, 255, 0.5)');
                gradient.addColorStop(1, 'rgba(150, 240, 255, 0.25)');
            } else {
                // 普通液氮激光：蓝色系（透明度降低）
                gradient.addColorStop(0, 'rgba(0, 100, 255, 0.8)');
                gradient.addColorStop(0.3, 'rgba(50, 150, 255, 0.6)');
                gradient.addColorStop(0.7, 'rgba(100, 200, 255, 0.4)');
                gradient.addColorStop(1, 'rgba(150, 220, 255, 0.2)');
            }
        } else {
            // 普通激光：改为较暗的深绿色系
            if (this.isCrit) {
                // 暴击激光：深绿中带一点亮度，但不刺眼
                gradient.addColorStop(0, 'rgba(0, 180, 60, 0.9)');
                gradient.addColorStop(0.3, 'rgba(30, 200, 80, 0.7)');
                gradient.addColorStop(0.7, 'rgba(60, 220, 110, 0.5)');
                gradient.addColorStop(1, 'rgba(90, 240, 140, 0.25)');
            } else {
                // 普通深绿色激光：整体更暗、更柔和
                gradient.addColorStop(0, 'rgba(0, 140, 40, 0.85)');
                gradient.addColorStop(0.3, 'rgba(20, 170, 60, 0.65)');
                gradient.addColorStop(0.7, 'rgba(50, 190, 90, 0.45)');
                gradient.addColorStop(1, 'rgba(80, 210, 120, 0.22)');
            }
        }
        
        // 绘制外层光晕（更宽，半透明）——整体减少透明度和光晕强度
        if (isFreezeLaser) {
            ctx.strokeStyle = this.isCrit ? 'rgba(50, 200, 255, 0.35)' : 'rgba(0, 150, 255, 0.25)';
            ctx.shadowColor = this.isCrit ? 'rgba(0, 150, 255, 0.6)' : 'rgba(0, 150, 255, 0.5)';
        } else {
            // 普通激光外层光晕：使用偏暗的深绿色
            ctx.strokeStyle = this.isCrit ? 'rgba(40, 180, 70, 0.32)' : 'rgba(0, 140, 40, 0.22)';
            ctx.shadowColor = this.isCrit ? 'rgba(0, 180, 60, 0.55)' : 'rgba(0, 140, 40, 0.45)';
        }
        ctx.lineWidth = this.width * 1.6; // 外层稍微变窄
        ctx.lineCap = 'round';
        ctx.shadowBlur = 8;
        ctx.beginPath();
        ctx.moveTo(this.startX, this.startY);
        ctx.lineTo(this.x, this.y);
        ctx.stroke();
        
        // 绘制中层光束（主光束）
        ctx.strokeStyle = gradient;
        ctx.lineWidth = this.width * 0.9;
        ctx.lineCap = 'round';
        ctx.shadowBlur = 6;
        if (isFreezeLaser) {
            ctx.shadowColor = this.isCrit ? 'rgba(0, 150, 255, 0.6)' : 'rgba(0, 150, 255, 0.5)';
        } else {
            ctx.shadowColor = this.isCrit ? 'rgba(0, 255, 0, 0.6)' : 'rgba(0, 255, 0, 0.5)';
        }
        ctx.beginPath();
        ctx.moveTo(this.startX, this.startY);
        ctx.lineTo(this.x, this.y);
        ctx.stroke();
        
        // 绘制激光核心（更亮的中心线）
        ctx.strokeStyle = 'rgba(255, 255, 255, 1)';
        ctx.lineWidth = Math.max(this.width * 0.4, 3); // 核心线至少3像素宽
        ctx.shadowBlur = 8;
        ctx.shadowColor = 'rgba(255, 255, 255, 0.9)';
        ctx.beginPath();
        ctx.moveTo(this.startX, this.startY);
        ctx.lineTo(this.x, this.y);
        ctx.stroke();
        
        ctx.restore();
    }
    
    checkCollision(enemy) {
        if (!this.isActive) return false;
        
        // 计算点到直线的距离
        const dx = this.x - this.startX;
        const dy = this.y - this.startY;
        const length = Math.sqrt(dx * dx + dy * dy);
        
        if (length === 0) return false;
        
        const toEnemyX = enemy.x - this.startX;
        const toEnemyY = enemy.y - this.startY;
        const t = Math.max(0, Math.min(1, (toEnemyX * dx + toEnemyY * dy) / (length * length)));
        
        const closestX = this.startX + t * dx;
        const closestY = this.startY + t * dy;
        
        const distX = enemy.x - closestX;
        const distY = enemy.y - closestY;
        const distance = Math.sqrt(distX * distX + distY * distY);
        
        // 检查是否在激光宽度范围内
        if (distance < enemy.size / 2 + this.width / 2) {
            // 每个敌人只造成一次伤害
            if (this.hitEnemies.has(enemy)) return false;
            this.hitEnemies.add(enemy);
            // 激光击中敌人不会反弹，只有击中墙壁才会反弹
            return true;
        }
        
        return false;
    }
}

// 敌人子弹类
class EnemyBullet {
    constructor(x, y, angle, speed, damage, enemyType = EnemyType.BASIC, bossType = null) {
        this.x = x;
        this.y = y;
        this.angle = angle;
        this.speed = speed;
        this.damage = damage;
        this.radius = 6;
        this.isPlayerBullet = false; // 标记为敌人子弹
        this.enemyType = enemyType; // 敌人类型
        this.bossType = bossType; // Boss类型（如果来自Boss）
    }
    
    update() {
        this.x += Math.cos(this.angle) * this.speed;
        this.y += Math.sin(this.angle) * this.speed;
    }
    
    draw() {
        // 根据Boss类型或敌人类型选择子弹图片
        let currentBulletImage = null;
        let currentBulletImageLoaded = false;
        
        if (this.bossType) {
            // 如果是Boss子弹，根据Boss类型选择图片
            if (this.bossType === BossType.ARMOR && enemyBulletImage1Loaded) {
                currentBulletImage = enemyBulletImage1;
                currentBulletImageLoaded = true;
            } else if (this.bossType === BossType.LIFESTEAL && enemyBulletImage2Loaded) {
                currentBulletImage = enemyBulletImage2;
                currentBulletImageLoaded = true;
            } else if (this.bossType === BossType.SPLIT && enemyBulletImage3Loaded) {
                currentBulletImage = enemyBulletImage3;
                currentBulletImageLoaded = true;
            } else if (this.bossType === BossType.BARRAGE && bossBulletImage4Loaded) {
                currentBulletImage = bossBulletImage4;
                currentBulletImageLoaded = true;
            } else if (this.bossType === BossType.CHARGE && bossBulletImage5Loaded) {
                currentBulletImage = bossBulletImage5;
                currentBulletImageLoaded = true;
            }
        } else {
            // 普通敌人子弹
            if (this.enemyType === EnemyType.BASIC && enemyBulletImage1Loaded) {
                currentBulletImage = enemyBulletImage1;
                currentBulletImageLoaded = true;
            } else if (this.enemyType === EnemyType.MEDIUM && enemyBulletImage2Loaded) {
                currentBulletImage = enemyBulletImage2;
                currentBulletImageLoaded = true;
            } else if (this.enemyType === EnemyType.ADVANCED && enemyBulletImage3Loaded) {
                currentBulletImage = enemyBulletImage3;
                currentBulletImageLoaded = true;
            }
        }
        
        // 使用图片绘制敌人子弹
        if (currentBulletImageLoaded && currentBulletImage) {
            ctx.save();
            ctx.translate(this.x, this.y);
            ctx.rotate(this.angle); // 根据移动方向旋转
            const size = this.radius * 3; // 显示尺寸
            ctx.drawImage(currentBulletImage, -size / 2, -size / 2, size, size);
            ctx.restore();
        } else {
            // 如果图片未加载，使用默认绘制
            ctx.fillStyle = '#FF4444';
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.fill();
            
            ctx.strokeStyle = '#FF0000';
            ctx.lineWidth = 2;
            ctx.stroke();
        }
    }
    
    isOffScreen() {
        return this.x < 0 || this.x > CONFIG.canvasWidth ||
               this.y < 0 || this.y > CONFIG.canvasHeight;
    }
}

// Boss激光类
class BossLaser {
    constructor(x, y, angle, damage) {
        this.startX = x;
        this.startY = y;
        this.angle = angle;
        this.damage = damage;
        this.length = 2000; // 激光长度（足够长以覆盖整个屏幕）
        this.width = 8; // 激光宽度
        this.lifetime = 500; // 激光持续时间（毫秒）
        this.spawnTime = Date.now();
        this.hasHit = false; // 是否已造成伤害
    }
    
    update() {
        // 激光不需要移动，只需要检查是否击中坦克
        if (!this.hasHit) {
            const endX = this.startX + Math.cos(this.angle) * this.length;
            const endY = this.startY + Math.sin(this.angle) * this.length;
            
            // 检查激光是否击中坦克（线段与圆形的碰撞检测）
            const dist = this.distanceToLineSegment(tank.x, tank.y, this.startX, this.startY, endX, endY);
            if (dist < tank.width / 2 + this.width / 2) {
                tank.takeDamage(this.damage);
                this.hasHit = true;
            }
        }
    }
    
    // 计算点到线段的距离
    distanceToLineSegment(px, py, x1, y1, x2, y2) {
        const A = px - x1;
        const B = py - y1;
        const C = x2 - x1;
        const D = y2 - y1;
        
        const dot = A * C + B * D;
        const lenSq = C * C + D * D;
        let param = -1;
        
        if (lenSq !== 0) {
            param = dot / lenSq;
        }
        
        let xx, yy;
        
        if (param < 0) {
            xx = x1;
            yy = y1;
        } else if (param > 1) {
            xx = x2;
            yy = y2;
        } else {
            xx = x1 + param * C;
            yy = y1 + param * D;
        }
        
        const dx = px - xx;
        const dy = py - yy;
        return Math.sqrt(dx * dx + dy * dy);
    }
    
    draw() {
        const endX = this.startX + Math.cos(this.angle) * this.length;
        const endY = this.startY + Math.sin(this.angle) * this.length;
        
        // 激光渐变效果
        const gradient = ctx.createLinearGradient(this.startX, this.startY, endX, endY);
        gradient.addColorStop(0, 'rgba(255, 0, 0, 0.8)');
        gradient.addColorStop(0.5, 'rgba(255, 100, 0, 0.6)');
        gradient.addColorStop(1, 'rgba(255, 200, 0, 0.4)');
        
        ctx.save();
        ctx.strokeStyle = gradient;
        ctx.lineWidth = this.width;
        ctx.lineCap = 'round';
        ctx.shadowBlur = 10;
        ctx.shadowColor = 'rgba(255, 0, 0, 0.8)';
        ctx.beginPath();
        ctx.moveTo(this.startX, this.startY);
        ctx.lineTo(endX, endY);
        ctx.stroke();
        ctx.restore();
    }
    
    isExpired() {
        return Date.now() - this.spawnTime > this.lifetime;
    }
}

// 道具类型
const ItemType = {
    HEAL: { name: '回复血量', color: '#4CAF50', icon: '❤' },
    SPREAD: { name: '子弹扩散', color: '#FFD700', icon: '✨' },
    FREEZE: { name: '冰冻子弹', color: '#00BFFF', icon: '❄' },
    CRIT: { name: '子弹暴击', color: '#FF0000', icon: '⚡' },
};

// 道具类
class Item {
    constructor(x, y, type) {
        this.x = x;
        this.y = y;
        this.type = type;
        this.radius = 15;
        this.lifetime = 5000; // 5秒后消失
        this.spawnTime = Date.now();
        this.bobOffset = 0; // 上下浮动效果
    }
    
    update() {
        // 上下浮动效果
        this.bobOffset = Math.sin(Date.now() / 200) * 3;
    }
    
    draw() {
        const y = this.y + this.bobOffset;
        
        // 根据道具类型选择图片
        let currentItemImage = null;
        let currentItemImageLoaded = false;
        
        if (this.type === ItemType.HEAL && itemImageHealthLoaded) {
            currentItemImage = itemImageHealth;
            currentItemImageLoaded = true;
        } else if (this.type === ItemType.CRIT && itemImageCriticalStrikeLoaded) {
            currentItemImage = itemImageCriticalStrike;
            currentItemImageLoaded = true;
        } else if (this.type === ItemType.FREEZE && itemImageColdBulletLoaded) {
            currentItemImage = itemImageColdBullet;
            currentItemImageLoaded = true;
        } else if (this.type === ItemType.SPREAD && itemImageSpreadLoaded) {
            currentItemImage = itemImageSpread;
            currentItemImageLoaded = true;
        }
        
        // 绘制道具
        if (currentItemImageLoaded && currentItemImage) {
            // 使用图片绘制道具
            const size = this.radius * 2;
            ctx.drawImage(currentItemImage, this.x - size / 2, y - size / 2, size, size);
        } else {
            // 使用默认绘制（图片未加载）
            // 道具外圈
            ctx.fillStyle = this.type.color;
            ctx.beginPath();
            ctx.arc(this.x, y, this.radius, 0, Math.PI * 2);
            ctx.fill();
            
            // 道具边框
            ctx.strokeStyle = '#fff';
            ctx.lineWidth = 2;
            ctx.stroke();
            
            // 道具图标（文字）
            ctx.fillStyle = '#fff';
            ctx.font = '16px Arial';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(this.type.icon, this.x, y);
        }
        
        // 闪烁效果（快消失时）
        const timeLeft = this.lifetime - (Date.now() - this.spawnTime);
        if (timeLeft < 2000) {
            const alpha = (timeLeft % 400) / 400;
            ctx.globalAlpha = alpha;
            ctx.fillStyle = this.type.color;
            ctx.beginPath();
            ctx.arc(this.x, y, this.radius, 0, Math.PI * 2);
            ctx.fill();
            ctx.globalAlpha = 1;
        }
    }
    
    isExpired() {
        return Date.now() - this.spawnTime > this.lifetime;
    }
}

// 游戏对象
let tank;
let enemies = [];
let bosses = []; // Boss数组
let bullets = []; // 玩家子弹数组
let lasers = []; // 激光数组
let enemyBullets = []; // 敌人子弹数组
let bossLasers = []; // Boss激光数组
let splitTankMinions = []; // 分裂Boss的小坦克数组
let miniTanks = []; // 玩家的小型坦克数组
let items = []; // 道具数组
let keys = {};

// 虚拟摇杆
let joystickInput = { x: 0, y: 0 };
let joystickActive = false;
let joystickCenter = { x: 0, y: 0 };
let joystickRadius = 80; // 摇杆活动半径

// 准星控制
let crosshair = {
    x: 0,
    y: 0,
    isDragging: false,
    radius: 15, // 准星大小
    distance: 150 // 准星距离坦克的初始距离
};

// 鼠标控制
let mouse = {
    x: 0,
    y: 0,
    isDown: false
};

// 初始化游戏
function initGame() {
    tank = new Tank(CONFIG.canvasWidth / 2, CONFIG.canvasHeight / 2);
    enemies = [];
    bosses = [];
    bullets = [];
    enemyBullets = [];
    bossLasers = [];
    splitTankMinions = [];
    items = [];
    gameState = {
        running: false, // 游戏未运行
        started: false, // 游戏未开始
        paused: false, // 暂停状态
        kills: 0,
        level: 1,
        lastUpgradeKills: 0,
        lastEnemySpawn: Date.now(),
        experience: 0,
        lastUpgradeExp: 0,
        bossKills: 0,
        lastBossSpawnTime: 0,
        armorBossSpawned: false, // 记录装甲Boss是否已在第4或第5个位置生成
        splitSlowEndTime: 0, // 分裂Boss被击杀后，用于减缓刷怪的结束时间戳
        upgradeModules: {
            LASER: 0,
            SPREAD: 0,
            BOUNCE: 0,
            FREEZE: 0,
            CRIT: 0,
            REGEN: 0
        }, // 技能模块等级
        pendingUpgrade: false // 是否有待处理的升级
    };
    
    // 初始化准星位置为坦克前方
    crosshair.x = tank.x + crosshair.distance;
    crosshair.y = tank.y;
    
    updateUI();
    document.getElementById('gameOver').style.display = 'none';
    document.getElementById('startOverlay').style.display = 'flex';
    
    // 初始隐藏暂停按钮
    const pauseButton = document.getElementById('pauseButton');
    if (pauseButton) {
        pauseButton.style.display = 'none';
    }
    
    // 确保BGM停止
    bgm.pause();
    bgm.currentTime = 0;
}

// 开始游戏
function startGame() {
    if (gameState.started) return; // 如果已经开始，不重复开始
    
    gameState.started = true;
    gameState.running = true;
    gameState.paused = false;
    gameState.startTime = Date.now(); // 记录游戏开始时间
    gameState.totalPauseTime = 0; // 重置暂停时间
    
    // 隐藏开始界面
    const startOverlay = document.getElementById('startOverlay');
    if (startOverlay) {
        startOverlay.style.display = 'none';
    }
    
    // 显示游戏UI
    const pauseButton = document.getElementById('pauseButton');
    if (pauseButton) {
        pauseButton.style.display = 'flex';
    }
    
    // 启动BGM
    startBGM();
}

// 根据游戏时间计算刷新间隔（毫秒）
function getSpawnIntervalByTime() {
    // 计算游戏时长（排除暂停时间）
    let gameTime = 0;
    if (gameState.startTime) {
        const currentPauseTime = gameState.paused && gameState.pauseStartTime ? 
            (gameState.totalPauseTime + (Date.now() - gameState.pauseStartTime)) : 
            gameState.totalPauseTime;
        gameTime = Date.now() - gameState.startTime - currentPauseTime;
    }
    
    const gameTimeSeconds = gameTime / 1000; // 游戏时间（秒）
    const gameTimeMinutes = gameTimeSeconds / 60; // 游戏时间（分钟）
    
    let spawnsPerSecond; // 每秒生成的怪物数
    let spawnInterval; // 刷新间隔（毫秒）
    
    if (gameTimeMinutes < 1) {
        // 0-1分钟：0.4 -> 1.5 只/秒（整体下调）
        const progress = gameTimeMinutes; // 0到1之间的进度
        spawnsPerSecond = 0.4 + (1.5 - 0.4) * progress;
        spawnInterval = 1000 / spawnsPerSecond;
    } else if (gameTimeMinutes < 2) {
        // 1-2分钟：1.5 -> 3 只/秒
        const progress = (gameTimeMinutes - 1); // 0到1之间的进度
        spawnsPerSecond = 1.5 + (3 - 1.5) * progress;
        spawnInterval = 1000 / spawnsPerSecond;
    } else if (gameTimeMinutes < 3) {
        // 2-3分钟：3 -> 5 只/秒
        const progress = (gameTimeMinutes - 2); // 0到1之间的进度
        spawnsPerSecond = 3 + (5 - 3) * progress;
        spawnInterval = 1000 / spawnsPerSecond;
    } else if (gameTimeMinutes < 4) {
        // 3-4分钟：5 -> 7 只/秒
        const progress = (gameTimeMinutes - 3); // 0到1之间的进度
        spawnsPerSecond = 5 + (7 - 5) * progress;
        spawnInterval = 1000 / spawnsPerSecond;
    } else {
        // 4分钟及以上：7 -> 8 只/秒（再往后也不会再暴涨）
        const progress = Math.min(1, (gameTimeMinutes - 4)); // 0到1之间的进度，限制在1分钟内
        spawnsPerSecond = 7 + (8 - 7) * progress;
        spawnInterval = 1000 / spawnsPerSecond;
    }
    
    // 第二个 Boss（含）之后整体减速：从这一刻到游戏结束，敌人刷新统一放慢
    // 使用 bossKills >= 2 作为“已经打过第二个 Boss”的判断
    if (gameState.bossKills >= 2) {
        // 刷新间隔整体放大 1.4 倍（越大越慢）
        spawnInterval = spawnInterval * 1.4;
    }
    
    // 如果刚刚击杀过分裂Boss，在一段时间内进一步减缓刷怪速度
    if (gameState.splitSlowEndTime && Date.now() < gameState.splitSlowEndTime) {
        // 在这段时间内，再额外放大刷新间隔（从1.6增加到2.0，更大幅度减速）
        spawnInterval = spawnInterval * 2.0;
    }
    
    // 确保间隔不会太小（最小120ms，即最多约8只/秒）
    spawnInterval = Math.max(120, spawnInterval);
    
    return spawnInterval;
}

// 生成敌人
function spawnEnemy() {
    // 如果有Boss存在，不生成普通敌人
    if (bosses.length > 0) {
        return;
    }
    
    const now = Date.now();
    
    // 根据游戏时间计算刷新间隔
    const spawnInterval = getSpawnIntervalByTime();
    
    if (now - gameState.lastEnemySpawn < spawnInterval) {
        return;
    }
    
    gameState.lastEnemySpawn = now;
    
    // 根据游戏时间和等级调整生成数量
    const level = gameState.level;
    
    // 计算游戏时长（用于调整生成数量）
    let gameTime = 0;
    if (gameState.startTime) {
        const currentPauseTime = gameState.paused && gameState.pauseStartTime ? 
            (gameState.totalPauseTime + (Date.now() - gameState.pauseStartTime)) : 
            gameState.totalPauseTime;
        gameTime = Date.now() - gameState.startTime - currentPauseTime;
    }
    const gameTimeMinutes = (gameTime / 1000) / 60;
    
    // 基础生成数量（根据等级）
    let baseSpawnCount = CONFIG.enemySpawnCount;
    
    if (level <= 4) {
        // 等级1-4: 只有初级敌人
        baseSpawnCount = 2 + Math.floor(level / 2); // 2-4个
    } else if (level <= 6) {
        // 等级5-6: BOSS阶段（控制住密度）
        baseSpawnCount = 3;
    } else if (level <= 9) {
        // 等级7-9: 第一个 BOSS 之后的过渡期，再削一档
        // 调低为 2-3 个，保证这一段主要是“补刀发育期”
        baseSpawnCount = 2 + Math.floor((level - 7) / 2); // 7级=2，8级=2，9级=3
    } else if (level <= 11) {
        // 等级10-11: BOSS阶段
        baseSpawnCount = 5;
    } else if (level <= 14) {
        // 等级12-14: 初中高级敌人混合
        baseSpawnCount = 6 + (level - 12); // 6-8个
    } else if (level <= 16) {
        // 等级15-16: BOSS阶段
        baseSpawnCount = 7;
    } else if (level <= 19) {
        // 等级17-19: 狂潮，怪物如潮水，满屏弹幕
        baseSpawnCount = 8 + (level - 17) * 2; // 8-12个
    } else if (level <= 21) {
        // 等级20-21: BOSS阶段
        baseSpawnCount = 10;
    } else if (level >= 22) {
        // 等级22+: 决战，只有高级敌人
        baseSpawnCount = 12 + Math.floor((level - 22) / 2); // 12-15个
    }
    
    // 根据游戏时间调整生成数量（后期增加密度）
    let timeMultiplier = 1.0;
    if (gameTimeMinutes >= 4) {
        // 4分钟以后，逐渐增加每次生成的怪物数量（整体曲线稍微放缓）
        const progress = Math.min(1, (gameTimeMinutes - 4) / 2); // 4-6分钟之间从1.0增长到1.3
        timeMultiplier = 1.0 + 0.3 * progress;
    }
    
    // 最终生成数量
    const spawnCount = Math.floor(baseSpawnCount * timeMultiplier);
    
    for (let i = 0; i < spawnCount; i++) {
        // 从屏幕四周随机生成
        const side = Math.floor(Math.random() * 4);
        let x, y;
        
        switch (side) {
            case 0: // 上边
                x = Math.random() * CONFIG.canvasWidth;
                y = -CONFIG.enemySpawnDistance;
                break;
            case 1: // 右边
                x = CONFIG.canvasWidth + CONFIG.enemySpawnDistance;
                y = Math.random() * CONFIG.canvasHeight;
                break;
            case 2: // 下边
                x = Math.random() * CONFIG.canvasWidth;
                y = CONFIG.canvasHeight + CONFIG.enemySpawnDistance;
                break;
            case 3: // 左边
                x = -CONFIG.enemySpawnDistance;
                y = Math.random() * CONFIG.canvasHeight;
                break;
        }
        
        // 根据等级决定敌人类型（根据等级表）
        let enemyType;
        const rand = Math.random();
        const level = gameState.level;
        
        if (level <= 4) {
            // 等级1-4: 只有初级敌人
            enemyType = EnemyType.BASIC;
        } else if (level === 5) {
            // 等级5: BOSS 1出现（不在这里生成普通敌人）
            enemyType = EnemyType.BASIC;
        } else if (level === 6) {
            // 等级6: BOSS掉落等级
            enemyType = EnemyType.BASIC;
        } else if (level === 7) {
            // 等级7: 中级敌人
            enemyType = EnemyType.MEDIUM;
        } else if (level === 8) {
            // 等级8: 初级和中级敌人混合
            enemyType = rand < 0.5 ? EnemyType.BASIC : EnemyType.MEDIUM;
        } else if (level === 9) {
            // 等级9: 怪物密度中等，伤害开始不足，怪稍微有点堆积
            enemyType = rand < 0.4 ? EnemyType.BASIC : EnemyType.MEDIUM;
        } else if (level === 10) {
            // 等级10: BOSS 2出现
            enemyType = rand < 0.4 ? EnemyType.BASIC : EnemyType.MEDIUM;
        } else if (level === 11) {
            // 等级11: BOSS掉落等级
            enemyType = rand < 0.4 ? EnemyType.BASIC : EnemyType.MEDIUM;
        } else if (level === 12) {
            // 等级12: 高级敌人加入
            if (rand < 0.3) {
                enemyType = EnemyType.BASIC;
            } else if (rand < 0.6) {
                enemyType = EnemyType.MEDIUM;
            } else {
                enemyType = EnemyType.ADVANCED;
            }
        } else if (level === 13) {
            // 等级13: 初中高级敌人混合，屏幕开始变乱，子弹乱飞
            if (rand < 0.3) {
                enemyType = EnemyType.BASIC;
            } else if (rand < 0.6) {
                enemyType = EnemyType.MEDIUM;
            } else {
                enemyType = EnemyType.ADVANCED;
            }
        } else if (level === 14) {
            // 等级14: 铁桶阵，考验穿透能力
            if (rand < 0.2) {
                enemyType = EnemyType.BASIC;
            } else if (rand < 0.5) {
                enemyType = EnemyType.MEDIUM;
            } else {
                enemyType = EnemyType.ADVANCED;
            }
        } else if (level === 15) {
            // 等级15: BOSS 3出现
            if (rand < 0.2) {
                enemyType = EnemyType.BASIC;
            } else if (rand < 0.5) {
                enemyType = EnemyType.MEDIUM;
            } else {
                enemyType = EnemyType.ADVANCED;
            }
        } else if (level === 16) {
            // 等级16: BOSS掉落等级
            if (rand < 0.2) {
                enemyType = EnemyType.BASIC;
            } else if (rand < 0.5) {
                enemyType = EnemyType.MEDIUM;
            } else {
                enemyType = EnemyType.ADVANCED;
            }
        } else if (level >= 17 && level <= 19) {
            // 等级17-19: 狂潮，全员变异，怪物如潮水，满屏弹幕
            if (rand < 0.2) {
                enemyType = EnemyType.BASIC;
            } else if (rand < 0.5) {
                enemyType = EnemyType.MEDIUM;
            } else {
                enemyType = EnemyType.ADVANCED;
            }
        } else if (level === 20) {
            // 等级20: BOSS 4出现
            if (rand < 0.2) {
                enemyType = EnemyType.BASIC;
            } else if (rand < 0.5) {
                enemyType = EnemyType.MEDIUM;
            } else {
                enemyType = EnemyType.ADVANCED;
            }
        } else if (level === 21) {
            // 等级21: BOSS掉落等级
            if (rand < 0.2) {
                enemyType = EnemyType.BASIC;
            } else if (rand < 0.5) {
                enemyType = EnemyType.MEDIUM;
            } else {
                enemyType = EnemyType.ADVANCED;
            }
        } else if (level >= 22) {
            // 等级22+: 决战，只有高级敌人
            enemyType = EnemyType.ADVANCED;
        } else {
            // 默认情况
            enemyType = EnemyType.BASIC;
        }
        
        enemies.push(new Enemy(x, y, enemyType));
    }
}

// 检查是否需要生成Boss
function checkBossSpawn() {
    const now = Date.now();
    const bossCooldown = 10000; // Boss冷却时间10秒，防止连续出现
    
    // 根据等级表，在特定等级生成BOSS
    // 等级5: BOSS 1, 等级10: BOSS 2, 等级15: BOSS 3, 等级20: BOSS 4, 等级25: BOSS 5
    const bossLevels = [5, 10, 15, 20, 25];
    const shouldSpawnBoss = bossLevels.includes(gameState.level);
    
    // 只有在特定等级、没有Boss存在、距离上次生成Boss至少10秒时才生成Boss
    if (shouldSpawnBoss && 
        bosses.length === 0 && 
        now - gameState.lastBossSpawnTime >= bossCooldown) {
        spawnBoss();
        gameState.lastBossSpawnTime = now;
        // showUpgradeNotification('警告：Boss出现！');
    }
}

// 生成Boss
function spawnBoss() {
    // 从屏幕边缘随机位置生成
    const side = Math.floor(Math.random() * 4);
    let x, y;
    
    switch (side) {
        case 0: // 上边
            x = Math.random() * CONFIG.canvasWidth;
            y = -CONFIG.enemySpawnDistance;
            break;
        case 1: // 右边
            x = CONFIG.canvasWidth + CONFIG.enemySpawnDistance;
            y = Math.random() * CONFIG.canvasHeight;
            break;
        case 2: // 下边
            x = Math.random() * CONFIG.canvasWidth;
            y = CONFIG.canvasHeight + CONFIG.enemySpawnDistance;
            break;
        case 3: // 左边
            x = -CONFIG.enemySpawnDistance;
            y = Math.random() * CONFIG.canvasHeight;
            break;
    }
    
    // 装甲Boss在第4或第5个出现
    // 前3个：LIFESTEAL, SPLIT, CHARGE
    // 第4-5个：ARMOR（随机选择第4或第5个）
    // 之后循环：BARRAGE, LIFESTEAL, SPLIT, CHARGE, BARRAGE...
    let bossType;
    if (gameState.bossKills < 3) {
        // 前3个Boss
        const firstThreeTypes = [BossType.LIFESTEAL, BossType.SPLIT, BossType.CHARGE];
        bossType = firstThreeTypes[gameState.bossKills];
    } else if (gameState.bossKills === 3) {
        // 第4个Boss：50%概率是ARMOR，50%概率是BARRAGE
        if (Math.random() < 0.5) {
            bossType = BossType.ARMOR;
            gameState.armorBossSpawned = true;
        } else {
            bossType = BossType.BARRAGE;
        }
    } else if (gameState.bossKills === 4) {
        // 第5个Boss：如果第4个不是ARMOR，则第5个是ARMOR；否则是BARRAGE
        if (!gameState.armorBossSpawned) {
            bossType = BossType.ARMOR;
            gameState.armorBossSpawned = true;
        } else {
            bossType = BossType.BARRAGE;
        }
    } else {
        // 第6个及之后：循环生成（排除ARMOR，因为ARMOR只在第4或第5个出现）
        const laterTypes = [BossType.LIFESTEAL, BossType.SPLIT, BossType.CHARGE, BossType.BARRAGE];
        const laterIndex = (gameState.bossKills - 5) % laterTypes.length;
        bossType = laterTypes[laterIndex];
    }
    
    bosses.push(new Boss(x, y, bossType));
}

// 应用升级效果（从当前等级升级到目标等级）
function applyLevelUpgrades(targetLevel) {
    const startLevel = gameState.level;
    const levelDiff = targetLevel - startLevel;
    
    if (levelDiff <= 0) return;
    
    // 每次升级提升20生命值
    const healthIncrease = levelDiff * 20;
    tank.maxHealth += healthIncrease;
    tank.heal(healthIncrease);
    
    // 更新升级等级
    tank.upgradeLevel = targetLevel - 1;
    
    // 每次升级坦克都会变大（根据升级等级），但有上限防止看不到敌人
    const maxSizeMultiplier = 2.0; // 最大2倍大小
    const sizeMultiplier = Math.min(maxSizeMultiplier, 1 + (tank.upgradeLevel * 0.15)); // 每次升级增加15%大小，但不超过2倍
    tank.width = tank.baseWidth * sizeMultiplier;
    tank.height = tank.baseHeight * sizeMultiplier;
    
    // 根据sizeMultiplier降低移动速度：越大越慢（速度与大小的倒数成正比，但下降更平缓）
    // 速度 = 基础速度 * (1 / sizeMultiplier^0.5)，这样2倍大小时速度约为71%
    const speedMultiplier = 1 / Math.sqrt(sizeMultiplier);
    tank.baseSpeed = 3 * speedMultiplier;
    tank.speed = tank.baseSpeed; // 更新当前速度
    
    // 子弹大小随坦克变大而变大，但增长幅度较小（只增长坦克增长的30%）
    const baseBulletSize = CONFIG.bulletSize.initial;
    const bulletSizeMultiplier = 1 + (tank.upgradeLevel * 0.15 * 0.3); // 子弹大小增长是坦克增长的30%
    tank.bulletSize = baseBulletSize * bulletSizeMultiplier; // 子弹大小随坦克大小变化，但增长较慢
    
    // 根据升级等级应用不同的升级效果
    if (tank.upgradeLevel >= 1) {
        // 第一次升级：子弹变大（已在上面处理）
    }
    if (tank.upgradeLevel >= 2) {
        // 第二次升级：子弹变大且扩散
        tank.bulletCount = 3;
        tank.bulletSpread = Math.PI / 6; // 30度扩散
    }
    if (tank.upgradeLevel >= 3) {
        // 第三次升级：全方位发射导弹
        tank.fullCircleShoot = true;
    }
    if (tank.upgradeLevel > 3) {
        // 后续升级：继续增强
        const additionalUpgrades = tank.upgradeLevel - 3;
        tank.damage += additionalUpgrades;
        // 计算新的基础射速
        const newBaseFireRate = Math.max(200, 500 - (additionalUpgrades * 50)); // 限制最小射速为200ms
        tank.baseFireRate = newBaseFireRate;
        tank.fireRate = tank.baseFireRate; // 更新当前射速（会根据移动状态再调整）
    }
}

// 升级系统
function checkUpgrade() {
    // 循环检查是否可以升级（可能一次获得大量经验值，连续升级）
    let upgraded = false;
    while (true) {
        const currentLevel = gameState.level;
        
        // 如果已经达到最大等级，不再升级
        if (currentLevel >= LEVEL_TABLE.length) {
            break;
        }
        
        // 获取当前等级所需的经验值
        const requiredExp = getRequiredExpForLevel(currentLevel);
        
        // 如果requiredExp为0，说明这是BOSS掉落等级，需要特殊处理
        if (requiredExp === 0) {
            // BOSS掉落等级，跳过这一级，继续检查下一级
            gameState.level++;
            tank.upgradeLevel++;
            // 更新lastUpgradeExp，保持与当前经验值一致（不消耗经验值）
            gameState.lastUpgradeExp = gameState.experience;
            continue; // 继续检查下一级
        }
        
        // 计算从上次升级到现在的经验值
        const experienceSinceLastUpgrade = gameState.experience - gameState.lastUpgradeExp;
        
        // 如果经验值不足，退出循环
        if (experienceSinceLastUpgrade < requiredExp) {
            break;
        }
        
        // 升级
        gameState.level++;
        tank.upgradeLevel++;
        gameState.lastUpgradeExp = gameState.experience - (experienceSinceLastUpgrade - requiredExp);
        gameState.lastUpgradeKills = gameState.kills;
        upgraded = true;
        
        // 显示升级选择界面
        showUpgradeSelection();
        
        // 等待玩家选择后再继续（暂停游戏循环）
        gameState.pendingUpgrade = true;
        break; // 一次只处理一个升级
        
        // 每次升级坦克都会变大（根据升级等级），但有上限防止看不到敌人
        const maxSizeMultiplier = 2.0; // 最大2倍大小
        const sizeMultiplier = Math.min(maxSizeMultiplier, 1 + (tank.upgradeLevel * 0.15)); // 每次升级增加15%大小，但不超过2倍
        tank.width = tank.baseWidth * sizeMultiplier;
        tank.height = tank.baseHeight * sizeMultiplier;
        
        // 根据sizeMultiplier降低移动速度：越大越慢（速度与大小的倒数成正比，但下降更平缓）
        // 速度 = 基础速度 * (1 / sizeMultiplier^0.5)，这样2倍大小时速度约为71%
        const speedMultiplier = 1 / Math.sqrt(sizeMultiplier);
        tank.baseSpeed = 3 * speedMultiplier;
        tank.speed = tank.baseSpeed; // 更新当前速度
        
        // 子弹大小随坦克变大而变大，但增长幅度较小（只增长坦克增长的30%）
        const baseBulletSize = CONFIG.bulletSize.initial;
        const bulletSizeMultiplier = 1 + (tank.upgradeLevel * 0.15 * 0.3); // 子弹大小增长是坦克增长的30%
        tank.bulletSize = baseBulletSize * bulletSizeMultiplier; // 子弹大小随坦克大小变化，但增长较慢
        
        // 根据升级等级应用不同的升级效果
        switch (tank.upgradeLevel) {
            case 1: // 第一次升级：子弹变大
                // showUpgradeNotification('坦克变大！子弹变大！');
                break;
            case 2: // 第二次升级：子弹变大且扩散
                tank.bulletCount = 3;
                tank.bulletSpread = Math.PI / 6; // 30度扩散
                // showUpgradeNotification('坦克变大！子弹变大且扩散！');
                break;
            case 3: // 第三次升级：全方位发射导弹
                tank.fullCircleShoot = true;
                // showUpgradeNotification('坦克变大！全方位导弹！');
                break;
            default: // 后续升级：继续增强
                tank.damage += 1;
                tank.baseFireRate = Math.max(200, tank.baseFireRate - 50); // 限制最小射速为200ms，修改基础射速
                tank.fireRate = tank.baseFireRate; // 更新当前射速（会根据移动状态再调整）
                // showUpgradeNotification('坦克变大！伤害 +1，射速提升！');
                break;
        }
    }
    
    if (upgraded) {
        updateUI();
    }
}

// 获取可用的升级选项（3选1，考虑等级限制）
function getAvailableUpgradeOptions() {
    const allModules = Object.values(UPGRADE_MODULES);
    const availableOptions = [];
    
    // 收集所有可用的升级选项（只有选择了低等级才能出现高等级）
    for (const module of allModules) {
        const currentLevel = gameState.upgradeModules[module.id];
        if (currentLevel < module.levels.length) {
            const nextLevel = module.levels[currentLevel];
            availableOptions.push({
                moduleId: module.id,
                module: module,
                level: nextLevel.level,
                description: nextLevel.description,
                isSpecial: nextLevel.isSpecial || false
            });
        }
    }
    
    // 随机选择3个选项
    const selected = [];
    const shuffled = [...availableOptions].sort(() => Math.random() - 0.5);
    
    for (let i = 0; i < Math.min(3, shuffled.length); i++) {
        selected.push(shuffled[i]);
    }
    
    return selected;
}

// 显示升级选择界面
function showUpgradeSelection() {
    const overlay = document.getElementById('upgradeOverlay');
    const optionsContainer = document.getElementById('upgradeOptions');
    
    if (!overlay || !optionsContainer) return;
    
    // 获取可用的升级选项
    const options = getAvailableUpgradeOptions();
    
    // 清空容器
    optionsContainer.innerHTML = '';
    
    // 创建选项元素
    options.forEach((option, index) => {
        const optionDiv = document.createElement('div');
        optionDiv.className = 'upgrade-option';
        optionDiv.dataset.moduleId = option.moduleId;
        optionDiv.dataset.level = option.level;
        
        const nameDiv = document.createElement('div');
        nameDiv.className = 'upgrade-option-name';
        nameDiv.textContent = `${option.module.name} Lv ${option.level}`;
        
        const categoryDiv = document.createElement('div');
        categoryDiv.className = 'upgrade-option-level';
        categoryDiv.textContent = option.module.category;
        
        const descDiv = document.createElement('div');
        descDiv.className = 'upgrade-option-description';
        descDiv.textContent = option.description;
        
        if (option.isSpecial) {
            const specialDiv = document.createElement('div');
            specialDiv.className = 'upgrade-option-special';
            specialDiv.textContent = '★ 质变技能 ★';
            optionDiv.appendChild(specialDiv);
        }
        
        optionDiv.appendChild(nameDiv);
        optionDiv.appendChild(categoryDiv);
        optionDiv.appendChild(descDiv);
        
        // 点击选择
        optionDiv.addEventListener('click', () => {
            selectUpgrade(option.moduleId, option.level);
        });
        
        optionsContainer.appendChild(optionDiv);
    });
    
    // 显示界面
    overlay.style.display = 'flex';
    gameState.paused = true; // 暂停游戏
}

// 选择升级
function selectUpgrade(moduleId, level) {
    // 更新技能等级
    gameState.upgradeModules[moduleId] = level;
    
    // 应用升级效果
    applyUpgradeEffect(moduleId, level);
    
    // 隐藏选择界面
    const overlay = document.getElementById('upgradeOverlay');
    if (overlay) {
        overlay.style.display = 'none';
    }
    
    // 恢复游戏
    gameState.paused = false;
    gameState.pendingUpgrade = false;
    
    // 继续检查是否还能升级
    checkUpgrade();
    updateUI();
}

// 应用升级效果
function applyUpgradeEffect(moduleId, level) {
    const module = UPGRADE_MODULES[moduleId];
    if (!module) return;
    
    switch (moduleId) {
        case 'LASER':
            applyLaserUpgrade(level);
            break;
        case 'SPREAD':
            applySpreadUpgrade(level);
            break;
        case 'BOUNCE':
            applyBounceUpgrade(level);
            break;
        case 'FREEZE':
            applyFreezeUpgrade(level);
            break;
        case 'CRIT':
            applyCritUpgrade(level);
            break;
        case 'REGEN':
            applyRegenUpgrade(level);
            break;
    }
}

// 激光模组升级效果
function applyLaserUpgrade(level) {
    if (level === 1) {
        // Lv 1: 主炮变为激光，瞬间击中直线所有敌人，伤害中等，攻速慢
        tank.hasLaser = true;
        tank.laserWidth = 20; // 基础宽度
        tank.laserDamage = tank.damage * 1.8; // 伤害提高（普通子弹的180%，从150%提升）
        tank.laserFireRate = tank.baseFireRate * 1.5; // 攻速慢（攻击间隔增加50%）
    } else if (level === 2) {
        // Lv 2: 激光变粗（判定宽度+50%）
        tank.laserWidth = Math.floor(tank.laserWidth * 1.5); // 宽度+50%
    } else if (level === 3) {
        // Lv 3: 攻击间隔减少30%
        tank.laserFireRate = tank.laserFireRate * 0.7; // 攻击间隔减少30%（射速提升）
    } else if (level === 4) {
        // Lv 4: 伤害增加50%
        tank.laserDamage = tank.laserDamage * 1.5; // 伤害增加50%
    } else if (level === 5) {
        // Lv 5: 在lv4基础上增加击杀回复生命值的效果（击杀回血效果在碰撞检测中实现）
        // 不改变激光的其他属性，保持lv4的效果
    }
}

// 扩容弹舱升级效果
function applySpreadUpgrade(level) {
    if (level === 1) {
        // Lv 1: 发射物数量 +1（前方V字型）
        tank.bulletCount = 2; // 从1发变为2发
        tank.bulletSpread = Math.PI / 12; // 15度扩散角度（V字型）
    } else if (level === 2) {
        // Lv 2: 发射物数量 +1（前方三叉戟型）
        tank.bulletCount = 3; // 从2发变为3发
        tank.bulletSpread = Math.PI / 8; // 22.5度扩散角度（三叉戟型）
    } else if (level === 3) {
        // Lv 3: 发射物数量+2（前方五发扇形）
        tank.bulletCount = 5; // 从3发变为5发（+2）
        tank.bulletSpread = Math.PI / 6; // 30度扩散角度（五发扇形）
    } else if (level === 4) {
        // Lv 4: 发射物数量+3，总共8发，覆盖前方120度
        tank.bulletCount = 8; // 从5发变为8发（+3）
        tank.bulletSpread = Math.PI * 2 / 3; // 120度（2π/3弧度），8发均匀分布覆盖前方120度
    } else if (level === 5) {
        // Lv 5 (质变): 发射物数量+7，总共15发，向360度发射
        tank.bulletCount = 15; // 从8发变为15发（+7）
        tank.fullCircleShoot = true; // 启用360度全弹发射
        // 总共15发，均匀分布在360度
    }
}

// 智能跳弹升级效果
function applyBounceUpgrade(level) {
    if (level === 1) {
        // Lv 1: 子弹/激光击中敌人或墙壁后，折射 1 次，伤害减半
        tank.hasBounce = true;
        tank.bounceStack = 1; // 折射1次
        tank.bounceDamageReduction = 0.5; // 伤害减半
    } else if (level === 2) {
        // Lv 2: 折射伤害不再减半（折射次数仍为1次）
        tank.bounceDamageReduction = 1.0; // 伤害不减半（保持100%伤害）
        // 折射次数保持1次（Lv 1和Lv 2都是1次）
    } else if (level === 3) {
        // Lv 3: 折射次数 +1（从1次变为2次）
        tank.bounceStack = 2; // 折射2次
    } else if (level === 4) {
        // Lv 4: 子弹飞行速度/激光射程 +30%（折射次数仍为2次）
        tank.bulletSpeed = tank.bulletSpeed * 1.3; // 子弹速度+30%
        // 激光射程通过增加maxLength来实现
        if (tank.hasLaser) {
            // 激光射程会在Laser类中通过maxLength增加30%
        }
        // 折射次数保持2次（Lv 3和Lv 4都是2次）
    } else if (level === 5) {
        // Lv 5 (质变): 折射锁定。折射次数变为4次，如果是激光，会形成折射网
        tank.bounceStack = 4; // 折射4次
        tank.laserRefraction = true; // 激光折射网
    }
}

// 液氮弹头升级效果
function applyFreezeUpgrade(level) {
    if (level === 1) {
        tank.hasFreeze = true;
        tank.freezeSlowPercent = 0.3; // 30%减速
        tank.freezeDuration = 1000; // 1秒
    } else if (level === 2) {
        tank.freezeSlowPercent = 0.6; // 60%减速
    } else if (level === 3) {
        tank.freezeStack = 3; // 连续3次冻结
        tank.freezeFreezeDuration = 2000; // 2秒
    } else if (level === 4) {
        tank.freezeAOE = true; // 范围化
    } else if (level === 5) {
        tank.freezeExplosion = true; // 冰爆
    }
}

// 贫铀核心升级效果
function applyCritUpgrade(level) {
    if (level === 1) {
        tank.hasCrit = true;
        tank.critRate = 0.1; // 暴击率 +10%
        tank.critDamage = 1.5; // 暴击伤害 150%
    } else if (level === 2) {
        tank.critRate = 0.15; // 暴击率 +15%
        tank.critDamage = 1.8; // 暴击伤害 180%
    } else if (level === 3) {
        tank.critRate = 0.2; // 暴击率 +20%
        tank.critDamage = 2.0; // 暴击伤害 200%
    } else if (level === 4) {
        tank.critKnockback = 2.0; // 暴击击退力 +100%（从1.0变为2.0）
    } else if (level === 5) {
        tank.critRate = 0.25; // 暴击率 +25%（红死神）
        tank.critPenetrate = true; // 红死神：触发暴击时，子弹穿透当前目标
    }
}

// 纳米修复升级效果
function applyRegenUpgrade(level) {
    if (level === 1) {
        tank.hasRegen = true;
        tank.regenInterval = 5000; // 5秒
        tank.regenPercent = 0.05; // 5%
        tank.lastRegenTime = Date.now();
    } else if (level === 2) {
        tank.regenInterval = 4000; // 4秒
    } else if (level === 3) {
        tank.maxHealth = Math.floor(tank.maxHealth * 1.3); // +30%
        tank.health = Math.min(tank.health, tank.maxHealth);
    } else if (level === 4) {
        tank.invincibleOnHit = true; // 受伤后1秒无敌
        tank.invincibleDuration = 1000;
    } else if (level === 5) {
        tank.reactiveArmor = true; // 反应装甲
    }
}

// 显示升级通知
function showUpgradeNotification(text) {
    const notification = document.getElementById('upgradeNotification');
    notification.textContent = text;
    notification.style.display = 'block';
    
    setTimeout(() => {
        notification.style.display = 'none';
    }, 2000);
}

// 碰撞检测
function checkCollisions() {
    // 子弹与敌人碰撞
    for (let i = bullets.length - 1; i >= 0; i--) {
        const bullet = bullets[i];
        
        for (let j = enemies.length - 1; j >= 0; j--) {
            const enemy = enemies[j];
            const dx = bullet.x - enemy.x;
            const dy = bullet.y - enemy.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            
            if (dist < bullet.radius + enemy.size / 2) {
                // 计算实际伤害（考虑暴击和反弹伤害减半）
                let actualDamage = bullet.damage;
                // 如果子弹已经是暴击，直接使用暴击伤害
                // 暴击判断应该在创建子弹时进行，而不是在碰撞时
                if (bullet.isCrit) {
                    actualDamage = actualDamage * tank.critDamage;
                }
                
                // 如果子弹已经反弹过，应用伤害减半（Lv 1）
                if (bullet.hasBounce && bullet.bounceCount > 0) {
                    actualDamage = actualDamage * tank.bounceDamageReduction;
                }
                
                // 击中敌人
                const killed = enemy.takeDamage(actualDamage);
                
                // 液氮弹头：减速和冰冻效果
                if (bullet.isFreeze || tank.freezeSlowPercent > 0) {
                    const slowPercent = bullet.isFreeze ? 0.5 : tank.freezeSlowPercent;
                    enemy.speed = enemy.baseSpeed * (1 - slowPercent);
                    
                    // 跟踪冰冻计数
                    if (tank.freezeStack > 0) {
                        const enemyId = enemy.x + '_' + enemy.y; // 简单ID
                        const count = (tank.enemyFreezeCount.get(enemyId) || 0) + 1;
                        tank.enemyFreezeCount.set(enemyId, count);
                        
                        if (count >= tank.freezeStack) {
                            enemy.isFrozen = true;
                            enemy.freezeTime = tank.freezeFreezeDuration || 2000;
                            enemy.speed = 0;
                            tank.enemyFreezeCount.delete(enemyId);
                        }
                    } else {
                        enemy.isFrozen = true;
                        enemy.freezeTime = 3000; // 冰冻3秒
                        enemy.speed = 0;
                    }
                }
                
                // 穿透效果
                if (bullet.hasPenetrate && bullet.penetrateCount < bullet.maxPenetrateCount) {
                    bullet.penetrateCount++;
                    // 不删除子弹，继续穿透
                } else {
                    bullets.splice(i, 1);
                }
                
                if (killed) {
                    gameState.kills += enemy.score;
                    gameState.experience += enemy.exp; // 使用经验值而不是分数
                    
                    // 液氮弹头：冰爆效果（冰刺只攻击敌人，不攻击玩家）
                    if (tank.freezeExplosion && enemy.isFrozen) {
                        const iceShardCount = 4;
                        for (let i = 0; i < iceShardCount; i++) {
                            const angle = (Math.PI * 2 / iceShardCount) * i;
                            const iceShard = new Bullet(
                                enemy.x,
                                enemy.y,
                                angle,
                                8,
                                tank.damage * 2, // 伤害极高
                                8,
                                true, // 使用bullet_blue.png
                                false,
                                false,
                                false,
                                0,
                                0
                            );
                            iceShard.isPlayerBullet = true; // 明确标记为玩家子弹，只攻击敌人
                            bullets.push(iceShard);
                        }
                    }
                    
                    enemies.splice(j, 1);
                    checkUpgrade();
                    checkBossSpawn(); // 检查是否需要生成Boss
                    checkWin();
                    updateUI();
                }
                break;
            }
        }
        
        // 子弹与Boss碰撞
        for (let j = bosses.length - 1; j >= 0; j--) {
            const boss = bosses[j];
            const dx = bullet.x - boss.x;
            const dy = bullet.y - boss.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            
            if (dist < bullet.radius + boss.size / 2) {
                // 击中Boss，传递子弹角度用于正面减伤计算
                const bulletAngle = Math.atan2(dy, dx);
                const killed = boss.takeDamage(bullet.damage, bulletAngle);
                
                // 穿透效果
                if (bullet.hasPenetrate && bullet.penetrateCount < bullet.maxPenetrateCount) {
                    bullet.penetrateCount++;
                    // 不删除子弹，继续穿透
                } else {
                    bullets.splice(i, 1);
                }
                
                if (killed) {
                    // 如果击杀的是分裂Boss，开启一段时间的刷怪减速期，方便玩家清理残余怪物
                    if (boss.type === BossType.SPLIT) {
                        // 40 秒内全局刷怪额外减速（延长减速时间）
                        gameState.splitSlowEndTime = Date.now() + 40000;
                    }
                    gameState.kills += boss.score;
                    gameState.bossKills++;
                    
                    // 根据BOSS击杀数确定经验值奖励
                    let bossExp = 0;
                    let targetLevel = 0; // 目标等级（0表示不强制升级）
                    
                    if (gameState.bossKills === 1) {
                        // BOSS 1: 100 XP，直接升到 Lv 6.5
                        bossExp = 100;
                        targetLevel = 6; // 升到6级，然后继续升级
                    } else if (gameState.bossKills === 2) {
                        // BOSS 2: 300 XP，直接升到 Lv 11
                        bossExp = 300;
                        targetLevel = 11;
                    } else if (gameState.bossKills === 3) {
                        // BOSS 3: 800 XP，直接冲过 Lv 16
                        bossExp = 800;
                        targetLevel = 16;
                    } else if (gameState.bossKills === 4) {
                        // BOSS 4: 2000 XP，直升 Lv 21
                        bossExp = 2000;
                        targetLevel = 21;
                    } else {
                        // 后续BOSS：根据当前等级给予经验值
                        bossExp = 100 * gameState.bossKills;
                    }
                    
                    gameState.experience += bossExp;
                    
                    // 如果指定了目标等级，直接升级到该等级
                    if (targetLevel > 0 && gameState.level < targetLevel) {
                        // 计算升级到目标等级所需的经验值
                        let totalExpNeeded = 0;
                        for (let l = gameState.level; l < targetLevel; l++) {
                            const reqExp = getRequiredExpForLevel(l);
                            if (reqExp > 0) {
                                totalExpNeeded += reqExp;
                            }
                        }
                        
                        // 设置经验值，确保能升级到目标等级
                        const currentExpSinceLastUpgrade = gameState.experience - gameState.lastUpgradeExp;
                        
                        // 如果经验值足够，逐级升级到目标等级
                        if (currentExpSinceLastUpgrade >= totalExpNeeded) {
                            // 逐级升级，每级都显示升级选择界面
                            let currentLevel = gameState.level;
                            let remainingExp = currentExpSinceLastUpgrade;
                            while (currentLevel < targetLevel) {
                                currentLevel++;
                                const reqExp = getRequiredExpForLevel(currentLevel);
                                
                                // 升级到当前等级
                                gameState.level = currentLevel;
                                tank.upgradeLevel = currentLevel - 1;
                                
                                // 如果是正常等级（需要经验值），消耗经验值
                                if (reqExp > 0) {
                                    remainingExp -= reqExp;
                                }
                                // 更新lastUpgradeExp（所有等级都要更新，包括BOSS掉落等级）
                                gameState.lastUpgradeExp = gameState.experience - remainingExp;
                                
                                // 应用升级效果
                                applyLevelUpgrades(currentLevel);
                                
                                // 显示升级选择界面（所有等级都显示）
                                showUpgradeSelection();
                                gameState.pendingUpgrade = true;
                                break; // 一次只处理一个升级，等待玩家选择
                            }
                            // 如果已经升级到目标等级且还有剩余经验值，更新lastUpgradeExp
                            if (currentLevel >= targetLevel && remainingExp >= 0) {
                                gameState.lastUpgradeExp = gameState.experience - remainingExp;
                            }
                        } else {
                            // 经验值不足，但先升级到能升级的最高等级
                            // 让checkUpgrade函数处理后续升级
                            checkUpgrade();
                        }
                    } else {
                        // 没有指定目标等级，正常检查升级
                        checkUpgrade();
                    }
                    
                    bosses.splice(j, 1);
                    // showUpgradeNotification('Boss被击败！');
                    // 如果还没有升级到目标等级，继续检查升级
                    if (targetLevel === 0 || gameState.level < targetLevel) {
                        checkUpgrade(); // 检查是否还能继续升级
                    }
                    checkWin();
                    updateUI();
                }
                break;
            }
        }
    }
    
    // 移除屏幕外的子弹
    bullets = bullets.filter(bullet => !bullet.isOffScreen());
    
    // 敌人子弹与玩家碰撞检测
    for (let i = enemyBullets.length - 1; i >= 0; i--) {
        const enemyBullet = enemyBullets[i];
        const dx = enemyBullet.x - tank.x;
        const dy = enemyBullet.y - tank.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        
        if (dist < enemyBullet.radius + tank.width / 2) {
            // 击中玩家
            tank.takeDamage(enemyBullet.damage);
            enemyBullets.splice(i, 1);
        }
    }
    
    // 移除屏幕外的敌人子弹
    enemyBullets = enemyBullets.filter(bullet => !bullet.isOffScreen());
    
    // 子弹与分裂Boss小坦克碰撞
    for (let i = bullets.length - 1; i >= 0; i--) {
        const bullet = bullets[i];
        
        for (let j = splitTankMinions.length - 1; j >= 0; j--) {
            const minion = splitTankMinions[j];
            const dx = bullet.x - minion.x;
            const dy = bullet.y - minion.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            
            if (dist < bullet.radius + minion.size / 2) {
                // 击中小坦克
                const killed = minion.takeDamage(bullet.damage);
                bullets.splice(i, 1);
                
                if (killed) {
                    splitTankMinions.splice(j, 1);
                }
                break;
            }
        }
    }
    
    // 分裂Boss小坦克与玩家碰撞
    for (let i = splitTankMinions.length - 1; i >= 0; i--) {
        const minion = splitTankMinions[i];
        const dx = minion.x - tank.x;
        const dy = minion.y - tank.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        
        if (dist < minion.size / 2 + tank.width / 2) {
            // 小坦克碰撞伤害
            if (!minion.lastDamageTime) {
                minion.lastDamageTime = Date.now();
            }
            const now = Date.now();
            if (now - minion.lastDamageTime >= 1000) {
                tank.takeDamage(15); // 小坦克造成15点伤害
                minion.lastDamageTime = now;
            }
        } else {
            minion.lastDamageTime = null;
        }
    }
    
    // 道具与坦克碰撞检测
    for (let i = items.length - 1; i >= 0; i--) {
        const item = items[i];
        const dx = item.x - tank.x;
        const dy = item.y - tank.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        
        if (dist < item.radius + tank.width / 2) {
            // 拾取道具
            applyItemEffect(item.type);
            items.splice(i, 1);
            // showUpgradeNotification(item.type.name);
        }
    }
    
    // 移除过期的道具
    items = items.filter(item => !item.isExpired());
}

// 掉落道具
function dropItem(x, y) {
    const itemTypes = Object.values(ItemType);
    const randomType = itemTypes[Math.floor(Math.random() * itemTypes.length)];
    items.push(new Item(x, y, randomType));
}

// 创建小型坦克
function createMiniTank() {
    // 在主角坦克旁边创建小型坦克
    const offsetX = (Math.random() - 0.5) * 80;
    const offsetY = (Math.random() - 0.5) * 80;
    miniTanks.push(new MiniTank(tank.x + offsetX, tank.y + offsetY));
}

// 应用道具效果
function applyItemEffect(itemType) {
    if (typeof itemType === 'object' && itemType.type) {
        // 处理特殊道具类型（来自Boss掉落）
        switch (itemType.type) {
            case 'MINI_TANK':
                // 在主角坦克旁增加一辆相同的小型坦克
                createMiniTank();
                break;
            case 'BOUNCE':
                // 子弹反弹效果，持续20秒
                tank.hasBounce = true;
                tank.bounceStack = Math.min(3, tank.bounceStack + 1); // 最多叠加3次
                tank.bounceDuration = 20000; // 持续20秒
                break;
            case 'PENETRATE':
                // 子弹穿透效果，可以叠加
                tank.hasPenetrate = true;
                tank.penetrateStack = Math.min(3, tank.penetrateStack + 1); // 最多叠加3次
                break;
            case 'LOW_HEALTH_BOOST':
                // 低生命值加速效果，可以叠加
                tank.hasLowHealthBoost = true;
                tank.lowHealthBoostStack = Math.min(3, tank.lowHealthBoostStack + 1); // 最多叠加3次
                break;
        }
        return;
    }
    
    switch (itemType) {
        case ItemType.HEAL:
            tank.heal(30); // 回复30血量，使用heal方法触发治疗效果
            updateUI();
            break;
        case ItemType.SPREAD:
            tank.hasSpread = true;
            // 叠加效果，最多2次
            tank.spreadStack = Math.min(2, tank.spreadStack + 1);
            tank.spreadDuration = 10000; // 持续10秒
            break;
        case ItemType.FREEZE:
            tank.hasFreeze = true;
            tank.lastFreezeShootTime = Date.now(); // 初始化冰冻子弹射击时间
            break;
        case ItemType.CRIT:
            tank.hasCrit = true;
            // 如果已经有暴击效果，叠加（最多2次叠加，即4倍伤害）
            if (tank.critDuration > 0) {
                tank.critStack = Math.min(2, tank.critStack + 1); // 最多叠加2次
            } else {
                tank.critStack = 1; // 首次拾取，叠加1次
            }
            tank.critDuration = 5000; // 持续5秒（重置持续时间）
            break;
    }
}

// 检查胜利条件
function checkWin() {
    if (gameState.kills >= CONFIG.targetKills) {
        gameState.running = false;
        showGameOver(true);
    }
}

// 显示游戏结束
function showGameOver(won) {
    // 暂停背景音乐
    bgm.pause();
    
    const gameOverDiv = document.getElementById('gameOver');
    const gameOverText = document.getElementById('gameOverText');
    
    if (won) {
        gameOverText.textContent = `恭喜通关！`;
    } else {
        gameOverText.textContent = `游戏失败！`;
    }
    
    gameOverDiv.style.display = 'block';
}

// 更新UI
function updateUI() {
    document.getElementById('kills').textContent = gameState.kills;
    const killsDisplayValue = document.getElementById('killsDisplayValue');
    if (killsDisplayValue) {
        killsDisplayValue.textContent = gameState.kills;
    }
    const targetKillsEl = document.getElementById('targetKills');
    if (targetKillsEl) {
        targetKillsEl.textContent = 'Boss: ' + gameState.bossKills + ' / ' + CONFIG.targetBossKills;
    }
    document.getElementById('level').textContent = gameState.level;
    
    // 更新经验条（使用新的等级表）
    const experienceSinceLastUpgrade = gameState.experience - gameState.lastUpgradeExp;
    const requiredExp = getRequiredExpForLevel(gameState.level);
    
    // 如果requiredExp为0，说明是BOSS掉落等级，显示特殊信息
    let expPercent = 0;
    let expDisplayText = '';
    
    if (requiredExp === 0 || requiredExp === Infinity) {
        // BOSS掉落等级或已达到最大等级
        expPercent = 100;
        if (gameState.level >= LEVEL_TABLE.length) {
            expDisplayText = 'MAX';
        } else {
            expDisplayText = 'BOSS掉落';
        }
    } else {
        expPercent = Math.min(100, (experienceSinceLastUpgrade / requiredExp) * 100);
        expDisplayText = `${Math.floor(experienceSinceLastUpgrade)} / ${requiredExp}`;
    }
    
    const expBar = document.getElementById('expBarFill');
    if (expBar) {
        expBar.style.width = expPercent + '%';
    }
    
    const expText = document.getElementById('expText');
    if (expText) {
        expText.textContent = expDisplayText;
    }
}

// 准星和鼠标事件
function getCanvasMousePos(e) {
    const rect = canvas.getBoundingClientRect();
    return {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
    };
}

// 检查是否点击在准星上
function isPointOnCrosshair(x, y) {
    const dx = x - crosshair.x;
    const dy = y - crosshair.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    return dist < crosshair.radius * 2;
}

canvas.addEventListener('mousedown', (e) => {
    const pos = getCanvasMousePos(e);
    mouse.x = pos.x;
    mouse.y = pos.y;
    mouse.isDown = true;
    
    // 检查是否点击在准星上
    if (isPointOnCrosshair(pos.x, pos.y)) {
        crosshair.isDragging = true;
    }
});

canvas.addEventListener('mousemove', (e) => {
    const pos = getCanvasMousePos(e);
    mouse.x = pos.x;
    mouse.y = pos.y;
    
    // 拖动准星
    if (crosshair.isDragging && mouse.isDown) {
        crosshair.x = pos.x;
        crosshair.y = pos.y;
    }
});

canvas.addEventListener('mouseup', (e) => {
    mouse.isDown = false;
    crosshair.isDragging = false;
});

canvas.addEventListener('mouseleave', (e) => {
    mouse.isDown = false;
    crosshair.isDragging = false;
});

// 触摸事件支持
canvas.addEventListener('touchstart', (e) => {
    e.preventDefault();
    const touch = e.touches[0];
    const pos = getCanvasMousePos({ clientX: touch.clientX, clientY: touch.clientY });
    mouse.x = pos.x;
    mouse.y = pos.y;
    mouse.isDown = true;
    
    if (isPointOnCrosshair(pos.x, pos.y)) {
        crosshair.isDragging = true;
    }
});

canvas.addEventListener('touchmove', (e) => {
    e.preventDefault();
    const touch = e.touches[0];
    const pos = getCanvasMousePos({ clientX: touch.clientX, clientY: touch.clientY });
    mouse.x = pos.x;
    mouse.y = pos.y;
    
    if (crosshair.isDragging && mouse.isDown) {
        crosshair.x = pos.x;
        crosshair.y = pos.y;
    }
});

canvas.addEventListener('touchend', (e) => {
    e.preventDefault();
    mouse.isDown = false;
    crosshair.isDragging = false;
});

// 跟踪鼠标位置（用于准星跟随）
document.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    mouse.x = e.clientX - rect.left;
    mouse.y = e.clientY - rect.top;
    
    // 如果不在拖动准星，让准星跟随鼠标
    if (!crosshair.isDragging) {
        crosshair.x = mouse.x;
        crosshair.y = mouse.y;
    }
});

// 键盘事件
document.addEventListener('keydown', (e) => {
    keys[e.key.toLowerCase()] = true;
    keys[e.key] = true;
});

document.addEventListener('keyup', (e) => {
    keys[e.key.toLowerCase()] = false;
    keys[e.key] = false;
});

// 游戏主循环
function gameLoop() {
    // 绘制背景（始终绘制，即使游戏未开始）
    if (bgImageLoaded) {
        // 绘制背景图片，缩放以适应画布
        ctx.drawImage(bgImage, 0, 0, CONFIG.canvasWidth, CONFIG.canvasHeight);
    } else {
        // 如果图片未加载，使用默认背景色
        ctx.fillStyle = '#0a0a14';
        ctx.fillRect(0, 0, CONFIG.canvasWidth, CONFIG.canvasHeight);
    }
    
    // 如果游戏未开始或未运行，只绘制背景
    if (!gameState.started || !gameState.running) {
        requestAnimationFrame(gameLoop);
        return;
    }
    
    // 如果暂停，只绘制不更新
    if (!gameState.paused && !gameState.pendingUpgrade && gameState.started) {
        // 生成敌人
        spawnEnemy();
        
        // 检查是否需要生成Boss
        checkBossSpawn();
        
        // 更新坦克
        tank.update();
        
        // 纳米修复：生命回复逻辑
        if (tank.hasRegen) {
            const now = Date.now();
            if (now - tank.lastRegenTime >= tank.regenInterval) {
                const oldHealth = tank.health;
                const healAmount = Math.floor(tank.maxHealth * tank.regenPercent);
                tank.heal(healAmount);
                tank.lastRegenTime = now;
                
                // 反应装甲：每当回复生命值时，向周围释放一圈电击
                if (tank.reactiveArmor && tank.health > oldHealth) {
                    const lostHealth = tank.maxHealth - oldHealth; // 回复前的已损失生命值
                    const shockDamage = Math.max(1, Math.floor(lostHealth * 0.1)); // 基于已损失生命值的10%造成伤害
                    const directionCount = 8; // 8个方向
                    
                    for (let dir = 0; dir < directionCount; dir++) {
                        const angle = (Math.PI * 2 / directionCount) * dir;
                        bullets.push(new Bullet(
                            tank.x,
                            tank.y,
                            angle,
                            4, // 电击子弹速度
                            shockDamage,
                            8, // 电击子弹半径
                            false, // 不是冰冻
                            false, // 不是暴击
                            false, // 不反弹
                            false, // 不穿透
                            0,
                            0,
                            true // 是电击子弹
                        ));
                    }
                }
            }
        }
        
        // 更新敌人
        for (let enemy of enemies) {
            enemy.update();
        }
        
        // 更新Boss
        for (let boss of bosses) {
            boss.update();
        }
        
        // 更新分裂Boss小坦克
        for (let i = splitTankMinions.length - 1; i >= 0; i--) {
            const minion = splitTankMinions[i];
            if (!minion.update()) {
                splitTankMinions.splice(i, 1);
            }
        }
        
        // 更新小型坦克
        for (let miniTank of miniTanks) {
            miniTank.update();
        }
        
        // 更新Boss激光
        for (let i = bossLasers.length - 1; i >= 0; i--) {
            const laser = bossLasers[i];
            laser.update();
            if (laser.isExpired()) {
                bossLasers.splice(i, 1);
            }
        }
        
        // 更新子弹
        for (let bullet of bullets) {
            bullet.update();
        }
        
        // 更新激光
        for (let i = lasers.length - 1; i >= 0; i--) {
            const laser = lasers[i];
            laser.update();
            
            // 检查激光与敌人的碰撞
            for (let j = enemies.length - 1; j >= 0; j--) {
                const enemy = enemies[j];
                if (laser.checkCollision(enemy)) {
                    // 计算激光伤害（考虑反弹伤害减半）
                    let laserDamage = laser.damage;
                    // 如果激光已经反弹过，应用伤害减半（Lv 1）
                    if (laser.hasBounced && tank.bounceDamageReduction < 1.0) {
                        laserDamage = laserDamage * tank.bounceDamageReduction;
                    }
                    const killed = enemy.takeDamage(laserDamage);
                    
                    // 液氮弹头：减速和冰冻效果（激光模式）
                    const hasFreezeModule = gameState.upgradeModules.FREEZE > 0;
                    if (hasFreezeModule && tank.freezeSlowPercent > 0) {
                        // 应用减速效果
                        enemy.speed = enemy.baseSpeed * (1 - tank.freezeSlowPercent);
                        
                        // 跟踪冰冻计数（Lv 3+）
                        if (tank.freezeStack > 0) {
                            const enemyId = enemy.x + '_' + enemy.y; // 简单ID
                            const count = (tank.enemyFreezeCount.get(enemyId) || 0) + 1;
                            tank.enemyFreezeCount.set(enemyId, count);
                            
                            if (count >= tank.freezeStack) {
                                // 连续击中3次，冻结敌人
                                enemy.isFrozen = true;
                                // 普通敌人冻结2秒
                                const freezeDuration = tank.freezeFreezeDuration || 2000;
                                enemy.freezeTime = freezeDuration;
                                enemy.speed = 0;
                                tank.enemyFreezeCount.delete(enemyId);
                                
                                // Lv 4: 冻结范围化（周围敌人有概率也被冻结）
                                if (tank.freezeAOE) {
                                    for (let k = 0; k < enemies.length; k++) {
                                        if (k === j) continue; // 跳过当前敌人
                                        const nearbyEnemy = enemies[k];
                                        const dx = nearbyEnemy.x - enemy.x;
                                        const dy = nearbyEnemy.y - enemy.y;
                                        const dist = Math.sqrt(dx * dx + dy * dy);
                                        // 范围：150像素，概率：30%
                                        if (dist <= 150 && Math.random() < 0.3) {
                                            nearbyEnemy.isFrozen = true;
                                            const nearbyFreezeDuration = tank.freezeFreezeDuration || 2000;
                                            nearbyEnemy.freezeTime = nearbyFreezeDuration;
                                            nearbyEnemy.speed = 0;
                                        }
                                    }
                                }
                            }
                        }
                    }
                    
                    if (killed) {
                        gameState.kills += enemy.score;
                        gameState.experience += enemy.exp;
                        
                        // 激光模组Lv 5：激光击杀回复生命值
                        if (gameState.upgradeModules.LASER >= 5) {
                            const healAmount = Math.max(1, Math.floor(tank.maxHealth * 0.03)); // 回复3%最大生命值
                            tank.heal(healAmount);
                        }
                        
                        // 液氮弹头Lv 5: 冰爆效果（被冻结的敌人死亡时发射4枚冰刺，只攻击敌人，不攻击玩家）
                        if (tank.freezeExplosion && enemy.isFrozen) {
                            const iceShardCount = 4;
                            for (let i = 0; i < iceShardCount; i++) {
                                const angle = (Math.PI * 2 / iceShardCount) * i;
                                const iceShard = new Bullet(
                                    enemy.x,
                                    enemy.y,
                                    angle,
                                    8,
                                    tank.damage * 2, // 伤害极高
                                    8,
                                    true, // 使用bullet_blue.png
                                    false,
                                    false,
                                    false,
                                    0,
                                    0
                                );
                                iceShard.isPlayerBullet = true; // 明确标记为玩家子弹，只攻击敌人
                                bullets.push(iceShard);
                            }
                        }
                        
                        enemies.splice(j, 1);
                        checkUpgrade();
                        checkBossSpawn();
                        checkWin();
                        updateUI();
                    }
                }
            }
            
            // 激光与分裂Boss小坦克碰撞
            for (let j = splitTankMinions.length - 1; j >= 0; j--) {
                const minion = splitTankMinions[j];
                if (laser.checkCollision(minion)) {
                    // 计算激光伤害（考虑反弹伤害减半）
                    let laserDamage = laser.damage;
                    if (laser.hasBounced && tank.bounceDamageReduction < 1.0) {
                        laserDamage = laserDamage * tank.bounceDamageReduction;
                    }
                    const killed = minion.takeDamage(laserDamage);
                    if (killed) {
                        splitTankMinions.splice(j, 1);
                    }
                }
            }
            
            // 检查激光与Boss的碰撞
            for (let j = bosses.length - 1; j >= 0; j--) {
                const boss = bosses[j];
                if (laser.checkCollision(boss)) {
                    // 计算激光伤害（考虑反弹伤害减半）
                    let laserDamage = laser.damage;
                    // 如果激光已经反弹过，应用伤害减半（Lv 1）
                    if (laser.hasBounced && tank.bounceDamageReduction < 1.0) {
                        laserDamage = laserDamage * tank.bounceDamageReduction;
                    }
                    const bulletAngle = Math.atan2(boss.y - laser.startY, boss.x - laser.startX);
                    const killed = boss.takeDamage(laserDamage, bulletAngle);
                    
                    // 液氮弹头：减速和冰冻效果（激光模式，Boss效果减半）
                    const hasFreezeModule = gameState.upgradeModules.FREEZE > 0;
                    if (hasFreezeModule && tank.freezeSlowPercent > 0) {
                        // 应用减速效果
                        boss.speed = boss.baseSpeed * (1 - tank.freezeSlowPercent);
                        
                        // 跟踪冰冻计数（Lv 3+）
                        if (tank.freezeStack > 0) {
                            const bossId = boss.x + '_' + boss.y; // 简单ID
                            const count = (tank.enemyFreezeCount.get(bossId) || 0) + 1;
                            tank.enemyFreezeCount.set(bossId, count);
                            
                            if (count >= tank.freezeStack) {
                                // 连续击中3次，冻结Boss（效果减半）
                                boss.isFrozen = true;
                                const freezeDuration = (tank.freezeFreezeDuration || 2000) / 2; // BOSS效果减半
                                boss.freezeTime = freezeDuration;
                                boss.speed = 0;
                                tank.enemyFreezeCount.delete(bossId);
                            }
                        }
                    }
                    
                    if (killed) {
                        // 激光模组Lv 5：激光击杀回复生命值
                        if (gameState.upgradeModules.LASER >= 5) {
                            const healAmount = Math.max(1, Math.floor(tank.maxHealth * 0.03)); // 回复3%最大生命值
                            tank.heal(healAmount);
                        }
                        
                        // 如果击杀的是分裂Boss，开启一段时间的刷怪减速期，方便玩家清理残余怪物
                        if (boss.type === BossType.SPLIT) {
                            // 40 秒内全局刷怪额外减速（延长减速时间）
                            gameState.splitSlowEndTime = Date.now() + 40000;
                        }
                        gameState.kills += boss.score;
                        gameState.bossKills++;
                        
                        // 根据BOSS击杀数确定经验值奖励
                        let bossExp = 0;
                        let targetLevel = 0; // 目标等级（0表示不强制升级）
                        
                        if (gameState.bossKills === 1) {
                            // BOSS 1: 100 XP，直接升到 Lv 6.5
                            bossExp = 100;
                            targetLevel = 6; // 升到6级，然后继续升级
                        } else if (gameState.bossKills === 2) {
                            // BOSS 2: 300 XP，直接升到 Lv 11
                            bossExp = 300;
                            targetLevel = 11;
                        } else if (gameState.bossKills === 3) {
                            // BOSS 3: 800 XP，直接冲过 Lv 16
                            bossExp = 800;
                            targetLevel = 16;
                        } else if (gameState.bossKills === 4) {
                            // BOSS 4: 2000 XP，直升 Lv 21
                            bossExp = 2000;
                            targetLevel = 21;
                        } else {
                            // 后续BOSS：根据当前等级给予经验值
                            bossExp = 100 * gameState.bossKills;
                        }
                        
                        gameState.experience += bossExp;
                        
                        // 如果指定了目标等级，直接升级到该等级
                        if (targetLevel > 0 && gameState.level < targetLevel) {
                            // 计算升级到目标等级所需的经验值
                            let totalExpNeeded = 0;
                            for (let l = gameState.level; l < targetLevel; l++) {
                                const reqExp = getRequiredExpForLevel(l);
                                if (reqExp > 0) {
                                    totalExpNeeded += reqExp;
                                }
                            }
                            
                            // 设置经验值，确保能升级到目标等级
                            const currentExpSinceLastUpgrade = gameState.experience - gameState.lastUpgradeExp;
                            
                            // 如果经验值足够，逐级升级到目标等级
                            if (currentExpSinceLastUpgrade >= totalExpNeeded) {
                                // 逐级升级，每级都显示升级选择界面
                                let currentLevel = gameState.level;
                                let remainingExp = currentExpSinceLastUpgrade;
                                while (currentLevel < targetLevel) {
                                    currentLevel++;
                                    const reqExp = getRequiredExpForLevel(currentLevel);
                                    
                                    // 升级到当前等级
                                    gameState.level = currentLevel;
                                    tank.upgradeLevel = currentLevel - 1;
                                    
                                    // 如果是正常等级（需要经验值），消耗经验值
                                    if (reqExp > 0) {
                                        remainingExp -= reqExp;
                                    }
                                    // 更新lastUpgradeExp（所有等级都要更新，包括BOSS掉落等级）
                                    gameState.lastUpgradeExp = gameState.experience - remainingExp;
                                    
                                    // 应用升级效果
                                    applyLevelUpgrades(currentLevel);
                                    
                                    // 显示升级选择界面（所有等级都显示）
                                    showUpgradeSelection();
                                    gameState.pendingUpgrade = true;
                                    break; // 一次只处理一个升级，等待玩家选择
                                }
                                // 如果已经升级到目标等级且还有剩余经验值，更新lastUpgradeExp
                                if (currentLevel >= targetLevel && remainingExp >= 0) {
                                    gameState.lastUpgradeExp = gameState.experience - remainingExp;
                                }
                            } else {
                                // 经验值不足，但先升级到能升级的最高等级
                                // 让checkUpgrade函数处理后续升级
                                checkUpgrade();
                            }
                        } else {
                            // 没有指定目标等级，正常检查升级
                            checkUpgrade();
                        }
                        
                        bosses.splice(j, 1);
                        // showUpgradeNotification('Boss被击败！');
                        // 如果还没有升级到目标等级，继续检查升级
                        if (targetLevel === 0 || gameState.level < targetLevel) {
                            checkUpgrade(); // 检查是否还能继续升级
                        }
                        checkBossSpawn(); // 检查是否需要生成Boss
                        checkWin();
                        updateUI();
                    }
                }
            }
            
            // 移除非活跃的激光
            if (!laser.isActive) {
                lasers.splice(i, 1);
            }
        }
        
        // 更新敌人子弹
        for (let enemyBullet of enemyBullets) {
            enemyBullet.update();
        }
        
        // 更新道具
        for (let item of items) {
            item.update();
        }
        
        // 碰撞检测
        checkCollisions();
        
        // 更新UI（包括血条）
        updateUI();
    }
    
    // 绘制
    tank.draw();
    for (let enemy of enemies) {
        enemy.draw();
    }
    for (let boss of bosses) {
        boss.draw();
    }
    
    // 绘制分裂Boss小坦克
    for (let minion of splitTankMinions) {
        minion.draw();
    }
    
    // 绘制小型坦克
    for (let miniTank of miniTanks) {
        miniTank.draw();
    }
    
    // 绘制Boss血条（在画面正上方中间，如果有Boss存在，像素风格）
    if (bosses.length > 0) {
        const boss = bosses[0]; // 只显示第一个Boss的血条
        const currentHp = Math.ceil(boss.displayHealth);
        const maxHp = boss.maxHealth;
        // 计算实际血条宽度（使用drawBossPixelHealthBar函数中的参数）
        // 装甲坦克使用3.75，使1500血量显示400像素（与其他boss一致）
        let pixelsPerHp = 10; // 默认每10点生命值1个像素（血条更大）
        if (boss.type === BossType.ARMOR) {
            pixelsPerHp = 3.75; // 装甲坦克：1500血量显示400像素
        }
        const displayMaxHp = Math.ceil(maxHp / pixelsPerHp);
        const pixelWidth = 0.8; // 与drawBossPixelHealthBar函数中的参数一致
        const pixelHeight = 8; // 与drawBossPixelHealthBar函数中的参数一致
        const gap = 0.15;
        const padding = 0.3;
        const barWidth = displayMaxHp * pixelWidth + (displayMaxHp - 1) * gap + padding * 2;
        const barX = CONFIG.canvasWidth / 2 - barWidth / 2;
        const barY = 20;
        drawBossPixelHealthBar(ctx, barX, barY, currentHp, maxHp, boss.isHit, pixelsPerHp);
        
        // 在血条下方显示Boss名字
        ctx.fillStyle = '#FFD700';
        ctx.font = 'bold 20px Arial'; // 字体增大
        ctx.textAlign = 'center';
        ctx.textBaseline = 'top';
        ctx.fillText(boss.name, CONFIG.canvasWidth / 2, barY + pixelHeight + padding * 2 + 8);
    }
    
    // 绘制Boss激光
    for (let laser of bossLasers) {
        laser.draw();
    }
    
    // 绘制玩家激光（在子弹之前绘制，使其更明显）
    for (let laser of lasers) {
        laser.draw();
    }
    
    for (let bullet of bullets) {
        bullet.draw();
    }
    
    // 绘制敌人子弹
    for (let enemyBullet of enemyBullets) {
        enemyBullet.draw();
    }
    
    // 绘制道具
    for (let item of items) {
        item.draw();
    }
    
    // 绘制准星
    drawCrosshair();
    
    // 绘制左上角UI（暂停键下方）
    if (gameState.started && gameState.running) {
        ctx.save();
        ctx.font = '18px Arial'; // 增大字体（从16px增加到18px）
        ctx.textAlign = 'left';
        ctx.textBaseline = 'top';
        
        const uiX = 10; // 距离左边缘10px
        const uiY1 = 70; // 第一行，暂停按钮下方（10 + 50 + 10），上移两行（从142减少到70）
        
        // 固定显示长度（像素数），确保血条和经验值条长度相同
        const fixedDisplayPixels = 30;
        const scale = 1.8;
        const pixelSize = 0.8 * scale;
        const gap = 0.15 * scale;
        const padding = 0.3 * scale;
        const barHeight = pixelSize + padding * 2; // 条的高度
        const fontSize = 18; // 字体大小
        const textCenterY = uiY1 + fontSize / 2; // 文本中心Y坐标
        const barCenterY = textCenterY; // 条的中心Y坐标（与文本中心对齐）
        const barY = barCenterY - barHeight / 2; // 条的顶部Y坐标
        
        // 第一行：HP文本（红色，不显示数字，只显示"HP:"）
        ctx.fillStyle = '#ff0000'; // 红色
        ctx.fillText('HP:', uiX, uiY1);
        
        // 第一行：HP血条（像素块形式，在HP文本右侧，与HP文本垂直居中对齐，使用红色）
        const hpTextWidth = ctx.measureText('HP:').width;
        const hpBarX = uiX + hpTextWidth + 5; // HP文本右侧5px间距
        const currentHp = Math.ceil(tank.displayHealth);
        const maxHp = tank.maxHealth;
        // 使用固定显示像素数，确保血条长度固定
        const pixelsPerHp = Math.max(1, Math.ceil(maxHp / fixedDisplayPixels));
        // 使用更大的血条（通过scale参数）和红色，与文本垂直居中对齐
        drawPixelHealthBarScaled(ctx, hpBarX, barY, currentHp, maxHp, false, tank.isHit, tank.isHeal, pixelsPerHp, scale, '#ff0000');
        
        // 第二行：等级和经验值
        const uiY2 = uiY1 + 26; // 第一行下方（从24增加到26以适应更大的字体）
        ctx.fillStyle = '#fff'; // 白色
        ctx.fillText('Lv:', uiX, uiY2);
        
        // 第二行：经验值条（像素块形式，在等级文本右侧，与等级文本垂直居中对齐，长度为血条的一半）
        const levelTextWidth = ctx.measureText('Lv:').width;
        const expBarX = uiX + levelTextWidth + 5; // 等级文本右侧5px间距
        const textCenterY2 = uiY2 + fontSize / 2; // 等级文本中心Y坐标
        const barCenterY2 = textCenterY2; // 条的中心Y坐标（与文本中心对齐）
        const expBarY = barCenterY2 - barHeight / 2; // 条的顶部Y坐标
        const experienceSinceLastUpgrade = gameState.experience - gameState.lastUpgradeExp;
        const requiredExp = getRequiredExpForLevel(gameState.level);
        // 经验值条长度为血条的一半
        const expDisplayPixels = Math.floor(fixedDisplayPixels / 2);
        
        // 如果requiredExp为0或Infinity，说明是BOSS掉落等级或已达到最大等级
        let displayCurrentExp = 0;
        if (requiredExp === 0 || requiredExp === Infinity) {
            // BOSS掉落等级或已达到最大等级，显示满条
            displayCurrentExp = expDisplayPixels;
        } else {
            // 将经验值映射到固定显示像素数（血条的一半）
            // 经验值范围是 0-requiredExp，需要映射到 0-expDisplayPixels
            const currentExp = Math.min(experienceSinceLastUpgrade, requiredExp);
            displayCurrentExp = Math.ceil((currentExp / requiredExp) * expDisplayPixels);
        }
        // 使用更大的经验条（通过scale参数），与文本垂直居中对齐
        drawPixelExpBarScaled(ctx, expBarX, expBarY, displayCurrentExp, expDisplayPixels, scale);
        
        ctx.restore();
    }
    
    // 绘制左下角UI（游戏时长和击杀数）
    if (gameState.started && gameState.running) {
        ctx.save();
        ctx.font = '14px Arial';
        ctx.fillStyle = '#fff';
        ctx.textAlign = 'left';
        ctx.textBaseline = 'bottom';
        
        // 计算游戏时长（排除暂停时间）
        let gameTime = 0;
        if (gameState.startTime) {
            const currentPauseTime = gameState.paused && gameState.pauseStartTime ? 
                (gameState.totalPauseTime + (Date.now() - gameState.pauseStartTime)) : 
                gameState.totalPauseTime;
            gameTime = Date.now() - gameState.startTime - currentPauseTime;
        }
        const seconds = Math.floor(gameTime / 1000);
        const minutes = Math.floor(seconds / 60);
        const displaySeconds = seconds % 60;
        const timeText = `时间: ${minutes}:${String(displaySeconds).padStart(2, '0')}`;
        const killsText = `击杀: ${gameState.kills}`;
        
        const bottomY = CONFIG.canvasHeight - 10;
        // 游戏时间显示为红色
        ctx.fillStyle = '#ff0000';
        ctx.fillText(timeText, 10, bottomY - 20);
        // 击杀数保持白色
        ctx.fillStyle = '#fff';
        ctx.fillText(killsText, 10, bottomY);
        
        ctx.restore();
    }
    
    requestAnimationFrame(gameLoop);
}

// 绘制准星
function drawCrosshair() {
    ctx.save();
    
    // 准星外圈
    ctx.strokeStyle = crosshair.isDragging ? '#FFD700' : '#4CAF50';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(crosshair.x, crosshair.y, crosshair.radius, 0, Math.PI * 2);
    ctx.stroke();
    
    // 准星内圈
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(crosshair.x, crosshair.y, crosshair.radius * 0.6, 0, Math.PI * 2);
    ctx.stroke();
    
    // 准星十字线
    ctx.strokeStyle = crosshair.isDragging ? '#FFD700' : '#4CAF50';
    ctx.lineWidth = 2;
    const lineLength = crosshair.radius * 0.8;
    
    // 水平线
    ctx.beginPath();
    ctx.moveTo(crosshair.x - lineLength, crosshair.y);
    ctx.lineTo(crosshair.x + lineLength, crosshair.y);
    ctx.stroke();
    
    // 垂直线
    ctx.beginPath();
    ctx.moveTo(crosshair.x, crosshair.y - lineLength);
    ctx.lineTo(crosshair.x, crosshair.y + lineLength);
    ctx.stroke();
    
    // 连接坦克和准星的线
    ctx.strokeStyle = 'rgba(76, 175, 80, 0.3)';
    ctx.lineWidth = 1;
    ctx.setLineDash([5, 5]);
    ctx.beginPath();
    ctx.moveTo(tank.x, tank.y);
    ctx.lineTo(crosshair.x, crosshair.y);
    ctx.stroke();
    ctx.setLineDash([]);
    
    ctx.restore();
}

// 虚拟摇杆事件处理
const joystickArea = document.getElementById('joystickArea');
const joystickHandle = document.getElementById('joystickHandle');

function updateJoystickPosition(clientX, clientY) {
    if (!joystickArea || !joystickHandle) return;
    
    const rect = joystickArea.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    const dx = clientX - centerX;
    const dy = clientY - centerY;
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    if (distance > joystickRadius) {
        const angle = Math.atan2(dy, dx);
        joystickInput.x = Math.cos(angle);
        joystickInput.y = Math.sin(angle);
    } else {
        joystickInput.x = dx / joystickRadius;
        joystickInput.y = dy / joystickRadius;
    }
    
    // 更新摇杆手柄位置
    const handleX = Math.max(-joystickRadius, Math.min(joystickRadius, dx));
    const handleY = Math.max(-joystickRadius, Math.min(joystickRadius, dy));
    joystickHandle.style.transform = `translate(calc(-50% + ${handleX}px), calc(-50% + ${handleY}px))`;
}

function resetJoystick() {
    joystickInput.x = 0;
    joystickInput.y = 0;
    joystickActive = false;
    if (joystickHandle) {
        joystickHandle.style.transform = 'translate(-50%, -50%)';
    }
}

// 鼠标事件
if (joystickArea) {
    joystickArea.addEventListener('mousedown', (e) => {
        joystickActive = true;
        updateJoystickPosition(e.clientX, e.clientY);
    });
}

document.addEventListener('mousemove', (e) => {
    if (joystickActive) {
        updateJoystickPosition(e.clientX, e.clientY);
    }
});

document.addEventListener('mouseup', () => {
    if (joystickActive) {
        resetJoystick();
    }
});

// 触摸事件
if (joystickArea) {
    joystickArea.addEventListener('touchstart', (e) => {
        e.preventDefault();
        joystickActive = true;
        const touch = e.touches[0];
        updateJoystickPosition(touch.clientX, touch.clientY);
    });
}

document.addEventListener('touchmove', (e) => {
    if (joystickActive) {
        e.preventDefault();
        const touch = e.touches[0];
        updateJoystickPosition(touch.clientX, touch.clientY);
    }
});

document.addEventListener('touchend', () => {
    if (joystickActive) {
        resetJoystick();
    }
});

// 暂停/恢复游戏
function togglePause() {
    if (!gameState.started) return; // 如果游戏未开始，不能暂停
    
    gameState.paused = !gameState.paused;
    const pauseButton = document.getElementById('pauseButton');
    const pauseOverlay = document.getElementById('pauseOverlay');
    
    if (gameState.paused) {
        // 暂停时停止BGM
        bgm.pause();
        gameState.pauseStartTime = Date.now(); // 记录暂停开始时间
        pauseButton.textContent = '▶';
        pauseButton.title = '继续游戏';
        if (pauseOverlay) {
            pauseOverlay.style.display = 'flex';
        }
    } else {
        // 恢复时重新播放BGM
        if (gameState.pauseStartTime) {
            gameState.totalPauseTime += Date.now() - gameState.pauseStartTime; // 累加暂停时间
            gameState.pauseStartTime = 0;
        }
        startBGM();
        pauseButton.textContent = '⏸';
        pauseButton.title = '暂停游戏';
        if (pauseOverlay) {
            pauseOverlay.style.display = 'none';
        }
    }
}

// 恢复游戏（通过恢复按钮）
function resumeGame() {
    if (!gameState.started) return;
    gameState.paused = false;
    
    // 累加暂停时间
    if (gameState.pauseStartTime) {
        gameState.totalPauseTime += Date.now() - gameState.pauseStartTime;
        gameState.pauseStartTime = 0;
    }
    
    const pauseButton = document.getElementById('pauseButton');
    const pauseOverlay = document.getElementById('pauseOverlay');
    
    // 恢复时重新播放BGM
    startBGM();
    
    if (pauseButton) {
        pauseButton.textContent = '⏸';
        pauseButton.title = '暂停游戏';
    }
    if (pauseOverlay) {
        pauseOverlay.style.display = 'none';
    }
}

// 初始化游戏（不自动开始）
initGame();
gameLoop();

// 绑定开始游戏按钮
// 开始游戏按钮
const startButton = document.getElementById('startButton');
if (startButton) {
    startButton.addEventListener('click', startGame);
}

// 绑定暂停按钮
const pauseButton = document.getElementById('pauseButton');
if (pauseButton) {
    pauseButton.addEventListener('click', togglePause);
}

// 绑定恢复游戏按钮
const resumeButton = document.getElementById('resumeButton');
if (resumeButton) {
    resumeButton.addEventListener('click', resumeGame);
}

