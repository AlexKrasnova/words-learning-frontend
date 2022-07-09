import {getWordSet} from './db';

function addDynamicContentToWordSetPage(id) {
    const wordSetTitle = document.querySelector('.word-set-title'),
          words = document.querySelector('.words'),
          training = document.querySelector('.training-button');

    getWordSet(id)
        .then(data => {
            let currentWordSet = data;
            wordSetTitle.textContent = currentWordSet.name;
            let wordsHtml = '';
            currentWordSet.words.forEach((word, i) => {
                wordsHtml += `
                    <li>${i + 1}. ${word.name}</li>
                `;
            });
            words.innerHTML = wordsHtml;

            training.innerHTML = `
                <a href="${id}/training" onclick="route()">Training</a></div>
            `;
        });
}

export default addDynamicContentToWordSetPage;