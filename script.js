let qwe = [];
let apiKey = "CilG8hJRwHmaHlNar8s8JiQ1yvqeCUKTvB71fjyt6UhLTEHej7xxT4Mc"
let id;
let H;
let timer;
let correctAnswers = 0; 
let totalQuestions = 0; 
let timeLeft = 0; 
let startTime = 0;
let interval;

window.onload = function() {
    getAPICata()
    document.getElementById('home').addEventListener('click', function() {
        location.reload();
    });
}



async function getAPICata(){
let api = `https://opentdb.com/api_category.php`;
try {
    let response = await fetch(api);
    let data = await response.json();
    console.log(data)
    gameStart(data)
  } catch (error) {
    console.error('Error fetching tv show:', error);
  }
}

async function getAPI(id, numberOfQuestions) {
  try {
    let response = await fetch(`https://opentdb.com/api.php?amount=${numberOfQuestions}&category=${id}&difficulty=${H}`);
    let data = await response.json();
    document.getElementById('title').innerHTML = "";
    console.log(data)
    getResults(data);

  } catch (error) {
    console.error('Error fetching tv show:', error);
    document.getElementById('title').innerHTML = "If no questions appear please click here <br> Sorry for the inconvenience"
  }
}
function findImage(question) {
    let stopwords = [
        "i", "me", "my", "myself", "we", "our", "ours", "ourselves", "you", "your", "yours",
        "yourself", "yourselves", "he", "him", "his", "himself", "she", "her", "hers", "herself",
        "it", "its", "itself", "they", "them", "their", "theirs", "themselves", "what", "which",
        "who", "whom", "this", "that", "these", "those", "am", "is", "are", "was", "were", "be",
        "been", "being", "have", "has", "had", "having", "do", "does", "did", "doing", "a", "an",
        "the", "and", "but", "if", "or", "because", "as", "until", "while", "of", "at", "by", "for",
        "with", "about", "against", "between", "into", "through", "during", "before", "after",
        "above", "below", "to", "from", "up", "down", "in", "out", "on", "off", "over", "under",
        "again", "further", "then", "once", "here", "there", "when", "where", "why", "how", "all",
        "any", "both", "each", "few", "more", "most", "other", "some", "such", "no", "nor", "not",
        "only", "own", "same", "so", "than", "too", "very", "s", "t", "can", "will", "just", "don",
        "should", "now", "many", "call", "class"
    ];

    
    let cleanedQuestion = question.replace(/&[^;]+;/g, '');
    let words = cleanedQuestion.split(' ');

    function isNotStopword(word) {
        return !stopwords.includes(word.toLowerCase());
    }

    let filteredWords = words.filter(isNotStopword);

    return filteredWords.slice(0, 2);
}


function startTimer(duration) {
    let timer = duration, minutes, seconds;
    startTime = Date.now() + 1000; 

    interval = setInterval(() => {
        minutes = parseInt(timer / 60, 10);
        seconds = parseInt(timer % 60, 10);
        
        if (minutes < 10) {
            minutes = "0" + minutes;
        }
        if (seconds < 10) {
            seconds = "0" + seconds;
        }
        
        document.getElementById('timer').innerHTML = minutes + ":" + seconds;
        
        if (--timer < 0) {
            timer = 0;
            endGame();
            document.getElementById('timer').innerHTML = "";
            clearInterval(interval); 
        }
    }, 1000);
}



async function imgFetch(search) {
    let url = "https://api.pexels.com/v1/search?per_page=1&query=" + search;
    let headers = {
        "Authorization": apiKey
    };

    try {
        let response = await fetch(url, { headers });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        let data = await response.json();
        console.log(data);

        if (data.photos && data.photos.length > 0) {
            return data.photos[0].src.medium;
        } else {
            console.error("No photos found");
            return ''; 
        }
    } catch (error) {
        console.error("Error fetching data:", error);
    }

    return ''; 
}


