<?php if(!defined("B_PROLOG_INCLUDED") || B_PROLOG_INCLUDED!==true) die(); ?>
<?php global $APPLICATION ?>
<?php r('/Layout'); ?>
<?php React('end'); ?>
<?php if (!isset($_GET['json'])) { ?>
<div id="root"><?php React('render') ?></div>
<?php $APPLICATION->AddHeadString(RB\React::getStyles()); ?>
<?php $APPLICATION->AddHeadScript(SITE_TEMPLATE_PATH . '/public/main.js'); ?>
<?php $APPLICATION->AddHeadString(
    '<script id="hydrateData">window["__setHydrateData"](' . React('getdata') . ');</script>',
        false,
        \Bitrix\Main\Page\AssetLocation::AFTER_JS
); ?>
<script id="appReady">
    window['__ready'](function() {
        const removeScripts = ['appReady', 'hydrateData'];
        for (const scriptId of removeScripts) {
            const script = document.getElementById(scriptId);
            if (script) {
                script.remove();
            }
        }
    });
    window['__ready'](true);
</script>
</body>
</html>
<?php } else { ?>
<?php React('renderData'); ?>
<?php } ?>