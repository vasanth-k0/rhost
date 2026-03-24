<?php

$script = json_decode($argv[1])->script;
echo eval(trim($script));