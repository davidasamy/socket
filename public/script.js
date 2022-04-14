const socket = io(); // create new instance


 // ask for what room the user wants to go
window.onload=function(){


document.getElementById("playGame").addEventListener('click', enter)
let username = ""
let room = ""
function enter() {
  nameinput = document.getElementById("user")
  roominput = document.getElementById("room")

  if (nameinput.value == ""/* || roominput.value == ""*/) {
    alert('please fill in username field')
  }
  else {
    document.getElementById("main-menu").style.display = "none"
    document.querySelectorAll('.actualgame').forEach(function(el) {
   el.style.display = 'block';
});
    let username = nameinput.value
    let room = roominput.value
    if (room = "") {
      room = "public"
    }
    socket.emit("joined", username, room);
    
  }
  
}


 // tell server the username and room of the person who joined

socket.on("joined", user => { // when server tells client that someone has joined
  //alert(user + " joined");
});



socket.on("leave", user => { // when server tells client that someone has left
  alert(user + " left");
});

readyButton = document.getElementById('ready')

readyButton.addEventListener('click', () => {
  socket.emit("ready");
})


socket.on('start', function(game_id) {
var listOfWords = ["name", "hope", "love", "sin", "honor", "courage", "killer", "manage", "want", "account", "sell", "login", "hacker", "money", "coin", "genius", "legend", "troll", "funny", "silly", "happy", "car", "bot", "tab", "hut", "teacher", "friend", "father", "mother", "sun", "planet", "panel", "phone", "app", "send", "duplicate", "multiply", "add", "random", "number", "part", "section", "many", "few", "little", "huge", "insane", "bonkers", "spectacular", "magnificent", "terrible", "frequent", "incredible", "destroy", "create", "population", "culture", "significant", "wow", "amazing", "cool", "chill", "nice", "dog", "cat", "mouse", "elephant", "giant", "monkey", "apple", "banana", "rat", "keyboard", "type", "science", "class", "puppy", "pay", "boom", "comment", "hero", "smooth", "rough", "enough", "tough", "fluff", "scam", "army", "soldier", "muscle", "brave", "strong", "jump", "run", "hide", "decide", "prospect", "episode", "location", "religion"];

let QQ = ""
const wpm = 0
const totalTime = 10000
let timer,
maxTime = 10,
timeLeft = maxTime,
charIndex = mistakes = isTyping = 0;

function removeVal(array, value) {
  const index = array.indexOf(value);
if (index > -1) {
  array.splice(index, 1); // 2nd parameter means remove one item only
}

}
function makeQuote(ary, length) {
  let array = ary
  let finalS = ""
  for (let i = 0; i < length; i++) {
  var randomItem = array[Math.floor(Math.random()*array.length)];
    
    finalS += " " + randomItem;
  }
  finalS = finalS.substring(1)
  return finalS
}




var currword = "";
var runs = 0;





document.getElementById("start").addEventListener("click", begin);
var num = 2;
function begin() {
  runs = 0
  document.getElementById("typehere").style.display = "block";
  document.getElementById('typehere').value = ""
      document.getElementById('typehere').disabled = false

  document.getElementById("start").style.display = "none";
  startTime = Date.now();
  document.getElementById("typehere").focus();
  startTime = Date.now()
  
  setTimeout(endGame, totalTime);
  document.getElementById('typehere').style.display = "block";
  document.getElementById('random').style.display = "block";
  resetGame();
} 
function showQuote() {
  console.log(QQ)
  QQ = makeQuote(listOfWords, 25);
  console.log(QQ)
  console.log('ha')
  
  const random = document.getElementById('random')
  random.innerHTML = ""
  QQ.split("").forEach(char => {
        let span = `<span>${char}</span>`
        random.innerHTML += span;
    });
    random.style.display = "block"
}
var userInput = document.getElementById('typehere');


function endGame() {
  fWORDS = ((charIndex - mistakes)  / 5)
  fWPM = fWORDS / ((totalTime/1000)/60)
  console.log(fWORDS, fWPM)
  document.getElementById('typehere').style.display = "none";
  document.getElementById('typehere').disabled = true
  document.getElementById('random').style.display = "none";
  document.getElementById("start").style.display = "block";
  socket.emit("score", { runs: fWORDS, game_id: game_id });
}
function initTyping() {
    const random = document.getElementById('random')
    const inpField = document.getElementById('typehere')
    let characters = random.querySelectorAll("span");
    let typedChar = inpField.value.split("")[charIndex];
    if(charIndex < characters.length - 1 && timeLeft > 0) {
        if(!isTyping) {
            timer = setInterval(initTimer, 1000);
            isTyping = true;
        }
        if(typedChar == null) {
            if(charIndex > 0) {
                charIndex--;
                if(characters[charIndex].classList.contains("incorrect")) {
                    mistakes--;
                }
                characters[charIndex].classList.remove("correct", "incorrect");
            }
        } else {
            if(characters[charIndex].innerText == typedChar) {
                characters[charIndex].classList.add("correct");
            } else {
                mistakes++;
                characters[charIndex].classList.add("incorrect");
            }
            charIndex++;
        }
        characters.forEach(span => span.classList.remove("active"));

        let wpm = Math.round(((charIndex - mistakes)  / 5) / (maxTime - timeLeft) * totalTime);
        wpm = wpm < 0 || !wpm || wpm === Infinity ? 0 : wpm;
        
        
    } else {
        clearInterval(timer);
        inpField.value = "";
    }   
}

function initTimer() {
    if(timeLeft > 0) {
        timeLeft--;
        
        let wpm = Math.round(((charIndex - mistakes)  / 5) / (maxTime - timeLeft) * 60);
        
    } else {
        clearInterval(timer);
    }
}


function resetGame() {
  document.getElementById("random").value = "";
    showQuote();
    clearInterval(timer);
    timeLeft = maxTime;
    charIndex = mistakes = isTyping = 0;
    document.getElementById("typehere").value = "";
}
  
document.getElementById('typehere').addEventListener("input", initTyping);

  

})

socket.on("gameover", winner => {
  alert(`${winner} Won!`)
})
  
}

