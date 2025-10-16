// Firebase config
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  projectId: "YOUR_PROJECT",
  storageBucket: "YOUR_PROJECT.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};

// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

// DOM Elements
const loginBtn = document.getElementById('loginBtn');
const signupBtn = document.getElementById('signupBtn');
const guestBtn = document.getElementById('guestBtn');
const menu = document.getElementById('menu');
const canvas = document.getElementById('gameCanvas');
const toggleBtn = document.getElementById('toggleMode');

let darkMode = false;

// Toggle Dark/Light Mode
toggleBtn.addEventListener('click', () => {
  darkMode = !darkMode;
  if(darkMode){
    document.body.style.background = '#111';
    canvas.style.border = '3px solid #fff';
    menu.style.color = 'white';
  } else {
    document.body.style.background = 'linear-gradient(to top, #87cefa, #fff)';
    canvas.style.border = '3px solid #000';
    menu.style.color = 'black';
  }
});

// Start game after login/guest
function startGame() {
  menu.style.display = 'none';
  canvas.style.display = 'block';
}

// Login
loginBtn.addEventListener('click', () => {
  const email = prompt('Enter Email:');
  const password = prompt('Enter Password:');
  auth.signInWithEmailAndPassword(email, password)
      .then((user) => { 
        alert('Login Successful!');
        startGame();
      })
      .catch((err) => alert(err.message));
});

// Signup
signupBtn.addEventListener('click', () => {
  const email = prompt('Enter Email:');
  const password = prompt('Enter Password:');
  auth.createUserWithEmailAndPassword(email, password)
      .then((user) => { 
        alert('Signup Successful!');
        startGame();
      })
      .catch((err) => alert(err.message));
});

// Guest Mode
guestBtn.addEventListener('click', () => {
  alert('Playing as Guest!');
  startGame();
});
const scoresList = document.getElementById('scoresList');

function updateLeaderboard(){
  scoresList.innerHTML = ''; // clear previous
  db.collection('scores')
    .orderBy('score', 'desc')
    .limit(5)
    .get()
    .then(snapshot => {
      snapshot.forEach(doc => {
        const li = document.createElement('li');
        li.textContent = doc.data().user + ': ' + doc.data().score;
        scoresList.appendChild(li);
      });
    });
}

// Update leaderboard every 5 seconds
setInterval(updateLeaderboard, 5000);
updateLeaderboard(); // initial load
