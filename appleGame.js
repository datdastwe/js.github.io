/**
 * 사과게임 (Apple Game / Make 10!)
 * 드래그하여 상자 안 사과들의 숫자 합이 10이 되면 사과를 제거하는 게임입니다.
 */

// 게임 설정 상수
const ROWS = 10;
const COLS = 17;
const TOTAL_APPLES = ROWS * COLS;

// 난이도별 설정
const DIFFICULTY_CONFIG = {
    easy: {
        timer: 150,
        pairRate: 0.80, // 인접한 두 사과가 합쳐서 10이 되도록 배치하는 비율
        name: '쉬움'
    },
    normal: {
        timer: 120,
        pairRate: 0.15, // 표준 무작위 배치
        name: '보통'
    },
    hard: {
        timer: 90,
        pairRate: 0.0,  // 짝꿍 없이 불규칙 배치
        name: '어려움'
    }
};

// 게임 상태 변수
let currentDifficulty = 'easy';
let boardData = []; // { id, row, col, value, isCleared, element }
let score = 0;
let remainingApples = TOTAL_APPLES;
let timeLeft = DIFFICULTY_CONFIG[currentDifficulty].timer;
let timerInterval = null;
let isGameOver = false;

// 드래그 상태 변수
let isDragging = false;
let startX = 0;
let startY = 0;
let currentX = 0;
let currentY = 0;
let selectedApples = [];

// DOM 요소 참조
const boardElement = document.getElementById('game-board');
const boardContainer = document.getElementById('board-container');
const selectionBox = document.getElementById('selection-box');
const sumTooltip = document.getElementById('sum-tooltip');
const scoreDisplay = document.getElementById('score-display');
const timerDisplay = document.getElementById('timer-display');
const remainsDisplay = document.getElementById('remains-display');
const timerCard = document.querySelector('.timer-card');
const btnRestart = document.getElementById('btn-restart');
const diffButtons = document.querySelectorAll('.diff-btn');

// 모달 요소
const gameModal = document.getElementById('game-modal');
const modalIcon = document.getElementById('modal-icon');
const modalTitle = document.getElementById('modal-title');
const modalDesc = document.getElementById('modal-desc');
const finalScore = document.getElementById('final-score');
const finalEaten = document.getElementById('final-eaten');
const modalRestartBtn = document.getElementById('modal-restart-btn');

// ==========================================
// 1. Web Audio API 사운드 효과 (별도 음원 불필요)
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

// 10 완성 시 청량한 성공 챠임음
function playMatchSound() {
    if (!audioCtx) return;
    try {
        const now = audioCtx.currentTime;
        const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6 (화음)
        
        notes.forEach((freq, i) => {
            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(freq, now + i * 0.05);

            gain.gain.setValueAtTime(0.15, now + i * 0.05);
            gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.05 + 0.25);

            osc.connect(gain);
            gain.connect(audioCtx.destination);

            osc.start(now + i * 0.05);
            osc.stop(now + i * 0.05 + 0.3);
        });
    } catch (e) {
        console.error(e);
    }
}

// 게임 오버 효과음
function playGameOverSound() {
    if (!audioCtx) return;
    try {
        const now = audioCtx.currentTime;
        const notes = [400, 350, 300, 250];
        notes.forEach((freq, i) => {
            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();
            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(freq, now + i * 0.12);

            gain.gain.setValueAtTime(0.15, now + i * 0.12);
            gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.12 + 0.2);

            osc.connect(gain);
            gain.connect(audioCtx.destination);

            osc.start(now + i * 0.12);
            osc.stop(now + i * 0.12 + 0.25);
        });
    } catch (e) {
        console.error(e);
    }
}

// 승리 축하 효과음
function playWinSound() {
    if (!audioCtx) return;
    try {
        const now = audioCtx.currentTime;
        const notes = [523.25, 659.25, 783.99, 1046.50, 1318.51];
        notes.forEach((freq, i) => {
            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(freq, now + i * 0.08);

            gain.gain.setValueAtTime(0.2, now + i * 0.08);
            gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.08 + 0.4);

            osc.connect(gain);
            gain.connect(audioCtx.destination);

            osc.start(now + i * 0.08);
            osc.stop(now + i * 0.08 + 0.5);
        });
    } catch (e) {
        console.error(e);
    }
}

