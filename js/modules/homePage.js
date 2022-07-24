import {
    getWordSets,
    addWordSet,
    editWordSet,
    deleteWordSet
} from './db';
import {
    hide,
    show
} from './utils';

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
                addWordSet(object)
                    .then(data => {
                        renderWordSetList();
                    })
                    .finally(() => {
                        closeModal(modal);
                    });
            } else {
                editWordSet(currentWordSetIndex, object)
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
        getWordSets()
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
        show(modal);
        nameInput.focus();
        document.body.style.overflow = 'hidden';
    }

    function closeModal() {
        hide(modal);
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
                deleteWordSet(wordSet.id);
            }
        });
    }
}

export default addDynamicContentToHomePage;