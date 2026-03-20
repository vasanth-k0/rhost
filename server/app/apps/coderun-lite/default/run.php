<?php

$test = 'Test';
echo "{$test} php script running on Coderun-Lite\n<br>\n";
var_dump(json_decode($argv[1]));
$i = 1;
define('MAX_COUNT', 3);
while ($i <= MAX_COUNT) {
    echo $i  . PHP_EOL;
    $i++;
    sleep(1);
}
exit();