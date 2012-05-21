function Messager(content) {
	this.content = content;
	this.id = '_MEI_FM_MESSAGER_';
}

function gid(elem_id) {
	return document.getElementById(elem_id);
}

Messager.prototype = {
	clear: function() {
		var $divs = $('#' + this.id);
		if($divs.size()) $divs.remove();
	},
	show: function() {
		this.clear();
		var style = {
			'z-index': 65535,
			'font-size': '14px',
			'line-height': '30px',
			'position': 'fixed',
			'width': '30%',
			'top': '0',
			'left': '35%',
			'text-align': 'center',
			'margin': '0 auto',
			'background-color': '#ECF1FA',
			'font-family': "\"Microsoft YaHei\", Helvetica, sans-serif", 
			'display': 'none'
		};
		this.$elem = $('<div>', {id: this.id});
		this.$elem
		.css(style)
		.text(this.content)
		.appendTo('body')
		.slideDown()
		.delay(3000)
		.slideUp('normal', function() {
			$(this).remove();
		});
	}
};

chrome.extension.onRequest.addListener(function(req, sender, callback) {
	if(req.action == 'show_message') {
		new Messager('已经成功保存书签').show();
		
	}
});