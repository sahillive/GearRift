const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const canvasWidth = canvas.width;
const canvasHeight = canvas.height;

// Game Variables
let gameSpeed = 5;
let score = 0;
let scoreMultiplier = 1;

// Background
let roadY = 0;
let cloudX = 0;

// Player
const player = {
  x: canvasWidth / 2 - 25,
  y: canvasHeight - 120,
  width: 50,
  height: 100,
  color: 'red',
  dx: 0,
  shield: false
};

// Obstacles & Coins & PowerUps
const obstacles = [];
const coins = [];
const powerUps = [];
const obstacleWidth = 50;
const obstacleHeight = 50;
const coinSize = 20;
const powerSize = 30;

// Key Controls
document.addEventListener('keydown', (e) => {
  if(e.key === 'ArrowLeft') player.dx = -6;
  if(e.key === 'ArrowRight') player.dx = 6;
});
document.addEventListener('keyup', (e) => {
  if(e.key === 'ArrowLeft' || e.key === 'ArrowRight') player.dx = 0;
});

// Generate Obstacles
function createObstacle() {
  const x = Math.random() * (canvasWidth - obstacleWidth);
  const y = -obstacleHeight;
  const colors = ['orange','purple','brown'];
  obstacles.push({x, y, width: obstacleWidth, height: obstacleHeight, color: colors[Math.floor(Math.random()*colors.length)], type:'normal'});
}

// Generate Coins
function createCoin() {
  const x = Math.random() * (canvasWidth - coinSize);
  const y = -coinSize;
  coins.push({x, y, size: coinSize, color: 'gold'});
}

// Generate PowerUps
function createPowerUp() {
  const x = Math.random() * (canvasWidth - powerSize);
  const y = -powerSize;
  const types = ['speed','shield'];
  powerUps.push({x, y, size: powerSize, color: '#00FFFF', type: types[Math.floor(Math.random()*types.length)]});
}

// Update Game Objects
function update() {
  // Player movement
  player.x += player.dx;
  if(player.x < 0) player.x = 0;
  if(player.x + player.width > canvasWidth) player.x = canvasWidth - player.width;

  // Move obstacles
  obstacles.forEach((obs, i) => {
    obs.y += gameSpeed;
    // Collision detection
    if(player.x < obs.x + obs.width &&
       player.x + player.width > obs.x &&
       player.y < obs.y + obs.height &&
       player.y + player.height > obs.y && !player.shield) {
         gameOver();
    }
    if(obs.y > canvasHeight) obstacles.splice(i,1);
  });

  // Move coins
  coins.forEach((coin, i) => {
    coin.y += gameSpeed;
    // Collect coin
    if(player.x < coin.x + coin.size &&
       player.x + player.width > coin.x &&
       player.y < coin.y + coin.size &&
       player.y + player.height > coin.y) {
      score += 50 * scoreMultiplier;
      coins.splice(i,1);
      // Particle effect
      createParticles(coin.x+coin.size/2, coin.y+coin.size/2);
    }
    if(coin.y > canvasHeight) coins.splice(i,1);
  });

  // Move power-ups
  powerUps.forEach((p, i) => {
    p.y += gameSpeed;
    if(player.x < p.x + p.size &&
       player.x + player.width > p.x &&
       player.y < p.y + p.size &&
       player.y + player.height > p.y) {
      if(p.type === 'speed') {
        gameSpeed += 3;
        setTimeout(()=> gameSpeed -=3,5000);
      } else if(p.type === 'shield'){
        player.shield = true;
        setTimeout(()=> player.shield=false,5000);
      }
      powerUps.splice(i,1);
    }
    if(p.y > canvasHeight) powerUps.splice(i,1);
  });

  // Move background
  roadY += gameSpeed;
  if(roadY > canvasHeight) roadY = 0;

  cloudX += 1;
  if(cloudX > canvasWidth) cloudX = -100;

  score += 1 * scoreMultiplier;
}

// Particle effect array
const particles = [];
function createParticles(x,y){
  for(let i=0;i<10;i++){
    particles.push({
      x, y,
      dx: (Math.random()-0.5)*4,
      dy: (Math.random()-1)*2,
      life: 30
    });
  }
}
function drawParticles(){
  particles.forEach((p,i)=>{
    ctx.fillStyle='yellow';
    ctx.fillRect(p.x,p.y,3,3);
    p.x += p.dx;
    p.y += p.dy;
    p.life--;
    if(p.life<=0) particles.splice(i,1);
  });
}

// Draw Everything
function draw() {
  ctx.clearRect(0,0,canvasWidth,canvasHeight);

  // Sky with clouds
  ctx.fillStyle='#87CEFA';
  ctx.fillRect(0,0,canvasWidth,canvasHeight/2);
  ctx.fillStyle='white';
  ctx.beginPath();
  ctx.arc(cloudX,50,30,0,Math.PI*2);
  ctx.arc(cloudX+50,70,20,0,Math.PI*2);
  ctx.arc(cloudX+100,60,25,0,Math.PI*2);
  ctx.fill();

  // Road
  ctx.fillStyle = '#555';
  ctx.fillRect(100,0,canvasWidth-200,canvasHeight);
  ctx.strokeStyle='white';
  ctx.lineWidth=4;
  for(let i=0;i<canvasHeight;i+=40){
    ctx.beginPath();
    ctx.moveTo(canvasWidth/2, i+(roadY%40));
    ctx.lineTo(canvasWidth/2, i+20+(roadY%40));
    ctx.stroke();
  }

  // Grass
  ctx.fillStyle='#4CAF50';
  ctx.fillRect(0,0,100,canvasHeight);
  ctx.fillRect(canvasWidth-100,0,100,canvasHeight);

  // Player
  ctx.fillStyle=player.shield?'cyan':player.color;
  ctx.fillRect(player.x,player.y,player.width,player.height);

  // Obstacles
  obstacles.forEach(obs=>{
    ctx.fillStyle=obs.color;
    ctx.fillRect(obs.x,obs.y,obs.width,obs.height);
  });

  // Coins
  coins.forEach(coin=>{
    ctx.fillStyle=coin.color;
    ctx.beginPath();
    ctx.arc(coin.x + coin.size/2, coin.y + coin.size/2, coin.size/2, 0, Math.PI*2);
    ctx.fill();
  });

  // PowerUps
  powerUps.forEach(p=>{
    ctx.fillStyle=p.color;
    ctx.beginPath();
    ctx.arc(p.x+p.size/2, p.y+p.size/2, p.size/2,0,Math.PI*2);
    ctx.fill();
    ctx.fillStyle='black';
    ctx.font='12px Arial';
    ctx.fillText(p.type[0].toUpperCase(), p.x+p.size/4, p.y+p.size/1.5);
  });

  // Particles
  drawParticles();

  // Score
  ctx.fillStyle='black';
  ctx.font='20px Arial';
  ctx.fillText('Score: '+score,10,30);
}

// Game Over
function gameOver(){
  alert('Game Over! Score: '+score);
  // Save score
  const user = firebase.auth().currentUser;
  if(user){
    firebase.firestore().collection('scores').add({
      user: user.email,
      score: score,
      timestamp: firebase.firestore.FieldValue.serverTimestamp()
    });
  }
  document.location.reload();
}

// Game Loop
function gameLoop(){
  update();
  draw();
  requestAnimationFrame(gameLoop);
}

// Spawn objects
setInterval(createObstacle,1200);
setInterval(createCoin,1500);
setInterval(createPowerUp,7000);

gameLoop();

