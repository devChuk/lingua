// document.addEventListener('mouseup',function(event)
// {
//     var text = window.getSelection().toString();
//     if(text.length)
//         runtime.sendMessage("foo",function(response){});
// })

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse){
	// get highlighted text
	var highlightedText = "";
	if (window.getSelection){
        highlightedText = window.getSelection().toString()
    }
    console.log(highlightedText);
	// send response
	sendResponse(highlightedText);
});
