// window.addEventListener('load', init);
// let secretFile = require('./secret.config.json');
// Globals
// Api Endpoint..
// https://random-word-api.herokuapp.com/word?number=50

//  Firebase initialization..
// Initialize Cloud Firestore through Firebase
firebase.initializeApp({
  apiKey: key.apiKey,
  authDomain: key.authDomain,
  projectId: key.projectId
});
let Wordarray;
var db = firebase.firestore();
let getWords = async ()=>{
  let response = await fetch('https://random-word-api.herokuapp.com/word?number=50',)
  Wordarray =  await response.json();
}
getWords();
// Available Levels
const levels = {
  easy: 8,
  medium: 5,
  hard: 3
};

// To change level


let time;
let score = 0;
let isPlaying;
let currentLevel;
let reset = true;
let checkStatusD;

// DOM Elements
const wordInput = document.querySelector('#word-input');
const currentWord = document.querySelector('#current-word');
const scoreDisplay = document.querySelector('#score');
const timeDisplay = document.querySelector('#time');
const message = document.querySelector('#message');
const seconds = document.querySelector('#seconds');
// const 
const words = [
  'hat',
  'river',
  'lucky',
  'statue',
  'generate',
  'stubborn',
  'cocktail',
  'runaway',
  'joke',
  'developer',
  'establishment',
  'hero',
  'javascript',
  'nutrition',
  'revolver',
  'echo',
  'siblings',
  'investigate',
  'horrendous',
  'symptom',
  'laughter',
  'magic',
  'master',
  'space',
  'definition'
];

function selectLevel(data){
  if(data === 1){
    currentLevel = levels.easy;
  }
  else if(data===2){
    currentLevel = levels.medium;
  }
  else{
    currentLevel = levels.hard;
  }
  time = currentLevel;
  const menuScreen = document.getElementsByClassName('welcome-screen-box')[0];
  const mainBox = document.getElementsByClassName('main-box')[0];
  menuScreen.style.display = "none";
  mainBox.style.display = "flex";
  timeDisplay.innerHTML = time;
  init();
}
// Initialize Game
function init() {
  // Show number of seconds in UI
  seconds.innerHTML = currentLevel;
  // Load word from array
  showWord(words);
  // Start matching on word input
  wordInput.addEventListener('focus', playGame);
  wordInput.addEventListener('input',startMatch);
}
function playGame(){
  // if(reset===true){
     startMatch();
// Call countdown every second
  setInterval(countdown, 1000);
  wordInput.removeEventListener('focus', playGame);
// Check game status
  checkStatusD = setInterval(checkStatus, 1000);

  // }
 
}
// Start match
function startMatch() {
 
  if (matchWords()) {
    isPlaying = true;
    time = currentLevel + 1;
    showWord(Wordarray);
    wordInput.value = '';
    score++;
  }

  // If score is -1, display 0
  if (score === -1) {
    scoreDisplay.innerHTML = 0;
  } else {
    scoreDisplay.innerHTML = score;
  }
}

// Match currentWord to wordInput
function matchWords() {
  let inputValue = wordInput.value.toUpperCase();
  let currentWordUpper = currentWord.innerHTML.toUpperCase();
  if (inputValue === currentWordUpper) {
    message.innerHTML = 'Correct!!!';
    return true;
  } else {
    message.innerHTML = '';
    return false;
  }
}

// Pick & show random word
function showWord(words) {
  // Generate random array index
  const randIndex = Math.floor(Math.random() * words.length);
  // Output random word
  currentWord.innerHTML = words[randIndex];
}

// Countdown timer
function countdown() {
  // Make sure time is not run out
  if (time > 0) {
    // Decrement
    time--;
  } else if (time === 0) {
    // Game is over
    isPlaying = false;
  }
  if(time>0 && time<=3){
    timeDisplay.style.color = "rgb(255, 57, 57)";
  }
  else{
    timeDisplay.style.color = "rgb(145, 143, 143)";

  }
  // Show time
  timeDisplay.innerHTML = time;
 
}

let responseHighScores = [];
let HighScores = '';
function getHighScores(){
  // db.collection("users").add({
  //   first: "Ada",
  //   last: "Lovelace",
  //   born: 1815
  // })
  // .then(function(docRef) {
  //   console.log("Document written with ID: ", docRef.id);
  // })
  // .catch(function(error) {
  //   console.error("Error adding document: ", error);
  // });
  let counter = 0;
  let inputAsk = false;
  db.collection("scores").get().then((data) => {
    if(counter<10){
       data.forEach((doc) => {
      if(doc.data().Score<score && inputAsk===false){
        counter++;
        inputAsk = true;
        responseHighScores.push({ Name: `<input type="text" id="newScoreName" placeholder="Your Name">`,Score: score,newData: 1,Date: `<button class="send-btn" id="submitBtn" onclick="submitToServer()">Send</button>`})
      }
      
      responseHighScores.push(doc.data());
      counter++; 
        console.log(doc.data())
        console.log(`${doc.id} => ${doc.data()}`);
      });
      if(counter<10 && inputAsk===false && score>0){
        inputAsk = true;
        responseHighScores.push({ Name: `<input type="text" id="newScoreName" placeholder="Your Name">`,Score: score,Date: `<button class="send-btn" id="submitBtn" onclick="submitToServer()">Send</button>`,newData: 1})
      }
    }
    responseHighScores.sort((a, b) => (a.Score < b.Score) ? 1 : -1);
   
 
});
}

function submitToServer(){
  db.collection("scores").add({
    Name: document.getElementById('newScoreName').value,
    Score: score,
    Date: new Date()
  })
  .then(function(docRef) {
    console.log("Document written with ID: ", docRef.id);
  })
  .catch(function(error) {
    console.error("Error adding document: ", error);
  });
  document.getElementById('submitBtn').disabled = true;
}
// Check game status
function checkStatus() {
  if (!isPlaying && time === 0) {
  clearInterval(checkStatusD);
    message.innerHTML = 'Game Over!!!';
    wordInput.disabled = true;
    // score = -1;
    currentWord.innerHTML = ` Game Over!<br><span class="scorebord">Score : ${score.toString()}<span> `; 
    getHighScores();
   
    setTimeout(()=>{
      responseHighScores.forEach(d=>{
        let date;
        if(d.newData!== 1){
           date = d.Date.toDate().toLocaleDateString();
          //  date2 = new Date()
          console.log(d.Date);
        }
        else{
           date = d.Date;

        }
        
        HighScores = HighScores + `<tr><td>${d.Name}</td><td>${d.Score}</td><td>${date}</td></tr>`;
       })
      const scoreBoardPage = document.getElementsByClassName('scorebord-page')[0];
      const mainBox = document.getElementsByClassName('main-box')[0];
      let scoreTable = document.getElementsByTagName('tbody')[0];
  

      // console.log(scoreTable);
      scoreTable.innerHTML = HighScores;
      mainBox.style.display = "none";
      scoreBoardPage.style.display = "flex";

    },2000)
  }
}
function refreshPage(){
  window.location.reload();
}