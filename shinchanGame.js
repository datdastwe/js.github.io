/**
 * 짱구의 슈퍼 모험 (Shin-chan Super Jump Adventure)
 * 마리오 스타일의 횡스크롤 플랫포머 게임
 * 짱구 캐릭터가 앞으로 달리며 동전과 초코비를 모으고 흰둥이를 구출합니다.
 */

// ==========================================
// 1. 오디오 합성기 (Web Audio API - 별도 파일 불필요)
// ==========================================
let audioCtx = null;

function initAudio() {
    if (!audioCtx) {
        const AudioContextClass = window.AudioContext || window.webkitAudioContext;
        if (AudioContextClass) {
            audioCtx = new AudioContextClass();
        }
    }
}

function playSound(type) {
    if (!audioCtx) return;
    try {
        const now = audioCtx.currentTime;

        if (type === 'jump') {
            // 통통 튀는 짱구 점프음
            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(160, now);
            osc.frequency.exponentialRampToValueAtTime(450, now + 0.18);
            gain.gain.setValueAtTime(0.2, now);
            gain.gain.exponentialRampToValueAtTime(0.01, now + 0.18);
            osc.connect(gain);
            gain.connect(audioCtx.destination);
            osc.start(now);
            osc.stop(now + 0.2);
        } else if (type === 'coin') {
            // 맑은 마리오 동전 소리 (B5 -> E6)
            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();
            osc.type = 'square';
            osc.frequency.setValueAtTime(987.77, now); // B5
            osc.frequency.setValueAtTime(1318.51, now + 0.08); // E6
            gain.gain.setValueAtTime(0.12, now);
            gain.gain.exponentialRampToValueAtTime(0.01, now + 0.35);
            osc.connect(gain);
            gain.connect(audioCtx.destination);
            osc.start(now);
            osc.stop(now + 0.35);
        } else if (type === 'chocobi') {
            // 초코비 획득 환호음 (파워업 사운드)
            [523.25, 659.25, 783.99, 1046.50].forEach((freq, idx) => {
                const osc = audioCtx.createOscillator();
                const gain = audioCtx.createGain();
                osc.type = 'triangle';
                osc.frequency.setValueAtTime(freq, now + idx * 0.06);
                gain.gain.setValueAtTime(0.15, now + idx * 0.06);
                gain.gain.exponentialRampToValueAtTime(0.01, now + idx * 0.06 + 0.2);
                osc.connect(gain);
                gain.connect(audioCtx.destination);
                osc.start(now + idx * 0.06);
                osc.stop(now + idx * 0.06 + 0.25);
            });
        } else if (type === 'stomp') {
            // 몬스터 밟기 사운드
            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(220, now);
            osc.frequency.exponentialRampToValueAtTime(80, now + 0.15);
            gain.gain.setValueAtTime(0.25, now);
            gain.gain.exponentialRampToValueAtTime(0.01, now + 0.15);
            osc.connect(gain);
            gain.connect(audioCtx.destination);
            osc.start(now);
            osc.stop(now + 0.16);
        } else if (type === 'block') {
            // 머리로 블록 부딪히기
            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();
            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(120, now);
            osc.frequency.exponentialRampToValueAtTime(60, now + 0.1);
            gain.gain.setValueAtTime(0.2, now);
            gain.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
            osc.connect(gain);
            gain.connect(audioCtx.destination);
            osc.start(now);
            osc.stop(now + 0.12);
        } else if (type === 'hurt') {
            // 부상 소리
            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();
            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(320, now);
            osc.frequency.exponentialRampToValueAtTime(100, now + 0.25);
            gain.gain.setValueAtTime(0.25, now);
            gain.gain.exponentialRampToValueAtTime(0.01, now + 0.25);
            osc.connect(gain);
            gain.connect(audioCtx.destination);
            osc.start(now);
            osc.stop(now + 0.26);
        } else if (type === 'clear') {
            // 스테이지 클리어 팡파레
            [523.25, 659.25, 783.99, 1046.50, 1318.51].forEach((freq, idx) => {
                const osc = audioCtx.createOscillator();
                const gain = audioCtx.createGain();
                osc.type = 'triangle';
                osc.frequency.setValueAtTime(freq, now + idx * 0.12);
                gain.gain.setValueAtTime(0.2, now + idx * 0.12);
                gain.gain.exponentialRampToValueAtTime(0.01, now + idx * 0.12 + 0.4);
                osc.connect(gain);
                gain.connect(audioCtx.destination);
                osc.start(now + idx * 0.12);
                osc.stop(now + idx * 0.12 + 0.5);
            });
        }
    } catch (e) {
        console.error(e);
    }
}

