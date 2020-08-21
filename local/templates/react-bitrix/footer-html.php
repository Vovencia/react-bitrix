<?php
    if(!defined("B_PROLOG_INCLUDED") || B_PROLOG_INCLUDED!==true) die();
    use \RB\React;
    use \RB\Page;
?>
<div id="root"><? React::renderHTML() ?></div>
<?php
    React::renderData();
    Page::renderPoint(Page::POINT_FOOTER_ASSETS);
    Page::renderAllAssets();
    React::renderRenderTime();
?>
</body>
</html>