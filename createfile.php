<?php
	ini_set('session.cookie_lifetime', 10);
	$idbut = $_REQUEST['idbut'];
	$path = $_REQUEST['path'];
	$i = 0;
	$format = '%s%s#%02d.but';
	while (true){
		$str = sprintf($format,$path,$idbut,$i);
		if (file_exists($str)){
			$i++;
		}else{
		    $h =fopen($str,"w");
			break;
		}
	}
	fclose($h);
?>  