// ==========================================
// 2. 캔버스 및 게임 상수
// ==========================================
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const CANVAS_WIDTH = 850;
const CANVAS_HEIGHT = 480;
const LEVEL_WIDTH = 3800; // 전체 맵 가로 길이 (3.8km 모험)

// 물리 상수
const GRAVITY = 0.52;
const MOVE_SPEED = 4.2;
const JUMP_FORCE = -12.5;

// 게임 상태
let gameState = 'START'; // 'START', 'PLAYING', 'GAMEOVER', 'CLEAR'
let score = 0;
let coins = 0;
let lives = 3;
let timeLeft = 300;
let timerInterval = null;
let cameraX = 0;

// 입력 상태
const keys = {
    left: false,
    right: false,
    up: false
};

// DOM HUD
const hudScore = document.getElementById('hud-score');
const hudCoins = document.getElementById('hud-coins');
const hudLives = document.getElementById('hud-lives');
const hudTime = document.getElementById('hud-time');
const startScreen = document.getElementById('start-screen');
const gameoverScreen = document.getElementById('gameover-screen');
const clearScreen = document.getElementById('clear-screen');
const overScore = document.getElementById('over-score');
const overCoins = document.getElementById('over-coins');
const clearScore = document.getElementById('clear-score');
const clearBonus = document.getElementById('clear-bonus');

