<?php
    if(!defined("B_PROLOG_INCLUDED") || B_PROLOG_INCLUDED!==true) die();
    global $APPLICATION;
    use \Bitrix\Main\Page\Asset;
    use \RB\Config;
    use \RB\React;
?>
<div id="root"><? React::render() ?></div>
<?php
    Asset::getInstance()->addJs(Config::mainScriptFile(true), false);
    Asset::getInstance()->addCss(Config::mainStylesFile(true));
    React::renderData();
?>
<script src="<?=SITE_TEMPLATE_PATH?>/footer-script.js"></script>
<!-- react render time: <?= \RB\React::getTimeGone() ?>ms -->
</body>
</html>