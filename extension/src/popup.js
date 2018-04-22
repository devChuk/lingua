const urlQueryString = 'https://translation.googleapis.com/language/translate/v2/?key=AIzaSyAtYeX5ws-W7wfkNOSYVTr0G3kJoaP2LTQ';

function el(id) {
    return document.getElementById(id);
}

// Return template string of <li> element with class and text
function li(original, translation) {
    return `<li><span>${original}</span><span>${translation}</span></li>`;
}

function populateFlashCard(original, translation) {
    el('original').innerText = original;
    el('translation').innerText = translation;
}

function populateHistoryList(history) {
    for (let i = 0; i < history.length; i++) {
        el('history').innerHTML += li(history[i].original, history[i].translation);
    }
}

function toggleHistoryList() {
    if (el('original').style.display !== 'none') {
        chrome.storage.sync.get('history', storedData => populateHistoryList(storedData.history));
        el('original').style.display = 'none';
        el('translation').style.display = 'none';
        el('history').style.display = '';
    } else {
        el('original').style.display = '';
        el('translation').style.display = '';
        el('history').innerHTML = '';
        el('history').style.display = 'none';
    }
}

function openSettings() {
    const settingsUrl = chrome.extension.getURL('settings.html');
    chrome.tabs.query({url: settingsUrl}, (tabs) => {
        if (tabs.length > 0) {
            chrome.tabs.update(tabs[0].id, {active: true});
        } else {
            chrome.tabs.create({url: settingsUrl, active: true}, (tab) => {
                chrome.windows.update(tab.windowId, {focused: true});
            });
        }
        window.close();
    });
}

function activateTranslate(tab) {
    chrome.storage.sync.get('language', sD => {
        chrome.tabs.sendMessage(
            tab[0].id,
            {type: 'incoming_tab'},
            response => {
                let data = {
                    key: 'AIzaSyAtYeX5ws-W7wfkNOSYVTr0G3kJoaP2LTQ',
                    q: response,
                    target: sD.language
                };

                // if blank, say user messed up
                if (response === '' || response === undefined) {
                    el('original').innerText = 'Select';
                    el('translation').innerText = 'a word';
                    return;
                }

                fetch(urlQueryString, {
                        body: JSON.stringify(data),
                        headers: new Headers({
                            'Content-Type': 'application/json'
                        }),
                        method: 'POST',
                    })
                    .then(response => response.json()) //parses response to JSON
                    .then(data => {
                        console.log(response, data);
                        let translation = data.data.translations[0].translatedText;
                        if (response === translation || translation === '') {
                            el('original').innerText = 'No translation';
                            return;
                        }

                        chrome.storage.sync.get('history', stored_data => {
                            let history = stored_data.history;
                            let index = history.findIndex(element => element.original === response);
                            if (index >= 0) {
                                // if already exists in history storage, remove from storage and put on top
                                let a = history.splice(index, 1);
                                history.unshift(a[0]);
                            } else {
                                // if doesn't exist, then add to storage
                                history.unshift({
                                    original: response,
                                    translation: translation
                                });
                            }
                            chrome.storage.sync.set({history});
                            // chrome.storage.sync.set({history: []});
                        });

                        let payload = {
                            original: response,
                            translation: translation,
                            url: tab[0].url
                        };
                        fetch('https://lingua-9c27a.firebaseio.com/.json', {
                                body: JSON.stringify(payload),
                                headers: new Headers({
                                    'Content-Type': 'application/json'
                                }),
                                method: 'POST'
                            })
                            .then(response => response.json()) //parses response to JSON
                            .then(data => {console.log(data);})
                            .catch(error => {console.error(error, payload)});

                        populateFlashCard(
                            response,
                            translation
                        );
                    	})
                    .catch(data => {console.log(data);});
            }
        );
    });
}

el('list').onclick = toggleHistoryList;
el('settings').onclick = openSettings;

setTimeout(() => {
    // Upon opening, find the tab the user's currently on and run activateTranslate()
    chrome.tabs.query({active: true, currentWindow: true}, tab => activateTranslate(tab));
    // Also, populate history list
    // chrome.storage.sync.get('history', storedData => populateHistoryList(storedData.history));
}, 150);
