<?php

// $paths = array('Assignments', 'Practicals', 'PracticeSketches');
//
// $files1 = scandir($paths[0]);
// $files2 = scandir($paths[1]);
// $files3 = scandir($paths[2]);
//
// $allFiles = array($files1, $files2, $files3);
// $iter = 0;

$files = scandir('.');

//foreach($allFiles as $files) {
	foreach ($files as $f){
		$name = join(DIRECTORY_SEPARATOR, [getcwd(), $f]);
		debug_to_console(getcwd());
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
	//$iter += 1;
//}

echo json_encode($dirs);

function debug_to_console($data) {
    $output = $data;
    if (is_array($output))
        $output = implode(',', $output);

    echo "<script>console.log('Debug Objects: " . $output . "' );</script>";
}




?>
