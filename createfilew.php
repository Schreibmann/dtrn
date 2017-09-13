<?php
	ini_set('session.cookie_lifetime', 10);
	$idbut="fromWebPanel";
	$path =$_REQUEST['path'];
	$format = '%s%s#%02d.ini';
	$i =0;
	$str = sprintf($format,$path,$idbut,$i);
	while (file_exists($str)){
		$i++;
		$str = sprintf($format,$path,$idbut,$i);
	}
	unset($_REQUEST['path']);
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
