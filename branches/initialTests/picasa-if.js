// JavaScript Document
//var username='photoagency.lviv';
var _GET;
var photoOutput; //ouitput from picassa
var labelList = new Array(
						{"category":"wedding", "label":"весілля"},
						{"category":"top", "label":"top"},
						{"category":"album", "label":"альбом"},
						{"category":"archive", "label":"архів"},
						{"category":"reportage", "label":"репортаж"},						
				 		{"category":"project", "label":"проекти"},
				 		{"category":"portrait", "label":"портрети"},
				 		{"category":"fashion", "label":"мода"},
				 		{"category":"backstage", "label":"backstage"}
						);


var photolist = new Array(); //this is used globally to store the entire list of photos in a given album, rather than pass the list around in a URL (which was getting rediculously long as a result)
var album_name = ""; //this is used globally to store the album name, so we don't have to pass it around in the URL anymore either.
var my_numpics = ""; //this is used globally to store the number of items in a particular album, so we don't have to pass it around in the URL anymore either.
var prev = ""; //used in the navigation arrows when viewing a single item
var next = "";//used in the navigation arrows when viewing a single item



function PRINT(a){document.write(a);}

function trimString(s) 
{ 
if ((s == null)||(s.length == 0)) 
return s; 

for(var start = 0; s.charCodeAt(start) == 32; start++) 
if (start == s.length-1) 
return ''; 

for(var end = s.length-1; s.charCodeAt(end) == 32; end--); 

return s.substring(start, end+1); 
} 







function getLabel( ctg ) {
		var str = "0";
		//ctg = trimString(ctg);
//		alert("in getLabel: ctg=" + ctg);
		
		for( i=0; i<labelList.length; i++ ){
			var c = trimString(labelList[ i ].category);
			if(c.toLowerCase() == ctg.toLowerCase()){
				str = labelList[ i ].label;
			}
		}
		return( str );
}


function readGet(){
	var _GET = new Array();
	var uriStr  = window.location.href.replace(/&amp;/g, '&');
	var paraArr, paraSplit;
	if(uriStr.indexOf('?') > -1){
		var uriArr  = uriStr.split('?');
		var paraStr = uriArr[1];
	}
	else{
		return _GET;
	}
	
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
	return _GET;
}

_GET = readGet();


function getJson(j){
	while (!j){}
	photoOutput = j;
}


/*function getAlbumList(j){ 
//returns the list of all albums for the user

 PRINT("<table border=0><tr>");

 for(i=0;i<j.feed.entry.length;i++){

  var img_base = j.feed.entry[i].media$group.media$content[0].url;

  var id_begin = j.feed.entry[i].id.$t.indexOf('albumid/')+8;
  var id_end = j.feed.entry[i].id.$t.indexOf('?');
  var id_base = j.feed.entry[i].id.$t.slice(id_begin, id_end);

  PRINT("<td valign=top><a class='standard' href='?albumid="+id_base+"'><img src='"+img_base+"?imgmax=160&crop=1' class='pwimages' /></a>");
  PRINT("<br><table border=0><tr><td></td></tr></table><center><a class='standard' href='?albumid="+id_base+"'>"+ j.feed.entry[i].title.$t +"</a></center></td>");
  if (i % columns == columns-1) {
    PRINT("</tr><tr><td><br></td></tr> <tr><td></td></tr> <tr>");
  }
 }
 PRINT("</tr></table>");
 
}

*/

