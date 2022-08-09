'use strict';
import "bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle";
import "@fortawesome/fontawesome-free/css/all.css";
import "/css/style.css";
import addDynamicContentToHomePage from './modules/homePage';
import addDynamicContentToWordSetPage from './modules/wordSetPage';
import addDynamicContentToTrainingPage from './modules/trainingPage';
import {
    getWordSets
} from './modules/db';

const languageSelect = document.querySelector('#languages');
const language =  window.localStorage.getItem('language');

if(language) {
    languageSelect.value = language;
} else {
    languageSelect.value = 'POLISH';
    window.localStorage.setItem('language', 'POLISH');
}
languageSelect.addEventListener('change', () => {
    window.localStorage.setItem('language', languageSelect.value);
    window.location.reload();
});


const routes = {
    404: "/pages/404.html",
    "/": "/pages/index.html"
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

    if (path === "/") {
        //addDynamicContentToHomePage(routes);
    }

    if (path.replace(/\d/g, '') === '/word-sets/') {
        addDynamicContentToWordSetPage(+path.replace(/\D/g, ''));
    }

    if (path.replace(/\d/g, '') === '/word-sets//training') {
        addDynamicContentToTrainingPage(+path.replace(/\D/g, ''));
    }
};

const updateDynamicRoutesAndHandleLocation = () => {

    for (const key in routes) {
        delete routes[key];
    }

    routes[404] = "/pages/404.html";
    routes["/"] = "/pages/index.html";

    getWordSets()
        .then(wordSets => {
            wordSets
                .filter(wordSet => wordSet.language === window.localStorage.getItem('language'))
                .forEach(item => {
                    routes[`/word-sets/${item.id}`] = '/pages/word-set.html';
                    routes[`/word-sets/${item.id}/training`] = '/pages/training.html';
                });

        })
        .then(() => {
            handleLocation();
        });
};

window.onpopstate = updateDynamicRoutesAndHandleLocation;
window.route = route;

updateDynamicRoutesAndHandleLocation();