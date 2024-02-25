console.log('this is zynotification.js, you can access extend app pag window in here');
let wsUrl = 'ws://127.0.0.1:9999';

var intervalID = null;

// 阻塞指定的时间--单位:ms
async function _trendx_delaySomeTime(time) {
    await new Promise(function(resolve, reject) {
        setTimeout(resolve, time);
    });
}

// 点击确认按钮
async function _trendx_getConfirm() {
    var title = document.querySelector("#app-content > div > div > div > div.request-signature__body > h3");
    var confirmButton = null;
    if(title.innerText === '签名请求') {
        do {
            confirmButton = document.querySelector("#app-content > div > div > div > div.page-container__footer > footer > button.button.btn--rounded.btn-primary.page-container__footer-button");
            await zy_handleObj._trendx_delaySomeTime(1000);
        } while(!confirmButton);
        return confirmButton;
    }
    return null;
}

var zy_handleObj = {
    _trendx_delaySomeTime,
    _trendx_getConfirm
}

function openWS() {
    let ws = new WebSocket(wsUrl);
    ws.onopen = function() {
        let origin = 'extension_notification';
        ws.send(JSON.stringify({ origin }));
    }

    ws.onmessage = async function(event) {
        let data = event.data || '{}';
        let res = JSON.parse(data);
        if(res.action === 'clickConfirm') {
            let confirmButton = await zy_handleObj._trendx_getConfirm();
            if(confirmButton) {
                const flag = res.params[0] || NaN;
                let to = 'contentScript', action = 'response';
                ws.send(JSON.stringify({ to, action, flag }));
                ws.close();
                confirmButton.click();
            } else {
                console.log('--contentScript---获取确认按钮失败---');
            }
        }
    }
}


window.onload = function() {
    intervalID = setInterval(() => {
        var title = document.querySelector("#app-content > div > div > div > div.request-signature__body > h3");
        if(title.innerText === '签名请求') {
            openWS();
            clearInterval(intervalID);
        }
    }, 1000);
}

window.onbeforeunload = function() {
    clearInterval(intervalID);
}

