<?php
    header("Content-Disposition: attachment; filename=story.js");
    header("Content-Type: text/javascript");
    header('Content-Length: ' . strval(strlen("foo!!!")));
    header("Connection: close");
    echo "foo!!!";
?>