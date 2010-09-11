<?php

$itemHeight = 40;
$itemWidth = 160;


$font = './MyriadPro-Cond.ttf'; //path to font you want to use
$fontsize = 12; //size of font

/*image generation code*/
$bg = imagecreatetruecolor($itemWidth, $itemHeight) or die ('Cannot initialize GD image stream.');
imagealphablending($bg, false);
imagesavealpha($bg, true);
$trans_colour = imagecolorallocatealpha($bg, 208, 208, 208, 65);
imagefilledrectangle($bg, 0, 0, imagesx($bg), imagesy($bg), $trans_colour);


$grey0 = imagecolorallocate($bg, 0, 0, 0);

//Text to be written
$itemStr = isset($_GET['text']) ? $_GET['text'] : "Menu Item";
$box = imagettfbbox( $fontsize, 0, $font, $itemStr );
//var_dump($box);
$x = ($itemWidth - ($box[2] - $box[0]))/2;
//Writes text to the image using fonts using FreeType 2
imagettftext($bg, $fontsize, 0, $x, 21, $grey0, $font, $itemStr);



//Create image
header("Content-type: image/png");
imagepng($bg);

//destroy image
ImageDestroy($bg);

?>
