
/**
 * Created by JetBrains WebStorm.
 * User: MOMO
 * Date: 12-4-18
 * Time: 下午5:22
 * To change this template use File | Settings | File Templates.
 */

// login and logout logic
$(function() {
    if(chrome.extension.getBackgroundPage().islogin) {
        $('#username').html(localStorage['username'] + '<a href="#" id="logout-btn">(退出)</a>');        
    } else {
        $('#username').html('<a id="login-btn" href="#">登录</a>');
    }
    $('#logout-btn').live('click', function() {
        api.logout();
        $('#username').html('<a id="login-btn" href="#">登录</a>');
    });
    $('#login-btn').live('click', function() {
        api.showLoginPopup();
    });
    chrome.extension.onRequest.addListener(function(req, sender, callback) {
        if(req.action === 'login') {
            $('#username').html(localStorage['username'] + '<a href="#" id="logout-btn">(退出)</a>');
        }
    });
});

// use global variable

var myRoot = '1', currentParentId = myRoot;
var row = 0, column = 1, step = 0;
var testData = [];
//var data = [];

/*
 var testData = new Array(
 ['Bookmarks Bar','weibo','http://weibo.com'],
 ['Bookmarks Bar','kk33','popo','google', 'http://www.google.com'],
 ['Bookmarks Bar','kk33','popo','baidu', 'http://www.baidu.com'],
 ['Bookmarks Bar','kk33','popo','bing', 'http://www.bing.com'],
 ['Bookmarks Bar','kk33','popo','44444！','http://mei.fm/'],
 ['Bookmarks Bar','kk33','jaja4445555','momo','5555','http://mei.fm/2'],
 ['Bookmarks Bar','kk33','jaja4445555','momo','666','http://mei.fm/3'],
 ['Bookmarks Bar','kk33','rrr','momo','666','http://mei.fm/4'],

 ['Other Bookmarks','mei.fm','http://mei.fm/5'],
 ['Other Bookmarks','meiwei','http://mei.fm/6'],
 ['Other Bookmarks','meiwei','nana','http://mei.fm/7'],
 ['Other Bookmarks','芥末','http://mei.fm/8'],

 ['Bookmarks Bar','美味书签','芥末的默认选辑','美味书签——互联网的精选辑！','http://mei.fm/4']

 );*/

var data = [{
    name:['Bookmarks Bar','kk222'],
    urls:[{
        title:'2222222222222！',
        url:'http://weibo.com/2'
    },{
        title:'2222222222222！',
        url:'http://weibo.com/22'
    }]
},{
    name:['Bookmarks Bar','kk222','popo'],
    urls:[
        {
            title:'333333333333！',
            url:'http://mei.fm/3'
        },
        {
            title:'333333333333！',
            url:'http://mei.fm/33'
        }
    ]
},{
    name:['Bookmarks Bar','kk333','popo'],
    urls:[{
        title:'333333333333！',
        url:'http://mei.fm/3'
    },{
        title:'333333333333！',
        url:'http://mei.fm/33'
    }]
},{
    name:['Other Bookmarks','mustardduck'],
    urls:[{
        title:'444444444！',
        url:'http://weibo.com/2'
    },{
        title:'55555555！',
        url:'http://weibo.com/22'
    }]
},{
    name:['Other Bookmarks','juri','popo'],
    urls:[{
        title:'66666666666！',
        url:'http://mei.fm/3'
    },{
        title:'7777777777777！',
        url:'http://mei.fm/33'
    }]
},{
    name:['Bookmarks Bar','美味书签','芥末的'],
    urls:[{
        title:'999999999999！',
        url:'http://mei.fm/9'
    },{
        title:'999999999999！',
        url:'http://mei.fm/99'
    }]
},{

    name:['中文广播剧'],
    urls:[{
        title:'000000000000！',
        url:'http://mei.fm/9'
    },{

        title:'000000000000！',
        url:'http://mei.fm/99'
    }]
},{
    name:['Bookmarks Bar','美味书签','世界最美'],
    urls:[{
        title:'999999999999！',
        url:'http://mei.fm/9'
    },{
        title:'999999999999！',
        url:'http://mei.fm/99'
    }]
},{
    name:['Bookmarks Bar','美味书签','芥末的默认选辑'],
    urls:[{
        title:'555555555！',
        url:'http://mei.fm/9'
    },{
        title:'555555555！',
        url:'http://mei.fm/99'
    }]
}];
console.log(data);

function importToMeiWei() {
    dump();
}

