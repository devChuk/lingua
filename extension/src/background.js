function setupOnInstall(details) {
    /**
     * Sets up initial stored data for the extension. Only run upon install and that there is no pre-
     * existing storage
     * @param {object} details developer.mozilla.org/en-US/Add-ons/WebExtensions/API/webNavigation/onCompleted#details
     */
    if (details.reason === 'install') {
        // make sure everything is empty
        chrome.storage.sync.get(storedData => {
            // Confirm that stored object is empty
            if (Object.keys(storedData).length === 0 && storedData.constructor === Object) {
                chrome.storage.sync.set({
                    history: []
                });
            }
        });
    }
}

chrome.runtime.onInstalled.addListener(setupOnInstall);
