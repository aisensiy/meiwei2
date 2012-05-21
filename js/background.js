
var flag = 0;
var animationTimer;
var index = 0;
var canvas,context,image,imageData;

var contentScriptLoaded;
var timer,timerSave;
var saveTabID;

chrome.extension.onRequest.addListener(
    function(request, sender, sendResponse) {

        if(request.status == 'success')
        {
            console.log('success');
        }
        
        resetIcon();
 });

function setImage(imagePath){
    var sx = 19;
    var sy = 19;

    canvas = document.getElementById('canvas');
    context = canvas.getContext('2d');
    image = new Image();
    image.src = imagePath;
    image.onload = function(){
        context.drawImage(image, 0, 0);
        imageData = context.getImageData(0, 0, sx, sy);
        chrome.browserAction.setIcon({
            imageData: imageData
        });
    }
    context.clearRect(0, 0, sx, sy);
}

function resetIcon()
{
    index = -1;
    //clearTimeout(animationTimer);
    console.log('stop animation');

    setImage("icon19.png");
}

function animateIcon()
{
    //console.log("animation id", index);
    if (index < 0)
    {
        resetIcon();
        return;
    }
    setImage('load' + index + '.png');
    if (++index >= 6)
    {
        index = 0;
    }
    if(animationTimer){
        clearTimeout(animationTimer);
    }
    animationTimer = setTimeout("animateIcon();", 200);
}

if (localStorage['firstTime']!='false')
{
    localStorage['firstTime'] = 'false';
    chrome.tabs.create({url:chrome.extension.getURL('options.html')});
}

chrome.browserAction.onClicked.addListener(function(tab){

    //chrome.tabs.sendRequest(tab.id, {my_check: "check"});
    
    var url = tab.url;
    saveTabID = tab.id;

    if(url.match('chrome.google.com/webstore/') || 
        url.match('chrome-extension://') || 
        url.match('chrome://') || 
        url.match('http://localhost*') || 
        url.match(('http://local*')) || 
        url.match('http://127.0.0.1*') 
    ) return alert('该链接目前不能收藏谢谢！');

    if(tab.status === 'loading'){
        alert('请等到页面加载完成,再收藏吧：）');
        return;
    }

    //chrome.tabs.executeScript(saveTabID, {file: "js/jquery.min.js"});
    //chrome.tabs.executeScript(saveTabID, {file: "js/save.js"});

    // line 11 has checked the status of content script so 
    // maybe the check here is unnecessary.
    //setTimeout("checkContentScript();",200);

    if(tab.status === 'complete'){
        console.log('call the execute script.');
        saveUrl();
    }

});

function saveUrl(){
    //if(contentScriptLoaded == 'loaded'){
        contentScriptLoaded = 0;
        console.log("start message sent.");
        index = 0;
        animationTimer = setTimeout("animateIcon();", 100);
        chrome.tabs.sendRequest(saveTabID, {my_message: "start"});
    //}
}
/*
function checkContentScript(){
    console.log(contentScriptLoaded);
    if(!contentScriptLoaded){
//        alert('请刷新');
        chrome.tabs.reload(saveTabID);
    }
}
*/
var api = {
    uid: null,
    stack_id: null,
    login: false,
    is_login: function(url, stack_id) {
        var request_url = 'http://mei.fm/save';
        $.post(request_url, {'url': url, 'stack_id': stack_id}, function(data) {
            if(data.is_logged_in) {
                api.login = true;
            }
        }, 'json');
    },

};