<?php if(!defined("B_PROLOG_INCLUDED") || B_PROLOG_INCLUDED!==true) die(); ?>
<?php global $APPLICATION ?>
<?php React('end'); ?>
<?php if (!isset($_GET['json'])) { ?>
<div id="root"><? React('render') ?></div>
<?php $APPLICATION->AddHeadScript(RB\Config::mainScriptFile(true)); ?>
<?php $APPLICATION->SetAdditionalCSS(RB\Config::mainStylesFile(true)); ?>
<?php $APPLICATION->AddHeadScript(RB\Config::pageDataFile(true)); ?>
<script id="appReady">
    window['__ready'](function() {
        const removeScripts = ['appReady', 'hydrateData'];
        for (const scriptId of removeScripts) {
            const script = document.getElementById(scriptId);
            if (script) script.remove();
        }
    });
    window['__ready'](true);
</script>
<!-- react render time: <?= \RB\React::getTimeGone() ?>ms -->
</body>
</html>
<?php } else { ?>
<?= React('renderData'); ?>
<?php } ?>