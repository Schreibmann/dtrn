<?php
	ini_set('session.cookie_lifetime', 10);
//	session_start();
	$fname = "auth.pss";
	$path = $_REQUEST['path'];
	$role = $_REQUEST['role'];
	$format = '%s%s';
	$str = sprintf($format,$path,$fname);
	$str2 = sprintf($format,$path,"auth.tmp");
	$newPassText = $_REQUEST['newpass'];
	
	if ($newPassText == "") {$newPass = "";} 
	else {$newPass = md5($newPassText);}
		
	if ( file_exists($str) ){
		$h = fopen($str,"r");
		$htmp = fopen($str2,"w");
		$state = "newStr";
		$key = "";
		$val = "";
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
						if ($key == $role){
							$ind[$key] = $newPass;
						}
						$format = "%s=%s\n";
						$tofile = sprintf($format,$key,$ind[$key]);
						fputs($htmp,$tofile);
						$val ="";
						$key ="";
						$state = "newStr";
					break;
					case " ":
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
		fputs($htmp,"#FEEFBAAB#");
		fclose($h);
		fclose($htmp);
		unlink($str);
		rename($str2,$str);
		$msg = sprintf('Пароль <%s> успешно изменен!',$role);
		echo $msg;
	}
?>