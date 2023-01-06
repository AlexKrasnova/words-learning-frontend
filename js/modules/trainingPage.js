import {addNewWordToSet, editWord, getWordSet} from './db';
import {hide} from './utils';
import {show} from './utils';

function addDynamicContentToTrainingPage(id) {
    getWordSet(id)
        .then(data => {
            let currentWordSet = data;
            let words = currentWordSet.words;
            let numberOfExampleInputs = 1;
            let editedWordId = -1;
            let editedCardNumber = -1;
            let numberOfFirstTimeRightAnswers = 0;
            let previousCard = -1;
            let hintCount = 0;

            words = words.sort((a, b) => 0.5 - Math.random());

            const trainingTitle = document.querySelector('.training-title'),
                wordSetLink = document.querySelector('.word-set-link'),
                editWordModal = document.querySelector('#edit-word-modal'),
                wordNameInput = document.querySelector('#word-name-input'),
                exampleInputsWrapper = document.querySelector('#word-examples-inputs-wrapper'),
                editWordForm = document.querySelector('#edit-word-form');

            wordSetLink.href = `/word-sets/${currentWordSet.id}`;

            trainingTitle.textContent = `Training "${currentWordSet.name}"`;
            addCards();
            addEventListenerToHintButtons();
            addEventListenerToForm();
            bindCloseModalToEvents(editWordModal);
            addEventListenerToAddExampleElement();
            addEventListenerToFirstDeleteExampleElement();
            // addEventListenerToSayWordElements();


            const editWordElements = document.querySelectorAll('.edit-word'),
                sayWordElements = document.querySelectorAll('.say-word');

            editWordElements.forEach((editWordElement, i) => {
                addEventListenerToEditWordElement(words[i], editWordElement);
            });

            sayWordElements.forEach((sayWordElement, i) => {
                addEventListenerToSayWordElement(words[i], sayWordElement);
            })

            bindEventListenerToEditWordForm();

            function addEventListenerToSayWordElement(word, sayWordElement) {
                sayWordElement.addEventListener('click', (e) => {
                    e.preventDefault();
                });
            }

            function addEventListenerToHintButtons() {
                const hintButtons = document.querySelectorAll('.hint-btn');

                hintButtons.forEach((hintButton) => {
                    hintButton.addEventListener('click', () => {
                        const cardNumber = hintButton.dataset.number;
                        const hintElement = document.querySelector(`#hint-${cardNumber}`),
                            wrongCorgi = document.querySelector(`#wrong-${cardNumber}`);
                        if (hintElement.classList.contains('hide')) {
                            hintCount++;
                            hide(wrongCorgi);
                            show(hintElement);
                            hintButton.textContent = 'Hide';
                        } else {
                            hide(hintElement);
                            hintButton.textContent = 'Hint';
                        }

                    })
                })
            }

            /*if (currentWordSet.words.length > 0) {
                wordCards.innerHTML = `
                    <div id="card-0" class="card">
                        <div id="card-body-new-0" class="card-body d-flex flex-column justify-content-between">
                            <div class="card-word-and-translation mb-3">
                                <div class="new-card-word-translation row">
                                    <div class="col-3 card-labels pe-0">Translation:</div>
                                    <div class="col-9">${words[0].translation}</div>
                                </div>
                                <div class="new-card-word row">
                                    <div class="col-3 card-labels pe-0 new-card-word-label">Word:</div>
                                    <div class="col-9">
                                        <form data-post action="#">
                                            <input required id="word-set-name" name="name" class="form-control"
                                                   type="text"/>
                                        </form>
                                    </div>
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-5">
                                    <img class="d-block rounded-circle new-card-corgi"
                                         src="/images/new-card-corgi.jpg" alt="Previous card corgi"/>
                                </div>
                                <div class="col-5 hint-corgi-words d-flex justify-content-center">
                                    <div>${words[0].name}</div>
                                </div>
                            </div>
                            <div class="row hide">
                                <div class="col-5">
                                    <img class="d-block rounded-circle new-card-corgi"
                                         src="/images/new-card-corgi.jpg" alt="Previous card corgi"/>
                                </div>
                                <div class="col-5 hint-corgi-words d-flex justify-content-center">
                                    <div>Wrong!</div>
                                </div>
                            </div>
                            <div class="row mb-2">
                                <div class="col-4"></div>
                                <div class="col-4">
                                    <button type="button" class="btn btn-secondary shadow-sm btn-sm btn-card w-100">
                                        Hint
                                    </button>
                                </div>
                                <div class="col-4">
                                    <a class="btn btn-primary shadow-sm btn-sm btn-card w-100" href=""
                                       onclick="route()" role="button">
                                        Check
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                `;*/

            function addCards() {

                const wordCards = document.querySelector('.word-cards'),
                    cardsContainer = document.querySelector('.cards-container');

                const wordCardsWidth = words.length * 509,
                    cardsContainerWidth = 2 * 509 + wordCardsWidth;

                wordCards.style.width = `${wordCardsWidth}px`;
                cardsContainer.style.width = `${cardsContainerWidth}px`;

                wordCards.innerHTML = '';
                words.forEach((word, i) => {
                    wordCards.innerHTML += `
                        <div id="card-${i}" class="card">
                            <div id="card-body-question-${i}" class="card-body">
                                <div class="d-flex flex-column justify-content-between h-100">
                                    <div class="card-word-and-translation mb-3">
                                        <div class="new-card-word-translation row">
                                            <div class="col-3 card-labels pe-0">Translation:</div>
                                            <div class="col-9">${words[i].translation}</div>
                                        </div>
                                        <div class="new-card-word row">
                                            <div class="col-3 card-labels pe-0 new-card-word-label">Word:</div>
                                            <div class="col-9">
                                                <form data-post action="#" id="training-form-${i}" class="training-form" data-number="${i}">
                                                    <input required id="word-name-${i}" name="name"  autocomplete="off" class="form-control word-name-input"
                                                           type="text"/>
                                                </form>
                                            </div>
                                        </div>
                                    </div>
                                    <div id="hint-${i}" class="hide">
                                        <div class="row">
                                            <div class="col-5">
                                                <img class="d-block rounded-circle new-card-corgi"
                                                     src="/images/new-card-corgi.jpg" alt="New card corgi"/>
                                            </div>
                                            <div class="col-5 hint-corgi-words d-flex justify-content-center">
                                                <div>${words[i].name}</div>
                                            </div>
                                        </div>
                                    </div>
                                    <div id="wrong-${i}" class="hide m-0 p-0">
                                        <div class="row">
                                            <div class="col-5">
                                                <img class="d-block rounded-circle new-card-corgi"
                                                     src="/images/new-card-corgi.jpg" alt="New card corgi"/>
                                            </div>
                                            <div class="col-5 hint-corgi-words d-flex justify-content-center">
                                                <div>Wrong!</div>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div class="row mb-2">
                                        <div class="col-4"></div>
                                        <div class="col-4">
                                            <button type="button" id="hint-btn-${i}" class="btn btn-secondary shadow-sm btn-sm btn-card w-100 hint-btn" data-number="${i}">
                                                Hint
                                            </button>
                                        </div>
                                        <div class="col-4">
                                            <button type="submit" form="training-form-${i}" class="btn btn-primary shadow-sm btn-sm btn-card w-100" data-number="${i}">
                                                Check
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
               
                            <div id="card-body-answer-${i}" class="card-body hide">
                                ${getAnswerCardBody(i)}
                            </div>
                        </div>
                    `;

                    const previousCardComment = document.querySelector(`#previous-card-comment-${i}`),
                        previousCardExamples = document.querySelector(`#previous-card-examples-${i}`);

                    if (word.comment == null) {
                        hide(previousCardComment);
                    }

                    if (word.examples.length === 0) {
                        hide(previousCardExamples)
                    }
                })
            }

            function addEventListenerToForm() {
                const trainingForms = document.querySelectorAll('.training-form');
                trainingForms.forEach((form) => {
                    form.addEventListener('submit', (e) => {
                        e.preventDefault();
                        const cardNumber = +form.dataset.number;
                        const wordInput = document.querySelector(`#word-name-${cardNumber}`),
                            cardBodyAnswer = document.querySelector(`#card-body-answer-${cardNumber}`),
                            cardBodyQuestion = document.querySelector(`#card-body-question-${cardNumber}`),
                            wrongCorgi = document.querySelector(`#wrong-${cardNumber}`),
                            hintElement = document.querySelector(`#hint-${cardNumber}`),
                            cardsContainer = document.querySelector(`.cards-container`),
                            wordNameInputs = document.querySelectorAll('.word-name-input'),
                            hintButton = document.querySelector(`#hint-btn-${cardNumber}`);

                        if (wordInput.value === words[cardNumber].name) {
                            hide(cardBodyQuestion);
                            show(cardBodyAnswer);
                            // cardsContainer.style.transform = `translateX(-${(cardNumber) * 509}px)`;
                            const shift = (cardNumber + 1) * 509;
                            if (previousCard !== cardNumber && hintCount == 0) {
                                numberOfFirstTimeRightAnswers++;
                            }
                            hintCount = 0;
                            cardsContainer.style.transform = `translateX(-${shift}px)`;
                            if (cardNumber < words.length - 1) {
                                wordNameInputs[cardNumber + 1].focus();
                            } else {
                                addResultToFarewellCard();
                            }
                        } else {
                            wordInput.style.borderColor = "red";
                            show(wrongCorgi);
                            hide(hintElement);
                            hintButton.textContent = 'Hint';
                        }
                        previousCard = cardNumber;
                    })

                });
            }

            function addResultToFarewellCard() {
                const resultElement = document.querySelector('#result');
                resultElement.textContent = `${numberOfFirstTimeRightAnswers}/${words.length}`;
            }

            function openModal(modal) {
                show(modal);
                wordNameInput.focus();
                document.body.style.overflow = 'hidden';
            }

            function closeModal(modal) {
                hide(modal);
                document.body.style.overflow = '';
                /*                currentWordIndex = -1;*/
                numberOfExampleInputs = 1;
                exampleInputsWrapper.innerHTML = `
                    <div class="input-group mb-3">
                        <input type="text" class="form-control word-example-input" placeholder="Example 1" name="example1"
                            aria-label="Example 1" aria-describedby="basic-addon2">
                        <div class="input-group-append">
                            <button id="delete-example-1" class="btn btn-outline-secondary" type="button">
                                Delete
                            </button>
                        </div>
                    </div>
                `;
                addEventListenerToFirstDeleteExampleElement();
                editWordForm.reset();
            }

            function addEventListenerToFirstDeleteExampleElement() {
                const deleteExample1 = document.querySelector('#delete-example-1');
                deleteExample1.addEventListener('click', (e) => {
                    e.preventDefault();
                    deleteExample1.parentElement.parentElement.remove();
                });
            }

            function bindCloseModalToEvents(modal) {

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

            function addEventListenerToEditWordElement(word, editWordElement) {
                editWordElement.addEventListener('click', (e) => {
                    e.preventDefault();
                    openModal(editWordModal);
                    const translationInput = document.querySelector('#word-translation-input'),
                        commentInput = document.querySelector('#word-comment-input');

                    wordNameInput.value = word.name;
                    translationInput.value = word.translation;
                    commentInput.value = word.comment;
                    editedWordId = word.id;
                    editedCardNumber = editWordElement.dataset.number;

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

            function addEventListenerToAddExampleElement() {
                const addExampleElement = document.querySelector('#add-example');
                addExampleElement.addEventListener('click', (e) => {
                    e.preventDefault();
                    addExampleInput();
                });
            }

            function addExampleInput() {
                numberOfExampleInputs++;
                const div = document.createElement('div');
                div.innerHTML = `
                    <div class="input-group mb-3">
                        <input type="text" class="form-control word-example-input" placeholder="Example ${numberOfExampleInputs}" name="example${numberOfExampleInputs}" aria-label="Example 1" aria-describedby="basic-addon2">
                        <div class="input-group-append">
                            <button id="delete-example-${numberOfExampleInputs}" class="btn btn-outline-secondary" type="button">Delete</button>
                        </div>
                    </div>
                `;
                exampleInputsWrapper.append(div);
                const deleteExample = document.querySelector(`#delete-example-${numberOfExampleInputs}`);
                deleteExample.addEventListener('click', (e) => {
                    e.preventDefault();
                    deleteExample.parentElement.parentElement.remove();
                });

            }

            function bindEventListenerToEditWordForm() {
                editWordForm.addEventListener('submit', (e) => {
                    e.preventDefault();

                    const formData = new FormData(editWordForm);
                    const object = Object.fromEntries(formData.entries());
                    const wordToAddOrEdit = {};
                    wordToAddOrEdit.id = editedWordId;
                    wordToAddOrEdit.name = object.name;
                    wordToAddOrEdit.translation = object.translation;
                    wordToAddOrEdit.comment = object.comment;
                    wordToAddOrEdit.language = window.localStorage.getItem('language');
                    wordToAddOrEdit.examples = [];
                    for (let key in object) {
                        if (key.replace(/\d/g, '') === 'example' && object[key] != '') {
                            wordToAddOrEdit.examples.push(object[key]);
                        }
                    }
                    if (wordToAddOrEdit.comment === '') {
                        wordToAddOrEdit.comment = null;
                    }

                    /*if (currentWordIndex < 0) {
                        addNewWordToSet(currentWordSet.id, wordToAddOrEdit)
                            .then(data => {
                                renderWordsAndTitle();
                            })
                            .finally(() => {
                                closeModal(addWordModal);
                            });
                    } else {*/
                    editWord(editedWordId, wordToAddOrEdit)
                        .then(data => {
                            console.log(data.data);
                            words[editedCardNumber] = wordToAddOrEdit;
                            renderAnswerContentOfCard(editedCardNumber);
                        })
                        .finally(() => {
                            closeModal(editWordModal);
                        });
                    // }
                });
            }

            function renderAnswerContentOfCard(cardNumber) {
                const answerContentOfCard = document.querySelector(`#card-body-answer-${cardNumber}`);
                const word = words[cardNumber];

                answerContentOfCard.innerHTML = getAnswerCardBody(cardNumber);

                const editWordElement = document.querySelector(`#edit-word-${cardNumber}`),
                    sayWordElement = document.querySelector(`#say-word-${cardNumber}`);
                addEventListenerToEditWordElement(words[cardNumber], editWordElement);
                addEventListenerToSayWordElement(words[cardNumber], sayWordElement);
            }

            function getAnswerCardBody(cardNumber) {
                const word = words[cardNumber];
                let examples = '';
                if (word.examples.length > 0) {
                    examples = 'Examples<br><ul>';

                    word.examples.forEach((example) => {
                        examples += `<li>${example}</li>`;
                    })
                    examples += '</ul>';
                }
                let comment = '';
                if (word.comment) {
                    comment = `Comment:<br>${word.comment}`;
                }

                return `<div class="row">
                                    <div class="col-4"></div>
                                    <div class="col-4 right-corgi-words d-flex justify-content-center">
                                        <div>Right!</div>
                                    </div>
                                    <div class="col-4">
                                        <img class="d-block rounded-circle previous-card-corgi"
                                             src="/images/previous-card-corgi.jpg" alt="Previous card corgi"/>
                                    </div>
                                </div>
                                <div class="previous-card-word-container mt-3">
                                    <div class="previous-card-word-content d-flex flex-column justify-content-around">
                                        <div class="card-word-and-translation">
                                            <div class="previous-card-word row">
                                                <div class="col-3 card-labels pe-0">Word:</div>
                                                <div class="col-7">
                                                    <span>${word.name}</span>&nbsp;&nbsp;
                                                    <a href="#" id="say-word-${cardNumber}" class="say-word" data-number="${cardNumber}">
                                                        <img src="/images/volume-low-solid.svg" alt="Sound"/>
                                                    </a>
                                                </div>
                                                <div class="col-1">
                                                    <a href="#" id="edit-word-${cardNumber}" class="edit-word" data-number="${cardNumber}">
                                                        <img src="/images/pencil-solid.svg" alt="Edit"/>
                                                    </a>
                                                </div>
                                            </div>
                                            <div class="previous-card-word-translation row">
                                                <div class="col-3 card-labels pe-0">Translation:</div>
                                                <div class="col-9">${word.translation}</div>
                                            </div>
                                        </div>
                                        <div id="previous-card-examples-${cardNumber}" class="mt-1">
                                            ${examples}
                                        </div>
                                        <div id="previous-card-comment-${cardNumber}" class="mt-1">
                                            ${comment}
                                        </div>
                                    </div>
                                </div>`;
            }
        })
}

export default addDynamicContentToTrainingPage;

