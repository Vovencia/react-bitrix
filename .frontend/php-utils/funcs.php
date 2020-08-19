<?php
namespace RB;

function getCurrentUrl($removeQuery = true) {
    $url = $_SERVER['REQUEST_URI'];
    $url = preg_replace("/\?json&/", '?', $url);
    $url = preg_replace("/[&?]json/", '', $url);

    if ($removeQuery) {
        $url = preg_replace("/\?.*/", '', $url);
    }

    return $url;
}

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