'use strict';
import addDynamicContentToHomePage from './modules/homePage';
import addDynamicContentToWordSetPage from './modules/wordSetPage';
import addDynamicContentToTrainingPage from './modules/trainingPage';

const routes = {
    404: "/words-learning/pages/404.html",
    "/words-learning/": "/words-learning/pages/index.html"
};

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
        addDynamicContentToHomePage(routes);
    }

    if (path.replace(/\d/g, '') === '/words-learning/word-set/') {
        addDynamicContentToWordSetPage(+path.replace(/\D/g, ''));
    }

    if (path.replace(/\d/g, '') === '/words-learning/word-set//training') {
        addDynamicContentToTrainingPage(+path.replace(/\D/g, ''));
    }
};

window.onpopstate = handleLocation;
window.route = route;


handleLocation();