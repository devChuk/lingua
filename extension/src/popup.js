const urlQueryString = 'https://translation.googleapis.com/language/translate/v2/?key=AIzaSyAtYeX5ws-W7wfkNOSYVTr0G3kJoaP2LTQ';

function el(id) {
    return document.getElementById(id);
}

function populateFlashCard(original, translation) {
    el('original').innerText = original;
    el('translation').innerText = translation;
}

function activateTranslate(tab) {
    chrome.tabs.sendMessage(
        tab[0].id,
        {type: 'incoming_tab'},
        response => {
            console.log(response);
            let data = {
                key: 'AIzaSyAtYeX5ws-W7wfkNOSYVTr0G3kJoaP2LTQ',
                q: response,
                target: 'ru'
            };
            fetch(urlQueryString, {
                    body: JSON.stringify(data),
                    headers: new Headers({
                        'Content-Type': 'application/json'
                    }),
                    method: 'POST',
                })
                .then(response => response.json()) //parses response to JSON
                .then(data => {
                	console.log(data);
                	console.log(response, data.data.translations[0].translatedText);
            		populateFlashCard(response, data.data.translations[0].translatedText);
                	})
                .catch(data => {console.log(data);});
        }
    );
}

// Upon opening, find the tab the user's currently on and run activateTranslate()
setTimeout(() => {
    chrome.tabs.query({active: true, currentWindow: true}, tab => {activateTranslate(tab)});
}, 150);
