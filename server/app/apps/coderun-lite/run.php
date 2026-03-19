<?php

$test = 'Test';
echo "{$test} php script running on Coderun-Lite\n<br>\n";
$i = 1;
define('MAX_COUNT', 10);
while ($i <= MAX_COUNT) {
    echo $i  . PHP_EOL;
    $i++;
    sleep(1);
}
exit();