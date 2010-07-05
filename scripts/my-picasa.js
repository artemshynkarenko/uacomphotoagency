//
//
//

var userName = "photoagency.lviv";
var thumbnailSize='800';

var lastVisit = new Date();
var level2MenuItemId = "albumList";
var level1MenuItemId = "categoryTopMenu";
var contentItemId = "thumbnails";
var labels = {
	"wedding": "Весілля",
	"album" : "Aльбом",
	"archive" : "Архів",
	"reportage" : "Репортаж",
	"project" : "Проекти",
	"portrait" : "Портрети",
	"fashion" : "Мода",
	"backstage" : "Backstage",
	"top" : "Вибране"
};

function getLocalizedValue( labelAlias){
	var localizedValue = labels[labelAlias];
	if (!localizedValue){
		localizedValue = labelAlias;
	}
	return localizedValue;
}

var pageName = "";
var pageState = null;

function getPageStateFromUrl(){
	//alert("Start getPageStateFromUrl()");
	var _GET = new Array();
	var uriStr  = window.location.href.replace(/&amp;/g, '&');
	var paraArr, paraSplit;
	if(uriStr.indexOf('?') > -1){
		var uriArr  = uriStr.split('?');
		var paraStr = uriArr[1];	
		if(paraStr.indexOf('&') > -1){
			paraArr = paraStr.split('&');
		}
		else{
			paraArr = new Array(paraStr);
		}
		for(var i = 0; i < paraArr.length; i++){
			paraArr[i] = paraArr[i].indexOf('=') > -1 ? paraArr[i] : paraArr[i] + '=';
			paraSplit  = paraArr[i].split('=');
			_GET[paraSplit[0]] = decodeURI(paraSplit[1].replace(/\+/g, ' '));
		}
	}
	//alert("Url parsed");
	var level1 = _GET["level1"];;
	if(!level1){
		level1 = "wedding";
	}
	else{
		level1 = level1.toLowerCase();
	}
	var level2 = _GET["level2"];
	if(level2){
		level2 = level2.toLowerCase();
	}
	else{
		level2 = "top";
	}
	
	var albumId = _GET["albumId"];
	pageState = {"level1": level1, "level2" : level2, "albumId" : albumId};
	//alert("End getPageStateFromUrl()");
}

function pageStateToUrl(newPageState){
	//alert("Start pageStateToUrl");
	var url = pageName + '?';
	if (newPageState.level1){
		url += 'level1=' + newPageState.level1;
		if (newPageState.level2 && newPageState.level2 != 'undefined'){
			 url += '&level2=' + newPageState.level2;
			 if (newPageState.albumId && newPageState.albumId != 'undefined'){
				 url += '&albumId=' + newPageState.albumId;
			 }
		}
	}
	//alert("End pageStateToUrl");
	return url;
}
function _print(element, html){
	//alert("Printing");
	if (element){
		element.append(html);
	}
	//alert("Printed");
}

function __printScriptInclude(src){
	var scriptString = '<script type="text/javascript" src="' + src + '"></script>';
	_print($(document), scriptString);
}
function __printScriptBlock(script){
	var scriptString = '<script type="text/javascript">' + script + '</s' + 'cript>';
	_print($(document), scriptString);
}


function beginGetAlbumsList(){
	//alert("Start beginGetAlbumsList");
	var picassaAlbumListUrl = "http://picasaweb.google.com/data/feed/base/user/" + userName +
  			"?category=album&alt=json&callback=endGetAlbumList&access=public";
	//alert("PICASSA_URL=" + picassaAlbumListUrl);
	//alert(endGetAlbumList);
	__printScriptInclude( picassaAlbumListUrl);
	//alert("End beginGetAlbumsList");
}

