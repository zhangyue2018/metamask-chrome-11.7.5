
console.log('this is zycontentscript.js, you can access webpag window in here');

// The ID of the extension we want to talk to.
var editorExtensionId = "eihlflfohojempmkfaojdjdeedpidmnm";

let count =0;
let intervalID = setInterval(() => {
    chrome.runtime.sendMessage({data: 'hello'}, function(response) {
        console.log('收到响应：', response);
        count++;
        if(count >= 10) {
            console.log('clear interval');
            clearInterval(intervalID);
        }
    });
}, 5000);
// Make a simple request:
