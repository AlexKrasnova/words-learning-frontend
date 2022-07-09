function getWordSets() {
    return axios.get('http://localhost:8080/word-sets/')
        .then(data => data.data);
}

function getWordSet(id) {
    return axios.get(`http://localhost:8080/word-sets/${id}/`)
        .then(data => data.data);
}

export {getWordSet};
export {getWordSets};