function endGetAlbumList(picasaJson){
	//alert ("Start endGetAlbumList");
	if (picasaJson.version != "1.0"){
		alert("Picass version has changed. Site may not work as properly. Sorry :(");
	}
	var albumFeed = picasaJson.feed.entry;
	for(var i = 0; i < albumFeed.length; ++i){
		var metaJsonString = albumFeed[i].media$group.media$description.$t;
		//alert("Raw metadata: " + metaJsonString);
		if(!metaJsonString || metaJsonString == "")
			continue;
		eval("albumFeed[i].media$group.media$description.$t = " + metaJsonString + ";");
	}
	getPageStateFromUrl();
	if(!pageState.albumId){
		buildLevelContent(albumFeed);
	}
	else{
		buildAlbumContent();
	}
	document.title = getLocalizedValue(pageState.level1) + " :: " + document.title;
	buildLevel1Menu(albumFeed);
	buildLevel2Menu(albumFeed);
	
	buildBreadScrums(albumFeed);
	//alert ("End endGetAlbumList");
}




function buildLevel1Menu(albumFeed){
	//alert ("Start buildLevel1Menu");
	var menuItems = new Array();
	for(var i = 0; i < albumFeed.length; ++i){
		var metaJson = albumFeed[i].media$group.media$description.$t;
		//alert("Raw metadata: " + metaJsonString);
		if(!metaJson || metaJson == "")
			continue;
		
		if(!metaJson.level1)
			continue;
		//alert("Level1 satisfied");
		var level1String = metaJson.level1.toLowerCase();
		var level1Items = level1String.split(',');
		for(var k = 0; k < level1Items.length; ++k){
			var level1 = level1Items[k];
			var j = 0;
			for (; j < menuItems.length; ++j){
				if (menuItems[j].level1 == level1){
					break;
				}
			}		
			if (j == menuItems.length){
				menuItems.push( {"level1": level1} );
			}
		}
	}
	//alert("Found " + menuItems.length + "top menuItems");
	var menuHolder = $("#" + level1MenuItemId);
	var styleTag = '<style type="text/css">';
	for(var i = 0; i < menuItems.length; ++i){
		var menuItem =  menuItems[i];
		var localizedValue = getLocalizedValue(menuItem.level1);
		var menuHtml = '<li id="' + menuItem.level1 + 'Header" class="menuItem';
		if (menuItem.level1 == pageState.level1){
			 menuHtml += ' selectedMenuItem';
		}
		menuHtml += '"><h2>';
		menuHtml += '<a class="menu" onclick="this.blur();" title="' +
			localizedValue + '" href="' + pageStateToUrl(menuItem) + '">' + localizedValue + '</a>';
		menuHtml += '</h2></li>';
		_print ( menuHolder, menuHtml);
		styleTag += "#" + menuItem.level1 +"Header{ background-image:url('scripts/text2img.php?text=" + encodeURIComponent(localizedValue) + "');}\r\n";
	}
	styleTag += '</style>';
	_print(menuHolder, styleTag);
	//alert ("End buildLevel1Menu");
}
function buildLevel2Menu(albumFeed){
	//alert ("Start buildLevel2Menu");
	var menuItems = new Array();
	for(var i = 0; i < albumFeed.length; ++i){
		var metaJson = albumFeed[i].media$group.media$description.$t;
		
		if(!metaJson.level1 || metaJson.level1.toLowerCase().indexOf(pageState.level1) == -1)
			continue;
		//alert("Level1 satisfied");
		var level2String = metaJson.level2.toLowerCase();
		var level2Items = level2String.split(',');
		for(var k = 0; k < level2Items.length; ++k){
			var level2 = level2Items[k];
			var j = 0;
			for (; j < menuItems.length; ++j){
				if (menuItems[j].level2 == level2){
					++menuItems[j].count;
					break;
				}
			}		
			if (j == menuItems.length){
				menuItems.push( {"level1": pageState.level1, "level2": level2, "count" : 1} );
			}
		}
	}
	//alert("Found " + menuItems.length + " albumlist items");
	var menuHolder = $("#" + level2MenuItemId);
	var styleTag = '<style type="text/css">';
	for(var i = 0; i < menuItems.length; ++i){
		var menuItem =  menuItems[i];
		var localizedValue = getLocalizedValue(menuItem.level2) + ' (' +menuItem.count + ')';
		var menuHtml = '<li id="' + menuItem.level2 + 'Header" class="menuItem';
		if (menuItem.level2 == pageState.level2){
			 menuHtml += ' selectedMenuItem';
		}
		menuHtml += '"><h3>';
		menuHtml += '<a class="menu" onclick="this.blur();" title="' +
			localizedValue + '" href="' + pageStateToUrl(menuItem) + '">' + localizedValue + '</a>';
		menuHtml += '</h3></li>';
		_print ( menuHolder, menuHtml);
		styleTag += "#" + menuItem.level2 +"Header{ background-image:url('scripts/text2img.php?text=" + encodeURIComponent(localizedValue) + "');}\r\n";
	}
	styleTag += '</style>';
	_print(menuHolder, styleTag);
	//alert ("End buildLevel2Menu");
}

