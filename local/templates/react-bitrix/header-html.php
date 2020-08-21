<?php
    if(!defined("B_PROLOG_INCLUDED") || B_PROLOG_INCLUDED!==true) die();
    global $APPLICATION;
    use RB\Config;
    use RB\Page;
?>
<!doctype html>
<html lang="ru">
<head>
<meta charset="UTF-8">
<link rel="shortcut icon" href="/favicon.ico" type="image/x-icon">
<meta name="viewport" content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">
<title><?$APPLICATION->ShowTitle()?></title>
<? $APPLICATION->ShowHead() ?>
<?
    Page::addAsset(Config::mainScriptFile(true));
    Page::addTemplateAsset('header-script.js', Page::TYPE_JS, Page::LOCATION_HEADER);
    Page::addTemplateAsset('footer-script.js', PAGE::TYPE_JS, Page::LOCATION_FOOTER);
    Page::renderPoint(Page::POINT_HEADER_ASSETS);
?>
</head>
<body>
<?php if (isset($_GET['panel'])) $APPLICATION->ShowPanel(); ?>