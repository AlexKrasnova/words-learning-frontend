/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./js/modules/db.js":
/*!**************************!*\
  !*** ./js/modules/db.js ***!
  \**************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "addWordSet": () => (/* binding */ addWordSet),
/* harmony export */   "deleteWordSet": () => (/* binding */ deleteWordSet),
/* harmony export */   "editWordSet": () => (/* binding */ editWordSet),
/* harmony export */   "getWordSet": () => (/* binding */ getWordSet),
/* harmony export */   "getWordSets": () => (/* binding */ getWordSets)
/* harmony export */ });
function getWordSets() {
    return axios.get('http://localhost:8080/word-sets/')
        .then(data => data.data);
}

function getWordSet(id) {
    return axios.get(`http://localhost:8080/word-sets/${id}/`)
        .then(data => data.data);
}

function addWordSet(wordSet) {
    return axios.post('http://localhost:8080/word-sets', wordSet);
}

function editWordSet(id, wordSet) {
    return axios.put(`http://localhost:8080/word-sets/${id}`, wordSet);
}

function deleteWordSet(id) {
    return axios.delete(`http://localhost:8080/word-sets/${id}`);
}







/***/ }),

/***/ "./js/modules/homePage.js":
/*!********************************!*\
  !*** ./js/modules/homePage.js ***!
  \********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _db__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./db */ "./js/modules/db.js");
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./utils */ "./js/modules/utils.js");




function addDynamicContentToHomePage(routes) {

    const form = document.querySelector('#add-word-set-form'),
        modal = document.querySelector('#add-word-set-modal'),
        nameInput = document.querySelector('#modal__name'),
        wordSetsMenu = document.querySelector('.word-set-list'),
        addWordSetElement = document.querySelector('.add-word-set');

    let currentWordSetIndex = -1;

    renderWordSetList(routes);

    addEventListenerToAddWordSetElement();
    bindCloseModalToEvents();

    bindEventListenerToForm();

    function bindEventListenerToForm() {
        form.addEventListener('submit', (e) => {
            e.preventDefault();

            if (nameInput.value && nameInput.value != '') {
                const formData = new FormData(form);
                const object = Object.fromEntries(formData.entries());
                object.language = window.localStorage.getItem('language');
                if (currentWordSetIndex < 0) {
                    (0,_db__WEBPACK_IMPORTED_MODULE_0__.addWordSet)(object)
                        .then(data => {
                            renderWordSetList(routes);
                        })
                        .finally(() => {
                            closeModal(modal);
                        });
                } else {
                    (0,_db__WEBPACK_IMPORTED_MODULE_0__.editWordSet)(currentWordSetIndex, object)
                        .then(data => {
                            console.log(data.data);
                            renderWordSetList(routes);
                        })
                        .finally(() => {
                            closeModal(modal);
                        });
                }
            } else {
                nameInput.style.border = '3px solid red';
            }
        });
    }

    function addEventListenerToEditWordSetElement(wordSet, editWordSetElement) {
        editWordSetElement.addEventListener('click', (e) => {
            e.preventDefault();
            openModal(modal);
            nameInput.value = wordSet.name;
            currentWordSetIndex = wordSet.id;
        });
    }

    function renderWordSetList() {
        (0,_db__WEBPACK_IMPORTED_MODULE_0__.getWordSets)()
            .then(data => {
                let wordSets = data;
                let wordSetListHtml = '';
                wordSets = wordSets.filter(wordSet => wordSet.language === window.localStorage.getItem('language'));
                wordSets.forEach(item => {
                    wordSetListHtml += `
                    <li id="word-set-${item.id}">   
                        <a href="/words-learning/word-sets/${item.id}" onclick="route()">${item.name}</a>
                        <a href="" id="edit-word-set-${item.id}">Edit</a> 
                        <a href="" id="delete-word-set-${item.id}">Delete</a>
                    </li>
                `;

                    routes[`/words-learning/word-sets/${item.id}`] = '/words-learning/pages/word-set.html';
                    routes[`/words-learning/word-sets/${item.id}/training`] = '/words-learning/pages/training.html';
                });

                wordSetsMenu.innerHTML = wordSetListHtml;

                wordSets.forEach(item => {
                    const editWordSet = document.querySelector(`#edit-word-set-${item.id}`),
                        deleteWordSet = document.querySelector(`#delete-word-set-${item.id}`);

                    addEventListenerToDeletWordSetElement(item, deleteWordSet);
                    addEventListenerToEditWordSetElement(item, editWordSet);
                });
            });
    }

    function openModal() {
        (0,_utils__WEBPACK_IMPORTED_MODULE_1__.show)(modal);
        nameInput.focus();
        document.body.style.overflow = 'hidden';
    }

    function closeModal() {
        (0,_utils__WEBPACK_IMPORTED_MODULE_1__.hide)(modal);
        document.body.style.overflow = '';
        const form = document.querySelector('#add-word-set-form'),
            nameInput = modal.querySelector('#modal__name');
        nameInput.style.border = '';
        currentWordSetIndex = -1;
        form.reset();
    }

    function addEventListenerToAddWordSetElement() {
        addWordSetElement.addEventListener('click', (e) => {
            e.preventDefault();
            openModal(modal);
        });
    }

    function bindCloseModalToEvents() {

        modal.addEventListener('click', e => {
            if (e.target === modal || e.target.getAttribute('data-close') == '') {
                closeModal(modal);
            }
        });

        document.addEventListener('keydown', e => {
            if (e.code === 'Escape' && modal.classList.contains('show')) {
                closeModal(modal);
            }
        });
    }

    function addEventListenerToDeletWordSetElement(wordSet, deleteWordSetElement) {
        deleteWordSetElement.addEventListener('click', (e) => {
            e.preventDefault();
            if (confirm(`Are you sure you want to delete word set "${wordSet.name}"`)) {
                const deletedWordSet = document.querySelector(`#word-set-${wordSet.id}`);
                deletedWordSet.remove();
                (0,_db__WEBPACK_IMPORTED_MODULE_0__.deleteWordSet)(wordSet.id);
            }
        });
    }
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (addDynamicContentToHomePage);

/***/ }),

