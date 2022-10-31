import {
    getWordSet,
    addNewWordToSet,
    editWord,
    deleteWord,
    deleteWordFromSet,
    editWordSet
} from './db';

import {
    hide,
    show
} from './utils';

function addDynamicContentToWordSetPage(id) {
    const wordSetTitle = document.querySelector('.word-set-title'),
        wordsElement = document.querySelector('.words'),
        wordsTableContent = document.querySelector('.words-table-content'),
        training = document.querySelector('.training-button'),
        editWordSetNameModal = document.querySelector('#edit-wordset-name-modal'),
        addWordModal = document.querySelector('#add-word-modal'),
        addWordElements = document.querySelectorAll('.add-word'),
        addExampleElement = document.querySelector('#add-example'),
        wordNameInput = document.querySelector('#word-name-input'),
        translationInput = document.querySelector('#word-translation-input'),
        commentInput = document.querySelector('#word-comment-input'),
        exampleInputsWrapper = document.querySelector('#word-examples-inputs-wrapper'),
        addWordForm = document.querySelector('#add-word-form'),
        editWordsetForm = document.querySelector('#edit-word-set-form');

    let currentWordIndex = -1,
        currentWordSet,
        numberOfExampleInputs = 1;

    renderWordsAndTitle();
    addEventListenerToAddWordElements();
    bindCloseModalToEvents(addWordModal);
    bindCloseModalToEvents(editWordSetNameModal);
    bindEventListenerToAddWordForm();
    bindEventListenerToEditWordsetForm();
    addEventListenerToAddExampleElement();
    addEventListenerToFirstDeleteExampleElement();

    const compareWordsByName = (word1, word2) => {
        return (word1.name).toLowerCase().localeCompare((word2.name).toLowerCase());
    };

    function renderWordsAndTitle() {
        getWordSet(id)
            .then(data => {
                currentWordSet = data;
                wordSetTitle.innerHTML = `${currentWordSet.name} 
                    <a href="#" id="edit-wordset-name">
                        <img src="/images/pencil-solid.svg" alt="Edit" />
                    </a>
                `;
                const editWordSetNameElement = document.querySelector('#edit-wordset-name');
                editWordSetNameElement.addEventListener('click', (e) => {
                    e.preventDefault();
                    openModal(editWordSetNameModal);
                    const wordSetNameInput = document.querySelector('#wordset-name-input');
                    wordSetNameInput.value = currentWordSet.name;
                    // currentWordSetIndex = currentWordSet.id;
                });
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
                        <tr id="word-${word.id}">
                            <th scope="row">${i + 1}</th>
                            <td class="medium-collumn">${word.name}</td>
                            <td class="small-column">
                                <a href="#" id="say-word-1">
                                    <img src="/images/volume-low-solid.svg" alt="Sound" />
                                </a>
                            </td>
                            <td class="medium-collumn">${word.translation}</td>
                            <td class="large-collumn">${examplesHtml}</td>
                            <td class="large-collumn">${word.comment ? word.comment : ""}</td>
                            <td class="small-column">
                                <a href="#" id="edit-word-${word.id}">
                                    <img src="/images/pencil-solid.svg" alt="Edit" />
                                </a>
                            </td>
                            <td class="small-column">
                                <a href="#" id="delete-word-${word.id}">
                                    <img src="/images/trash-can-solid.svg" alt="Delete" />
                                </a>
                            </td>
                        </tr>
                    `;

                    //     `
                    //     <li id="word-${word.id}" class="word-set__word">
                    //         <div class="word">
                    //             <div class="word-element number">${i + 1}</div>
                    //             <div class="word-element">${word.name}</div>
                    //             <div class="word-element">${word.translation}</div>
                    //             <div class="word-element">${examplesHtml}</div>
                    //             <div class="word-element">${word.comment ? word.comment : ''}</div>
                    //             <div id="edit-word-${word.id}" class="word-element"><a href="#">Edit</a></div>
                    //             <div id="delete-word-${word.id}" class="word-element"><a href="#">Delete</a></div>
                    //         </div>
                    //     </li>
                    // `;
                });
                //wordsElement.innerHTML = wordsHtml;
                wordsTableContent.innerHTML = wordsHtml;

                words.forEach(item => {
                    const editWord = document.querySelector(`#edit-word-${item.id}`),
                        deleteWord = document.querySelector(`#delete-word-${item.id}`);

                    addEventListenerToDeleteWordElement(item, deleteWord);
                    addEventListenerToEditWordElement(item, editWord);
                });


                training.innerHTML = `
                    <a class="btn btn-primary shadow btn-lg" href="${id}/training" onclick="route()" role="button">
                        Training
                    </a>
                `;

                // `<div>
                //         <a href="${id}/training" onclick="route()">Training</a></div>
                // `;


            });
    }

    function bindEventListenerToEditWordsetForm() {
        editWordsetForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const formData = new FormData(editWordsetForm);
            const object = Object.fromEntries(formData.entries());
            object.language = window.localStorage.getItem('language');
            editWordSet(currentWordSet.id, object)
                .then(data => {
                    console.log(data.data);
                    renderWordsAndTitle();
                })
                .finally(() => {
                    closeModal(editWordSetNameModal);
                });
        });
    }

    function bindEventListenerToAddWordForm() {
        addWordForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const formData = new FormData(addWordForm);
            const object = Object.fromEntries(formData.entries());
            const wordToAddOrEdit = {};
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

            if (currentWordIndex < 0) {
                addNewWordToSet(currentWordSet.id, wordToAddOrEdit)
                    .then(data => {
                        renderWordsAndTitle();
                    })
                    .finally(() => {
                        closeModal(addWordModal);
                    });
            } else {
                editWord(currentWordIndex, wordToAddOrEdit)
                    .then(data => {
                        console.log(data.data);
                        renderWordsAndTitle();
                    })
                    .finally(() => {
                        closeModal(addWordModal);
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

    function addEventListenerToAddWordElements() {
        addWordElements.forEach(addWordElement => {
            addWordElement.addEventListener('click', (e) => {
                e.preventDefault();
                openModal(addWordModal);
            });
        });
    }

    function addEventListenerToDeleteWordElement(word, deleteWordElement) {
        deleteWordElement.addEventListener('click', (e) => {
            e.preventDefault();
            if (confirm(`Are you sure you want to delete word "${word.name}" from word set "${currentWordSet.name}?"`)) {
                const deletedWord = document.querySelector(`#word-${word.id}`);
                deletedWord.remove();
                deleteWordFromSet(word.id, currentWordSet.id);
            }
            if (confirm(`Do you want to delete word "${word.name}" from your word database?"`)) {
                deleteWord(word.id);
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

    function openModal(modal) {
        show(modal);
        wordNameInput.focus();
        document.body.style.overflow = 'hidden';
    }

    function closeModal(modal) {
        hide(modal);
        document.body.style.overflow = '';
        currentWordIndex = -1;
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
        addWordForm.reset();
    }

    function addEventListenerToFirstDeleteExampleElement() {
        const deleteExample1 = document.querySelector('#delete-example-1');
        deleteExample1.addEventListener('click', (e) => {
            e.preventDefault();
            deleteExample1.parentElement.remove();
        });
    }
}

export default addDynamicContentToWordSetPage;