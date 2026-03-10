<?php
    $files = glob("cards/*.txt");
    $output = [];

    foreach ($files as $file) {
        $lines = file($file, FILE_IGNORE_NEW_LINES);
        $lastLine = end($lines);
        $id = basename($file, ".txt");
        $output[] = ['id' => $id, 'date' => $lastLine];
    }

    echo json_encode($output)
?>