// ==========================================
// 2. 사과 배치 및 난이도 알고리즘
// ==========================================
function getRandomAppleNumber() {
    return Math.floor(Math.random() * 9) + 1; // 1 ~ 9
}

/**
 * 난이도에 따른 사과 번호 배치
 * - 쉬움: 인접한 가로/세로 셀들이 10을 이루는 짝(5+5, 1+9, 2+8, 3+7, 4+6)을 80% 이상 우선 배치
 * - 보통: 무작위 배치 + 일부 짝
 * - 어려움: 짝 없이 골고루 불규칙하게 배치 (3개 이상의 조합 필요)
 */
function generateAppleGrid(difficulty) {
    const config = DIFFICULTY_CONFIG[difficulty];
    const grid = Array.from({ length: ROWS }, () => Array(COLS).fill(0));
    const visited = Array.from({ length: ROWS }, () => Array(COLS).fill(false));

    // 쉬움 / 보통 모드에서 인접 10 페어 생성
    if (config.pairRate > 0) {
        for (let r = 0; r < ROWS; r++) {
            for (let c = 0; c < COLS; c++) {
                if (visited[r][c]) continue;

                // pairRate 확률로 인접한 이웃과 합 10 만들기
                if (Math.random() < config.pairRate) {
                    const directions = [];
                    // 가로 이웃
                    if (c + 1 < COLS && !visited[r][c + 1]) directions.push([r, c + 1]);
                    // 세로 이웃
                    if (r + 1 < ROWS && !visited[r + 1][c]) directions.push([r + 1, c]);

                    if (directions.length > 0) {
                        const [nr, nc] = directions[Math.floor(Math.random() * directions.length)];
                        const firstVal = Math.floor(Math.random() * 9) + 1; // 1~9
                        const secondVal = 10 - firstVal; // 합이 10이 되는 짝궁

                        grid[r][c] = firstVal;
                        grid[nr][nc] = secondVal;
                        visited[r][c] = true;
                        visited[nr][nc] = true;
                        continue;
                    }
                }
            }
        }
    }

    // 아직 채워지지 않은 칸 무작위 배치
    for (let r = 0; r < ROWS; r++) {
        for (let c = 0; c < COLS; c++) {
            if (!visited[r][c]) {
                if (difficulty === 'hard') {
                    // 어려움 모드는 7, 8, 9와 1, 2, 3이 자주 나와 2개로 만들기 어렵게 유도
                    const skewed = [1, 1, 2, 3, 6, 7, 8, 8, 9, 9];
                    grid[r][c] = skewed[Math.floor(Math.random() * skewed.length)];
                } else {
                    grid[r][c] = getRandomAppleNumber();
                }
                visited[r][c] = true;
            }
        }
    }

    return grid;
}

// ==========================================
// 3. 게임 초기화 및 보드 렌더링
// ==========================================
function initGame() {
    clearInterval(timerInterval);
    isGameOver = false;
    score = 0;
    remainingApples = TOTAL_APPLES;
    timeLeft = DIFFICULTY_CONFIG[currentDifficulty].timer;

    updateUI();
    timerCard.classList.remove('danger');
    gameModal.classList.remove('active');

    // 보드 데이터 생성
    const rawGrid = generateAppleGrid(currentDifficulty);
    boardData = [];
    boardElement.innerHTML = '';

    let index = 0;
    for (let r = 0; r < ROWS; r++) {
        for (let c = 0; c < COLS; c++) {
            const val = rawGrid[r][c];
            const cell = document.createElement('div');
            cell.className = 'apple-cell';
            cell.textContent = val;
            cell.dataset.id = index;
            cell.dataset.row = r;
            cell.dataset.col = c;
            cell.dataset.val = val;

            boardElement.appendChild(cell);

            boardData.push({
                id: index,
                row: r,
                col: c,
                value: val,
                isCleared: false,
                element: cell
            });

            index++;
        }
    }

    // 타이머 시작
    startTimer();
}

