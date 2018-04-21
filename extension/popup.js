

// var table = document.getElementById("myTable");

// // Create an empty <tr> element and add it to the 1st position of the table:
// var row = table.insertRow(0);

// // Insert new cells (<td> elements) at the 1st and 2nd position of the "new" <tr> element:
// var cell1 = row.insertCell(0);
// var cell2 = row.insertCell(1);

// // Add some text to the new cells:
// cell1.innerHTML = "NEW CELL1";
// cell2.innerHTML = "NEW CELL2";

var t1 = "smthg";
var t1 = "rawr";

function myFunction(original, translation) {
    var table = document.getElementById("myTable");
    var row = table.insertRow(1);
    var cell1 = row.insertCell(0);
    var cell2 = row.insertCell(1);
    cell1.innerHTML = original;
    cell2.innerHTML = translation;
}

// document.getElementById('magicjohnson').addEventListener("click", myFunction);


const urlQueryString = 'https://translation.googleapis.com/language/translate/v2/?key=AIzaSyAtYeX5ws-W7wfkNOSYVTr0G3kJoaP2LTQ';



function activateTranslate(tab){
    //console.log(tab, tab.id);

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
                	console.log(data.data.translations[0].translatedText);
            		myFunction(response, data.data.translations[0].translatedText);

                	}) //prints
                .catch(data => {console.log(data);});
        }
    );
    
}

chrome.tabs.query({active: true}, tab => {activateTranslate(tab)});
// activateTranslate();