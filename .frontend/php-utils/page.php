<?php
namespace RB;
use \Bitrix\Main\Page\Asset;

class Page {
    const TYPE_AUTO = '';
    const TYPE_JS = 'js';
    const TYPE_CSS = 'css';
    const LOCATION_AUTO = 'auto';
    const LOCATION_HEADER = 'header';
    const LOCATION_FOOTER = 'footer';
    const POINT_HEADER_ASSETS = 'HEADER_ASSETS';
    const POINT_FOOTER_ASSETS = 'FOOTER_ASSETS';

    public static $mergeHeaderAssets = true;
    public static $mergeFooterAssets = true;

    protected static $footerAssets = [];
    protected static $headerAssets = [];
    /**
     * @param string|array $assets
     * @param string $type
     */
    public static function addHeaderAsset($assets, $type = self::TYPE_AUTO) {
        self::addAsset($assets, $type, self::LOCATION_HEADER);
    }
    /**
     * @param string|array $assets
     * @param string $type
     */
    public static function addFooterAsset($assets, $type = self::TYPE_AUTO) {
        self::addAsset($assets, $type, self::LOCATION_FOOTER);
    }
    /**
     * @param string|array $assets
     * @param string $type
     * @param string $location
     */
    public static function addAsset($assets, $type = self::TYPE_AUTO, $location = self::LOCATION_AUTO) {
        if (is_string($assets)) {
            $assets = [$assets];
        }
        foreach ($assets as $asset) {
            $_type = $type;
            if (empty($_type)) {
                $_type = self::getAssetType($asset);
            }
            if (empty($_type)) continue;
            $_type = strtolower($_type);
            switch($location) {
                case self::LOCATION_HEADER:
                    self::$headerAssets[] = [
                        "type" => $_type,
                        "url" => $asset,
                    ];
                break;
                case self::LOCATION_FOOTER:
                    self::$footerAssets[] = [
                        "type" => $_type,
                        "url" => $asset,
                    ];
                break;
                default:
                    switch ($_type) {
                        case 'js': Asset::getInstance()->addJs($asset); break;
                        case 'css': Asset::getInstance()->addCss($asset); break;
                    }
                break;
            }
        }
    }
    /**
     * @param string|array $assets
     * @param string $type
     * @param string $location
     */
    public static function addTemplateAsset($assets, $type = self::TYPE_AUTO, $location = self::LOCATION_AUTO) {
        if (is_string($assets)) {
            $assets = [$assets];
        }
        foreach ($assets as $key => $asset) {
            $assets[$key] = self::getTemplatePath() . '/' . $asset;
        }
        self::addAsset($assets, $type, $location);
    }
    /**
     * @param string $asset
     * @return string
     */
    public static function getAssetType($asset) {
        if (preg_match("/\.js$/", strtolower($asset))) {
            return self::TYPE_JS;
        }
        if (preg_match("/\.css$/", strtolower($asset))) {
            return self::TYPE_CSS;
        }
        return '';
    }
    /**
     * @return string
     */
    public static function getTemplatePath() {
        /** @noinspection PhpUndefinedConstantInspection */
        return SITE_TEMPLATE_PATH;
    }
    /**
     * @return false|mixed|string
     */
    public static function getTitle() {
        global $APPLICATION;
        return $APPLICATION->GetTitle();
    }
    /**
     * @return array
     */
    public static function getMetaList() {
        global $APPLICATION;
        $result = [];
        $metaNames = ['keywords', 'description'];
        foreach ($metaNames as $metaName) {
            $value = $APPLICATION->GetProperty($metaName);
            if (empty($value)) {
                $value = '';
            }
            $result[] = [
                "name" => $metaName,
                "value" => $value,
            ];
        }
        return $result;
    }

    /**
     * @param array $assets
     * @param boolean $addSkipAttribute
     * @param null|string $mergeName
     */
    public static function renderAssets($assets, $addSkipAttribute = false, $mergeName = null) {
        $_assets = [
            'css' => [],
            'js' => [],
        ];
        $attr = $addSkipAttribute ? ' data-skip-moving="true"' : '';
        foreach ($assets as $asset) {
            $url = $asset['url'];
            $file = Config::getPathFromUrl($url);
            if (!file_exists($file)) continue;
            switch($asset['type']) {
                case self::TYPE_CSS: $_assets['css'][] = $url; break;
                case self::TYPE_JS: $_assets['js'][] = $url; break;
            }
        }
        if (!empty($mergeName)) {
            foreach ($_assets as $type => $urls) {
                $_urls = [];
                $_contents = [];
                foreach ($urls as $url) {
                    $_file = Config::getPathFromUrl($url);
                    $_content = file_get_contents($_file);
                    if (empty($_content)) continue;

                    $_contents[] = "\n/* start: $url */\n$_content\n/* end: $url */\n";
                    $_urls[] = $url;
                }
                if (empty($_contents)) continue;

                $_urls = implode("", $_urls);
                if ($mergeName) {
                    $_urls = $mergeName . $_urls;
                }
                $_contents = implode("\n\n", $_contents);
                $url = RBCache::contentCache($_urls, $type, $_contents);
                $_assets[$type] = [$url];
            }
        }

        foreach ($_assets['css'] as $url) {
            $file = Config::getPathFromUrl($url);
            $changeTime = filemtime($file);
            ?><link rel="stylesheet" href="<?= $url ?>?<?= $changeTime ?>"<?= $attr ?>><?php
        }
        foreach ($_assets['js'] as $url) {
            $file = Config::getPathFromUrl($url);
            $changeTime = filemtime($file);
            ?><script src="<?= $url ?>?<?= $changeTime ?>"<?= $attr ?>></script><?php
        }
    }
    public static function renderHeaderAssets() {
        $point = self::getPoint(self::POINT_HEADER_ASSETS, true);
        $content = ob_get_contents();
        ob_clean();
        self::renderAssets(self::$headerAssets, true, self::$mergeHeaderAssets ? 'header-assets' : null);
        $assets = ob_get_contents();
        ob_clean();
        echo str_replace($point, $assets, $content);
    }
    public static function renderFooterAssets() {
        $point = self::getPoint(self::POINT_FOOTER_ASSETS, true);
        $content = ob_get_contents();
        ob_clean();
        self::renderAssets(self::$footerAssets, false, self::$mergeFooterAssets ? 'footer-assets' : null);
        $assets = ob_get_contents();
        ob_clean();
        echo str_replace($point, $assets, $content);
    }
    public static function renderAllAssets() {
        self::renderHeaderAssets();
        self::renderFooterAssets();
    }

    /**
     * @param boolean $removeQuery
     * @return string
     */
    public static function getCurrentUrl($removeQuery = false) {
        $url = $_SERVER['REQUEST_URI'];

        if ($removeQuery) {
            $url = preg_replace("/\?.*/", '', $url);
        }

        return $url;
    }

    /**
     * @param string $type Page::POINT_HEADER_ASSETS|Page::POINT_FOOTER_ASSETS|etc.
     * @param boolean $forRender
     * @return string
     */
    public static function getPoint($type, $forRender = false) {
        $point = 'RB_' . $type;
        if ($forRender) {
            $point = "<!-- #$point# -->";
        }
        return $point;
    }
    /**
     * @param string $type Page::POINT_HEADER_ASSETS|Page::POINT_FOOTER_ASSETS|etc.
     */
    public static function renderPoint($type) {
        echo self::getPoint($type, true);
    }
}