<?php
namespace RB {

    use \Bitrix\Main\Page\Asset;
    use \Bitrix\Main\Page\AssetLocation;

    class React
    {
        protected function __construct()
        {
        }

        protected function __clone()
        {
        }

        protected function __wakeup()
        {
        }

        protected static $content = [];
        protected static $started = false;
        protected static $hasError = false;
        protected static $error = [
            "message" => "Сервисная ошибка",
            "code" => 500,
        ];
        protected static $styles = "";
        protected static $store = [];
        protected static $startTime = 0;

        protected static $cacheEnabled = true;
        protected static $inlineData = false;

        public static function isJSON()
        {
            $headers = apache_request_headers();
            return isset($headers["Content-Result"]) && $headers["Content-Result"] === 'json';
        }

        public static function start()
        {
            if (self::$started) {
                return;
            }
            self::$startTime = microtime(true);
            self::$started = true;
            ob_start();
        }

        public static function end()
        {
            if (!self::$started) {
                return;
            }
            self::$started = false;
            $content = ob_get_contents();

            $parsed = HTMLParser::parse($content);
            if ($parsed !== null) {
                self::$content = $parsed;
            }

            ob_end_clean();
        }

        public static function getTimeGone()
        {
            if (self::$startTime) {
                return round((microtime(true) - self::$startTime) * 1000, 2);
            }
            return 0;
        }

        public static function render()
        {
            $data = self::getHydrateData();

            $cache = new RBCache;
            $cache->enabled = self::$cacheEnabled && false;

            $result = $cache->run($data, function () use ($data) {
                return NodeConnect::exec($data);
            });
            self::$styles = $result['styles'];
            self::saveStyles();
            echo $result['html'];
        }

        public static function getStyles()
        {
            return self::$styles;
        }

        public static function saveStyles()
        {
            $styles = self::getStyles();
            $styles = preg_replace("/<\/?style.*?>/", '', $styles);
            $stylesFile = Config::mainStylesFile();
            $stylesDir = dirName($stylesFile);
            if (!file_exists($stylesDir)) {
                mkdir($stylesDir, 0777, true);
            }
            if (!file_exists($stylesFile)) {
                file_put_contents($stylesFile, "");
            }
            $lastStyles = file_get_contents($stylesFile);
            if ($lastStyles !== $styles) {
                file_put_contents($stylesFile, $styles);
            }
        }

        public static function getHydrateData($getJSON = false)
        {
            if (self::$hasError) {
                $result = [
                    "error" => self::$error,
                    "url" => self::getCurrentUrl(),
                ];
            } else {
                $result = self::getData();
            }
            if ($getJSON) {
                return json_encode($result);
            }
            return $result;
        }

        public static function saveData()
        {
            $data = self::getHydrateData(true);
            $data = "window['__setHydrateData'](" . $data . ")";
            $dataFile = Config::pageDataFile();
            $dataDir = dirName($dataFile);
            if (!file_exists($dataDir)) {
                mkdir($dataDir, 0777, true);
            }
            if (!file_exists($dataFile)) {
                file_put_contents($dataFile, "");
            }
            $lastData = file_get_contents($dataFile);
            if ($lastData !== $data) {
                file_put_contents($dataFile, $data);
            }
        }

        public static function getCurrentUrl()
        {
            return getCurrentUrl(true);
        }

        public static function getData()
        {
            return array_merge([], self::$store, [
                "page:title" => self::getTitle(),
                "page:meta" => self::getMetaList(),
                "page:content" => self::$content,
                "url" => self::getCurrentUrl(),
            ]);
        }

        public static function getDataJSON()
        {
            return json_encode(self::getData());
        }

        public static function getError()
        {
            return self::$error;
        }

        public static function getErrorJSON()
        {
            return json_encode(self::getError());
        }

        public static function getMetaList()
        {
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

        public static function getTitle()
        {
            global $APPLICATION;
            return $APPLICATION->GetTitle();
        }

        public static function getPageDataUrl()
        {
            self::saveData();
            return Config::pageDataFile(true);
        }

        public static function renderData()
        {
            $data = self::getHydrateData(true);
            if (self::isJSON()) {
                echo $data;
                return;
            }
            if (self::$inlineData) {
                Asset::getInstance()->addString(
                    '<script id="hydrateData">window["__setHydrateData"](' . $data . ');</script>',
                    false,
                    AssetLocation::BODY_END
                );
            } else {
                Asset::getInstance()->addJs(self::getPageDataUrl());
            }
        }

        /**
         * @param string $key
         * @param $value
         */
        public static function addToStore($key, $value)
        {
            self::$store[$key] = $value;
        }

        /**
         * @param array $props
         * @return string
         */
        public static function getPropsString($props = []) {
            if (empty($props)) {
                return "";
            }
            $props = base64_encode(json_encode($props));
            return " :props=\"$props\"";
        }
    }
}

namespace {
    use RB\React;

    /**
     * Преобразование props компонента в html attribute (:props)
     * @param array $props
     * @return string
     */
    function r_props($props = []) {
        return React::getPropsString($props);
    }

    /**
     * Начало компонента
     * @param string $name Имя компонента (например Layout)
     * @param array $props
     */
    function r_begin($name, $props = []) {
        $props = r_props($props);
        echo "<$name$props>";
    }
    /**
     * Конец компонента
     * @param string $name Имя компонента (например Layout)
     */
    function r_end($name) {
        echo "</$name>";
    }

    /**
     * Вывести компонент
     * @param string $name Имя компонента (например Layout)
     * @param array $props Пропсы компонента
     */
    function r_render($name, $props = []) {
        r_begin($name, $props);
        r_end($name);
        // React::component($name, $props);
    }

    /**
     * Сокращенный вызов компонента
     * @param string $el Имя элемента (Layout, /Layout, Layout/)
     * @param array $props Пропсы компонента
     * @example
     * r("Layout"); // Аналог r_begin("Layout")
     * r("/Layout"); // Аналог r_end("Layout")
     * r("Layout/"); // Аналог r_render("Layout")
     */
    function r($el, $props = []) {
        if (!is_string($el)) {
            return;
        }
        if (preg_match("/Store/", $el)) {
            r_store($props['name'], $props['value']);
            return;
        }
        $el = str_replace(" ", "", $el);
        if (preg_match("/^[A-Z][a-zA-Z0-9]*$/", $el)) {
            r_begin($el, $props);
            return;
        }
        if (preg_match("/^\/[A-Z][a-zA-Z0-9]*$/", $el)) {
            r_end(str_replace("/", "", $el));
            return;
        }
        if (preg_match("/^[A-Z][a-zA-Z0-9]*\/$/", $el)) {
            r_render(str_replace("/", "", $el), $props);
            return;
        }
    }
    /**
     * @param string $key
     * @param $value
     */
    function r_store($key, $value) {
         React::addToStore($key, $value);
    }
}
