import {
    getWordSet,
    addNewWordToSet,
    editWord,
    deleteWord,
    deleteWordFromSet
} from './db';

import {
    hide,
    show
} from './utils';

function addDynamicContentToWordSetPage(id) {
    const wordSetTitle = document.querySelector('.word-set-title'),
        wordsElement = document.querySelector('.words'),
        trainings = document.querySelectorAll('.training-button'),
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
        getWordSet(id)
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

                trainings.forEach(training => {
                    training.innerHTML = `<div>
                        <a href="${id}/training" onclick="route()">Training</a></div>
                `;
                });


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
                        renderWords();
                    })
                    .finally(() => {
                        closeModal(modal);
                    });
            } else {
                editWord(currentWordIndex, wordToAddOrEdit)
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
        show(modal);
        nameInput.focus();
        document.body.style.overflow = 'hidden';
    }

    function closeModal() {
        hide(modal);
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

export default addDynamicContentToWordSetPage;