function buildLevelContent(albumFeed){
	//alert ("Start buildLevelContent");
	var albumsItems = new Array();
	for(var i = 0; i < albumFeed.length; ++i){
		var feedItem = albumFeed[i]
		var metaJson = feedItem.media$group.media$description.$t;
		
		if(!metaJson.level1 || metaJson.level1.toLowerCase().indexOf(pageState.level1) == -1 )
			continue;
		if (!metaJson.level2 || metaJson.level2.toLowerCase().indexOf(pageState.level2) == -1 )
			continue;
		//alert("Level1, Level2 satisfied");
		albumsItems.push( {"level1": pageState.level1, "level2": pageState.level2,  "jSon" : feedItem} );
	}
	//alert("Found " + albumsItems.length + " albums");
	var contentHolder = $("#" + contentItemId);
	for(var i = 0; i < albumsItems.length; ++i){
		var albumItem =  albumsItems[i];
		var idString = albumItem.jSon.id.$t;
		//alert(idString);
		var id_begin = idString.indexOf('albumid/')+8;
  		var id_end = idString.indexOf('?');
  		var id_base = idString.slice(id_begin, id_end);
		albumItem.albumId = id_base;
		var albumTitle = albumItem.jSon.title.$t;
		var imageUrl = albumItem.jSon.media$group.media$content[0].url + '?imgmax=160&crop=1';
		var albumHtml = '<p><a href="' + pageStateToUrl(albumItem) + '" title="'+ albumTitle + '">'
			+ '<img src="' + imageUrl + '" alt="' + albumTitle + '" /></a></p>';
		_print ( contentHolder, albumHtml);
	}
	//alert ("End buildLevelContent");
}

function buildAlbumContent(){
	//alert ("Start buildAlbumContent");
	beginGetAlbumPhotos();
	//alert ("End buildAlbumContent");
}

function beginGetAlbumPhotos(){
	//alert ("Start beginGetAlbumPhotos");
	var picasaImageListUrl = 'http://picasaweb.google.com/data/feed/base/user/' + userName +'/albumid/' + pageState.albumId
			+ '?category=photo&alt=json&callback=endGetAlbumPhotos';
	__printScriptInclude( picasaImageListUrl);
	//alert ("End beginGetAlbumPhotos");
}

function endGetAlbumPhotos(photosFeed){
	//alert ("Start endGetAlbumPhotos");
	var entry = photosFeed.feed.entry;
	var contentHolder = $("#" + contentItemId);
	for(var i=0; i < entry.length; i++){
		var imageItem = entry[i];
		var imgUrl = imageItem.media$group.media$content[0].url;
		var imageHtml = '<p><a class="gallery" href="' + imgUrl + '">'
			+ '<img src="' + imgUrl + '?imgmax=72&crop=1" class="pwimages" /></a></p>';
		_print ( contentHolder, imageHtml);
	}
	$("a.gallery").lightbox();
	//alert ("End endGetAlbumPhotos");
}

function buildBreadScrums(albumFeed){
	//TODO: add breadscums leve11Name > level2Name > AlbumName
}