function updateUI() {
    scoreDisplay.textContent = score;
    timerDisplay.textContent = timeLeft;
    remainsDisplay.textContent = remainingApples;
}

function startTimer() {
    timerInterval = setInterval(() => {
        if (timeLeft > 0) {
            timeLeft--;
            timerDisplay.textContent = timeLeft;

            if (timeLeft <= 15) {
                timerCard.classList.add('danger');
            }
        } else {
            endGame(false);
        }
    }, 1000);
}

// ==========================================
// 4. 게임 종료 및 결과 처리
// ==========================================
function endGame(isVictory) {
    clearInterval(timerInterval);
    isGameOver = true;

    finalScore.textContent = `${score}점`;
    finalEaten.textContent = `${TOTAL_APPLES - remainingApples}개`;

    if (isVictory) {
        modalIcon.textContent = '🏆';
        modalTitle.textContent = '모든 사과 올클리어!';
        modalDesc.textContent = `축하합니다! 모든 사과를 먹어 치웠습니다! (${DIFFICULTY_CONFIG[currentDifficulty].name} 모드)`;
        playWinSound();
    } else {
        modalIcon.textContent = '⏰';
        modalTitle.textContent = '시간 종료!';
        modalDesc.textContent = `제한 시간이 모두 소진되었습니다. 다음엔 더 높은 점수에 도전해보세요!`;
        playGameOverSound();
    }

    gameModal.classList.add('active');
}

// ==========================================
// 5. 드래그 상자 선택 및 10 검사 로직
// ==========================================
function getBoardCoordinates(e) {
    const rect = boardContainer.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;

    return {
        x: clientX - rect.left,
        y: clientY - rect.top,
        clientX,
        clientY
    };
}

function onDragStart(e) {
    if (isGameOver) return;
    initAudio(); // 오디오 컨텍스트 사용자 인터랙션 후 활성화

    // 오른쪽 클릭 무시
    if (e.button && e.button !== 0) return;

    isDragging = true;
    const coords = getBoardCoordinates(e);
    startX = coords.x;
    startY = coords.y;
    currentX = coords.x;
    currentY = coords.y;

    selectionBox.style.display = 'block';
    sumTooltip.style.display = 'block';
    updateSelectionBox();
    checkIntersections();
}

function onDragMove(e) {
    if (!isDragging || isGameOver) return;

    const coords = getBoardCoordinates(e);
    currentX = coords.x;
    currentY = coords.y;

    updateSelectionBox();
    checkIntersections();
}

function onDragEnd() {
    if (!isDragging) return;
    isDragging = false;

    // 현재 선택된 사과들의 합 계산
    const sum = selectedApples.reduce((acc, item) => acc + item.value, 0);

    // 합이 정확히 10인 경우: 사과 제거 & 점수 획득
    if (sum === 10 && selectedApples.length > 0) {
        playMatchSound();

        selectedApples.forEach(item => {
            item.isCleared = true;
            item.element.classList.remove('selected', 'sum-match-10');
            item.element.classList.add('cleared');
        });

        score += selectedApples.length;
        remainingApples -= selectedApples.length;
        updateUI();

        // 모든 사과를 제거했는지 확인
        if (remainingApples <= 0) {
            endGame(true);
        }
    } else {
        // 10이 아니면 선택 스타일 초기화
        selectedApples.forEach(item => {
            item.element.classList.remove('selected', 'sum-match-10');
        });
    }

    // 드래그 박스 및 툴팁 숨기기
    selectionBox.style.display = 'none';
    selectionBox.classList.remove('match-10');
    sumTooltip.style.display = 'none';
    sumTooltip.classList.remove('match-10', 'over-10');
    selectedApples = [];
}

