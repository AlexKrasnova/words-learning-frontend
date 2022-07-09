import {getWordSet} from './db';
import {hide} from './utils';
import {show} from './utils';

function addDynamicContentToTrainingPage(id) {
    getWordSet(id)
        .then(data => {
            let currentWordSet = data;
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



            trainAgain.href = `/words-learning/word-set/${id}/training`;

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

                let previousWordHtml = `
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
        });
}

export default addDynamicContentToTrainingPage;