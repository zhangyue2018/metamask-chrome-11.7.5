console.log('====this is zypopup.js====');

chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        console.log('---in popup---request--', request);
        console.log('---in popup---sender--', sender);
        sendResponse({farewell: "goodbye"});
    }
);
