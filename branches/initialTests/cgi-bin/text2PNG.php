<?php

header("Content-type: image/png"); //Picture Format
//header("Expires: Mon, 01 Jul 2003 00:00:00 GMT"); // Past date
//header("Last-Modified: " . gmdate("D, d M Y H:i:s") . " GMT"); // Consitnuously modified
//header("Cache-Control: no-cache, must-revalidate"); // HTTP/1.1
//header("Pragma: no-cache"); // NO CACHE

/*image generation code*/
//create Image of size 350px x 75px
$bg = imagecreatetruecolor(350, 75) or die ('Cannot initialize GD image stream.');

//This will make it transparent
imagealphablending($bg, false);
imagesavealpha($bg, true);

$trans_colour = imagecolorallocatealpha($bg, 0, 0, 0, 127);
imagefilledrectangle($bg, 0, 0, imagesx($bg), imagesy($bg), $trans_colour);
//imagefill($bg, 0, 0, $trans_colour);

//Text to be written
$helloworld = isset($_GET['text']) ? $_GET['text'] : "hello World";

// White text
$white = imagecolorallocate($bg, 255, 255, 255);
// Grey Text
$grey = imagecolorallocate($bg, 128, 128, 128);
// Black Text
$black = imagecolorallocate($bg, 0,0,0);

$font = './MyriadPro-Regular.otf'; //path to font you want to use
$fontsize = 20; //size of font

//Writes text to the image using fonts using FreeType 2
imagettftext($bg, $fontsize, 0, 20, 20, $grey, $font, $helloworld);

//Create image
imagepng($bg);

//destroy image
ImageDestroy($bg);

?>
