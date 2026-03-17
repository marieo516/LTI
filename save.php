<?php 
    $dir = __DIR__ . '/cards';

    if (!is_dir($dir)) {
        mkdir($dir, 0755, true);
    }

    $name = $_POST['name'];
    $file = __DIR__ . '/cards' . '/' . $name . ".txt";
    $action = $_POST['action'] ?? '';

    if ($action === 'update') {
        file_put_contents(
            $file,
            $_POST['date']."\n",
            FILE_APPEND | LOCK_EX
        );
    }

    if ($action === 'delete') {
        if (file_exists($file)) {
            unlink($file);
        }
    }

    if ($action === 'undo') {
        if (file_exists($file)) {

            $lines = file($file, FILE_IGNORE_NEW_LINES);
            array_pop($lines);

            if (count($lines) === 0) {
                unlink($file);
            } else {
                file_put_contents(
                    $file, 
                    implode("\n", $lines) . "\n"
                );
            }
        }
    }
?>