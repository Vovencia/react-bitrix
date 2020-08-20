<?php

trait V8JsNodeModuleLoader_NormalisePath {
    function normalisePath(array $parts) {
        $normalisedParts = array();

        array_walk($parts, function($part) use(&$normalisedParts) {
            switch($part) {
            case '..':
                if(!empty($normalisedParts)) {
                    array_pop($normalisedParts);
                }
                break;

            case '.':
                break;

            default:
                array_push($normalisedParts, $part);
            }
        });

        return $normalisedParts;
    }
}