/*function getAlbumsByCategory(j){ 
 PRINT("<table border=0><tr>");
 for(i=0;i<j.feed.entry.length;i++){

  var img_base = j.feed.entry[i].media$group.media$content[0].url;

  var id_begin = j.feed.entry[i].id.$t.indexOf('albumid/')+8;
  var id_end = j.feed.entry[i].id.$t.indexOf('?');
  var id_base = j.feed.entry[i].id.$t.slice(id_begin, id_end);
  
  if( j.feed.entry[i].media$group.media$description.$t == "Weddings"){
	  PRINT("<td valign=top><a class='standard' href='?albumid="+id_base+"'><img src='"+img_base+"?imgmax=160&crop=1' alt='" + j.feed.entry[i].title.$t +"' class='pwimages' border='none' border='0'/></a>");
//	  PRINT("<br><table border=0><tr><td></td></tr></table><center><a class='standard' href='?albumid="+id_base+"'>"+ j.feed.entry[i].title.$t +"</a></center></td>");
  if (i % columns == columns-1) {
    PRINT("</tr><tr><td><br></td></tr> <tr><td></td></tr> <tr>");
  }
  }
 }
 PRINT("</tr></table>");
 
}
*/

function getAlbumsByCategoryLevel(j, c, lv){ 
 	PRINT("<table border=0><tr>");
 	
	for( var i=0; i<j.feed.entry.length; i++ ){

  		var img_base = j.feed.entry[i].media$group.media$content[0].url;
  		var id_begin = j.feed.entry[i].id.$t.indexOf('albumid/')+8;
  		var id_end = j.feed.entry[i].id.$t.indexOf('?');
  		var id_base = j.feed.entry[i].id.$t.slice(id_begin, id_end);
  		var albumCateg = JSON.parse(j.feed.entry[i].media$group.media$description.$t);
  
  		if( ( albumCateg.level1.toLowerCase()==c.toLowerCase() ) && ( albumCateg.level2.toLowerCase()==lv.toLowerCase() ) ){

			PRINT("<td valign=top><a class='standard' href='?category=" + _GET['category']+"&level2="+_GET['level2']
				+"&albumid="+id_base+"'><img src='"+img_base+"?imgmax=160&crop=1' alt='" + 
					j.feed.entry[i].title.$t +"' class='pwimages' border='none' border='0'/></a>");
  		
			if (i % columns == columns-1) {
    			PRINT("</tr><tr><td><br></td></tr> <tr><td></td></tr> <tr>");
  			}
  		}
 	}
 	PRINT("</tr></table>");
}


function getCategorySublevels(j, c){
	var labels = new Array();
//	alert(j);
	PRINT("<p>");
 
	for( var i = 0; i < j.feed.entry.length; i++ ){
		var albumCateg = j.feed.entry[i].media$group.media$description.$t;
		
		var lev1 = "";
		if (albumCateg.level1)
			lev1  = trimString(albumCateg.level1.toLowerCase());
		var lev2 = "";
		if (albumCateg.level2)
			lev2 = trimString(albumCateg.level2.toLowerCase());

		var flag = true;
		var ctg = trimString(c.toLowerCase());
		
		if( lev1 ==  ctg ){
			for( var k = 0; k < labels.length; k++ ){
				if( labels[k] == lev2 ){
					flag = false;
				}
			}
		}

		if( flag && ( lev2 != "top" ) ){
			labels.push( lev2 );
			//alert('level1='+ lev1 +'; level2=' + lev2  );
			PRINT('<a href="test.html?category=' + lev1 + '&level2=' + lev2 + '">' + getLabel( lev2 ) + '</a>&nbsp;');
		}
	}
 	PRINT("</p>");	
}



//
//
//	DISPLAY THUMBNAILS OF THE PICTURES IN AN ALBUM
//
//


