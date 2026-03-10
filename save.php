<?php 
    $dir = __DIR__ . '/cards';

    if (!is_dir($dir)) {
        mkdir($dir, 0755, true);
    }

    file_put_contents($dir . '/' . $_POST['name'].".txt", $_POST['date']."\n", FILE_APPEND | LOCK_EX); 
?>