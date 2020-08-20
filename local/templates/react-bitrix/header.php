<?php
    if(!defined("B_PROLOG_INCLUDED") || B_PROLOG_INCLUDED!==true) die();
    use RB\React;
    global $APPLICATION;
    if (!React::isJSON()) {
        include_once __DIR__ . '/header-html.php';
    }
    React::start();
    $APPLICATION->IncludeComponent(
        "bitrix:menu",
        "main",
        Array(
            "ROOT_MENU_TYPE"	=>	"main",
            "CHILD_MENU_TYPE" => "submenu",
            "MAX_LEVEL"	=>	"3",
            "USE_EXT"	=>	"N",
            "MENU_CACHE_TYPE" => "N",
        )
    );