<?php
	$idbut="checkBox";
	$path ="ini/";
	$format = '%s%s.ini';
	$str = sprintf($format,$path,$idbut);
	while (file_exists($str)){
		unlink($str);
		usleep(200000);
	}
	$h = fopen($str,"w");
	if ($h){
		$tofile="";
		$frmt = "%s=%s\n";  
		foreach ($_REQUEST as $myKey => $myVal){
		    if (($myKey != "PHPSESSID") && ($myKey != "prs")) {
				$tofile .= sprintf($frmt,$myKey,$myVal);
			}
		}
		fwrite($h,$tofile);
		fputs($h,"#FEEFBAAB#");
		fclose($h);
	}
?>  

