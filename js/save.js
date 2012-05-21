
 chrome.extension.onRequest.addListener(
     function(request, sender, sendResponse) {
         if(request.my_message == "start"){
             var callback = function() {
                 console.log("invoke callback method.");
                 chrome.extension.sendRequest({status: 'success'});
             };
             show(callback);
         }
         /*
         if(request.my_check == "check") {
             chrome.extension.sendRequest({check: 'loaded'});
         }
         */
     });

function show(callback){
    //     debugger;
    var ur='http://mei.fm';

    mwinit('0.9', ur, true, callback);

}
var mei = {
  v: '0.9',
  d: document,
  frames: document.getElementsByTagName('frame'),
  active: 'all',
  match: ['feeds.feedburner.com\/([a-z0-9_-]+)', 'stumbleupon.com\/su\/([a-z0-9_-]+)', 'bit.ly\/([a-z0-9_-]+)', '/(twitter\.com\/.*\/status\/.*|twitter\.com\/.*\/statuses\/.*|)/i', 'kickstarter.com\/projects\/([a-z0-9_-]+)\/([a-z0-9_-]+)', 'feedproxy.google.com\/', 'video.google.[a-z]+\/videoplay\\?docid=([a-z0-9_-]+)', 'video.google.[a-z]+\/googleplayer.swf\\?docid=([a-z0-9_-]+)', 'http://campl.us/([a-z0-9]+)', 'ffffound.com\/static-data\/.*?\/([a-z0-9_-]+)_[a-z0-9]+.(jpg|gif|png)', 'twitpic.com\/show\/full\/([a-z0-9_-]+)', 'twitpic.com\/([a-z0-9_-]+)', 'dropular.net\/content\/_fixed\/_200\/([a-z0-9_-]+)', 'cl.ly\/([a-z0-9_-]+)', 'dribbble.com\/shots\/([0-9]+)', 'dribbble.com\/system\/users\/[0-9]+\/screenshots\/([0-9]+)', 'nstagr.am\/p\/([a-z0-9_-]+)', 'mgur.com\/gallery\/([a-z0-9_-]+)', '.imgur.com\/([a-z0-9_-]+).[a-z0-9]+', 'mgur.com\/([a-z0-9_-]+)', '500px.com\/photo\/([a-z0-9_-]+)', 'photos.500px.com\/([a-z0-9_-]+)\/', '9gag.com\/gag\/([a-z0-9]+)', 'd3uwin5q170wpc.cloudfront.net\/photo\/([a-z0-9]+)_', 'mg.ly\/([a-z0-9_-]+)', 'xkcd.com\/([0-9]+)', 'mgs.xkcd.com\/', 'piccsy.com\/[0-9]+\/[0-9]+\/([a-z0-9_-]+)', 'pinterest.com\/pin\/([a-z0-9_-]+)', 'blip.tv\/file\/([0-9]+)', 'blip.tv\/play\/([a-z0-9+_-]+)', 'break.com\/(index|amp|usercontent/[a-z0-9]+/[a-z0-9]+)\/([a-z0-9_-]+)\.html', 'embed.break.com\/([a-z0-9_-]+)', 'collegehumor.com\/video\:([a-z0-9_-]+)', 'collegehumor.com\/moogaloop/moogaloop.swf\\?clip_id=([a-z0-9_-]+)', 'current.com\/items\/([0-9]+)', 'current.com\/e\/([0-9]+)', 'dailymotion.com\/.*video\/([a-z0-9_-]+)', 'dailymotion.com\/swf\/([a-z0-9_-]+)', 'eatdrinkordie.com\/videos\/([a-z0-9_-]+)', '5min.com\/Video\/[a-z0-9_-]+-([0-9]+)', '5min.com\/Video\/([0-9]+)', '5min.com\/Embeded\/([a-z0-9]+)', 'flickr.com\/photos\/([a-z0-9\@_-]+)\/([0-9]+)', 'static.flickr.com\/([a-z0-9]+)\/([0-9]+)', 'flickr.com/apps/video/stewart.swf?(.*)&photo_id=([a-z0-9]+)', 'funnyordie.com\/videos\/([a-z0-9_-]+)', 'hulu.com\/watch\/([a-z0-9_-]+)\/([a-z0-9_-]+)', 'howcast.com\/videos\/([0-9]+)[a-z0-9_-]+', 'liveleak.com\/view\\?i=([a-z0-9_-]+)', 'liveleak.com\/e\/([a-z0-9_-]+)', 'metacafe.com\/watch\/([a-z0-9_-]+)\/([a-z0-9_-]+)', 'metacafe.com\/fplayer\/([a-z0-9_-]+)', 'mtv.com\/videos\/.*?\/([0-9]+)\/', 'vids.myspace.com\/.*VideoId=([a-z0-9]+)', 'mediaservices.myspace.com\/services\/media\/embed.aspx\/m=([a-z0-9]+)', 'myvideo.de\/watch\/([0-9]+)\/([a-z0-9_-]+)', 'photobucket.com\/.*\/([a-z0-9_-]+)\.flv', 'pwnordie.com\/videos\/([a-z0-9_-]+)', 'reuters.com\/news\/video\\?videoId=([a-z0-9_-]+)', 'revver.com\/video\/([0-9]+)', 'revver.com\/player\/1.0\/player.swf\\?mediaId=([0-9]+)', 'shredordie.com\/videos\/([a-z0-9_-]+)', '12seconds.tv\/v\/([a-z0-9]+)', '12seconds.tv\/players\/remotePlayer.swf\\?vid=([0-9]+)', 'theonion.com\/video\/[a-z0-9_-]+,([0-9]+)', 'twitvid.com\/player_fb\/([a-z0-9]+)', 'twitvid.com\/([a-z0-9]+)', 'ustream.tv\/recorded\/([a-z0-9]+)', 'ustream.tv\/flash\/video\/([a-z0-9]+)', 'viddler.com\/.*videos\/([0-9]+)', 'viddler.com\/player\/([a-z0-9]+)', 'vidly.com\/p\/player.swf\\?config=http:\/\/twitvid.io\/_cfg\/([a-z0-9]+)', 'vidly.com\/embed\/([a-z0-9]+)', 'vidly.com\/([a-z0-9]+)', 'vimeo.com\/([0-9]+)', 'vimeo.com\/moogaloop.swf\\?clip_id=([a-z0-9]+)', 'vodpod.com\/watch\/([0-9]+)-([a-z0-9_-]+)', 'video.yahoo.com\/watch\/([a-z0-9_-]+)', 'static.video.yahoo.com\/yep\/YV_YEP.swf.*&id=([a-z0-9]+).*&vid=([a-z0-9]+)', 'youtube.com\/watch\\?.*v=([a-z0-9_-]+)', 'youtube.com\/v\/([a-z0-9_-]+)', 'youtube.com\/embed\/([a-z0-9_-]+)', 'http://www.youtube.com/swf/l.swf\\?.*video_id=([a-z0-9_-]+)', 'docstoc.com\/docs\/([0-9]+)', 'slideshare.net\/([a-z0-9._-]+)\/([a-z0-9._-]+)', 'scribd.com\/doc\/([0-9]+)\/', 'scribd.com\/ScribdViewer.swf\\?document_id=([0-9]+)', '([a-z]+).wikipedia.org\/wiki\/(.*)'],
  location: window.location.href,
  hash: window.location.hash,
  title: window.document.title,
  urls: [],
  invisible: [],
  indy: false,
  found: 0,
  types: 0,
  alt: 0,
  callback: null,

  addEvent: function (element, type, handler) {
    if(element.attachEvent) {
      element.attachEvent('on' + type, handler);
    } else {
      element.addEventListener(type, handler, false);
    }
  },

  removeEvent: function(element, type, handler) {
    element.removeEventListener(type, handler)
  },

  bg_on: function() {
      var bg = 'url(data:image/png;base64,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)';
    mei.d.getElementById('mei-io').style.background = bg;
  },

  bg_off: function() {
    mei.d.getElementById('mei-io').style.background = 'none';
  },

  init: function(v, base_url, page, callback) {
    mei.callback = callback;
    mei.url = base_url;
    mei.title = mei.addslashes(mei.enc(mei.clean(window.document.title)));
    if (mei.o) mei.close();
    mei.addEvent(window, 'message', mei.message_close, false);
    mei.addEvent(window, 'message', mei.message_bg_on, false);
    if (mei.frames.length > 0) return mei.popup(mei.location, mei.title, true);
    mei.d = (mei.frames.length > 0) ? window[0].document : document;
    if (mei.e('mei-overlay') || mei.e('mei-io')) return false;
    mei.cleanlocation();
    if (mei.v != v) return window.location.href = mei.url + '/tools/bookmarklet?v=' + v + '&referer=' + this.enc(mei.location);
    if (mei.location.match('mei.fm')) return alert('不能收藏美味书签网站里的网页');
    if (mei.d == '[object ImageDocument]') return mei.popup(mei.location, mei.title, true);
    mei.head = mei.d.getElementsByTagName('head')[0];
    if (!mei.head || !mei.d.body) return mei.popup(mei.location, mei.title, true);
    mei.loadcss();
    if (mei.analyze(mei.location) || page == true) {
      mei.indy = true;
      return mei.popup(mei.location, mei.title);
    }
    document.onkeydown = function(e) {
      if (e.which == 27) mei.close();
    };
    mei.overlay();
    mei.resizer();
    mei.addEvent(window, 'resize', mei.resizer);
  },

  message_close: function(m) {
    console.log(m.data);
    if (m.data == 'close' && m.origin == mei.url) mei.closeIF();
  },
  message_bg_on: function(m) {
    console.log(m.data);
    if (m.data == 'bg_on' && m.origin == mei.url) mei.bg_on();
  },

  analyze: function(url) {
    for (var i = 0; i < mei.match.length; i++) {
      var reg = new RegExp(mei.match[i], 'gi');
      if (reg.test(url)) return true;
    }
    return false;
  },

  loadcss: function() {
    var css = '*{background:none;margin:0;padding:0;}html,body{overflow:hidden!important;}#mei-overlay{position:fixed;top:0;left:0;right:0;bottom:0;width:100%;height:100%;background:#262626;overflow:hidden;z-index:2147483645;margin:0!important;}#mei-overlay *{font-family:"Lucida Grande", Tahoma, Arial, sans-serif;font-size:12px;font-weight:400;line-height:18px;list-style:none;font-style:normal;-webkit-user-select:none;-moz-user-select:none;text-shadow:none;border:none;-webkit-text-stroke:0;outline:0;text-transform:none!important;letter-spacing:0;margin:0;padding:0;}a:focus{outline:0;}#mei-shim{position:fixed;background:url(data:image/png;base64,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);width:100%;height:20px;left:0;top:30px;z-index:2147483644;}#mei-io,#mei-if{position:fixed;top:0;left:0;right:0;bottom:0;z-index:2147483646;width:100%;height:100%;border:none;background:url(data:image/png;base64,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);margin:0;padding:0;}#mei-if{visibility:hidden;z-index:2147483647;background:none;}#mei-if.loaded{visibility:visible;}#mei-ioload{position:absolute;top:50%;left:50%;width:166px;height:45px;background:#222 url(data:image/gif;base64,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) no-repeat center center;margin-top:-23px;margin-left:-83px;-webkit-border-radius:5px;-moz-border-radius:5px;color:#fff;}#mei-overlay a{background:none!important;}';
    if (this.d.createStyleSheet) return mei.d.createStyleSheet().cssText = css;
    mei.s = mei.d.createElement('style');
    mei.s.setAttribute('type', 'text/css');
    mei.s.setAttribute('id', 'mei-css');
    mei.s.appendChild(mei.d.createTextNode(css));
    mei.d.getElementsByTagName('body')[0].appendChild(mei.s);
    return true;
  },

  cleanlocation: function() {
    if (mei.hash == '#mei-close') {
      window.location.hash = '#';
      mei.location = mei.location.replace('#mei-close', '');
    } else if (mei.hash == '#') {
      mei.location = mei.location.replace('#', '');
    }
  },

  overlay: function() {
    mei.o = mei.d.createElement('div');
    mei.o.id = 'mei-overlay';
    mei.o.innerHTML = '<div id="mei-shim"></div>';
    mei.d.body.appendChild(mei.o);
  },

  enc: function(s) {
    return encodeURIComponent(s);
  },

  close: function() {
    console.log('close!!!');
    if (mei.s) mei.s.parentNode.removeChild(mei.s);
    if (mei.o) mei.o.parentNode.removeChild(mei.o);
    mei.s = false;
    mei.o = false;
    mei.removeEvent(window, 'message', mei.message_bg_on);
    mei.removeEvent(window, 'message', mei.message_close);
    mei.callback && mei.callback();
  },

  e: function(id) {
    return (mei.d.getElementById(id)) ? mei.d.getElementById(id) : false;
  },

  popup: function(url, title, oldschool) {
    mei.cleanlocation();
    url = mei.enc(url);
    if (!oldschool) return mei.openIF(url, title);
    var u = mei.url + '/browser_save?&url=' + url + '&title=' + title + '&v=' + mei.v;
    var w = 500;
    var h = 468;
    var l = (screen.width ? (screen.width - w) / 2 : 0);
    var t = (screen.height ? (screen.height - h) / 4 : 0);
    var win = window.open(u, 'meiwei', 'width=' + w + ',height=' + h + ',left=' + l + ',top=' + t + ',status=0,toolbar=no,resizable=yes,scrollbars=yes');
    (!win) ? alert('请暂时关闭浏览器的弹窗屏蔽功能!') : win.focus();
  },

  openIF: function(url, title) {
    var io = mei.d.createElement('div');
    io.id = 'mei-io';
    io.onclick = mei.closeIF;
    io.innerHTML = '<div id="mei-ioload"></div>';
    mei.d.body.appendChild(io);
    var u = mei.url + '/browser_save?iframe=true&url=' + url + '&title=' + title + '&v=' + mei.v;
    var iframe = mei.d.createElement('iframe');
    iframe.id = 'mei-if';
    iframe.height = '100%';
    iframe.width = '100%';
    iframe.src = u;
    iframe.onload = function() {
      // mei.bg_off();
      iframe.className = 'loaded';
      mei.e('mei-ioload').style.display = 'none';
    }
    io.appendChild(iframe);
    try{
      iframe.focus();           // ie says no permission
    }catch(e){}
    mei.checkMSG();
  },

  closeIF: function() {
    var el = mei.e('mei-io');
    if (el) el.parentNode.removeChild(el);
    if (mei.indy) return mei.close();
  },

  checkMSG: function() {
    var hash = window.location.hash;
    if (hash == '#mei-close') {
      mei.closeIF();
      self.location.hash = (mei.hash.length > 0) ? mei.hash : '#';
    }
    setTimeout(mei.checkMSG, 100);
  },

  absolute: function(url) {
    if (url.match(/(http|https|ftp|feed)\:\/\//i)) return url;
    var loc = location.href;
    loc = loc.substring(0, loc.lastIndexOf('/'));
    while (/^\.\./.test(url)) {
      loc = loc.substring(0, loc.lastIndexOf('/'));
      url = url.substring(3);
    }
    return loc + '/' + url;
  },

  clean: function(str) {
    return str.replace(/^\s+|\s+$/g, '');
  },

  size: function(width, height) {
    var box = 150;
    if (width != 0 && height != 0) {
      var ratio = (width / height);
      if (width > height) {
        if (width > box) width = box;
        height = Math.floor(width / ratio);
      } else if (height > width) {
        if (height > box) height = box;
        width = Math.floor(height * ratio);
      } else if (width > box) {
        width = box;
        height = box;
      }
      return {
        'width': width,
        'height': height
      };
    } else {
      return {
        'width': box,
        'height': box
      };
    }
  },

  short: function(string, chars) {
    var dots = (string.length > chars) ? '...' : '';
    var short = string.substring(0, chars);
    return short + dots;
  },

  shorturl: function(string, chars) {
    var string = string.replace("http://", "").replace("https://", "").replace("www.", "").replace(/\/$/, "");
    return mei.short(string, chars);
  },

  resizer: function() {
    var items = mei.c.getElementsByTagName('li');
    var width = mei.c.scrollWidth;
    var scale = 150;
    var boxWidth = 175;
    var addMargin = 20;
    var addLeft = -6;
    var boxHeight = 200;
    var addTop = 25;
    if (width - addMargin < boxWidth) width = boxWidth + addMargin;
    var perLine = (width < boxWidth + addMargin) ? 1.01 : Math.floor((width - addMargin) / boxWidth);
    var increment = (width - addMargin) / (perLine);
    for (var i = 0; i < items.length; i++) {
      var column = i % perLine;
      row = Math.ceil((i + 1) / perLine);
      items[i].style.position = "absolute";
      items[i].style.left = Math.round(addLeft + addMargin / 2 + column * increment + .5 * increment - scale / 2) + "px";
      items[i].style.top = Math.round(boxHeight * (row - 1) + addTop) + "px";
    }
  },

  addslashes: function(str) {
    str = str.replace(/\\/g, '\\\\');
    str = str.replace(/\'/g, '\\\'');
    str = str.replace(/\"/g, '\\"');
    str = str.replace(/\0/g, '\\0');
    return str;
  }
};

function mwinit(v, base_url, page, callback) {
  mei.init(v, base_url, page, callback);
}