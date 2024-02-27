console.log('this is zynotification.js, you can access extend app pag window in here');
let wsUrl = 'ws://127.0.0.1:9999';

let signatureFilter = "#app-content > div > div > div > div.request-signature__body > h3";
let loginFilter = "#app-content > div > div > div > div.signature-request-siwe-header > div.box.permissions-connect-header.box--flex-direction-column.box--justify-content-center.box--display-flex > div.permissions-connect-header__title";

// 阻塞指定的时间--单位:ms
async function _trendx_delaySomeTime(time) {
    await new Promise(function(resolve, reject) {
        setTimeout(resolve, time);
    });
}

// 点击确认按钮
async function _trendx_clickConfirm() {
    var title = document.querySelector(signatureFilter);
    var confirmButton = null;
    if(title.innerText === '签名请求') {
        do {
            confirmButton = document.querySelector("#app-content > div > div > div > div.page-container__footer > footer > button.button.btn--rounded.btn-primary.page-container__footer-button");
            await window._trendx_delaySomeTime(3000);
        } while(!confirmButton);
        return confirmButton;
    }
    return null;
}

async function _trendx_confirmLogin() {
    var title = document.querySelector(loginFilter);
    var loginButton = null;
    if(title.innerText === '登录请求') {
        do {
            loginButton = document.querySelector("#app-content > div > div > div > div.page-container__footer.signature-request-siwe__page-container-footer > footer > button.button.btn--rounded.btn-primary.page-container__footer-button");
        } while(!loginButton);
        return loginButton;
    }
    return null;
}

var zy_handleObj = {
    _trendx_delaySomeTime,
    _trendx_clickConfirm
}

function openWS() {
    let ws = new WebSocket(wsUrl);
    ws.onopen = function() {
        // let origin = 'metamask_notification';
        let origin = 'extension_notification';
        ws.send(JSON.stringify({ origin }));
    }

    ws.onmessage = async function(event) {
        let data = event.data || '{}';
        let res = JSON.parse(data);
        if(res.action === 'clickConfirm' && zy_handleObj['_trendx_' + res.action]) {
            let confirmButton = await zy_handleObj['_trendx_' + res.action]();
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
        if(res.action === 'confirmLogin' && zy_handleObj['_trendx_' + res.action]) {
            let loginButton = await zy_handleObj['_trendx_' + res.action]();
            if(loginButton) {
                let to = 'contentScript', action = 'login_response';
                ws.send(JSON.stringify({ to, action }));
                ws.close();
                loginButton.click();
            } else {
                console.log('--contentScript---获取确认按钮失败---');
            }
        }
    }
}

var intervalID = setInterval(() => {
    var title = document.querySelector(signatureFilter);
    if(title.innerText === '签名请求') {
        openWS();
        clearInterval(intervalID);
        return;
    }
    var title1 = document.querySelector(loginFilter);
    if(title1.innerText === '登录请求') {
        openWS();
        clearInterval(intervalID);
    }
}, 1000);