function getphotolist(j){

// This function is called just before displaying an item; it returns info about the item's current state within its parent
// album, such as the name of the album it's in, the index of the photo in that album, and the IDs of the previous and next
// photos in that album (so we can link to them using navigation arrows).  This way we don't have to pass state information
// around in the URL, which was resulting in hellishly long URLs (sometimes causing "URI too long" errors on some servers).

// Get the number of pictures in the album.  Added 7/18/2007.
 my_numpics = j.feed.openSearch$totalResults.$t;

// Also get the name of the album, so we don't have to pass that around either.  Added 7/18/2007.
 album_name = j.feed.title.$t;

 for(i=0;i<j.feed.entry.length;i++){
  // get the list of all photos referenced in the album and display;
  // also stored in an array (photoids) for navigation in the photo view (passed via the URL)
  var id_begin = j.feed.entry[i].id.$t.indexOf('photoid/')+8;
  var id_end = j.feed.entry[i].id.$t.indexOf('?');
  var id_base = j.feed.entry[i].id.$t.slice(id_begin, id_end);
  photolist[i]=id_base;

  // now get previous and next photos relative to the photo we're currently viewing
  if (i>0)
  {
    var prev_begin = j.feed.entry[i-1].id.$t.indexOf('photoid/')+8;
    var prev_end = j.feed.entry[i-1].id.$t.indexOf('?');
    prev = j.feed.entry[i-1].id.$t.slice(id_begin, id_end);
  }
  if (i<j.feed.entry.length-1)
  {
    var next_begin = j.feed.entry[i+1].id.$t.indexOf('photoid/')+8;
    var next_end = j.feed.entry[i+1].id.$t.indexOf('?');
    next = j.feed.entry[i+1].id.$t.slice(id_begin, id_end);
  }

 }
}


function albums(j){  //returns all photos in a specific album

 //get the number of photos in the album
 var np = j.feed.openSearch$totalResults.$t;
 var item_plural = "s";
 if (np == "1") { item_plural = ""; }

 var album_begin = j.feed.entry[0].summary.$t.indexOf('href="')+6;
 var album_end = j.feed.entry[0].summary.$t.indexOf('/photo#');
 var album_link = j.feed.entry[0].summary.$t.slice(album_begin, album_end);
 var photoids = new Array();

 //PRINT("<div style='margin-left:3px'><a class='standard' href='" + window.location.protocol + "//" + window.location.hostname+window.location.pathname+"'>Gallery Home</a> &gt; "+ j.feed.title.$t +"&nbsp;&nbsp;["+np+" item"+item_plural+"]</div><div style='text-align:right; margin-right:5px; margin-top:-14px'><a target=PICASA class='standard' href='"+album_link+"'>View this album in Picasa</a></div><br>");
 PRINT("<ul border=0 id='lighBox'>");

 for(i=0;i<j.feed.entry.length;i++){

  //var img_begin = j.feed.entry[i].summary.$t.indexOf('src="')+5;
  //var img_end = j.feed.entry[i].summary.$t.indexOf('?imgmax');
  //var img_base = j.feed.entry[i].summary.$t.slice(img_begin, img_end);

  var img_base = j.feed.entry[i].media$group.media$content[0].url;

  var id_begin = j.feed.entry[i].id.$t.indexOf('photoid/')+8;
  var id_end = j.feed.entry[i].id.$t.indexOf('?');
  var id_base = j.feed.entry[i].id.$t.slice(id_begin, id_end);
  photoids[i]=id_base;
  

  // display the thumbnail (in a table) and make the link to the photo page, including the gallery name so it can be displayed.
  // (apparently the gallery name isn't in the photo feed from the Picasa API, so we need to pass it as an argument in the URL) - removed the gallery name 7/18/2007
  var link_url = "?category=" + _GET['category']+"&level2="+_GET['level2']+"&albumid="+_GET['albumid']+"&photoid="+id_base; //+"&photoids="+photoids;
  // disable the navigation entirely for really long URLs so we don't hit against the URL length limit.
  // note: this is probably not necessary now that we're no longer passing the photoarray inside the URL. 7/17/2007
  // Not a bad idea to leave it in, though, in case something goes seriously wrong and we need to revert to that method.
  if (link_url.length > 2048) { link_url = link_url.slice(0, link_url.indexOf('&photoids=')+10)+id_base; }
  PRINT("<li valign=top><a class='gallery' href='"+img_base+"'><img src='"+img_base+"?imgmax=160&crop=1' class='pwimages' /></a>");
  
  //PRINT("<p><center><SPAN STYLE='font-size: 9px'>"+j.feed.entry[i].media$group.media$description.$t+"</span></center>");
  PRINT("</li>");

  /*if (i % columns == columns-1) {
    PRINT("</tr><tr><td><br></td></tr><tr>");
  }*/
 }
 PRINT("</ul>");
 alert("Here we go for jQuery!");
 alert($('a.gallery'));
 alert("JQuery working");
$('a.gallery').lightbox();
 alert("Executed");
}