async function getResults(data) {
    let currentQuestionIndex = 0;
    let answersContainer = document.getElementById('everything');
    answersContainer.innerHTML = ''; 
    let time = totalQuestions * 10
    startTimer(time);

    function displayQuestion() {
        if (currentQuestionIndex >= data.results.length) {
            endGame();
            clearInterval(interval); 
            return;
        }
        let question = data.results[currentQuestionIndex];
        let questionDiv = document.createElement('div');
        questionDiv.classList.add('question');

        imgFetch(findImage(question.question)).then(imgUrl => {
            let img = document.createElement('img');
            img.src = imgUrl;

            let questionText = document.createElement('h2');
            questionText.innerHTML = question.question;

            questionDiv.appendChild(questionText);
            questionDiv.appendChild(img); 

            let answersList = document.createElement('ul');
            let correctAnswer = question.correct_answer;

            if (question.type === 'boolean') {
                createAnswer(answersList, "True", correctAnswer);
                createAnswer(answersList, "False", correctAnswer);
            } else if (question.type === 'multiple') {
                let allAnswers = [...question.incorrect_answers, correctAnswer];
                allAnswers.sort(function() { return 0.5 - Math.random(); });

                for (let j = 0; j < allAnswers.length; j++) {
                    createAnswer(answersList, allAnswers[j], correctAnswer);
                }
            }

            questionDiv.appendChild(answersList);
            answersContainer.appendChild(questionDiv); 
        });
    }

    
    function createAnswer(answersList, answerText, correctAnswer) {
        let answerItem = document.createElement('li');
        answerItem.innerHTML = answerText;

        answerItem.addEventListener('click', function() {
            checkAnswer(answerItem, answerText, correctAnswer);
            currentQuestionIndex++; 
            answersContainer.innerHTML = ''; 
            displayQuestion(); 
        });

        answersList.appendChild(answerItem);
    }

    displayQuestion();
}


function checkAnswer(answerItem, answerText, correctAnswer) {
    
    if (answerText === correctAnswer) {
        document.getElementById('timer').style.backgroundColor = '#a7f9c5 ';
        correctAnswers++;
    } else {
       document.getElementById('timer').style.backgroundColor = '#f47174 ';
    }

    let allAnswerItems = answerItem.parentElement.querySelectorAll('li');
    for (let i = 0; i < allAnswerItems.length; i++) {
        allAnswerItems[i].style.pointerEvents = 'none'; // Disable further clicks on the answers
    }
}
function gameStart(data){
    let answersContainer = document.getElementById('everything');
    for(i in data.trivia_categories){


        let cata = document.createElement('div');
        cata.classList.add('cata');
        cata.id = data.trivia_categories[i].id;
        
        cata.innerHTML = data.trivia_categories[i].name;
        answersContainer.appendChild(cata);

        cata.addEventListener('click', function() {
            id = cata.id
            answersContainer.innerHTML = '';
            hardness(id);
        });
    }
}

function hardness(id){
    d = ['easy', 'medium', 'hard', '']
    let answersContainer = document.getElementById('everything');


    for(i in d){


        let cata = document.createElement('div');
        cata.classList.add('cata');
        cata.id = d[i];
        if(d[i] != ''){
            cata.innerHTML = d[i];
        }else{
            cata.innerHTML = "random"
        }
        answersContainer.appendChild(cata);

        cata.addEventListener('click', function() {
            H = cata.id
            answersContainer.innerHTML = '';
            max = NofQ(id, H);
            console.log(max)
        });
    }
}

async function NofQ(id, h){
    let api = `https://opentdb.com/api_count.php?category=${id}`;
    try {
        let response = await fetch(api);
        let data = await response.json();
        NofQDisplay(data, h)
        
      } catch (error) {
        console.error('Error fetching data', error);
      }
 
    }

