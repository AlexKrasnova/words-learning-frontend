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


function addDynamicContentToHomePage(routes) {
    (0,_db__WEBPACK_IMPORTED_MODULE_0__.getWordSets)()
        .then(data => {
            let wordSets = data;

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
        });
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
        (0,_modules_homePage__WEBPACK_IMPORTED_MODULE_0__["default"])(routes);
    }

    if (path.replace(/\d/g, '') === '/words-learning/word-set/') {
        (0,_modules_wordSetPage__WEBPACK_IMPORTED_MODULE_1__["default"])(+path.replace(/\D/g, ''));
    }

    if (path.replace(/\d/g, '') === '/words-learning/word-set//training') {
        (0,_modules_trainingPage__WEBPACK_IMPORTED_MODULE_2__["default"])(+path.replace(/\D/g, ''));
    }
};

window.onpopstate = handleLocation;
window.route = route;


handleLocation();
})();

/******/ })()
;
//# sourceMappingURL=bundle.js.map