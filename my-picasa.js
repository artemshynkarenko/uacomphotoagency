//
//
//

var userName = "photoagency.lviv";
var thumbnailSize='800';
var pageName = "";
var lastVisit = new Date();
var level2MenuItemId = "albumList";
var divScriptsEval = null;
function _print(element, html){
	//alert("Printing");
	if (element){
		element.append(html);
	}
	//alert("Printed");
}

function __printScriptInclude(src){
	var scriptString = '<script type="text/javascript" src="' + src + '"></script>';
	_print(divScriptsEval, scriptString);
}
function __printScriptBlock(script){
	var scriptString = '<script type="text/javascript">' + script + '</s' + 'cript>';
	_print(divScriptsEval, scriptString);
}

function endGetAlbumList(picasaJson){
	//alert ("Start endGetAlbumList");
	if (picasaJson.version != "1.0"){
		alert("Picass version has changed. Site may not work as properly. Sorry :(");
	}
	var albumFeed = picasaJson.feed.entry;
	buildLevel2Menu("wedding", albumFeed);
	//alert ("End endGetAlbumList");
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

function buildLevel2Menu(level1Name, albumFeed){
	//alert ("Start buildLevel2Menu");
	var level1NameLowerCase = level1Name.toLowerCase();
	var menuItems = new Array();
	for(var i = 0; i < albumFeed.length; ++i){
		var metaJsonString = albumFeed[i].media$group.media$description.$t;
		//alert("Raw metadata: " + metaJsonString);
		if(!metaJsonString || metaJsonString == "")
			continue;
		var metaJson = JSON.parse(metaJsonString);
		
		if(!metaJson.level1 || metaJson.level1.toLowerCase() != level1NameLowerCase)
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
		}
		if (j == menuItems.length){
			menuItems.push( {"level2": level2, "count" : 1} );
		}
	}
	//alert("Found " + menuItems.length + "items");
	var menuHtml = "";
	for(var i = 0; i < menuItems.length; ++i){
		var menuItem =  menuItems[i];
		menuHtml += '<li><h3><a href="' + pageName + '?level1=' + level1Name + '&level2=' + menuItem.level2 + '">'
 			+ menuItem.level2 + '&nbsp;(' + menuItem.count + ')</a></h3></li>';
	}
	var menuHolder = $("#" + level2MenuItemId);
	_print ( menuHolder, menuHtml);
	//alert ("End buildLevel2Menu");
}

