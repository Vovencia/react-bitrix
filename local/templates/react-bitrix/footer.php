<?php
    if(!defined("B_PROLOG_INCLUDED") || B_PROLOG_INCLUDED!==true) die();
    use RB\React;
    React::end();
    if (!React::isJSON()) {
        include_once __DIR__ . '/footer-html.php';
    } else {
        React::renderData();
    }