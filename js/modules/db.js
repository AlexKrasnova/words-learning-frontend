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

export {getWordSet};
export {getWordSets};
export {addWordSet};
export {editWordSet};
export {deleteWordSet};