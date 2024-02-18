console.log('this is zynotification.js, you can access extend app pag window in here');
let wsUrl = 'ws://127.0.0.1:9999';

// 阻塞指定的时间--单位:ms
window._trendx_delaySomeTime = async function(time) {
    await new Promise(function(resolve, reject) {
        setTimeout(resolve, time);
    });
}

// 点击确认按钮
window._trendx_clickConfirm = function() {
    var title = document.querySelector("#app-content > div > div > div > div.request-signature__body > h3");
    if(title.innerText === '签名请求') {
        var confirmButton = document.querySelector("#app-content > div > div > div > div.page-container__footer > footer > button.button.btn--rounded.btn-primary.page-container__footer-button");
        confirmButton.click();
    }
}

window.onload = function() {
    let ws = new WebSocket(wsUrl);
    ws.onopen = function() {
        let origin = 'extension_notification';
        ws.send(JSON.stringify(origin));
    }

    ws.onmessage = async function(event) {
        let data = event.data || '{}';
        console.log('---ws---onmessage---data---', data);
        let res = JSON.parse(data);
        if(res.action && window['_trendx_' + res.action]) {
            await window._trendx_delaySomeTime(2000);

            let to = 'webPage', action = 'clickConfirm_ok';
            ws.send(JSON.stringify({ to, action }));
            
            window['_trendx_' + res.action]();
        }
    }
}

