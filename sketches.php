<?php

$path1 = 'Assignments';
$files1 = scandir($path1);
$path2 = 'Practicals';
$files2 = scandir($path2);
$path3 = 'Practice Sketches';
$files3 = scandir($path3);
$files = array_merge($files1, $files2, $files3);
// echo '<script>console.log(dirPaths = + '$files')</script>';

foreach ($files as $f){
	$name = join(DIRECTORY_SEPARATOR, [$path, $f]);

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
