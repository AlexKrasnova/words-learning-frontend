import {getWordSet} from './db';
import {hide} from './utils';
import {show} from './utils';

function addDynamicContentToTrainingPage(id) {
    getWordSet(id)
        .then(data => {
            let currentWordSet = data;
            let words = currentWordSet.words;

            words = words.sort((a, b) => 0.5 - Math.random());

            const trainingTitle = document.querySelector('.training-title'),
            wordSetLink = document.querySelector('.word-set-link');

            wordSetLink.href = `/word-sets/${currentWordSet.id}`;

            trainingTitle.textContent = `Training "${currentWordSet.name}"`;
            addCards();
            addEventListenerToHintButtons();
            addEventListenerToForm();

            const editWordElements = document.querySelectorAll('.edit-word');
            editWordElements.forEach((editWordElement, i) => {
                editWordElement.addEventListener('click', (e) => {
                    e.preventDefault();
                })
            });

            function addEventListenerToHintButtons() {
                const hintButtons = document.querySelectorAll('.hint-btn');

                hintButtons.forEach((hintButton) => {
                    hintButton.addEventListener('click', () => {
                        const cardNumber = hintButton.dataset.number;
                        const hintElement = document.querySelector(`#hint-${cardNumber}`);
                        if (hintElement.classList.contains('hide')) {
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
                                                    <input required id="word-name-${i}" name="name" class="form-control word-name-input"
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
                                            <button type="button" class="btn btn-secondary shadow-sm btn-sm btn-card w-100 hint-btn" data-number="${i}">
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
                                <div class="row">
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
                                                    <span>${words[i].name}</span>&nbsp;&nbsp;
                                                    <a href="#" id="say-word">
                                                        <img src="/images/volume-low-solid.svg" alt="Sound"/>
                                                    </a>
                                                </div>
                                                <div class="col-1">
                                                    <a href="#" id="edit-word-${i}" class="edit-word">
                                                        <img src="/images/pencil-solid.svg" alt="Edit"/>
                                                    </a>
                                                </div>
                                            </div>
                                            <div class="previous-card-word-translation row">
                                                <div class="col-3 card-labels pe-0">Translation:</div>
                                                <div class="col-9">${words[i].translation}</div>
                                            </div>
                                        </div>
                                        <div id="previous-card-examples-${i}" class="mt-1">
                                            ${examples}
                                        </div>
                                        <div id="previous-card-comment-${i}" class="mt-1">
                                            ${comment}
                                        </div>
                                    </div>
                                </div>
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
                            cardsContainer = document.querySelector(`.cards-container`),
                            wordNameInputs = document.querySelectorAll('.word-name-input');

                        if (wordInput.value === words[cardNumber].name) {
                            hide(cardBodyQuestion);
                            show(cardBodyAnswer);
                            // cardsContainer.style.transform = `translateX(-${(cardNumber) * 509}px)`;
                            const shift = (cardNumber + 1) * 509
                            cardsContainer.style.transform = `translateX(-${shift}px)`;
                            if (cardNumber < words.length - 1) {
                                wordNameInputs[cardNumber + 1].focus();
                            }
                        } else {
                            wordInput.style.borderColor = "red";
                            show(wrongCorgi);
                        }
                    })

                });
            }

            /*function openModal(modal) {
                show(modal);
                wordNameInput.focus();
                document.body.style.overflow = 'hidden';
            }

            function closeModal(modal) {
                hide(modal);
                document.body.style.overflow = '';
/!*                currentWordIndex = -1;
                numberOfExampleInputs = 1;*!/
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
                addWordForm.reset();
            }

            function addEventListenerToFirstDeleteExampleElement() {
                const deleteExample1 = document.querySelector('#delete-example-1');
                deleteExample1.addEventListener('click', (e) => {
                    e.preventDefault();
                    deleteExample1.parentElement.remove();
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
                    openModal(addWordModal);
                    wordNameInput.value = word.name;
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
            }*/


                /*trainingForm.addEventListener('submit', (e) => {
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
                });*/
        })

    /*const trainingTitle = document.querySelector('.training-title'),
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



    trainAgain.href = `/word-sets/${id}/training`;

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
    });*/
}

export default addDynamicContentToTrainingPage;