<? if(!defined("B_PROLOG_INCLUDED") || B_PROLOG_INCLUDED!==true)die(); ?>
<? global $APPLICATION; ?>
<?php if (!isset($_GET['json'])) { ?>
<!doctype html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <meta
        name="viewport"
        content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0"
    >
    <title><?$APPLICATION->ShowTitle()?></title>
    <?$APPLICATION->ShowHead()?>
</head>
<body>
<?
if (isset($_GET['panel'])) {
    $APPLICATION->ShowPanel();
}
?>
<?php } ?>
<? React('start'); ?>
<?$APPLICATION->IncludeComponent(
    "bitrix:menu",
    "main",
    Array(
        "ROOT_MENU_TYPE"	=>	"main",
        "CHILD_MENU_TYPE" => "submenu",
        "MAX_LEVEL"	=>	"3",
        "USE_EXT"	=>	"N",
        "MENU_CACHE_TYPE" => "N",
    )
);?>
<? r('Layout'); ?>