// ==========================================
// 3. 짱구(Player) 오브젝트 및 캔버스 렌더러
// ==========================================
const player = {
    x: 80,
    y: 300,
    w: 36,
    h: 46,
    vx: 0,
    vy: 0,
    isGrounded: false,
    facing: 1, // 1: 오른쪽, -1: 왼쪽
    walkTimer: 0,
    invincibleTimer: 0,

    reset() {
        this.x = 80;
        this.y = 300;
        this.vx = 0;
        this.vy = 0;
        this.isGrounded = false;
        this.facing = 1;
        this.walkTimer = 0;
        this.invincibleTimer = 0;
    },

    update() {
        // 좌우 입력 처리
        if (keys.left) {
            this.vx = -MOVE_SPEED;
            this.facing = -1;
            this.walkTimer += 0.25;
        } else if (keys.right) {
            this.vx = MOVE_SPEED;
            this.facing = 1;
            this.walkTimer += 0.25;
        } else {
            this.vx *= 0.8;
            if (Math.abs(this.vx) < 0.1) this.vx = 0;
        }

        // 점프
        if (keys.up && this.isGrounded) {
            this.vy = JUMP_FORCE;
            this.isGrounded = false;
            playSound('jump');
            createParticles(this.x + this.w / 2, this.y + this.h, 6, '#e2e8f0');
        }

        // 중력 적용
        this.vy += GRAVITY;
        if (this.vy > 12) this.vy = 12;

        // 위치 갱신
        this.x += this.vx;
        this.checkHorizontalCollisions();

        this.y += this.vy;
        this.isGrounded = false;
        this.checkVerticalCollisions();

        // 맵 좌측 경계 제한
        if (this.x < 0) this.x = 0;

        // 무적 시간 감소
        if (this.invincibleTimer > 0) {
            this.invincibleTimer--;
        }

        // 낭떠러지 추락 사망
        if (this.y > CANVAS_HEIGHT + 60) {
            this.takeDamage(true);
        }
    },

    checkHorizontalCollisions() {
        for (let block of levelBlocks) {
            if (isColliding(this, block)) {
                if (this.vx > 0) {
                    this.x = block.x - this.w;
                } else if (this.vx < 0) {
                    this.x = block.x + block.w;
                }
                this.vx = 0;
            }
        }
    },

    checkVerticalCollisions() {
        for (let block of levelBlocks) {
            if (isColliding(this, block)) {
                if (this.vy > 0) {
                    // 바닥 착지
                    this.y = block.y - this.h;
                    this.vy = 0;
                    this.isGrounded = true;
                } else if (this.vy < 0) {
                    // 머리로 블록 치기 (마리오 핵심 메커니즘!)
                    this.y = block.y + block.h;
                    this.vy = 0;
                    block.bump();
                }
            }
        }
    },

    takeDamage(instantKill = false) {
        if (this.invincibleTimer > 0 && !instantKill) return;

        playSound('hurt');
        lives--;
        updateHUD();

        if (lives <= 0 || instantKill) {
            endGame(false);
        } else {
            this.invincibleTimer = 90; // 약 1.5초 무적 점멸
            this.vy = -8; // 통 튕김
        }
    },

    // 짱구의 특징(짱구볼, 두꺼운 눈썹, 빨간티, 노란바지)을 캔버스 2D로 정밀 묘사
    draw() {
        if (this.invincibleTimer > 0 && Math.floor(this.invincibleTimer / 6) % 2 === 0) {
            return; // 무적 점멸 효과
        }

        ctx.save();
        ctx.translate(this.x + this.w / 2 - cameraX, this.y + this.h / 2);
        ctx.scale(this.facing, 1);

        const isJumping = !this.isGrounded;
        const legSwing = isJumping ? 0.3 : Math.sin(this.walkTimer) * 0.45;

        // 1) 다리 및 신발 (흰 양말 + 파란 운동화)
        ctx.fillStyle = '#ffffff'; // 양말
        // 뒷다리
        ctx.save();
        ctx.translate(-5, 12);
        ctx.rotate(-legSwing);
        ctx.fillRect(-3, 0, 6, 8);
        ctx.fillStyle = '#2563eb'; // 파란 운동화
        ctx.fillRect(-4, 7, 9, 5);
        ctx.restore();

        // 앞다리
        ctx.save();
        ctx.translate(5, 12);
        ctx.rotate(legSwing);
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(-3, 0, 6, 8);
        ctx.fillStyle = '#2563eb';
        ctx.fillRect(-3, 7, 9, 5);
        ctx.restore();

        // 2) 노란 반바지 (짱구 시그니처!)
        ctx.fillStyle = '#facc15';
        ctx.beginPath();
        ctx.roundRect(-10, 6, 20, 10, 3);
        ctx.fill();

        // 3) 빨간색 반팔 티셔츠 (짱구 시그니처!)
        ctx.fillStyle = '#ef4444';
        ctx.beginPath();
        ctx.roundRect(-11, -8, 22, 16, 4);
        ctx.fill();

        // 팔 (달리기 / 점프 애니메이션)
        ctx.fillStyle = '#fed7aa'; // 피부색
        ctx.save();
        if (isJumping) {
            // 점프 시 양팔 만세
            ctx.fillRect(8, -14, 5, 12);
        } else {
            // 달릴 때 팔 흔들기
            ctx.translate(6, -2);
            ctx.rotate(-legSwing * 1.2);
            ctx.fillRect(-2, 0, 5, 10);
        }
        ctx.restore();

        // 4) 짱구 얼굴 & 볼록한 짱구 볼 (감자머리 특유의 실루엣)
        ctx.fillStyle = '#fed7aa'; // 피부톤
        ctx.beginPath();
        // 뒤통수 -> 턱 -> 툭 튀어나온 짱구 볼살 곡선
        ctx.arc(-2, -14, 13, Math.PI * 0.5, Math.PI * 1.5, false);
        ctx.bezierCurveTo(4, -28, 14, -24, 15, -16); // 이마
        ctx.bezierCurveTo(17, -13, 16, -7, 10, -5);  // 볼살 뽈록
        ctx.bezierCurveTo(4, -2, -2, -3, -2, -1);   // 턱선
        ctx.closePath();
        ctx.fill();

        // 짱구 귀
        ctx.fillStyle = '#fdba74';
        ctx.beginPath();
        ctx.arc(-8, -13, 3.5, 0, Math.PI * 2);
        ctx.fill();

        // 5) 까만 짱구 머리카락 (스포츠 까까머리)
        ctx.fillStyle = '#171717';
        ctx.beginPath();
        ctx.arc(-2, -15, 13.5, Math.PI * 0.9, Math.PI * 1.85, false);
        ctx.fill();

        // 6) 짱구의 상징: 굵고 짙은 송충이 눈썹!
        ctx.fillStyle = '#000000';
        ctx.beginPath();
        ctx.ellipse(7, -19, 5, 2.8, Math.PI * 0.12, 0, Math.PI * 2);
        ctx.fill();

        // 7) 크고 맑은 눈 & 동공
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.ellipse(8, -13, 3.5, 4.5, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#000000';
        ctx.beginPath();
        ctx.arc(9.5, -13, 2.5, 0, Math.PI * 2);
        ctx.fill();
        // 눈 하이라이트
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(10.5, -14, 1, 0, Math.PI * 2);
        ctx.fill();

        // 귀여운 입
        ctx.strokeStyle = '#dc2626';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.arc(9, -7, 2.5, 0, Math.PI);
        ctx.stroke();

        ctx.restore();
    }
};

// ==========================================
// 4. 레벨 요소 (블록, 동전, 초코비, 악당, 흰둥이 집)
// ==========================================
let levelBlocks = [];
let coinsList = [];
let chocobisList = [];
let enemiesList = [];
let particles = [];
let shiroHouse = null;

class Block {
    constructor(x, y, w, h, type = 'brick', content = 'empty') {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.type = type; // 'ground', 'brick', 'question', 'pipe'
        this.content = content; // 'empty', 'coin', 'chocobi'
        this.isHit = false;
        this.bumpY = 0;
    }

    bump() {
        if (this.type === 'ground' || this.type === 'pipe' || this.isHit) {
            playSound('block');
            return;
        }

        playSound('block');
        this.bumpY = -8;
        createParticles(this.x + this.w / 2, this.y, 4, '#fbbf24');

        if (this.type === 'question') {
            this.isHit = true;
            if (this.content === 'coin') {
                score += 100;
                coins++;
                playSound('coin');
                spawnCoinPop(this.x + this.w / 2 - 8, this.y - 28);
            } else if (this.content === 'chocobi') {
                score += 500;
                playSound('chocobi');
                spawnChocobi(this.x + this.w / 2 - 14, this.y - 36);
            }
            updateHUD();
        }
    }

    update() {
        if (this.bumpY < 0) {
            this.bumpY += 1.5;
            if (this.bumpY > 0) this.bumpY = 0;
        }
    }

    draw() {
        const renderY = this.y + this.bumpY;
        if (this.x + this.w - cameraX < -50 || this.x - cameraX > CANVAS_WIDTH + 50) return;

        if (this.type === 'ground') {
            // 녹색 풀밭 지형
            ctx.fillStyle = '#22c55e';
            ctx.fillRect(this.x - cameraX, renderY, this.w, 8);
            ctx.fillStyle = '#854d0e';
            ctx.fillRect(this.x - cameraX, renderY + 8, this.w, this.h - 8);
            // 흙 블록 줄무늬 패턴
            ctx.strokeStyle = '#713f12';
            ctx.strokeRect(this.x - cameraX, renderY + 8, this.w, this.h - 8);
        } else if (this.type === 'brick') {
            // 벽돌 블록
            ctx.fillStyle = '#b45309';
            ctx.fillRect(this.x - cameraX, renderY, this.w, this.h);
            ctx.strokeStyle = '#000000';
            ctx.lineWidth = 2;
            ctx.strokeRect(this.x - cameraX, renderY, this.w, this.h);
            // 벽돌 무늬
            ctx.fillStyle = '#d97706';
            ctx.fillRect(this.x - cameraX + 3, renderY + 3, this.w - 6, this.h / 2 - 4);
        } else if (this.type === 'question') {
            // 물음표 아이템 블록
            ctx.fillStyle = this.isHit ? '#64748b' : '#facc15';
            ctx.fillRect(this.x - cameraX, renderY, this.w, this.h);
            ctx.strokeStyle = '#000000';
            ctx.lineWidth = 2;
            ctx.strokeRect(this.x - cameraX, renderY, this.w, this.h);

            // ? 글자
            ctx.fillStyle = '#000000';
            ctx.font = 'bold 20px Jua';
            ctx.textAlign = 'center';
            ctx.fillText(this.isHit ? '•' : '?', this.x + this.w / 2 - cameraX, renderY + this.h - 9);
        } else if (this.type === 'pipe') {
            // 초록색 워프 파이프
            ctx.fillStyle = '#16a34a';
            ctx.fillRect(this.x - cameraX, renderY, this.w, this.h);
            ctx.strokeStyle = '#000000';
            ctx.lineWidth = 2.5;
            ctx.strokeRect(this.x - cameraX, renderY, this.w, this.h);
            // 파이프 림
            ctx.fillStyle = '#22c55e';
            ctx.fillRect(this.x - cameraX - 4, renderY, this.w + 8, 16);
            ctx.strokeRect(this.x - cameraX - 4, renderY, this.w + 8, 16);
        }
    }
}

class Coin {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.w = 18;
        this.h = 24;
        this.isCollected = false;
        this.animTimer = Math.random() * Math.PI;
    }

    update() {
        this.animTimer += 0.08;
    }

    draw() {
        if (this.isCollected) return;
        const scaleX = Math.abs(Math.sin(this.animTimer));
        const cx = this.x + this.w / 2 - cameraX;
        const cy = this.y + this.h / 2;

        ctx.save();
        ctx.translate(cx, cy);
        ctx.scale(Math.max(0.15, scaleX), 1);

        // 황금빛 동전
        ctx.fillStyle = '#facc15';
        ctx.beginPath();
        ctx.ellipse(0, 0, 9, 12, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#b45309';
        ctx.lineWidth = 2;
        ctx.stroke();

        ctx.fillStyle = '#fef08a';
        ctx.fillRect(-2, -6, 4, 12);
        ctx.restore();
    }
}

class Chocobi {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.w = 28;
        this.h = 32;
        this.vy = -5;
        this.isCollected = false;
    }

    update() {
        if (this.vy < 0) {
            this.y += this.vy;
            this.vy += 0.3;
        }
    }

    draw() {
        if (this.isCollected) return;
        // 짱구가 가장 좋아하는 분홍색 초코비 상자
        ctx.save();
        ctx.translate(this.x - cameraX, this.y);

        ctx.fillStyle = '#ec4899'; // 핑크 상자
        ctx.beginPath();
        ctx.roundRect(0, 0, this.w, this.h, 4);
        ctx.fill();
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 2;
        ctx.stroke();

        // 악어공룡 와니야마상 그린 스타
        ctx.fillStyle = '#4ade80';
        ctx.beginPath();
        ctx.arc(this.w / 2, this.h / 2 - 2, 7, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 9px Jua';
        ctx.textAlign = 'center';
        ctx.fillText('초코비', this.w / 2, this.h - 5);
        ctx.restore();
    }
}

class Enemy {
    constructor(x, y, patrolDistance = 140) {
        this.x = x;
        this.y = y;
        this.w = 34;
        this.h = 32;
        this.startX = x;
        this.patrolDistance = patrolDistance;
        this.vx = 1.3;
        this.isAlive = true;
        this.squashTimer = 0;
    }

    update() {
        if (!this.isAlive) return;

        this.x += this.vx;
        if (this.x > this.startX + this.patrolDistance) {
            this.vx = -Math.abs(this.vx);
        } else if (this.x < this.startX) {
            this.vx = Math.abs(this.vx);
        }
    }

    draw() {
        const renderX = this.x - cameraX;
        if (renderX < -60 || renderX > CANVAS_WIDTH + 60) return;

        ctx.save();
        ctx.translate(renderX + this.w / 2, this.y + this.h / 2);

        if (!this.isAlive) {
            // 밟혀서 납작해진 애니메이션
            ctx.scale(1.4, 0.25);
            ctx.fillStyle = '#15803d';
            ctx.beginPath();
            ctx.arc(0, 0, 16, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
            return;
        }

        ctx.scale(this.vx > 0 ? 1 : -1, 1);

        // 초록 악어공룡 (와니야마상 모티브)
        ctx.fillStyle = '#22c55e';
        ctx.beginPath();
        ctx.arc(0, 0, 15, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 2;
        ctx.stroke();

        // 뾰족한 이빨
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.moveTo(8, -2);
        ctx.lineTo(13, 1);
        ctx.lineTo(8, 4);
        ctx.fill();

        // 몬스터 눈
        ctx.fillStyle = '#fef08a';
        ctx.beginPath();
        ctx.arc(4, -6, 4, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#000000';
        ctx.beginPath();
        ctx.arc(5, -6, 2, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
    }
}

class ShiroHouse {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.w = 90;
        this.h = 80;
        this.tailAngle = 0;
    }

    update() {
        this.tailAngle += 0.2;
    }

    draw() {
        const rx = this.x - cameraX;
        ctx.save();
        ctx.translate(rx, this.y);

        // 1) 흰둥이 개집 (하늘색 지붕 + 나무집)
        ctx.fillStyle = '#fbbf24'; // 집 벽
        ctx.fillRect(0, 20, 65, 60);
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 2.5;
        ctx.strokeRect(0, 20, 65, 60);

        // 삼각형 파란 지붕
        ctx.fillStyle = '#38bdf8';
        ctx.beginPath();
        ctx.moveTo(-8, 22);
        ctx.lineTo(32, -8);
        ctx.lineTo(73, 22);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // 입구 구멍
        ctx.fillStyle = '#1e293b';
        ctx.beginPath();
        ctx.arc(32, 50, 16, Math.PI, 0, false);
        ctx.rect(16, 50, 32, 30);
        ctx.fill();

        // 2) 신나서 꼬리 흔드는 흰둥이 (Shiro) 캐릭터
        const sx = 78;
        const sy = 55;
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(sx, sy, 14, 0, Math.PI * 2); // 흰둥이 몸
        ctx.fill();
        ctx.stroke();

        // 꼬리 흔들기
        ctx.save();
        ctx.translate(sx + 12, sy);
        ctx.rotate(Math.sin(this.tailAngle) * 0.6);
        ctx.fillRect(0, -2, 8, 4);
        ctx.restore();

        // 흰둥이 얼굴
        ctx.beginPath();
        ctx.arc(sx - 8, sy - 6, 12, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        // 귀
        ctx.fillStyle = '#e2e8f0';
        ctx.beginPath();
        ctx.ellipse(sx - 12, sy - 16, 4, 7, -0.3, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        // 까만 코
        ctx.fillStyle = '#000000';
        ctx.beginPath();
        ctx.arc(sx - 16, sy - 5, 2.5, 0, Math.PI * 2);
        ctx.fill();

        // 눈
        ctx.beginPath();
        ctx.arc(sx - 9, sy - 8, 2, 0, Math.PI * 2);
        ctx.fill();

        // '흰둥이' 팻말
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 12px Jua';
        ctx.fillText('흰둥이 집 🐶', 5, 12);

        ctx.restore();
    }
}

function createParticles(x, y, count, color) {
    for (let i = 0; i < count; i++) {
        particles.push({
            x,
            y,
            vx: (Math.random() - 0.5) * 5,
            vy: (Math.random() - 0.8) * 6,
            size: Math.random() * 4 + 3,
            color,
            life: 30
        });
    }
}

function spawnCoinPop(x, y) {
    coinsList.push(new Coin(x, y));
    createParticles(x + 9, y + 12, 8, '#facc15');
}

function spawnChocobi(x, y) {
    chocobisList.push(new Chocobi(x, y));
    createParticles(x + 14, y + 16, 10, '#ec4899');
}

// 충돌 감지 헬퍼 (AABB)
function isColliding(rect1, rect2) {
    return (
        rect1.x < rect2.x + rect2.w &&
        rect1.x + rect1.w > rect2.x &&
        rect1.y < rect2.y + rect2.h &&
        rect1.y + rect1.h > rect2.y
    );
}

// ==========================================
// 5. 스테이지 빌더 (풍부한 떡잎마을 레벨 구성)
// ==========================================
function buildLevel() {
    levelBlocks = [];
    coinsList = [];
    chocobisList = [];
    enemiesList = [];
    particles = [];

    // 바닥 지형 (중간중간 점프해야 하는 함정 구덩이 배치)
    levelBlocks.push(new Block(0, 410, 850, 70, 'ground'));
    levelBlocks.push(new Block(940, 410, 680, 70, 'ground'));
    levelBlocks.push(new Block(1720, 410, 800, 70, 'ground'));
    levelBlocks.push(new Block(2620, 410, 1200, 70, 'ground'));

    // 파이프 장애물
    levelBlocks.push(new Block(380, 345, 52, 65, 'pipe'));
    levelBlocks.push(new Block(750, 320, 52, 90, 'pipe'));
    levelBlocks.push(new Block(1350, 335, 52, 75, 'pipe'));
    levelBlocks.push(new Block(2150, 310, 52, 100, 'pipe'));
    levelBlocks.push(new Block(2950, 335, 52, 75, 'pipe'));

    // 공중 물음표 & 벽돌 블록 세트 1
    levelBlocks.push(new Block(260, 290, 36, 36, 'question', 'coin'));
    levelBlocks.push(new Block(296, 290, 36, 36, 'brick'));
    levelBlocks.push(new Block(332, 290, 36, 36, 'question', 'chocobi')); // 첫번째 초코비!
    levelBlocks.push(new Block(368, 290, 36, 36, 'brick'));

    // 높은 공중 벽돌 세트 2
    levelBlocks.push(new Block(520, 200, 36, 36, 'brick'));
    levelBlocks.push(new Block(556, 200, 36, 36, 'question', 'coin'));
    levelBlocks.push(new Block(592, 200, 36, 36, 'brick'));

    // 구덩이 위 징검다리 발판
    levelBlocks.push(new Block(860, 340, 60, 24, 'brick'));
    levelBlocks.push(new Block(1640, 330, 60, 24, 'brick'));
    levelBlocks.push(new Block(2540, 320, 60, 24, 'brick'));

    // 중반부 챌린지 블록 세트 3
    levelBlocks.push(new Block(1120, 290, 36, 36, 'brick'));
    levelBlocks.push(new Block(1156, 290, 36, 36, 'question', 'coin'));
    levelBlocks.push(new Block(1192, 290, 36, 36, 'question', 'chocobi'));
    levelBlocks.push(new Block(1228, 290, 36, 36, 'brick'));

    // 계단형 피라미드 블록 구조물
    for (let i = 0; i < 4; i++) {
        for (let j = 0; j <= i; j++) {
            levelBlocks.push(new Block(1850 + i * 36, 410 - (j + 1) * 36, 36, 36, 'brick'));
        }
    }

    // 후반부 챌린지 블록 세트 4
    levelBlocks.push(new Block(2350, 260, 36, 36, 'question', 'coin'));
    levelBlocks.push(new Block(2386, 260, 36, 36, 'question', 'chocobi'));
    levelBlocks.push(new Block(2422, 260, 36, 36, 'question', 'coin'));

    // 필드에 배치된 반짝이는 황금 동전들
    const coinCoords = [
        [180, 360], [210, 360], [240, 360],
        [470, 360], [500, 360],
        [520, 160], [556, 160], [592, 160],
        [1020, 360], [1050, 360], [1080, 360],
        [1450, 360], [1480, 360], [1510, 360],
        [1900, 220], [1936, 180], [1972, 140],
        [2240, 360], [2280, 360],
        [2700, 360], [2730, 360], [2760, 360],
        [3100, 360], [3140, 360], [3180, 360]
    ];
    coinCoords.forEach(([cx, cy]) => coinsList.push(new Coin(cx, cy)));

    // 순찰하는 악어 몬스터 배치
    enemiesList.push(new Enemy(480, 378, 160));
    enemiesList.push(new Enemy(1020, 378, 180));
    enemiesList.push(new Enemy(1420, 378, 150));
    enemiesList.push(new Enemy(2220, 378, 200));
    enemiesList.push(new Enemy(2750, 378, 180));
    enemiesList.push(new Enemy(3050, 378, 160));

    // 골인 지점: 흰둥이 집
    shiroHouse = new ShiroHouse(3620, 330);
}

// ==========================================
// 6. 메인 게임 루프 & 업데이트
// ==========================================
function update() {
    if (gameState !== 'PLAYING') return;

    player.update();

    // 카메라 추적 (짱구를 중앙에 배치)
    const targetCameraX = player.x - CANVAS_WIDTH * 0.38;
    cameraX += (targetCameraX - cameraX) * 0.1;
    if (cameraX < 0) cameraX = 0;
    if (cameraX > LEVEL_WIDTH - CANVAS_WIDTH) cameraX = LEVEL_WIDTH - CANVAS_WIDTH;

    // 블록 업데이트
    levelBlocks.forEach(b => b.update());

    // 동전 수집 판정
    coinsList.forEach(c => {
        if (!c.isCollected && isColliding(player, c)) {
            c.isCollected = true;
            score += 100;
            coins++;
            playSound('coin');
            createParticles(c.x + 9, c.y + 12, 6, '#facc15');
            updateHUD();
        }
        c.update();
    });

    // 초코비 수집 판정
    chocobisList.forEach(ch => {
        if (!ch.isCollected && isColliding(player, ch)) {
            ch.isCollected = true;
            score += 500;
            playSound('chocobi');
            createParticles(ch.x + 14, ch.y + 16, 12, '#ec4899');
            updateHUD();
        }
        ch.update();
    });

    // 적 업데이트 및 충돌 판정
    enemiesList.forEach(e => {
        if (!e.isAlive) return;
        e.update();

        if (isColliding(player, e)) {
            // 마리오처럼 위에서 밟았을 때!
            if (player.vy > 0 && player.y + player.h - player.vy <= e.y + 12) {
                e.isAlive = false;
                player.vy = JUMP_FORCE * 0.75; // 통 튕겨오름
                score += 200;
                playSound('stomp');
                createParticles(e.x + e.w / 2, e.y + e.h / 2, 8, '#22c55e');
                updateHUD();
            } else {
                // 옆이나 아래서 부딪힘: 데미지
                player.takeDamage();
            }
        }
    });

    // 파티클 업데이트
    for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.2;
        p.life--;
        if (p.life <= 0) {
            particles.splice(i, 1);
        }
    }

    // 골인(흰둥이 집 도달) 판정
    if (shiroHouse) {
        shiroHouse.update();
        if (player.x + player.w >= shiroHouse.x + 20) {
            endGame(true);
        }
    }
}

// 캔버스 드로잉
function render() {
    // 1) 파란 하늘 배경
    ctx.fillStyle = '#5c94fc';
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // 2) 패럴랙스 구름과 떡잎마을 언덕
    renderBackgroundParallax();

    // 3) 레벨 블록들
    levelBlocks.forEach(b => b.draw());

    // 4) 동전 및 초코비
    coinsList.forEach(c => c.draw());
    chocobisList.forEach(ch => ch.draw());

    // 5) 흰둥이 집
    if (shiroHouse) shiroHouse.draw();

    // 6) 적 몬스터
    enemiesList.forEach(e => e.draw());

    // 7) 짱구 플레이어
    player.draw();

    // 8) 파티클
    particles.forEach(p => {
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x - cameraX, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
    });
}

function renderBackgroundParallax() {
    // 뭉게구름 (원거리 패럴랙스)
    ctx.fillStyle = 'rgba(255, 255, 255, 0.75)';
    const cloudOffset = cameraX * 0.2;
    [
        [200, 80, 50], [600, 110, 65], [1100, 70, 45],
        [1600, 100, 60], [2100, 85, 55], [2600, 115, 65],
        [3100, 75, 45], [3600, 95, 55]
    ].forEach(([cx, cy, r]) => {
        const rx = cx - cloudOffset;
        if (rx > -100 && rx < CANVAS_WIDTH + 100) {
            ctx.beginPath();
            ctx.arc(rx, cy, r, 0, Math.PI * 2);
            ctx.arc(rx + r * 0.6, cy - 10, r * 0.7, 0, Math.PI * 2);
            ctx.arc(rx - r * 0.6, cy - 5, r * 0.65, 0, Math.PI * 2);
            ctx.fill();
        }
    });

    // 원경 푸른 언덕 (중거리 패럴랙스)
    ctx.fillStyle = '#86efac';
    const hillOffset = cameraX * 0.45;
    [
        [300, 410, 220], [850, 410, 260], [1500, 410, 230],
        [2100, 410, 280], [2800, 410, 240], [3500, 410, 270]
    ].forEach(([hx, hy, hr]) => {
        const rx = hx - hillOffset;
        if (rx > -300 && rx < CANVAS_WIDTH + 300) {
            ctx.beginPath();
            ctx.arc(rx, hy, hr, Math.PI, 0, false);
            ctx.fill();
        }
    });
}

function gameLoop() {
    update();
    render();
    requestAnimationFrame(gameLoop);
}

// ==========================================
// 7. 게임 상태 제어 (시작, 게임오버, 클리어)
// ==========================================
function startGame() {
    initAudio();
    gameState = 'PLAYING';
    score = 0;
    coins = 0;
    lives = 3;
    timeLeft = 300;
    cameraX = 0;

    startScreen.classList.remove('active');
    gameoverScreen.classList.remove('active');
    clearScreen.classList.remove('active');

    buildLevel();
    player.reset();
    updateHUD();

    clearInterval(timerInterval);
    timerInterval = setInterval(() => {
        if (gameState === 'PLAYING') {
            timeLeft--;
            hudTime.textContent = String(timeLeft).padStart(3, '0');
            if (timeLeft <= 0) {
                endGame(false);
            }
        }
    }, 1000);
}

function endGame(isClear) {
    gameState = isClear ? 'CLEAR' : 'GAMEOVER';
    clearInterval(timerInterval);

    if (isClear) {
        playSound('clear');
        const timeBonus = timeLeft * 10;
        score += timeBonus;
        clearScore.textContent = `${score}점`;
        clearBonus.textContent = `+${timeBonus}점`;
        clearScreen.classList.add('active');
    } else {
        playSound('hurt');
        overScore.textContent = `${score}점`;
        overCoins.textContent = `${coins}`;
        gameoverScreen.classList.add('active');
    }
}

function updateHUD() {
    hudScore.textContent = String(score).padStart(6, '0');
    hudCoins.textContent = `× ${String(coins).padStart(2, '0')}`;
    let hearts = '';
    for (let i = 0; i < lives; i++) hearts += '♥';
    hudLives.textContent = hearts || '💀';
}

// ==========================================
// 8. 입력 이벤트 리스너 (키보드 + 모바일 터치)
// ==========================================
window.addEventListener('keydown', (e) => {
    initAudio();
    if (gameState === 'START' && e.code === 'Enter') {
        startGame();
        return;
    }

    if (e.code === 'ArrowLeft' || e.code === 'KeyA') {
        keys.left = true;
    }
    if (e.code === 'ArrowRight' || e.code === 'KeyD') {
        keys.right = true;
    }
    if (e.code === 'ArrowUp' || e.code === 'KeyW' || e.code === 'Space') {
        keys.up = true;
        e.preventDefault();
    }
});

window.addEventListener('keyup', (e) => {
    if (e.code === 'ArrowLeft' || e.code === 'KeyA') {
        keys.left = false;
    }
    if (e.code === 'ArrowRight' || e.code === 'KeyD') {
        keys.right = false;
    }
    if (e.code === 'ArrowUp' || e.code === 'KeyW' || e.code === 'Space') {
        keys.up = false;
    }
});

// 버튼 클릭 이벤트
document.getElementById('btn-start').addEventListener('click', startGame);
document.getElementById('btn-restart').addEventListener('click', startGame);
document.getElementById('btn-clear-restart').addEventListener('click', startGame);

// 모바일 가상 패드 터치 이벤트
const btnLeft = document.getElementById('btn-left');
const btnRight = document.getElementById('btn-right');
const btnJump = document.getElementById('btn-jump');

btnLeft.addEventListener('touchstart', (e) => { e.preventDefault(); keys.left = true; });
btnLeft.addEventListener('touchend', (e) => { e.preventDefault(); keys.left = false; });
btnRight.addEventListener('touchstart', (e) => { e.preventDefault(); keys.right = true; });
btnRight.addEventListener('touchend', (e) => { e.preventDefault(); keys.right = false; });
btnJump.addEventListener('touchstart', (e) => { e.preventDefault(); keys.up = true; });
btnJump.addEventListener('touchend', (e) => { e.preventDefault(); keys.up = false; });

// 초기 루프 실행
document.addEventListener('DOMContentLoaded', () => {
    buildLevel();
    updateHUD();
    requestAnimationFrame(gameLoop);
});

