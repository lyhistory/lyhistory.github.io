---
title: '"Download" Emotion JS Plugin'
layout: single
author_profile: true
read_time: true
comments: true
share: true
related: true
---

![](/content/images/post/20190101/emotion_icon.gif)
emotion source(partial):
```
[{"phrase":"[微笑]","type":"face","url":"/emotion/5c/huanglianwx_org.gif","hot":false,"common":true,"category":"","icon":"/emotion/5c/huanglianwx_thumb.gif","value":"[微笑]","picid":""},{"phrase":"[嘻嘻]","type":"face","url":"/emotion/0b/tootha_org.gif","hot":false,"common":true,"category":"","icon":"/emotion/0b/tootha_thumb.gif","value":"[嘻嘻]","picid":""},{"phrase":"[哈哈]","type":"face","url":"/emotion/6a/laugh.gif","hot":false,"common":true,"category":"","icon":"/emotion/6a/laugh.gif","value":"[哈哈]","picid":""},{"phrase":"[可爱]","type":"face","url":"/emotion/14/tza_org.gif","hot":false,"common":true,"category":"","icon":"/emotion/14/tza_thumb.gif","value":"[可爱]","picid":""}]
```

download icons to local using c# webclient:
The DownloadFileAsync/DownloadFileCompleted members of WebClient use the Event-based Asynchronous Pattern. If you want to use async and await, you should be using the Task-based Asynchronous Pattern.
In this case, you should use the DownloadFileTaskAsync member, as such(Please note that your Context.listOfLocalDirectories.Add and Errors.printError methods should be threadsafe.):
```
private async Task DownloadFileAsync(DocumentObject doc)
{
	try
	{
		using (WebClient webClient = new WebClient())
		{
			string downloadToDirectory = @Resources.defaultDirectory + value.docName;
			webClient.Credentials = System.Net.CredentialCache.DefaultNetworkCredentials;
			await webClient.DownloadFileTaskAsync(new Uri(value.docUrl), @downloadToDirectory);

			//Add them to the local
			Context.listOfLocalDirectories.Add(downloadToDirectory);
		}
	}
	catch (Exception)
	{
		Errors.printError("Failed to download File: " + value.docName);
	}
}

private async Task DownloadMultipleFilesAsync(List doclist)
{
	await Task.WhenAll(doclist.Select(doc => DownloadFileAsync(doc)));
}
```

