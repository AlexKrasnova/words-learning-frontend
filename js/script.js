'use strict';

let wordSets;
let currentWordSet;
const routes = {
    404: "/words-learning/pages/404.html",
    "/words-learning/": "/words-learning/pages/index.html"
};



function addDynamicContentToHomePage() {
    const wordSetsMenu = document.querySelector('.word-set-list');
    let wordSetListHtml = '';

    wordSets.forEach(item => {
        wordSetListHtml += `
            <li>   
                <a href="/words-learning/word-set/${item.id}" onclick="route()">${item.name}</a>
            </li>
        `;
        routes[`/words-learning/word-set/${item.id}`] = '/words-learning/pages/word-set.html';
        routes[`/words-learning/word-set/${item.id}/training`] = '/words-learning/pages/training.html';
    });

    wordSetsMenu.innerHTML = wordSetListHtml;
}

function addDynamicContentToWordSetPage(index) {
    const wordSetTitle = document.querySelector('.word-set-title'),
        words = document.querySelector('.words'),
        training = document.querySelector('.training-button');

    wordSetTitle.textContent = wordSets[index].name;
    axios.get(`http://localhost:8080/word-sets/${wordSets[index].id}/`)
        .then(serverData => {
            currentWordSet = serverData.data;
            console.log(currentWordSet.words);
        }).then(() => {

            let wordsHtml = '';
            currentWordSet.words.forEach((word, i) => {
                wordsHtml += `
                    <li>${i + 1}. ${word.name}</li>
                `;
            });
            words.innerHTML = wordsHtml;

            training.innerHTML = `
                <a href="${wordSets[index].id}/training" onclick="route()">Training</a></div>
            `;
        });
}

function addDynamicContentToTrainingPage(index) {
    const trainingTitle = document.querySelector('.training-title'),
        result = document.querySelector('.result'),
        resultText = document.querySelector('.result-text'),
        previousWord = document.querySelector('.previous-word'),
        previousWordContent = document.querySelector('.previous-word-content'),
        training = document.querySelector('.training'),
        wordInput = document.querySelector('#word-input'),
        wordLabel = document.querySelector('#word-label'),
        trainingForm = document.querySelector('#training-form'),
        hint = document.querySelector('#hint'),
        trainingEnd = document.querySelector('.training-end'),
        trainAgain = document.querySelector('#train-again');
    trainingTitle.textContent = `Training "${currentWordSet.name}"`;

    hide(result);
    hide(previousWord);
    hide(trainingEnd);

     trainAgain.href = `/words-learning/word-set/${wordSets[index].id}/training`;

    let words = currentWordSet.words;
    words = words.sort((a, b) => 0.5 - Math.random());
    console.log(words);
    let currentIndex = 0;

    let word = words[0];

    wordLabel.textContent = word.translation;

    hint.addEventListener('click', (e) => {
        e.preventDefault();
        alert(word.name);
    });

    trainingForm.addEventListener('submit', (e) => {
        e.preventDefault();
        show(result);

        if (wordInput.value === word.name) {
            resultText.textContent = 'Right!';
            resultText.classList.add('result-right');
            resultText.classList.remove('result-wrong');
        } else {
            resultText.textContent = 'Wrong';
            resultText.classList.remove('result-right');
            resultText.classList.add('result-wrong');
            hide(previousWord);
            return;
        }

        let examples = '';
        word.examples.forEach(item => {
            examples += `<br>${item}`;
        });

        let previousWordHtml =  `
            <b>translation:</b> ${word.translation}<br>
            <b>name:</b> ${word.name}
        `;
        if (examples != '') {
            previousWordHtml += `<br><b>examples:</b> ${examples}`;
        }
        previousWordContent.innerHTML = previousWordHtml;

        show(previousWord);

        if (currentIndex < words.length - 1) {
            currentIndex++;
            word = words[currentIndex];
            wordInput.value = '';
            wordLabel.textContent = word.translation;
        } else {
            hide(training);
            show(trainingEnd);
        }
    });
}

function hide(element) {
    element.classList.add('hide');
    element.classList.remove('show');
}

function show(element) {
    element.classList.remove('hide');
    element.classList.add('show');
}

function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}

const route = (event) => {
    event = event || window.event;
    event.preventDefault();
    window.history.pushState({}, "", event.target.href);
    handleLocation();
};

const handleLocation = async () => {
    const path = window.location.pathname;
    const route = routes[path] || routes[404];
    const html = await axios.get(route).then((data) => data.data);
    document.getElementById("main-page").innerHTML = html;

    if (path === "/words-learning/") {
        addDynamicContentToHomePage();
    }

    if (path.replace(/\d/g, '') === '/words-learning/word-set/') {
        for (let i = 0; i < wordSets.length; i++) {
            if (wordSets[i].id === +path.replace(/\D/g, '')) {
                addDynamicContentToWordSetPage(i);
                break;
            }
        }
    }

    if (path.replace(/\d/g, '') === '/words-learning/word-set//training') {
        for (let i = 0; i < wordSets.length; i++) {
            if (wordSets[i].id === +path.replace(/\D/g, '')) {
                addDynamicContentToTrainingPage(i);
                break;
            }
        }
    }
};

window.onpopstate = handleLocation;
window.route = route;


initData();

function initData() {
    // wordSets = axios.get('http://localhost:3000/data')
    wordSets = axios.get('http://localhost:8080/word-sets/')
        .then(data => {
            wordSets = data.data;
            handleLocation();
        });
}

function getWordSet(id) {
    axios.get(`http://localhost:8080/word-sets/${id}/`)
        .then(serverData => {
            currentWordSet = serverData.data;
        });
}