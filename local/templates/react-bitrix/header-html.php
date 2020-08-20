<?php if(!defined("B_PROLOG_INCLUDED") || B_PROLOG_INCLUDED!==true)die(); ?>
<?php global $APPLICATION; ?>
<!doctype html>
<html lang="ru">
<head>
<meta charset="UTF-8">
<link rel="shortcut icon" href="/favicon.ico" type="image/x-icon">
<meta name="viewport" content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">
<title><?$APPLICATION->ShowTitle()?></title>
<?$APPLICATION->ShowHead()?>
<script data-skip-moving="true" src="<?=SITE_TEMPLATE_PATH?>/header-script.js"></script>
</head>
<body>
<?php if (isset($_GET['panel'])) $APPLICATION->ShowPanel(); ?>