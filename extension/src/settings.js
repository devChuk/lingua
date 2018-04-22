function el(id) {
    return document.getElementById(id);
}

// get current setting
chrome.storage.sync.get('language', storedData => {
    let optionEl = Array.from(
        el('language').children
    )
        .find(option => option.value === storedData.language);
    // set default
    optionEl.selected = true;
});

el('language').onchange = event => {
    chrome.storage.sync.set({language: el('language').value});
};


// on update, update setting
