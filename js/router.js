'use strict';
import addDynamicContentToHomePage from './modules/homePage';
import addDynamicContentToWordSetPage from './modules/wordSetPage';
import addDynamicContentToTrainingPage from './modules/trainingPage';
import {
    getWordSets
} from './modules/db';

window.localStorage.setItem('language', 'ENGLISH');
const languageElement = document.querySelector('.language');
languageElement.textContent = `Language: ${window.localStorage.getItem('language')}`;


const routes = {
    404: "/words-learning/pages/404.html",
    "/words-learning/": "/words-learning/pages/index.html",
    "/words-learning/lorem/": "/words-learning/pages/lorem.html"
};

const route = (event) => {
    event = event || window.event;
    event.preventDefault();
    window.history.pushState({}, "", event.target.href);
    updateDynamicRoutesAndHandleLocation();
};

const handleLocation = async () => {
    const path = window.location.pathname;
    const route = routes[path] || routes[404];
    const html = await axios.get(route).then((data) => data.data);
    document.getElementById("main-page").innerHTML = html;

    if (route === routes[404]) {
        return;
    }

    if (path === "/words-learning/") {
        addDynamicContentToHomePage(routes);
    }

    if (path.replace(/\d/g, '') === '/words-learning/word-sets/') {
        addDynamicContentToWordSetPage(+path.replace(/\D/g, ''));
    }

    if (path.replace(/\d/g, '') === '/words-learning/word-sets//training') {
        addDynamicContentToTrainingPage(+path.replace(/\D/g, ''));
    }
};

const updateDynamicRoutesAndHandleLocation = () => {

    for (const key in routes) {
        delete routes[key];
    }

    routes[404] = "/words-learning/pages/404.html";
    routes["/words-learning/"] = "/words-learning/pages/index.html";
    routes["/words-learning/lorem/"] = "/words-learning/pages/lorem.html";

    getWordSets()
        .then(wordSets => {
            wordSets
                .filter(wordSet => wordSet.language === window.localStorage.getItem('language'))
                .forEach(item => {
                    routes[`/words-learning/word-sets/${item.id}`] = '/words-learning/pages/word-set.html';
                    routes[`/words-learning/word-sets/${item.id}/training`] = '/words-learning/pages/training.html';
                });

        })
        .then(() => {
            handleLocation();
        });
};

window.onpopstate = updateDynamicRoutesAndHandleLocation;
window.route = route;

updateDynamicRoutesAndHandleLocation();