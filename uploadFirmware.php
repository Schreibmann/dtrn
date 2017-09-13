<?php
	// Каталог, в который мы будем принимать файл:
	$uploaddir = './files/';
	$uploadinfo = $_FILES['uploadfile'];
	$uploadname = $uploadinfo['name'];
	$uploadfile = $uploaddir.basename($uploadname);
	
	// Копируем файл из каталога для временного хранения файлов:
	// Выводим информацию о загруженном файле:
	echo "<html>
			<head>
				<meta http-equiv='Content-Type' content='text/html; charset=utf-8'>
				<title>Информация</title>
				<link rel=\"stylesheet\" href=\"/css/allcss.css\" type=\"text/css\" charset=\"utf-8\">
			</head>
			<body class=\"frameie\">
				<div class=\"divM_sm\" id=\"responseUploadText\">";					
    $call ='window.parent.UploadBar(\'hide\')';
	$uploaderror = $uploadinfo['error'];
	$uploadtmpname =$uploadinfo['tmp_name'];
	if ($uploadname == "") 
		$uploaderror = 9;
	if ($uploaderror > 0){
		 //в зависимости от номера ошибки выводим соответствующее сообщение
		 //UPLOAD_MAX_FILE_SIZE - значение установленное в php.ini
		 //MAX_FILE_SIZE значение указанное в html-форме загрузки файла
		 echo "<br>Не удалось загрузить файл на сервер!<br>"; 
		 switch ($uploaderror) {
			 case 1: echo 'Размер файла превышает допустимое значение UPLOAD_MAX_FILE_SIZE'; break;
			 case 2: echo 'Размер файла превышает допустимое значение MAX_FILE_SIZE'; break;
			 case 3: echo 'Не удалось загрузить часть файла'; break;
			 case 4: echo 'Файл не был загружен'; break;
			 case 6: echo 'Отсутствует временная папка.'; break;
			 case 7: echo 'Не удалось записать файл на диск.'; break;
			 case 8: echo 'PHP-расширение остановило загрузку файла.'; break;
			 case 9: echo 'Недопустимое имя файла или файл не выбран.'; break;
		 }
	}else{
		if (copy($uploadtmpname, $uploadfile)){
			echo "Файл успешно загружен на сервер!<br>";
			echo "Оригинальное имя  файла:<br> ".$uploadname."<br>";
			echo "Размер файла в байтах: ".$uploadinfo['size']."<br>";
			$call ='window.parent.refreshFirmware()';
		} else {
			echo "Не удалось скопировать Файл на сервер!<br>";
			echo "Временное имя файла: ".$uploadtmpname."<br>";
		}
	}	
	echo "</div>";
	$res = '<button class="menuButtons" onclick="';
    $res .= $call;
	$res .='" >Ok</button>';
    echo $res;
	echo"
			</body>
		</html>
	";


?>