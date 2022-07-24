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
/* harmony export */   "addNewWordToSet": () => (/* binding */ addNewWordToSet),
/* harmony export */   "addWordSet": () => (/* binding */ addWordSet),
/* harmony export */   "deleteWord": () => (/* binding */ deleteWord),
/* harmony export */   "deleteWordFromSet": () => (/* binding */ deleteWordFromSet),
/* harmony export */   "deleteWordSet": () => (/* binding */ deleteWordSet),
/* harmony export */   "editWord": () => (/* binding */ editWord),
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

function addNewWordToSet(setId, word) {
    return axios.post(`http://localhost:8080/word-sets/${setId}/words`, word);
}

function editWord(id, word) {
    return axios.put(`http://localhost:8080/words/${id}`, word);
}

function deleteWord(id) {
    return axios.delete(`http://localhost:8080/words/${id}`);
}

function deleteWordFromSet(wordId, setId) {
    return axios.delete(`http://localhost:8080/word-sets/${setId}/words/${wordId}`);
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
        addWordSetElements = document.querySelectorAll('.add-word-set');

    let currentWordSetIndex = -1;

    renderWordSetList(routes);

    addEventListenerToAddWordSetElements();
    bindCloseModalToEvents();

    bindEventListenerToForm();

    function bindEventListenerToForm() {
        form.addEventListener('submit', (e) => {
            e.preventDefault();

            const formData = new FormData(form);
            const object = Object.fromEntries(formData.entries());
            object.language = window.localStorage.getItem('language');
            if (currentWordSetIndex < 0) {
                (0,_db__WEBPACK_IMPORTED_MODULE_0__.addWordSet)(object)
                    .then(data => {
                        renderWordSetList();
                    })
                    .finally(() => {
                        closeModal(modal);
                    });
            } else {
                (0,_db__WEBPACK_IMPORTED_MODULE_0__.editWordSet)(currentWordSetIndex, object)
                    .then(data => {
                        console.log(data.data);
                        renderWordSetList();
                    })
                    .finally(() => {
                        closeModal(modal);
                    });
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
                        <a class="word-set-name-list" href="/words-learning/word-sets/${item.id}" onclick="route()">${item.name}</a>
                        <a href="#" id="edit-word-set-${item.id}">Edit</a> 
                        <a href="#" id="delete-word-set-${item.id}">Delete</a>
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
        currentWordSetIndex = -1;
        form.reset();
    }

    function addEventListenerToAddWordSetElements() {
        addWordSetElements.forEach(addWordSetElement => {
            addWordSetElement.addEventListener('click', (e) => {
                e.preventDefault();
                openModal(modal);
            });
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
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./utils */ "./js/modules/utils.js");




function addDynamicContentToWordSetPage(id) {
    const wordSetTitle = document.querySelector('.word-set-title'),
        wordsElement = document.querySelector('.words'),
        training = document.querySelector('.training-button'),
        modal = document.querySelector('.modal'),
        addWordElements = document.querySelectorAll('.add-word'),
        addExampleElement = document.querySelector('#add-example'),
        nameInput = document.querySelector('#word-name-input'),
        translationInput = document.querySelector('#word-translation-input'),
        commentInput = document.querySelector('#word-comment-input'),
        exampleInputsWrapper = document.querySelector('#word-examples-inputs-wrapper'),
        form = document.querySelector('#add-word-form');
        
    let currentWordIndex = -1,
        currentWordSet,
        numberOfExampleInputs = 1;

    renderWords();
    addEventListenerToAddWordElements();
    bindCloseModalToEvents();
    bindEventListenerToForm();
    addEventListenerToAddExampleElement();
    addEventListenerToFirstDeleteExampleElement();

    const compareWordsByName = (word1, word2) => {
        return (word1.name).toLowerCase().localeCompare((word2.name).toLowerCase());
    };

    function renderWords() {
        (0,_db__WEBPACK_IMPORTED_MODULE_0__.getWordSet)(id)
            .then(data => {
                currentWordSet = data;
                wordSetTitle.textContent = currentWordSet.name;
                let words = currentWordSet.words;
                words = words.sort(compareWordsByName);
                let wordsHtml = '';
                words.forEach((word, i) => {
                    let examplesHtml = '';
                    word.examples.forEach((example, i) => {
                        examplesHtml += `<br>${example}`;
                    });
                    examplesHtml = examplesHtml.slice(4);
                    wordsHtml += `
                    <li id="word-${word.id}" class="word-set__word">
                        <div class="word">
                            <div class="word-element number">${i + 1}</div>
                            <div class="word-element">${word.name}</div>
                            <div class="word-element">${word.translation}</div>
                            <div class="word-element">${examplesHtml}</div>
                            <div class="word-element">${word.comment ? word.comment : ''}</div>
                            <div id="edit-word-${word.id}" class="word-element"><a href="#">Edit</a></div>
                            <div id="delete-word-${word.id}" class="word-element"><a href="#">Delete</a></div>
                        </div>
                    </li>
                `;
                });
                wordsElement.innerHTML = wordsHtml;

                words.forEach(item => {
                    const editWord = document.querySelector(`#edit-word-${item.id}`),
                        deleteWord = document.querySelector(`#delete-word-${item.id}`);

                    addEventListenerToDeletWordElement(item, deleteWord);
                    addEventListenerToEditWordElement(item, editWord);
                });

                training.innerHTML = `
                <a href="${id}/training" onclick="route()">Training</a></div>
            `;
            });
    }

    function bindEventListenerToForm() {
        form.addEventListener('submit', (e) => {
            e.preventDefault();

            const formData = new FormData(form);
            const object = Object.fromEntries(formData.entries());
            const wordToAddOrEdit = {};
            wordToAddOrEdit.name = object.name;
            wordToAddOrEdit.translation = object.translation;
            wordToAddOrEdit.comment = object.comment;
            wordToAddOrEdit.language = window.localStorage.getItem('language');
            wordToAddOrEdit.examples = []; 
            for (let key in object) {
                if(key.replace(/\d/g, '') === 'example' && object[key] != '') {
                    wordToAddOrEdit.examples.push(object[key]);
                }
            }
            if (wordToAddOrEdit.comment === '') {
                wordToAddOrEdit.comment = null;
            }
            
            if (currentWordIndex < 0) {
                (0,_db__WEBPACK_IMPORTED_MODULE_0__.addNewWordToSet)(currentWordSet.id, wordToAddOrEdit)
                    .then(data => {
                        renderWords();
                    })
                    .finally(() => {
                        closeModal(modal);
                    });
            } else {
                (0,_db__WEBPACK_IMPORTED_MODULE_0__.editWord)(currentWordIndex, wordToAddOrEdit)
                    .then(data => {
                        console.log(data.data);
                        renderWords();
                    })
                    .finally(() => {
                        closeModal(modal);
                    });
            }
        });
    }
    
    function addEventListenerToAddExampleElement() {
        addExampleElement.addEventListener('click', (e) => {
            e.preventDefault();
            addExampleInput();
        }); 
    }

    function addExampleInput() {
        numberOfExampleInputs++;
        const div = document.createElement('div');
        div.innerHTML = `
            <input class="word-example-input" name="example${numberOfExampleInputs}" type="text">
            <a id="delete-example-${numberOfExampleInputs}" href="#">Delete</a>
        `;
        exampleInputsWrapper.append(div);
        const deleteExample = document.querySelector(`#delete-example-${numberOfExampleInputs}`);
        deleteExample.addEventListener('click', (e) => {
            e.preventDefault();
            deleteExample.parentElement.remove();
        });
        
    }

    function addEventListenerToAddWordElements() {
        addWordElements.forEach(addWordElement => {
            addWordElement.addEventListener('click', (e) => {
                e.preventDefault();
                openModal(modal);
            });
        });
    }

    function addEventListenerToDeletWordElement(word, deleteWordElement) {
        deleteWordElement.addEventListener('click', (e) => {
            e.preventDefault();
            if (confirm(`Are you sure you want to delete word "${word.name}" from word set "${currentWordSet.name}?"`)) {
                const deletedWord = document.querySelector(`#word-${word.id}`);
                deletedWord.remove();
                (0,_db__WEBPACK_IMPORTED_MODULE_0__.deleteWordFromSet)(word.id, currentWordSet.id);
            }
            if (confirm(`Do you want to delete word "${word.name}" from your word database?"`)) {
                (0,_db__WEBPACK_IMPORTED_MODULE_0__.deleteWord)(word.id);
            }
        });
    }

    function addEventListenerToEditWordElement(word, editWordElement) {
        editWordElement.addEventListener('click', (e) => {
            e.preventDefault();
            openModal(modal);
            nameInput.value = word.name;
            translationInput.value = word.translation;
            commentInput.value = word.comment;
            currentWordIndex = word.id;

            let exampleInputs = document.querySelectorAll('.word-example-input');

            if (word.examples.length > 0) {
                exampleInputs[0].value = word.examples[0];
            } 
            
            if (word.examples.length > 1) {
                for (let i = 1; i < word.examples.length; i++) {
                    addExampleInput();
                    exampleInputs = document.querySelectorAll('.word-example-input');
                    exampleInputs[i].value = word.examples[i];
                }
            }
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

    function openModal() {
        (0,_utils__WEBPACK_IMPORTED_MODULE_1__.show)(modal);
        nameInput.focus();
        document.body.style.overflow = 'hidden';
    }

    function closeModal() {
        (0,_utils__WEBPACK_IMPORTED_MODULE_1__.hide)(modal);
        document.body.style.overflow = '';
        currentWordIndex = -1;
        numberOfExampleInputs = 1;
        exampleInputsWrapper.innerHTML = `
            <div>
                <input class="word-example-input" name="example1" type="text">
                <a id="delete-example-1" href="#">Delete</a>
            </div>
        `;
        addEventListenerToFirstDeleteExampleElement();
        form.reset();
    }

    function addEventListenerToFirstDeleteExampleElement() {
        const deleteExample1 = document.querySelector('#delete-example-1');
            deleteExample1.addEventListener('click', (e) => {
                e.preventDefault();
                deleteExample1.parentElement.remove();
        });
    }
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