function exportToChrome() {
//    if (step <= 0)
//    {
//        $.get('http://192.168.1.21:9092/api/v1/export', function(mei_data){
//           add(data,mei_data.stacks,mei_data.elements);
//            console.log(mei_data.stacks);
//            console.log(mei_data.elements);
//            console.log(data);
    if (step <= 0)
    {
        // for bookmarks bar
        row = 0, column = 1 ;
        myRoot = '1';
        currentParentId='1';
        testData = [];
        prepareBookmarkBarData();
        get();
    }
//        });
//    }
    else if (step == 1)
    {
        console.log("second round");
        row = 0, column = 1 ;
        myRoot = '2';
        currentParentId='2';
        testData = [];
        prepareOtherBookmarkBarData();
        get();
    }
    //   console.log(step);
    else if (step == 2){
        reportProgress(1);
        alert('书签已经导出到浏览器，去看看吧');
    }
}

function moveNext()//发消息(正在导出)
{
    // check if we move to the next line, if next line reset currentParentId.
    var items = testData[row];
    if (column < items.length - 2)
    {
        ++column;
    }
    else
    {
        ++row;
        column = 1;
        currentParentId = myRoot;
    }

    if (row >= testData.length)
    {
        ++step;
        exportToChrome();
        return null;
        // stop
    }
    reportProgress(0);
    return 1; // continue;
}

function reportProgress(mark){
    if(mark === 0){
        var css = '*{background:none;margin:0;padding:0;}html,body{overflow:hidden!important;}' +
            '#mei-overlay{position:fixed;top:0;left:0;right:0;bottom:0;width:100%;height:100%;background:#262626;overflow:hidden;z-index:2147483645;margin:0!important;}' +
            '#mei-overlay *{font-family:"Lucida Grande", Tahoma, Arial, sans-serif;font-size:12px;font-weight:400;line-height:18px;list-style:none;font-style:normal;-webkit-user-select:none;-moz-user-select:none;text-shadow:none;border:none;-webkit-text-stroke:0;outline:0;text-transform:none!important;letter-spacing:0;margin:0;padding:0;}a:focus{outline:0;}' +
            '#mei-shim{position:fixed;background:url(data:image/png;base64,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);width:100%;height:20px;left:0;top:30px;z-index:2147483644;}' +
            '#mei-io,#mei-if{position:fixed;top:0;left:0;right:0;bottom:0;z-index:2147483646;width:100%;height:100%;border:none;margin:0;padding:0;background:url(data:image/png;base64,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);}' +
            '#mei-if{visibility:hidden;z-index:2147483647;background:none;}' +
            '#mei-if.loaded{visibility:visible;}' +
            '#mei-ioload{position:absolute;top:50%;left:50%;width:166px;height:45px;background:#222 url(data:image/gif;base64,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) no-repeat center center;margin-top:-23px;margin-left:-83px;-webkit-border-radius:5px;-moz-border-radius:5px;color:#fff;}' +
            '#mei-overlay a{background:none!important;}';
        if (document.createStyleSheet) return document.createStyleSheet().cssText = css;
        s = document.createElement('style');
        s.setAttribute('type', 'text/css');
        s.setAttribute('id', 'mei-css');
        s.appendChild(document.createTextNode(css));
        document.getElementsByTagName('head')[0].appendChild(s);//

        var el = e('mei-io');
        if(!el){
            var io = document.createElement('div');
            io.id = 'mei-io';

            //io.onclick = mei.closeIF;
            io.innerHTML = '<div id="mei-ioload"></div>';
            document.body.appendChild(io);
        }
    }

    else{
        console.log('removeChild');
        var el = e('mei-io');
        if (el) el.parentNode.removeChild(el);
    }

}

function e(id) {
    return (document.getElementById(id)) ? document.getElementById(id) : false;
}

function isLink()
{
    var items = testData[row];
    return (column >= (items.length - 2));
}

function currentName()
{
    return (testData[row][column]);
}

// TODO
function currentLink()
{
      return testData[row][testData[row].length - 1]
}

function get()
{
    chrome.bookmarks.getChildren(currentParentId,  function onGetChildrenFinished(array)
        {
            var index = -1;
            for(var i = 0; i < array.length; ++i) {
                if(array[i].title == currentName() && !array[i].url ) {
                    index = i;
                    break;
                }
                else if( array[i].url == currentLink()  && array[i].url ) {
                    index = i;
                    break;
                }
            }
            if (index != -1)
            {
                currentParentId = array[index].id;
                if (moveNext())
                {
                    get();
                }
            }
            else
            {
                create();
            }
        }
    );
}

function create()
{
    if (isLink())
    {
        var parent = {parentId:currentParentId, title:currentName(), url:currentLink()};
        chrome.bookmarks.create(parent, function onCreateLinkFinished(result)
            {
                if(moveNext()) {
                    get();
                }
            });
    }
    else
    {
        var parent = {parentId:currentParentId, title:currentName()};
        chrome.bookmarks.create(parent, function onCreateFinished(result)
            {
                currentParentId = result.id;
                if(moveNext()) {
                    get();
                }
            });
    }
}