function NofQDisplay(data, h) {
    let answersContainer = document.getElementById('everything');
    answersContainer.innerHTML = ''; 
    
    let maxQuestions = 0;
    if (h === "easy") {
        maxQuestions = data.category_question_count.total_easy_question_count;
    } else if (h === "medium") {
        maxQuestions = data.category_question_count.total_medium_question_count;
    } else if (h === "hard") {
        maxQuestions = data.category_question_count.total_hard_question_count;
    } else {
        maxQuestions = data.category_question_count.total_question_count;
    }
    if(maxQuestions > 50){
        maxQuestions = 50
    }
    let inputContainer = document.createElement('div');
    inputContainer.classList.add('input-container');
    
    let label = document.createElement('label');
    label.for = 'questionNumber';
    label.textContent = 'Enter Number of Questions:';
    
    let input = document.createElement('input');
    input.type = 'number';
    input.id = 'questionNumber';
    input.min = 1;
    input.max = maxQuestions;
    input.value = maxQuestions;
    
    let submitButton = document.createElement('button');
    submitButton.textContent = 'Submit';
    submitButton.addEventListener('click', function() {
        let numberOfQuestions = parseInt(input.value, 10);
        answersContainer.innerHTML = ''; 
        if(numberOfQuestions > maxQuestions){
            numberOfQuestions = maxQuestions
        }
        getAPI(id, numberOfQuestions);
        totalQuestions = numberOfQuestions
    });

    inputContainer.appendChild(label);
    inputContainer.appendChild(input);
    inputContainer.appendChild(submitButton);
    answersContainer.appendChild(inputContainer);

}
function endGame() {
    let answersContainer = document.getElementById('everything');
    answersContainer.innerHTML = ''; 
    

    let endTime = Date.now(); // way to accurate lol
    console.log(endTime)
    let timeTaken = (endTime - startTime) / 1000; 
    if (timeTaken < 0){
        timeTaken = 0
    }
    console.log(timeTaken)
    let minutes = Math.floor(timeTaken / 60);
    let seconds = Math.floor(timeTaken % 60);

    let endScreen = document.createElement('div');
    endScreen.classList.add('end-screen');

    let resultText = document.createElement('h3');
    resultText.innerHTML = `You answered ${correctAnswers} / ${totalQuestions} questions correctly.`;
    
    let timeText = document.createElement('h3');
    timeText.innerHTML = `Time taken: ${minutes}:${seconds < 10 ? '0' + seconds : seconds}`;

    // score logic 
    let score = 0;

    let accuracyScore = (correctAnswers / totalQuestions) * 100;
    let timePenalty;

    if (H === "easy") {
        timePenalty = Math.max(0, (timeTaken / 60) * 10); // For every minute taken, the player loses 10 points from their score. (easy) 
    } else if (H === "medium") {
        timePenalty = Math.max(0, (timeTaken / 60) * 5); // For every minute taken, the player loses 5 points from their score. (medium) 
    } else if (H === "hard") {
        timePenalty = Math.max(0, (timeTaken / 60) * 2); // For every minute taken, the player loses 2 points from their score. (hard) 
    } else {
        timePenalty = Math.max(0, (timeTaken / 60) * 5); // For every minute taken, the player loses 5 points from their score. (regualar?)
    }
    score = accuracyScore - timePenalty;
    score = Math.max(0, Math.min(score, 100));
    score = Math.round(score * 100) / 100
    let scoreText = document.createElement('h3');
    scoreText.innerHTML = `Score: ${score}`;

    endScreen.appendChild(resultText);
    endScreen.appendChild(timeText);
    endScreen.appendChild(scoreText);

    
    answersContainer.appendChild(endScreen);
    document.getElementById('timer').style.backgroundColor = '';

}

// load the service worker
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
      navigator.serviceWorker.register('sw.js').then(function(registration) {
        console.log('Service Worker registered with scope:', registration.scope);
  
      }, function(error) {
        console.log('Service Worker registration failed:', error);
      });
    });
  }         
  
  // handle install prompt
  let deferredPrompt;
  
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
  
    const installButton = document.getElementById('installButton');
    installButton.style.display = 'block';
  
    installButton.addEventListener('click', () => {
      installButton.style.display = 'none';
      deferredPrompt.prompt();
      deferredPrompt.userChoice.then((choiceResult) => {
        if (choiceResult.outcome === 'accepted') {
          console.log('User accepted the install prompt');
        } else {
          console.log('User dismissed the install prompt');
        }
        deferredPrompt = null;
      });
    });
  });   
