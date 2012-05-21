var api = (function() {
	var default_folder = '美味书签';
	function is_login() {

	}
	function send_login_request(email, password, callback) {

		var login_url = 'http://mei.fm/login';
		$.ajax({
			url: login_url,
			type: 'POST',
			dataType: 'json',
			async: false,
			data: {'email': email, 'password': password},
			success: function(data) {
				if(data.error_msg == "邮箱或密码错误，请检查。") {
					callback && callback.failed && callback.failed(data);
				} else {
					callback && callback.success && callback.success(data);
				}
			},
			error: function() {
			}
		});
	}
	function get_default_stack(uid) {
		var request_url = 'http://192.168.1.21:4567/users/' + uid + '/stacks.json';
		$.ajax({
			url: request_url,
			dataType: 'json',
			async: false,
			success: function(data) {
				$.each(data, function(index, elem) {
					if(elem.is_default) {
						localStorage['stack_id'] = elem.id;
					}
				})
			}
		});
	}
	function save_url(stack_id, url, callback) {
		var request_url = 'http://mei.fm/save';
		$.post(request_url, {'url': url, 'stack_id': stack_id}, function(data) {
			if(data.error_msg == "请登录。") {
				callback && callback.failed && callback.failed(data);
			} else {
				callback && callback.success && callback.success(data);
			}
		}, 'json');
	}

	function push_bookmark(bookmarks, callback) {
		var request_url = 'http://mei.fm/api/v1/import';
		var flatten = [];
		function _do_process(treenode, prefix) {
			prefix = prefix.slice(0);
			console.log(['prefix', prefix]);
			var children_urls = [];
			if(treenode.children && treenode.title !== default_folder) {
				for(var i=0, n=treenode.children.length; i<n; i++) {
					if(treenode.children[i].url) children_urls.push({'title': treenode.children[i].title, 'url': treenode.children[i].url});
				}
				if(!children_urls.length) {}
				else {
					prefix.push(treenode.title);
					flatten.push({'name': prefix, 'urls': children_urls});
				}
				for(var i=0, n=treenode.children.length; i<n; i++) {
					if(!treenode.children[i].url) {
						_do_process(treenode.children[i], prefix);
					}
				}
			}
			else
				console.log('leaf node');
		}

		chrome.bookmarks.getTree(function(root) {

			var root = root[0];
			console.log(root);

			_do_process(root, []);

			console.log(flatten);
			console.log('push to server.');
			$.post(request_url, {stacks: JSON.stringify(flatten)}, function(data) {
				console.log(data);
				alert('export successfully!');
			});
		});


		var data;
		callback && callback(data);
	}

	function pull_bookmark(callback) {
		var request_url = 'http://mei.fm/api/v1/export';

		$.getJSON(request_url, function(data) {
			_pre_process(data, function(data) {
				console.log(data);
			});
		});

		function _reconstruct_tree(stacks, node, prefix) {
			var prefix = prefix.slice(0);
			for(var i=0; i<stacks.length; i++) {
				if(stacks.found) continue;
				var matched = prefix.length == stacks[i].name.length - 1;
				if(matched)
					for(var j=0; j<prefix.length; j++) {
						if(prefix[j] !== stacks[i].name[j]) {
							matched = false;
							break;
						}
					}

				if(matched) {
					node.children = node.children || [];
					var index = node.children.push({
						'title': stacks[i].name[prefix.length],
						'stack_id': stacks[i].id
					}) - 1;
					var new_prefix = prefix.slice(0);
					new_prefix.push(stacks[i].name[prefix.length]);
					stacks[i].found = true;
					_reconstruct_tree(stacks, node.children[index], new_prefix);
				}
			}
		}

		function _reconstruct_leaves(node, elements) {
			function _tree_search(element, node) {
				if(node && node.stack_id && node.stack_id == element.stack_id) {
					node.children = node.children || [];
					node.children.push({'title': element.title, 'url': element.url});
					return true;
				}
				else if(node && node.children) {
					for(var i=0; i<node.children.length; i++) {
						if(_tree_search(element, node.children[i])) break;
					}
				}
			}
			for(var i=0; i<elements.length; i++) {
				var element = elements[i];

				_tree_search(element, node);
			}
		}

		function _find_link(node, children) {
		  	for(var i=0, n=children.length; i<n; i++)
		    		if(children[i].url && children[i].title == node.title) {
		      		return true;
		    	}
		  	//console.log([node, children]);
		  	return false;
		}

		function _find_folder(node, children) {
		  	for(var i=0, n=children.length; i<n; i++)
		    		if(!children[i].url && children[i].title == node.title) return children[i];
		  	return false;
		}

		function _create_subtree(parent, data) {
			//如果是书签
			if(data.url) {
				var obj = {
					'parentId': parent.id,
					'title': data.title || data.url,
					'url': data.url
				};
				console.log(['obj', obj]);
				//如果在该目录下找到了相同title的书签，则不添加
				if(parent.children && _find_link(obj, parent.children)) return;
				chrome.bookmarks.create(obj, function(node) {
					console.log('create bookmark ' + node.url);
				});
			} else {//如果是文件夹
				var obj = {
					'parentId': parent.id,
					'title': data.title
				};
				//console.log(['parent', parent]);
				if(parent.children) {
					var folder = _find_folder(obj, parent.children);
					console.log(folder);
					//如果找到了title相同的文件夹，则不添加文件夹，
					//并且从该文件夹继续
					if(folder) {
						if(data.children)
						for(var i=0, n=data.children.length; i<n; i++)
							_create_subtree(folder, data.children[i]);
						return;
					}
				}
				//如果没有找到title相同的文件夹，则建立这个文件夹，
				//并在这个新建的文件夹继续
				console.log('before create folder');
				chrome.bookmarks.create(obj,
				function(tree) {
					console.log('create folder ' + obj.title);
					if(!tree.url && data.children) {
					for(var i=0, n=data.children.length; i<n; i++)
						_create_subtree(tree, data.children[i]);
					}
				});
			}
		}
		

		function _pre_process(data, callback) {
			var bookmark_bar_id = 1, others_id = 2;
			var bookmark_bar_name, others_name;
			chrome.bookmarks.getTree(function(root) {
				console.log(['root', root]);
				root = root[0];
				bookmark_bar_name = root.children[0].title;
				others_name = root.children[1].title;

				for(var i=0, n=data.stacks.length; i<n; i++) {
					var cur_stack = data.stacks[i];
					if(cur_stack.name.length == 1 && 
						cur_stack.name[0] != bookmark_bar_name && 
						cur_stack.name[0] != others_name) {
						cur_stack.name = [bookmark_bar_name, cur_stack.name[0]];
					}
				}
				var root_bookmarks = {'title': ''};
				_reconstruct_tree(data.stacks, root_bookmarks, []);
				console.log(root_bookmarks);
				_reconstruct_leaves(root_bookmarks, data.elements);
				_create_subtree(root, root_bookmarks.children[0]);
				_create_subtree(root, root_bookmarks.children[1]);
				callback && callback(data);

			});	

		}
		function _do_process(data) {

		}
	}

	function showLoginPopup() {
		chrome.tabs.create({url: '../html/login.html'});
	}

	function logout() {
		islogin = false;
		localStorage.removeItem('email');
    		localStorage.removeItem('password');
    		localStorage.removeItem('islogin');
    		localStorage.removeItem('uid');
    		localStorage.removeItem('stack_id');
    		localStorage.removeItem('username');
	}

	return {
		get_default_stack: get_default_stack,
		logout: logout,
		save_url: save_url,
		send_login_request: send_login_request,
		push_bookmark: push_bookmark,
		pull_bookmark: pull_bookmark,
		showLoginPopup: showLoginPopup
	};
})();
