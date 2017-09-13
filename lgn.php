<?php
	 if ($_SERVER['REQUEST_METHOD'] == 'POST')
	{
		$fname = "auth";
		$path = './ini/';
		$format = '%s%s.pss';
		$str = sprintf($format,$path,$fname);
		if ( file_exists($str) ){
			$h = fopen($str,"r");
			$state = "findDiez";
			$key = "";
			$val = "";
			$passBase = array();
			$flag ="";
			fseek($h,-11,SEEK_END);			
			while (!feof($h)){
				$c =fgetc($h);
				switch ($state){
				  case "findDiez":
						switch ($c){
							case "#":
								$state = "collectFlag";
							break;
							default:
						}
					 break;	
				 case "collectFlag":
					switch ($c){
						case "#":
							if ($flag == "FEEFBAAB"){
								$state = "newStr";
								fseek($h,0,SEEK_SET);
							}
						break;
						default:
							$flag .= $c;
					}
				 break;	
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
							$key = "";
						break;
						default:
							$key .= $c;
					}
				 break;
				 case "takeKey":
					switch ($c){
						case "\n":
							$passBase[$key] = $val;
							$val ="";
							$key ="";
							$state = "newStr";
						break;
						case " ":
						break;
						case "\r":
						break;
						default:
							$val .= $c;
					}
				 break;
				 default:
				   $state = "newStr";
				}
			}
			fclose($h);
			$pwdtext = $_REQUEST['pass'];
            $pwdmd5 = md5($pwdtext);
            $login = $_REQUEST['login'];
            $pass = $passBase[$login];
			
			if ($pass == '')
            { 
                echo "no_pass";
            }
			
			else if ($pwdmd5 == $pass)
            { 
                echo "good_pass";
            }
    /*      else{     
                    $login = 'Control';
                    $pass = $passBase[$login];
                        if ($pwdmd5 == $pass)
                        {
                            echo "Control";
                        }
                        else
                        {
							$login = 'User';
							$pass = $passBase[$login];
								if ($pwdmd5 == $pass)
								{
									echo "Conf";
								} */
			else echo "Проверьте правильность ввода пароля!";
                        /*}
				}*/
	}
	}
	
?>