function photo(j){//returns exactly one photo


 var album_begin = j.entry.summary.$t.indexOf('href="')+6;
 var album_end = j.entry.summary.$t.indexOf('/photo#');
 var album_link = j.entry.summary.$t.slice(album_begin, album_end);

 var img_title = j.entry.title.$t;

 //get the dimensions of the photo we're grabbing; if it's smaller than our max width, there's no need to scale it up.
 var img_width = j.entry.media$group.media$content[0].width;
 var img_height = j.entry.media$group.media$content[0].height;


 var img_base = j.entry.media$group.media$content[0].url;


 // is this a video? If so, we will display that in the breadcrumbs below.
 var is_video = 0;
 if (j.entry.media$group.media$content.length > 1)
 {
   //PRINT('This is a '+j.entry.media$group.media$content[1].medium+'.<br>');
   if (j.entry.media$group.media$content[1].medium == "video")
   {
	   is_video = 1;
   }
 }

 
 var photo_begin = j.entry.summary.$t.indexOf('href="')+6;
 var photo_end = j.entry.summary.$t.indexOf('"><img');
 var photo_link = j.entry.summary.$t.slice(photo_begin, photo_end);
 var photo_id = _GET['photoid'];

 //album name is now taken from the global variable instead. 7/18/2007
 //
 //var album_name_begin = j.entry.summary.$t.indexOf(username)+username.length+1;
 //var album_name_end = j.entry.summary.$t.indexOf('/photo#');
 //var album_name = j.entry.summary.$t.slice(album_name_begin, album_name_end);

 var album_id = _GET['albumid'];
 var my_next = next;
 var my_prev = prev;
 var photo_array = photolist;
 //var my_numpics = _GET['np'];
 //instead, we now get this through the global variable my_numpics. 7/18/2007

 //PRINT("photo ids: "+_GET['photoids']+".<br><br>");
 //PRINT("photolist: "+photo_array+".<br><br>");

 //var my_galleryname = _GET['galleryname'];
 //var my_fixed_galleryname = my_galleryname.slice(1, my_galleryname.length-1);
 var my_galleryname = album_name;
 var my_fixed_galleryname = album_name;
 var album_base_path = window.location.protocol + "//" + window.location.hostname+window.location.pathname +
		 "?category=" + _GET['category'] + "&level2="+_GET['level2']+"&albumid="+ _GET['albumid'];

 alert("in photo()");
 alert("albumbasepath: " + album_base_path);

 // Get the filename for display in the breadcrumbs
 var LastSlash = 0;
 var img_filename = img_title;
 for(i=0;i<img_base.length-1;i++){
  if (img_base.charAt(i)=="/")
  {
	  LastSlash = i;
  }
 }
 if (LastSlash != 0)
 {
	 img_filename = img_base.slice(LastSlash+1, img_base.length);
 }
 // replace some commonly-used URL characters like %20
 img_filename = img_filename.replace("%20"," ");
 img_filename = img_filename.replace("%22","\"");
 img_filename = img_filename.replace("%27","\'");


//find preceding two and following two pictures in the array; used for the navigation arrows.
//the arrows are already linked to the previous and next pics, which were passed in with the URL.
//however, we need the ones that are two behind and two ahead so that we can pass that info along when we link to another photo.
//
//NOTE: as of 7/16/2007, the photo array is taken from global photolist (loaded in the getphotolist function) rather than from the URL.
//This has eliminated the need for really long URLs, which were hitting up against the URL length limit in some extreme cases.
for(i=0;i<photo_array.length;i++){
 if (photo_array[i]==photo_id)
 {
	 var p1 = photo_array[i-1]; //ID of the picture one behind this one; if null, we're at the beginning of the album
	 var current_index = i + 1; //this is the count of the current photo
	 var n1 = photo_array[i+1]; //ID of the picture one ahead of this one; if null, we're at the end of the album
 }
}
//these will be passed along if we move to the next or previous photo - removed the gallery name 7/18/2007
//var prev = album_base_path + "&photoid=" + p1 + "&np=" + my_numpics + "&galleryname=" + my_galleryname.replace("'","%27") + "&prev="+p2+ "&next="+photo_id; //+"&photoids="+photo_array;
//var next = album_base_path + "&photoid=" + n1 + "&np=" + my_numpics + "&galleryname=" + my_galleryname.replace("'","%27") + "&prev="+photo_id+ "&next="+n2; //+"&photoids="+photo_array;
var prev = album_base_path + "&photoid=" + p1; //+"&photoids="+photo_array;
var next = album_base_path + "&photoid=" + n1; //+"&photoids="+photo_array;

alert("next: " + next);
//Display the breadcrumbs
var my_item_plural = "";
if (my_numpics != 1)
{
	my_item_plural = "s";
}
var item_label = "picture";
var item_label_caps = "Picture";
if (is_video == 1) //if it's a video, don't say it's a picture, say it's an "item" instead
{
	item_label = "item";
	item_label_caps = "Item";
}
//if (photo_array.length == 1) { var current_index_text = "Total of " + my_numpics + " " + item_label + my_item_plural; } else { var current_index_text = item_label_caps + " " + current_index + " of " + my_numpics; }
var current_index_text = item_label_caps + " " + current_index + " of " + my_numpics;
if (is_video == 1) { current_index_text = current_index_text + "&nbsp;&nbsp;[VIDEO]"; }  //show in the breadcrumbs that the item is a video
PRINT("<div style='margin-left:3px'><a class='standard' href='"+ window.location.protocol + "//" + window.location.hostname+window.location.pathname+"'>Gallery Home</a> &gt; <a class='standard' href='" + album_base_path + "'>" + my_fixed_galleryname + "</a> &gt; <!--" + img_filename + "-->" + current_index_text + "</div><div style='text-align:right; margin-right:3px; margin-top:-14px'><a target=PICASA class='standard' href='"+photo_link+"'>View this image in Picasa</a></div><br>");


if (p1 == null) //we're at the first picture in the album; going back takes us to the album index
  { var prev = album_base_path }

if (n1 == null) //we're at the last picture in the album; going forward takes us to the album index
  { var next = album_base_path }

 //the navigation panel: back, home, and next.
 PRINT("<center><table border=0><tr valign=top>");
 if (photo_array.length > 1) { PRINT("<td><a class='standard' href='"+prev+"'><img border=0 alt='Previous item' src='prev.jpg'></a> </td><td></td>"); }
 PRINT("<td> <a class='standard' href='"+album_base_path+"'><img border=0 alt='Back to album index' src='home.jpg'></a> </td>");
 if (photo_array.length > 1) { PRINT("<td></td><td> <a class='standard' href='"+next+"'><img border=0 alt='Next item' src='next.jpg'></a></td>"); }
 PRINT("</tr></table></center><br>");

 var max_width = 658; //max width for our photos
 var display_width = max_width;
 if (img_width < display_width)
   { display_width = img_width; } //don't scale up photos that are narrower than our max width; disable this to set all photos to max width

 //at long last, display the image and its description. photos larger than max_width are scaled down; smaller ones are left alone
 PRINT("<center><a border=0 target=PICASA href='"+photo_link+"'><img id='picture' width="+display_width+" src='"+img_base+"?imgmax="+photosize+"' class='pwimages' /></a></center>");
 PRINT("<br><center><div style='margin-left:2px'>"+j.entry.media$group.media$description.$t+"</div></center></p>");


 //now we will trap left and right arrow keys so we can scroll through the photos with a single keypress ;-) JMB 7/5/2007
 PRINT('<script language="Javascript"> function testKeyCode( evt, intKeyCode ) { if ( window.createPopup ) return evt.keyCode == intKeyCode; else return evt.which == intKeyCode; } document.onkeydown = function ( evt ) { if ( evt == null ) evt = event; if ( testKeyCode( evt, 37 ) ) { window.location = "' + prev + '"; return false; } if ( testKeyCode( evt, 39 ) ) { window.location = "' + next + '"; return false; } } </script>');


 // an attempt at resampling the photo, rather than relying on the browser's internal resize function. doesn't work, unfortunately.
 //
 //PRINT("<?php PRINTfilename='"+img_base+"?imgmax="+photosize+"'; PRINTwidth = 658; PRINTheight = 1600; list(PRINTwidth_orig, PRINTheight_orig) = getimagesize(PRINTfilename); ");
 //PRINT("PRINTratio_orig = PRINTwidth_orig/PRINTheight_orig; if (PRINTwidth/PRINTheight > PRINTratio_orig) { PRINTwidth = PRINTheight*PRINTratio_orig; } else { PRINTheight = PRINTwidth/PRINTratio_orig; } ");
 //PRINT("PRINTimage_p = imagecreatetruecolor(PRINTwidth, PRINTheight); PRINTimage = imagecreatefromjpeg(PRINTfilename); ");
 //PRINT("imagecopyresampled(PRINTimage_p, PRINTimage, 0, 0, 0, 0, PRINTwidth, PRINTheight, PRINTwidth_orig, PRINTheight_orig); imagejpeg(PRINTimage_p, null, 100); ?>");

}




