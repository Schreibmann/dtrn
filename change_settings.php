<?php
	//ini_set('session.cookie_lifetime', 10);
	$fname = "settings.ini";
	$path = $_REQUEST['path'];
	$grid = $_REQUEST['grid'];
	$frame_1_ip=$_REQUEST['frame_1_ip'];
	$frame_2_ip=$_REQUEST['frame_2_ip'];
	$frame_3_ip=$_REQUEST['frame_3_ip'];
	$frame_4_ip=$_REQUEST['frame_4_ip'];
	$frame_5_ip=$_REQUEST['frame_5_ip'];
	$frame_6_ip=$_REQUEST['frame_6_ip'];
	$frame_7_ip=$_REQUEST['frame_7_ip'];
	$frame_8_ip=$_REQUEST['frame_8_ip'];
	$frame_9_ip=$_REQUEST['frame_9_ip'];
	$frame_10_ip=$_REQUEST['frame_10_ip'];
	$frame_11_ip=$_REQUEST['frame_11_ip'];
	$frame_12_ip=$_REQUEST['frame_12_ip'];
	$format = "%s%s";
	$str = sprintf($format,$path,$fname);
	$str2 = sprintf($format,$path,"settings.tmp");

	if ( file_exists($str) ){ $h = fopen($str,"r"); }
	
		$htmp = fopen($str2,"w");
		
		$format = "grid=%s\n";
		$tofile = sprintf($format,$grid);
		fputs($htmp,$tofile);

		$tofile = sprintf("frame_1_ip=%s\n",$frame_1_ip);
		fputs($htmp,$tofile);
		$tofile = sprintf("frame_2_ip=%s\n",$frame_2_ip);
		fputs($htmp,$tofile);
		$tofile = sprintf("frame_3_ip=%s\n",$frame_3_ip);
		fputs($htmp,$tofile);
		$tofile = sprintf("frame_4_ip=%s\n",$frame_4_ip);
		fputs($htmp,$tofile);
		$tofile = sprintf("frame_5_ip=%s\n",$frame_5_ip);
		fputs($htmp,$tofile);
		$tofile = sprintf("frame_6_ip=%s\n",$frame_6_ip);
		fputs($htmp,$tofile);
		$tofile = sprintf("frame_7_ip=%s\n",$frame_7_ip);
		fputs($htmp,$tofile);
		$tofile = sprintf("frame_8_ip=%s\n",$frame_8_ip);
		fputs($htmp,$tofile);
		$tofile = sprintf("frame_9_ip=%s\n",$frame_9_ip);
		fputs($htmp,$tofile);
		$tofile = sprintf("frame_10_ip=%s\n",$frame_10_ip);
		fputs($htmp,$tofile);
		$tofile = sprintf("frame_11_ip=%s\n",$frame_11_ip);
		fputs($htmp,$tofile);
		$tofile = sprintf("frame_12_ip=%s\n",$frame_12_ip);
		fputs($htmp,$tofile);
		fputs($htmp,"#FEEFBAAB#");
		fclose($h);
		fclose($htmp);
		unlink($str);
		rename($str2,$str);
		echo 'Настройки сохранены!';
		
?>