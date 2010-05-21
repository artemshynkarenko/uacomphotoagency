<?php

$itemHeight = 20;
$itemWidth = 80;


$font = './MyriadPro-Cond.otf'; //path to font you want to use
$fontsize = 13; //size of font

/*image generation code*/
//create Image of size 350px x 75px
$bg = imagecreatetruecolor($itemWidth, $itemHeight) or die ('Cannot initialize GD image stream.');
imagealphablending($bg, false);
imagesavealpha($bg, true);
$trans_colour = imagecolorallocatealpha($bg, 0, 0, 0, 127);
imagefilledrectangle($bg, 0, 0, imagesx($bg), imagesy($bg), $trans_colour);


$grey0 = imagecolorallocate($bg, 128, 128, 128);
$grey1 = imagecolorallocate($bg, 178, 178, 178);


//Text to be written
$itemStr = isset($_GET['text']) ? $_GET['text'] : "Menu Item";
$box = imagettfbbox( $fontsize, 0, $font, $itemStr );
//var_dump($box);
$x = $itemWidth - ($box[2] - $box[0]);
//Writes text to the image using fonts using FreeType 2
if ($active = isset($_GET['active']) ? $_GET['active'] : false){
	imagettftext($bg, $fontsize, 0, $x, 15, $grey1, $font, $itemStr);
}
else{
	imagettftext($bg, $fontsize, 0, $x, 15, $grey0, $font, $itemStr);
}

//Create image
header("Content-type: image/png");
imagepng($bg);

//destroy image
ImageDestroy($bg);

?>
