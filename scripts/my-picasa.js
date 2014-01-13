//
//
//

var userName = "photoagency.lviv";
var thumbnailSize='800';

var lastVisit = new Date();
var level2MenuItemId = "albumList";
var level1MenuItemId = "categoryTopMenu";
var contentItemId = "thumbnails";
var albumThumbs = "albumThumbnails";
var labels = {
	"wedding": "Весілля",
	"album2009" : "Aльбоми 2009",
	"album2010" : "Aльбоми 2010",
	"album" : "Aльбом",
	"archive" : "Архів",
	"reportage" : "Репортаж",
	
	"ads": "Реклама",
	"ads2": "Реклама",
	
	"project" : "Проекти",
	"backstage" : "Backstage",
	"calendar" : "Календар",
	"lviv" : "Львів",
	"balet" : "Балет",
	"travels" : "Подорожі",
	
	"fashion" : "Мода",
	"top" : "Вибране",
	
	"portrait" : "Портрети",
	"womanportrait": "Жіночий",
	"maleportrait": "Чоловічий",
	"familyportrait": "Сімейний",
	"kidsportrait": "Дитячий"
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
		level2 = "NONE";
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
	if(newPageState.level2 && newPageState.level2 == 'archive'){
		switch(newPageState.level1){
		case "wedding":
			url = "/weddings/index.html";
			break;
		case "portrait":
			url = "/portfolio/index.html";
			break;
		case "project":
			url = "/gallery/index.html";
			break;
		case "ads":
			url = "/gallery/index.html";
			break;
		default:
			break;
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
	
	document.title = getLocalizedValue(pageState.level1) + " :: " + document.title;
	buildLevel1Menu(albumFeed);
	buildLevel2Menu(albumFeed);
	buildBreadScrums(albumFeed);
	if(!pageState.albumId){
		buildLevelContent(albumFeed);
	}
	else{
		buildAlbumContent();
	}
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
		menuHtml += '<a class="menu" title="' +
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
	menuItems.push( {"level1": pageState.level1, "level2": "archive", "count" : -1} );
	//alert("Found " + menuItems.length + " albumlist items");
	var menuHolder = $("#" + level2MenuItemId);
	var styleTag = '<style type="text/css">';
	for(var i = 0; i < menuItems.length; ++i){
		var menuItem =  menuItems[i];
		var localizedValue = getLocalizedValue(menuItem.level2);
		if (menuItem.count > 1 )
			localizedValue += ' (' +menuItem.count + ')';
		var menuHtml = '<li id="' + menuItem.level2 + 'Header" class="menuItem';
		if (menuItem.level2 == pageState.level2 || pageState.level2 == "NONE"){
			 menuHtml += ' selectedMenuItem';
			 pageState.level2 = menuItem.level2;
		}
		menuHtml += '"><h3>';
		menuHtml += '<a class="menu" title="' +
			localizedValue + '" href="' + pageStateToUrl(menuItem) + '">' + localizedValue + '</a>';
		menuHtml += '</h3></li>';
		_print ( menuHolder, menuHtml);
		if (menuItem.level2 == pageState.level2){
			styleTag += buildAlbumMenu(albumFeed, styleTag);
		}
		styleTag += "#" + menuItem.level2 +"Header{ background-image:url('scripts/text2img.php?text=" + encodeURIComponent(localizedValue) + "');}\r\n";
	}
	styleTag += '</style>';
	_print(menuHolder, styleTag);
	//alert ("End buildLevel2Menu");
}

function buildAlbumMenu(albumFeed){
	//alert ("Start buildAlbumMenu");
	var styleTag = "";
	var menuHolder = $("#" + level2MenuItemId);
	var menuHtml = '';
	for(var i = 0; i < albumFeed.length; ++i){
		var albumItem =  albumFeed[i];
		var metaJson = albumItem.media$group.media$description.$t;
		
		if(!metaJson.level1 || metaJson.level1.toLowerCase().indexOf(pageState.level1) == -1)
			continue;
		//alert("Level1 satisfied");
		var level2String = metaJson.level2.toLowerCase();
		var level2Items = level2String.split(',');
		for(var k = 0; k < level2Items.length; ++k){
			var level2 = level2Items[k];
			//alert(level2 + " != " + pageState.level2);
			if(level2 != pageState.level2)
				continue;
			//alert("Level2 satisfied");
			var idString = parseAlbumIdFromJson( albumItem);
			//alert(idString);
			var albumTitle = albumItem.title.$t;
			//alert(albumTitle);
			var localizedValue = getLocalizedValue(albumTitle);
			//localizedValue = encodeURIComponent(localizedValue);
			//alert(localizedValue);
			menuHtml += '<li id="album' + idString + 'Header" class="menuItem';
			if (pageState.albumId != null && idString.indexOf(pageState.albumId) > -1){
				 menuHtml += ' selectedMenuItem';
			}
			var menuItem = {"level1": pageState.level1, "level2": pageState.level2, "albumId": idString};
			menuHtml += '"><h4>';
			menuHtml += '<a class="menu" title="' +
				localizedValue + '" href="' + pageStateToUrl(menuItem) + '">' + localizedValue + '</a>';
			menuHtml += '</h4></li>';

			styleTag += "#album" + idString +"Header{ border-bottom:none !important;background-image:url('scripts/text2imgSmall.php?text=" + encodeURIComponent(localizedValue) + "');height:25px !important;}\r\n#album" + idString +"Header a{height:25px !important;}";
		}
		
	}
	menuHtml += "";
	_print ( menuHolder, menuHtml);
	//alert ("End buildAlbumMenu");
	return styleTag;
}
function buildLevelContent(albumFeed){
	//alert ("Start buildLevelContent");
	var albumsItems = new Array();
	for(var i = 0; i < albumFeed.length; ++i){
		var feedItem = albumFeed[i]
		var metaJson = feedItem.media$group.media$description.$t;

		if(!metaJson.level1 || metaJson.level1.toLowerCase().indexOf(pageState.level1) == -1 )
		{
			//if(metaJson.level1)
			//	alert(metaJson.level1 +  "!=" + pageState.level1);
			continue;
		}
		if (!metaJson.level2 || metaJson.level2.toLowerCase().indexOf(pageState.level2) == -1 )
		{
			//if(metaJson.level2)
			//	alert(metaJson.level2 +  "!=" + pageState.level2);
			continue;
		}

		//alert("Level1, Level2 satisfied");
		albumsItems.push( {"level1": pageState.level1, "level2": pageState.level2,  "jSon" : feedItem} );
	}
	//alert("Found " + albumsItems.length + " albums");
	var contentHolder = $("#" + albumThumbs);
	for(var i = 0; i < albumsItems.length; ++i){
		var albumItem =  albumsItems[i];
		albumItem.albumId = parseAlbumIdFromJson( albumItem.jSon);
		var albumHtmlItemId = "thumb" + albumItem.albumId;
		var albumTitle = albumItem.jSon.title.$t;
		var imageUrl = albumItem.jSon.media$group.media$content[0].url + '?imgmax=160&crop=1';
		var albumHtml = '<p><a id="' + albumHtmlItemId + '"href="' + pageStateToUrl(albumItem) + '" title="'+ albumTitle + '">'
			+ '<img src="' + imageUrl + '" alt="' + albumTitle + '" /><img class="albumTitle" id="' + albumHtmlItemId + 'Img" src="scripts/text2imgThumb.php?text=' + encodeURIComponent(albumTitle) + '" alt="' + albumTitle + '"/></a></p>';
		_print ( contentHolder, albumHtml);
		$("#" + albumHtmlItemId).hover(function()
							{/*alert("IN");*/ $("#" + this.id + "Img").show("fast");},
		  								function()
							{/*alert("OUT");*/$("#" + this.id + "Img").hide("fast");})
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
		var imgName = imageItem.title.$t;
		var imgUrlBig = imgUrl.replace(imgName, "s1600/" + imgName);
		var imageHtml = '<p><a class="gallery" href="' + imgUrlBig + '">'
			+ '<img src="' + imgUrl + '?imgmax=72&crop=1" class="pwimages" /></a></p>';
		_print ( contentHolder, imageHtml);
	}
	$("a.gallery").lightbox();
	//alert ("End endGetAlbumPhotos");
}

function buildBreadScrums(albumFeed){
	//TODO: add breadscums leve11Name > level2Name > AlbumName
}

function parseAlbumIdFromJson(albumFeedItem){
	var idString = albumFeedItem.id.$t;
	//alert(idString);
	var id_begin = idString.indexOf('albumid/')+8;
	var id_end = idString.indexOf('?');
	var id_base = idString.slice(id_begin, id_end);
	return  id_base;
}