if( !_GET['category']){
	PRINT('<p>');
	PRINT('<a href="test.html?category=wedding">Весілля</a>&nbsp;');
	PRINT('<a href="test.html?category=portrait">Портрет</a>&nbsp;');
	PRINT('<a href="test.html?category=fashion">Мода</a>&nbsp;');
	PRINT('<a href="test.html?category=project">Проекти</a>&nbsp;');
	PRINT('</p>');
}
else {
	PRINT('<script type="text/javascript" src="http://picasaweb.google.com/data/feed/base/user/' + username +
  			'?category=album&alt=json&callback=getJson&access=public"></' + 'script>'); //getting feed from picasa

	if( !_GET['level2'] ){
		PRINT('<script type="text/javascript">getCategorySublevels(photoOutput, _GET["category"] );</script>');
		PRINT('<script type="text/javascript">getAlbumsByCategoryLevel( photoOutput, _GET[ "category" ], "top" );</' + 'script>');
	}
	else{
		PRINT('<script type="text/javascript">getCategorySublevels(photoOutput, _GET["category"] );</script>');
		
		if(_GET['photoid']&&_GET['albumid']){
	 		PRINT('<script type="text/javascript" src="http://picasaweb.google.com/data/feed/base/user/'+username+'/albumid/'
	   			+_GET['albumid']+'?category=photo&alt=json&callback=getphotolist"></' + 'script>');
	 //get the list of photos in the album and put it in the global "photolist" array so we can prop
 
 			PRINT('<script type="text/javascript" src="http://picasaweb.google.com/data/entry/base/user/'+username+'/albumid/'
   				+_GET['albumid']+'/photoid/'+_GET['photoid']+'?alt=json&callback=photo"></' + 'script>');//photo
		}
		else if(_GET['albumid']&&!_GET['photoid']){
 		PRINT('<script type="text/javascript" src="http://picasaweb.google.com/data/feed/base/user/'+username+'/albumid/'+_GET['albumid']
			+ '?category=photo&alt=json&callback=albums"></' + 'script>');//albums
		}
		else{
 			PRINT('<script type="text/javascript">getAlbumsByCategoryLevel( photoOutput, _GET[ "category" ], _GET[ "level2" ] );</' + 'script>');
		}
		
//		..
	}

}






/*
PRINT('<script type="text/javascript" src="http://picasaweb.google.com/data/feed/base/user/' + username +
  '?category=album&alt=json&callback=getJson&access=public"></script>');

PRINT('<script type="text/javascript">getAlbumsByCategoryLevel( photoOutput, "wedding", "album" );</script>');
*/


