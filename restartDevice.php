<?php
	if (strtoupper(substr(PHP_OS, 0, 3)) != 'WIN') {
		$str = 'ini/restart.sh';
		if ( file_exists($str) ){
			exec($str);
		}
	}
?>