const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Ajustar canvas al tamaño de la ventana
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Reajustar cuando se cambie el tamaño de la ventana
window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});

let score = 0;
let lives = 3;
let timeLeft = 30;
let gameActive = true;

const player = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    size: 20,
    speed: 5
};

const obstacles = [];
const stars = [];

function createObstacle() {
    return {
        x: Math.random() * (canvas.width - 80),
        y: Math.random() * (canvas.height - 80),
        size: 25,
        speedX: (Math.random() - 0.5) * 3,
        speedY: (Math.random() - 0.5) * 3
    };
}

function createStar() {
    return {
        x: Math.random() * (canvas.width - 100),
        y: Math.random() * (canvas.height - 100),
        size: 20,
        speedX: (Math.random() - 0.5) * 2,
        speedY: (Math.random() - 0.5) * 2
    };
}

for (let i = 0; i < 7; i++) {
    obstacles.push(createObstacle());
    stars.push(createStar());
}

const keys = {};

document.addEventListener('keydown', (e) => {
    keys[e.key] = true;
});

document.addEventListener('keyup', (e) => {
    keys[e.key] = false;
});

function movePlayer() {
    // Controles INVERTIDOS
    if (keys['ArrowLeft']) player.x += player.speed;
    if (keys['ArrowRight']) player.x -= player.speed;
    if (keys['ArrowUp']) player.y += player.speed;
    if (keys['ArrowDown']) player.y -= player.speed;
    
    player.x = Math.max(player.size, Math.min(canvas.width - player.size, player.x));
    player.y = Math.max(player.size, Math.min(canvas.height - player.size, player.y));
}

function updateObstacles() {
    obstacles.forEach((obs, index) => {
        obs.x += obs.speedX;
        obs.y += obs.speedY;
        
        if (obs.x <= 0 || obs.x >= canvas.width - obs.size) obs.speedX *= -1;
        if (obs.y <= 0 || obs.y >= canvas.height - obs.size) obs.speedY *= -1;
        
        const dx = player.x - (obs.x + obs.size / 2);
        const dy = player.y - (obs.y + obs.size / 2);
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < player.size + obs.size / 2) {
            score += 10;
            document.getElementById('score').textContent = score;
            obstacles[index] = createObstacle();
        }
    });
}

function updateStars() {
    stars.forEach((star, index) => {
        star.x += star.speedX;
        star.y += star.speedY;
        
        if (star.x <= 0 || star.x >= canvas.width - star.size) star.speedX *= -1;
        if (star.y <= 0 || star.y >= canvas.height - star.size) star.speedY *= -1;
        
        const dx = player.x - (star.x + star.size / 2);
        const dy = player.y - (star.y + star.size / 2);
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < player.size + star.size / 2) {
            lives--;
            document.getElementById('lives').textContent = lives;
            stars[index] = createStar();
            
            if (lives <= 0) {
                endGame();
            }
        }
    });
}

function drawPlayer() {
    ctx.fillStyle = '#0066ff';
    ctx.beginPath();
    ctx.arc(player.x, player.y, player.size, 0, Math.PI * 2);
    ctx.fill();
}

function drawObstacles() {
    obstacles.forEach(obs => {
        ctx.fillStyle = '#ff0000';
        ctx.fillRect(obs.x, obs.y, obs.size, obs.size);
    });
}

function drawStars() {
    stars.forEach(star => {
        ctx.fillStyle = '#00ff00';
        ctx.beginPath();
        const cx = star.x + star.size / 2;
        const cy = star.y + star.size / 2;
        for (let i = 0; i < 5; i++) {
            const angle = (i * 4 * Math.PI) / 5 - Math.PI / 2;
            const x = cx + Math.cos(angle) * star.size / 2;
            const y = cy + Math.sin(angle) * star.size / 2;
            if (i === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
        }
        ctx.closePath();
        ctx.fill();
    });
}

function endGame() {
    gameActive = false;
    document.getElementById('finalScore').textContent = score;
    document.getElementById('gameOver').style.display = 'block';
}

function gameLoop() {
    if (!gameActive) return;
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    movePlayer();
    updateObstacles();
    updateStars();
    
    drawObstacles();
    drawStars();
    drawPlayer();
    
    requestAnimationFrame(gameLoop);
}

const timer = setInterval(() => {
    if (!gameActive) {
        clearInterval(timer);
        return;
    }
    
    timeLeft--;
    document.getElementById('time').textContent = timeLeft;
    
    if (timeLeft <= 0) {
        clearInterval(timer);
        endGame();
    }
}, 1000);

gameLoop();