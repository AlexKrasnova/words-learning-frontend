import {getWordSets} from './db';

function addDynamicContentToHomePage(routes) {
    getWordSets()
        .then(data => {
            let wordSets = data;

            const wordSetsMenu = document.querySelector('.word-set-list');
            let wordSetListHtml = '';

            wordSets.forEach(item => {
                wordSetListHtml += `
                    <li>   
                        <a href="/words-learning/word-sets/${item.id}" onclick="route()">${item.name}</a>
                    </li>
                `;
                routes[`/words-learning/word-sets/${item.id}`] = '/words-learning/pages/word-set.html';
                routes[`/words-learning/word-sets/${item.id}/training`] = '/words-learning/pages/training.html';
            });

            wordSetsMenu.innerHTML = wordSetListHtml;
        });
}

export default addDynamicContentToHomePage;