emotion.js:
```
//customize hashtable
function Hashtable() {
	this._hash = new Object();
	this.put = function(key, value) {
		if (typeof (key) != "undefined") {
			if (this.containsKey(key) == false) {
				this._hash[key] = typeof (value) == "undefined" ? null : value;
				return true;
			} else {
				return false;
			}
		} else {
			return false;
		}
	}
	this.remove = function(key) { delete this._hash[key]; }
	this.size = function() { var i = 0; for (var k in this._hash) { i++; } return i; }
	this.get = function(key) { return this._hash[key]; }
	this.containsKey = function(key) { return typeof (this._hash[key]) != "undefined"; }
	this.clear = function() { for (var k in this._hash) { delete this._hash[k]; } }
}

var emotions = new Array();
var categorys = new Array();
var uPeterEmotionsHt = new Hashtable();

$(function () {
	var emotionsource="/content/js/" + "emotion_source.js"+ "?v=" + Math.random();
	setTimeout(function () { $.getScript(emotionsource)}, 1E3);
});

function AnalyticEmotion(s) {
	if(typeof (s) != "undefined") {
		var sArr = s.match(/\[.*?\]/g);
		if (sArr != null) {
			for (var i = 0; i &lt; sArr.length; i++) {
				if (uPeterEmotionsHt.containsKey(sArr[i])) {
					var src = "/content/image/" + uPeterEmotionsHt.get(sArr[i]);
					var reStr = "<img width="\&quot;22\&quot;" height="\&quot;22\&quot;" />";
					s = s.replace(sArr[i], reStr);
				}
			}
		}
	}
	return s;
}

(function($){
	$.fn.PeterEmotion = function(target){
		var cat_current;
		var cat_page;
		$(this).click(function(event){
			event.stopPropagation();

			var eTop = target.offset().top + target.height() + 15;
			var eLeft = target.offset().left - 1;

			if($('#emotions .categorys')[0]){
				$('#emotions').css({top: eTop, left: eLeft});
				$('#emotions').toggle();
				return;
			}
			$('body').append('<div id="emotions"></div>');
			$('#emotions').css({top: eTop, left: eLeft});
			$('#emotions').html('<div>正在加载，请稍候...</div>');
			$('#emotions').click(function(event){
				event.stopPropagation();
			});

			$('#emotions').html('
				<div style="float: right;"><a id="prev"></a>«<a id="next"></a>»</div>
				<div class="categorys"></div>
				<div class="container"></div>
				<div class="page"></div>
			');
			$('#emotions #prev').click(function(){
				showCategorys(cat_page - 1);
			});
			$('#emotions #next').click(function(){
				showCategorys(cat_page + 1);
			});
			showCategorys();
			showEmotions();

		});
		$('body').click(function(){
			$('#emotions').remove();
		});
		$.fn.insertText = function(text){
			this.each(function() {
				if(this.tagName !== 'INPUT' &amp;&amp; this.tagName !== 'TEXTAREA') {return;}
				if (document.selection) {
					this.focus();
					var cr = document.selection.createRange();
					cr.text = text;
					cr.collapse();
					cr.select();
				}else if (this.selectionStart || this.selectionStart == '0') {
					var
					start = this.selectionStart,
					end = this.selectionEnd;
					this.value = this.value.substring(0, start)+ text+ this.value.substring(end, this.value.length);
					this.selectionStart = this.selectionEnd = start+text.length;
				}else {
					this.value += text;
				}
			});
			return this;
		}
		function showCategorys(){
			var page = arguments[0]?arguments[0]:0;
			if(page &lt; 0 || page &gt;= categorys.length / 5){
				return;
			}
			$('#emotions .categorys').html('');
			cat_page = page;
			for(var i = page * 5; i &lt; (page + 1) * 5 &amp;&amp; i &lt; categorys.length; ++i){
				$('#emotions .categorys').append($('<a>' + categorys[i] + '</a>'));
			}
			$('#emotions .categorys a').click(function(){
				showEmotions($(this).text());
			});
			$('#emotions .categorys a').each(function(){
				if($(this).text() == cat_current){
					$(this).addClass('current');
				}
			});
		}
		function showEmotions(){
			var category = arguments[0]?arguments[0]:'默认';
			var page = arguments[1]?arguments[1] - 1:0;
			$('#emotions .container').html('');
			$('#emotions .page').html('');
			cat_current = category;
			var path = "/content/image/";
			for(var i = page * 72; i &lt; (page + 1) * 72 &amp;&amp; i &lt; emotions[category].length; ++i){
				$('#emotions .container').append($('<a title="' + emotions[category][i].name + '"><img src="' + path+emotions[category][i].icon + '" alt="' + emotions[category][i].name + '" width="22" height="22" /></a>'));
			}
			$('#emotions .container a').click(function(){
				target.insertText($(this).attr('title'));
				$('#emotions').remove();
			});
			for(var i = 1; i &lt; emotions[category].length / 72 + 1; ++i){
				$('#emotions .page').append($('<a class="current">' + i + '</a>'));
			}
			$('#emotions .page a').click(function(){
				showEmotions(category, $(this).text());
			});
			$('#emotions .categorys a.current').removeClass('current');
			$('#emotions .categorys a').each(function(){
				if($(this).text() == category){
					$(this).addClass('current');
				}
			});
		}
	}
})(jQuery);

function loadSource(data) {
	for (var i in data) {
		if (data[i].category == '') {
			data[i].category = '默认';
		}
		if (emotions[data[i].category] == undefined) {
			emotions[data[i].category] = new Array();
			categorys.push(data[i].category);
		}
		emotions[data[i].category].push({
			name: data[i].phrase,
			icon: data[i].icon
		});
		uPeterEmotionsHt.put(data[i].phrase, data[i].icon);
	}
}
```

ref:
http://stackoverflow.com/questions/16514027/download-multiple-files-async-and-wait-for-all-of-them-to-finish-before-executin