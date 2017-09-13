<?php
	ini_set('session.cookie_lifetime', 10);
//	session_start();
	$fname = "checkBox.ini";
	$path = $_REQUEST['path'];
	$newPeriod = $_REQUEST['newPeriod'];
	$format = '%s%s';
	$str = sprintf($format,$path,$fname);
	$str2 = sprintf($format,$path,"bD.tmp");
	if ( file_exists($str) ){
		$h = fopen($str,"r");
		$htmp = fopen($str2,"w");
		$state = "newStr";
		$key = "";
		$val = "";
		$trowTofile =false;
		$ind["name"] = $fname;
		while (!feof($h)){
			$c =fgetc($h);
			switch ($state){
			 case "newStr":
				switch ($c){
					case "=":
						$state = "takeKey";
					break;
					case " ":

					break;
					case "\r":
					
					break;
					case "\n":
					break;
					default:
						$key .= $c;
				}
			 break;
			 case "takeKey":
			 	switch ($c){
					case "\n":
						$ind[$key] = $val;
						if ($key == "pCheckPeriod"){
							$ind[$key] = $newPeriod;
							$trowTofile = true;
						}
						$format = "%s=%s\n";
						$tofile = sprintf($format,$key,$ind[$key]);
						fputs($htmp,$tofile);
						$val ="";
						$key ="";
						$state = "newStr";
					break;
					case '\r':
					break;
					default:
						$val .= $c;
				}
			 break;
			 default:
			   $state = "newStr";
			}
		}
		if (!$trowTofile){
			$tofile = sprintf("pCheckPeriod=%s\n",$newPeriod);
			fputs($htmp,$tofile);
		}
		fputs($htmp,"#FEEFBAAB#");
		fclose($h);
		fclose($htmp);
		unlink($str);
		rename($str2,$str);
		echo "Период проверки успешно изменен!";
	}
?>