<?if (!defined("B_PROLOG_INCLUDED") || B_PROLOG_INCLUDED!==true)die();?>
<?php

$menu = [];
$menu_current = [];
$parents = [];
$prev_item = [
    "items" => &$menu,
];
$prev_depth = -1;

foreach ($arResult as $key => $arItem):
    if ($arItem['DEPTH_LEVEL'] > $prev_depth) {
        $parents[] = &$prev_item;
    } else if ($arItem['DEPTH_LEVEL'] < $prev_depth) {
        for ($i = 0; $i < ($prev_depth - $arItem['DEPTH_LEVEL']); $i++) {
            array_pop($parents);
        }
    }

    $parents[count($parents) - 1]['items'][] = [
        // "parent" => &$parents[count($parents) - 1],
        "text" => $arItem["TEXT"],
        "depth" => $arItem['DEPTH_LEVEL'],
        "url" => $arItem["LINK"],
        "items" => [],
        "current" => $arItem["LINK"] === $_SERVER['REQUEST_URI'],
        "current_submenu" => strpos($_SERVER['REQUEST_URI'], $arItem["LINK"]) === 0,
    ];

    $prev_item = &$parents[count($parents) - 1]['items'][count($parents[count($parents) - 1]['items']) - 1];
    $prev_depth = $arItem['DEPTH_LEVEL'];
endforeach;

foreach ($menu as $item) {
    if ($item['current_submenu']) {
        $menu_current = $item;
        break;
    }
}

r('Store/', ['name' => 'nav:main', 'value' => $menu]);