function prepareBookmarkBarData() {
    for(var i= 0;i<data.length;i++) {
        var node = data[i];
        var a = node.name;
        if(a[0] === 'Other Bookmarks' || a[0] === '其它书签') continue;
        if(a[0] === 'Bookmarks Bar' || a[0] === '书签栏') {
            for(var k = 0; k < node.urls.length; ++k) {
                var items = new Array();
                for(var j=0;j<a.length;j++) {
    			   items.push(a[j]);
                }
                items.push(node.urls[k].title);
                items.push(node.urls[k].url);
                testData.push(items);
            }
        }
         else{//是选辑
                 for(var j=0;j<node.urls.length;j++){
                    var items = [];
                    items.push('书签栏');
                    items.push('美味书签');

    			    items.push(a[0]);

                    items.push(node.urls[j].title);
                    items.push(node.urls[j].url);
                    testData.push(items);
                 }
         }
    }
    console.log(testData);
}

function prepareOtherBookmarkBarData(){
    for(var i= 0;i<data.length;i++){
        var node = data[i];
        var a = node.name;

        if(a[0] === 'Bookmarks Bar' || a[0] === '书签栏') continue;

        if(a[0] === 'Other Bookmarks' || a[0] === '其它书签'){
            for(var k = 0; k < node.urls.length; ++k) {
                var items = new Array();
                for(var j=0;j<a.length;j++) {
    			   items.push(a[j]);
                }
                items.push(node.urls[k].title);
                items.push(node.urls[k].url);
                testData.push(items);
            }
        }
    }
    console.log(testData);
}

function dump() {
    var bookmarkTreeNodes = chrome.bookmarks.getTree(
        function(bookmarkTreeNodes) {

            var folders = [];
            var bookmarks = [];
            var importData = [];

            dumpTreeNodes(bookmarkTreeNodes);

            function dumpTreeNodes(bookmarkNodes) {
                for (var i = 0; i < bookmarkNodes.length; i++) {
                    dumpNode(bookmarkNodes[i]);
                }
            }

            function dumpNode(bookmarkNode) {
                if (bookmarkNode.title) {
                    if(!bookmarkNode.children){
                        bookmarks.push({stack_id : bookmarkNode.parentId, url: bookmarkNode.url, title: bookmarkNode.title });
                    }
                }
                if (bookmarkNode.children && bookmarkNode.children.length > 0) {
                    if(bookmarkNode.title){
                        folders.push({parentId: bookmarkNode.parentId, name: bookmarkNode.title, id:bookmarkNode.id});
                    };
                    dumpTreeNodes(bookmarkNode.children);
                }
            }

            add(importData, folders, bookmarks, 'import');//展平收藏夹，用数组把文件夹的嵌套表示出来
            console.log(importData);

            localStorage['importButton'] = 'false';

            var importButton = document.getElementById('importButton');
            importButton.style.backgroundColor = '#808080';
            importButton.disabled = true;

                    var mei_data = {
             stacks:JSON.stringify(data)
             };
             $.post(' http://192.168.1.21:9092/api/v1/import', mei_data, function(resp){

             console.log(resp);
             });

        });
}


function add(importData,folders,bookmarks,flag){
    for(var i= 0;i<folders.length;i++){
        importData.push(addFolder(folders[i],bookmarks));
    }
    if(flag == 'import'){
        addStack(importData);
    }
}

function addFolder(folder,bookmarks) {
    return {
        id: folder.id,
        parentId:folder.parentId,
        name: folder.name,
        urls: addURL(folder,bookmarks)
    }
}

function addURL(folder,bookmarks) {
    var urls = [];
    for(var i= 0;i<bookmarks.length;i++) {
        if (bookmarks[i].stack_id === folder.id) {
            urls.push({title: bookmarks[i].title,
                url: bookmarks[i].url});
        }
    }
    return urls;
}

function addStack(importData){//把importData数据中name变成字符串数组

    for(var i= 0;i<importData.length;i++) {
        if(importData[i].parentId === '0') {
             importData[i].name = [importData[i].name];
             continue;
        }

        var folder_name = [];
        for(var j = i-1 ;j >= 0 ;j--) {
          if(importData[i].parentId === importData[j].id) {
            for(var k=0;k<importData[j].name.length;k++) {
               folder_name.push(importData[j].name[k]);
            }
          }
        }
        folder_name.push(importData[i].name);
        importData[i].name = folder_name;
    }

}