<?php if(!defined("B_PROLOG_INCLUDED") || B_PROLOG_INCLUDED!==true) die(); ?>
<?php global $APPLICATION ?>
<?php r('/Layout'); ?>
<?php React('end'); ?>
<div id="root"><?php React('render') ?></div>
<script>
    window.__hydrateData = <?php React('renderData') ?>;
</script>
<?php $APPLICATION->AddHeadString(RB\React::getStyles()); ?>
<script src="<?= SITE_TEMPLATE_PATH ?>/public/main.js"></script>
</body>
</html>