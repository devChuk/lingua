let flashcards = [];

function el(id) {
    return document.getElementById(id);
}

function shuffle(array) {
  var currentIndex = array.length, temporaryValue, randomIndex;
  // While there remain elements to shuffle...
  while (0 !== currentIndex) {
    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;
    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }
  return array;
}

// loop thru data object to populate global flashcards array
function populateFlashCards(data) {
    console.log(data);
    for (let key in data) {
        flashcards.push(data[key]);
    }
    flashcards = shuffle(flashcards);
}

// setup UI
function setup() {
    if (flashcards.length === 0) {
        el('word').innerText = 'No flashcards';
        return;
    }

    el('word').innerText = flashcards[0].original;
    el('link').onclick = () => {
        window.open(flashcards[0].url, '_blank');
    };
    el('flip').onclick = () => {
        if (el('word').innerText !== flashcards[0].translation) {
            el('word').innerText = flashcards[0].translation;
        } else {
            el('word').innerText = flashcards[0].original;
        }
    };
    el('skip').onclick = () => {
        flashcards.push(flashcards.shift());
        el('word').innerText = flashcards[0].original;
    };
    el('delete').onclick = () => {
        flashcards.shift();
        if (flashcards.length > 0) {
            el('word').innerText = flashcards[0].original;
        } else {
            el('word').innerText = 'No flashcards left';
        }
    };
}

fetch('http://brianchuk.pythonanywhere.com/getindexcards')
    .then(response => response.json()) //parses response to JSON
    .then(data => {
        populateFlashCards(data);
        setup();
    })
    .catch(error => {console.error(error)});
