var islogin = false;

var handlers = (function() {
	function is_login() {
		if(!localStorage['email'] || !localStorage['password']) 
			islogin = false;
		else {
			api.send_login_request(localStorage['email'], localStorage['password'], {
				failed: function() {islogin = false},
				success: function(data) {
					islogin = true;
					localStorage['uid'] = data.logged_in_user_id;
					localStorage['username'] = data.logged_in_username;
					api.get_default_stack(data.logged_in_user_id);
				}
			});
		}
	}

	function load_content_script(tab, callback) {
		chrome.tabs.executeScript(tab.id, {file: 'js/jquery.min.js'});
		chrome.tabs.executeScript(tab.id, {file: 'js/in.js'}, function() {
			callback && callback();
		});
	}

	function Notification(icon, title, content) {
		this.content = content;
		this.title = title;
		this.icon = icon;
	}

	Notification.prototype = {
		show: function() {
			var self = this;
			this.elem = webkitNotifications.createNotification(
			  chrome.extension.getURL(this.icon),  // icon url - can be relative
			  this.title,  // notification title
			  this.content  // notification body text
			);
			this.elem.show();
			setTimeout(function() {
				self.elem.cancel();
			}, 3000);
		}
	}

	function save(tab, url) {
		if(!is_valid(url)) alert('该链接目前不能收藏谢谢！');
		else {
			/*
			api.save_url(localStorage['stack_id'], tab.url, {
				failed: function() {
					//show error message
					handlers.logout();
				},
				success: function() {
					chrome.tabs.sendRequest(tab.id, {'action': 'show_message'});
				}
			});
			*/
			window.processing = false;
			new Notification('icon32.png', '成功保存', '已经成功保存书签').show();
			//chrome.tabs.sendRequest(tab.id, {'action': 'show_message'});
			console.log(tab.url);
		}
	}

	function is_valid(url) {
		if(url.match('chrome.google.com/webstore/') || 
	        url.match('chrome-extension://') || 
	        url.match('chrome://') || 
	        url.match('http://localhost*') || 
	        url.match(('http://local*')) || 
	        url.match('http://127.0.0.1*') ||
	        url.match('mei.fm')
	    ) return false;
		return true;
	}

	return {
		load_content_script: load_content_script,
		save: save,
		is_login: is_login,
		is_valid: is_valid
	}
})();


(function init() {
	chrome.browserAction.onClicked.addListener(function(tab) {
		console.log('click the button!');
		handlers.is_login();
		if(!islogin) {
			console.log('not login');
			api.showLoginPopup();
			return;
		}
		if(!handlers.is_valid(tab.url)) {
			console.log('invalid url');
			alert('该链接目前不能收藏谢谢！');
			return;
		}

		// if the button is clicked and action is processing
		// new click will be omitted.
		if(window.processing) return;
		window.processing = true;
		handlers.load_content_script(tab, function() {
			script_loaded = true;
			if(islogin === true) {
				// show saving message
				handlers.save(tab, tab.url);
			}
			else {
				window.processing = false;
				api.showLoginPopup();
			}
		});
		
	});
	
	chrome.extension.onRequest.addListener(function(req, sender, callback) {
		if(req.action === 'login') islogin = true;
	});
})();