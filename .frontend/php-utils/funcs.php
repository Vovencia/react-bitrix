<?php
namespace RB;

function resolve(...$paths) {
    $paths = implode('/', $paths);
    $paths = str_replace('\\', '/', $paths);
    $paths = explode('/', $paths);
	$result = [];

	if (!$paths[0]) {
        $paths[0] = '/';
    }

	foreach ($paths as $item) {
	    if ($item === '..') {
	        array_pop($result);
	        continue;
        }
	    if (preg_match('/^\.*$/', $item)) {
	        continue;
        }
	    $result[] = $item;
    }
	$result = array_filter($result, function($item) {
	    return !empty($item);
    });

    $result = implode('/', $result);
    if (empty($result)) {
        $result = '/';
    }

	return $result;
}

function dirName(...$paths) {
    $paths = resolve(...$paths);
    if (empty($paths)) {
        return "";
    }
    $paths = explode('/', $paths);
    array_pop($paths);
    return implode("/", $paths);
}