/***/ "./js/modules/trainingPage.js":
/*!************************************!*\
  !*** ./js/modules/trainingPage.js ***!
  \************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _db__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./db */ "./js/modules/db.js");
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./utils */ "./js/modules/utils.js");




function addDynamicContentToTrainingPage(id) {
    (0,_db__WEBPACK_IMPORTED_MODULE_0__.getWordSet)(id)
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

            (0,_utils__WEBPACK_IMPORTED_MODULE_1__.hide)(result);
            (0,_utils__WEBPACK_IMPORTED_MODULE_1__.hide)(previousWord);
            (0,_utils__WEBPACK_IMPORTED_MODULE_1__.hide)(trainingEnd);



            trainAgain.href = `/words-learning/word-sets/${id}/training`;

            let words = currentWordSet.words;
            words = words.sort((a, b) => 0.5 - Math.random());
            let currentIndex = 0;

            let word = words[0];

            wordLabel.textContent = word.translation;

            hint.addEventListener('click', (e) => {
                e.preventDefault();
                alert(word.name);
            });

            trainingForm.addEventListener('submit', (e) => {
                e.preventDefault();
                (0,_utils__WEBPACK_IMPORTED_MODULE_1__.show)(result);

                if (wordInput.value === word.name) {
                    resultText.textContent = 'Right!';
                    resultText.classList.add('result-right');
                    resultText.classList.remove('result-wrong');
                } else {
                    resultText.textContent = 'Wrong';
                    resultText.classList.remove('result-right');
                    resultText.classList.add('result-wrong');
                    (0,_utils__WEBPACK_IMPORTED_MODULE_1__.hide)(previousWord);
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

                (0,_utils__WEBPACK_IMPORTED_MODULE_1__.show)(previousWord);

                if (currentIndex < words.length - 1) {
                    currentIndex++;
                    word = words[currentIndex];
                    wordInput.value = '';
                    wordLabel.textContent = word.translation;
                } else {
                    (0,_utils__WEBPACK_IMPORTED_MODULE_1__.hide)(training);
                    (0,_utils__WEBPACK_IMPORTED_MODULE_1__.show)(trainingEnd);
                }
            });
        });
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (addDynamicContentToTrainingPage);

/***/ }),

/***/ "./js/modules/utils.js":
/*!*****************************!*\
  !*** ./js/modules/utils.js ***!
  \*****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "hide": () => (/* binding */ hide),
/* harmony export */   "show": () => (/* binding */ show)
/* harmony export */ });
function hide(element) {
    element.classList.add('hide');
    element.classList.remove('show');
}

function show(element) {
    element.classList.remove('hide');
    element.classList.add('show');
}




/***/ }),

/***/ "./js/modules/wordSetPage.js":
/*!***********************************!*\
  !*** ./js/modules/wordSetPage.js ***!
  \***********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _db__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./db */ "./js/modules/db.js");


function addDynamicContentToWordSetPage(id) {
    const wordSetTitle = document.querySelector('.word-set-title'),
          words = document.querySelector('.words'),
          training = document.querySelector('.training-button');
    
    (0,_db__WEBPACK_IMPORTED_MODULE_0__.getWordSet)(id)
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

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (addDynamicContentToWordSetPage);

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
/*!**********************!*\
  !*** ./js/router.js ***!
  \**********************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _modules_homePage__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./modules/homePage */ "./js/modules/homePage.js");
/* harmony import */ var _modules_wordSetPage__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./modules/wordSetPage */ "./js/modules/wordSetPage.js");
/* harmony import */ var _modules_trainingPage__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./modules/trainingPage */ "./js/modules/trainingPage.js");
/* harmony import */ var _modules_db__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./modules/db */ "./js/modules/db.js");






window.localStorage.setItem('language', 'POLISH');
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
        (0,_modules_homePage__WEBPACK_IMPORTED_MODULE_0__["default"])(routes);
    }

    if (path.replace(/\d/g, '') === '/words-learning/word-sets/') {
        (0,_modules_wordSetPage__WEBPACK_IMPORTED_MODULE_1__["default"])(+path.replace(/\D/g, ''));
    }

    if (path.replace(/\d/g, '') === '/words-learning/word-sets//training') {
        (0,_modules_trainingPage__WEBPACK_IMPORTED_MODULE_2__["default"])(+path.replace(/\D/g, ''));
    }
};

const updateDynamicRoutesAndHandleLocation = () => {

    for (const key in routes) {
        delete routes[key];
    }

    routes[404] = "/words-learning/pages/404.html";
    routes["/words-learning/"] = "/words-learning/pages/index.html";
    routes["/words-learning/lorem/"] = "/words-learning/pages/lorem.html";

    (0,_modules_db__WEBPACK_IMPORTED_MODULE_3__.getWordSets)()
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
})();

/******/ })()
;
//# sourceMappingURL=bundle.js.map