// 드래그 사각형 크기 및 위치 업데이트
function updateSelectionBox() {
    const left = Math.min(startX, currentX);
    const top = Math.min(startY, currentY);
    const width = Math.abs(currentX - startX);
    const height = Math.abs(currentY - startY);

    selectionBox.style.left = `${left}px`;
    selectionBox.style.top = `${top}px`;
    selectionBox.style.width = `${width}px`;
    selectionBox.style.height = `${height}px`;

    // 툴팁 위치
    sumTooltip.style.left = `${currentX}px`;
    sumTooltip.style.top = `${currentY}px`;
}

// 선택 사각형 내 사과 충돌 감지 및 합계 계산
function checkIntersections() {
    const boxLeft = Math.min(startX, currentX);
    const boxTop = Math.min(startY, currentY);
    const boxRight = boxLeft + Math.abs(currentX - startX);
    const boxBottom = boxTop + Math.abs(currentY - startY);

    const containerRect = boardContainer.getBoundingClientRect();
    const newlySelected = [];
    let currentSum = 0;

    boardData.forEach(item => {
        if (item.isCleared) return;

        const cellRect = item.element.getBoundingClientRect();
        // 보드 컨테이너 기준 사과의 중심 좌표
        const appleCenterX = (cellRect.left + cellRect.right) / 2 - containerRect.left;
        const appleCenterY = (cellRect.top + cellRect.bottom) / 2 - containerRect.top;

        // 사과 중심이 드래그 상자 내부에 있는지 검사
        if (
            appleCenterX >= boxLeft &&
            appleCenterX <= boxRight &&
            appleCenterY >= boxTop &&
            appleCenterY <= boxBottom
        ) {
            newlySelected.push(item);
            currentSum += item.value;
        }
    });

    // 기존 선택 스타일 리셋 후 재적용
    selectedApples.forEach(item => {
        if (!newlySelected.includes(item)) {
            item.element.classList.remove('selected', 'sum-match-10');
        }
    });

    const isMatch10 = currentSum === 10;
    const isOver10 = currentSum > 10;

    newlySelected.forEach(item => {
        item.element.classList.add('selected');
        if (isMatch10) {
            item.element.classList.add('sum-match-10');
        } else {
            item.element.classList.remove('sum-match-10');
        }
    });

    selectedApples = newlySelected;

    // 툴팁 및 박스 시각 피드백
    sumTooltip.textContent = `합: ${currentSum}`;

    if (isMatch10) {
        sumTooltip.classList.add('match-10');
        sumTooltip.classList.remove('over-10');
        selectionBox.classList.add('match-10');
        sumTooltip.textContent = `합: 10! 🎉`;
    } else if (isOver10) {
        sumTooltip.classList.add('over-10');
        sumTooltip.classList.remove('match-10');
        selectionBox.classList.remove('match-10');
    } else {
        sumTooltip.classList.remove('match-10', 'over-10');
        selectionBox.classList.remove('match-10');
    }
}

// ==========================================
// 6. 이벤트 리스너 등록
// ==========================================

// 마우스 드래그 이벤트
boardContainer.addEventListener('mousedown', onDragStart);
window.addEventListener('mousemove', onDragMove);
window.addEventListener('mouseup', onDragEnd);

// 터치 모바일 이벤트 지원
boardContainer.addEventListener('touchstart', (e) => {
    onDragStart(e);
}, { passive: false });

window.addEventListener('touchmove', (e) => {
    if (isDragging) {
        e.preventDefault(); // 화면 스크롤 방지
        onDragMove(e);
    }
}, { passive: false });

window.addEventListener('touchend', onDragEnd);

// 난이도 변경 버튼
diffButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
        const selectedDiff = e.currentTarget.dataset.difficulty;
        if (currentDifficulty === selectedDiff) return;

        diffButtons.forEach(b => b.classList.remove('active'));
        e.currentTarget.classList.add('active');

        currentDifficulty = selectedDiff;
        initGame();
    });
});

// 다시 시작 버튼
btnRestart.addEventListener('click', initGame);
modalRestartBtn.addEventListener('click', initGame);

// 첫 로딩 시 게임 시작
document.addEventListener('DOMContentLoaded', initGame);

