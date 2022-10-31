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
        nameInput = document.querySelector('#word-set-name'),
        wordSetsTableContent = document.querySelector('.word-sets-table-content'),
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

    function renderWordSetList() {
        getWordSets()
            .then(data => {
                let wordSets = data;
                let wordSetListHtml = '';
                wordSets = wordSets.filter(wordSet => wordSet.language === window.localStorage.getItem('language'));
                wordSets.forEach((item, i) => {
                    wordSetListHtml += `
                        <tr id="word-set-${item.id}">
                            <th scope="row">${i + 1}</th>
                            <td class="word-set-name-td"><a class="word-set-name" href="/word-sets/${item.id}" onclick="route()">${item.name}</a></td>
                            <td class="medium-column-word-sets">${item.wordCount}</td>
                            <td><a class="btn btn-secondary btn-sm shadow-sm medium-column-word-sets small-button" href="word-sets/1/training" onclick="route()" role="button">Training</a></td>
                            <td class="small-column">
                                <a href="#" id="delete-word-set-${item.id}">
                                    <img src="images/trash-can-solid.svg" alt="Delete"/>
                                </a>
                            </td>
                        </tr>
                    `;

                    routes[`/word-sets/${item.id}`] = '/pages/word-set.html';
                    routes[`/word-sets/${item.id}/training`] = '/pages/training.html';
                });

                wordSetsTableContent.innerHTML = wordSetListHtml;

                wordSets.forEach(item => {
                    const deleteWordSet = document.querySelector(`#delete-word-set-${item.id}`);

                    addEventListenerToDeleteWordSetElement(item, deleteWordSet);
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

    function addEventListenerToDeleteWordSetElement(wordSet, deleteWordSetElement) {
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