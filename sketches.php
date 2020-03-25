<?php

$files = scandir('.');

	foreach ($files as $f){
		$name = $f;

		// note that we multiply times by 1000 because PHP is in seconds
		// others expect milliseconds
		if ($f[0] != '.' && is_dir($name)){
		   $dirs[] = (object) [
			'name' => $name,
			'ctime' => stat($name)['ctime'] * 1000,
			'mtime' => stat($name)['mtime'] * 1000
			];
		}
	}

echo json_encode($dirs);

?>
