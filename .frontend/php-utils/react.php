<?php
namespace RB {
    class React {
        protected function __construct(){}
        protected function __clone(){}
        protected function __wakeup(){}

        protected static $content = [];
        protected static $started = false;
        protected static $hasError = false;
        protected static $error = [
            "message" => "Сервисная ошибка",
            "code" => 500,
        ];
        protected static $store = [];
        protected static $startTime = 0;

        protected static $cacheEnabled = true;
        protected static $cacheHTMLParse = true;

        protected static $bufferedContent = '';

        /**
         * @return bool
         */
        public static function isJSON() {
            $headers = apache_request_headers();
            return isset($headers["Content-Result"]) && $headers["Content-Result"] === 'json';
        }

        public static function start() {
            if (self::$started) return;
            self::$startTime = microtime(true);
            self::$started = true;
            ob_start();
        }

        public static function bufferStart() {
            ob_start();
        }
        public static function bufferEnd() {
            $buffer = ob_get_contents();
            self::$bufferedContent .= $buffer;
            ob_end_clean();
            return $buffer;
        }

        public static function end() {
            if (!self::$started) return;
            self::$started = false;
            $content = self::$bufferedContent . ob_get_contents();
            ob_end_clean();

            if (self::$cacheHTMLParse) {
                $parsed = RBCache::resultCache('html', $content, true, function() use ($content) {
                    return HTMLParser::parse($content);
                });
            } else {
                $parsed = HTMLParser::parse($content);
            }
            $parsed = self::parsedHTMLWalker($parsed);

            if ($parsed !== null) {
                self::$content = $parsed;
            } else {
                self::$hasError = true;
            }
        }

        public static function parsedHTMLWalker($parsed) {
            $parsed = array_values(array_filter($parsed, function($item) {
                if (is_array($item) && $item['tag'] === 'Store') {
                    $props = $item['props'];
                    if (isset($props[':props'])) {
                        try {
                            $props = json_decode(base64_decode($props[':props']), true);
                        } catch (\Exception $e) {}
                    }
                    if (isset($props['name']) && isset($props['value'])) {
                        self::addToStore($props['name'], $props['value']);
                    }

                    return false;
                }
                return true;
            }));
            $parsed = array_map(function($item) {
                if (isset($item['children']) && is_array($item['children']) && !empty($item['children'])) {
                    $item['children'] = self::parsedHTMLWalker($item['children']);
                }
                return $item;
            }, $parsed);
            return $parsed;
        }

        /**
         * @return float|int
         */
        public static function getTimeGone() {
            if (self::$startTime) {
                return round((microtime(true) - self::$startTime) * 1000, 2);
            }
            return 0;
        }

        public static function renderHTML() {
            $data = self::getHydrateData();

            if (self::$cacheEnabled) {
                $result = RBCache::dataCache($data, function () use ($data) {
                    return NodeConnect::exec($data);
                });
            } else {
                $result = NodeConnect::exec($data);
            }

            self::addStyles($result['styledStyles'], $result['styles']);
            echo $result['html'];
        }
        /**
         * @param string $styledStyles
         */
        protected static function _addStyledStyles($styledStyles) {
            $styledStyles = preg_replace("/<\/?style.*?>/", '', $styledStyles);
            $styledStylesUrl = RBCache::contentCache('styledStyles', '.css', $styledStyles);
            Page::addAsset($styledStylesUrl, Page::TYPE_CSS);
        }
        /**
         * @param array<string> $styles
         */
        protected static function _addStyles($styles) {
            foreach ($styles as $style) {
                $path = $style['path'];
                $content = $style['content'];
                $styledStylesUrl = RBCache::contentCache($path, '.css', $content);
                Page::addAsset($styledStylesUrl, Page::TYPE_CSS);
            }
        }

        /**
         * @param string $styledStyles
         * @param array<string> $styles
         */
        public static function addStyles($styledStyles, $styles) {
            self::_addStyledStyles($styledStyles);
            self::_addStyles($styles);
        }

        /**
         * @param boolean $getJSON
         * @return string|array
         */
        public static function getHydrateData($getJSON = false) {
            if (self::$hasError) {
                $result = [
                    "error" => self::$error,
                    "url" => self::getCurrentUrl(),
                ];
            } else {
                $result = self::getData();
            }
            if ($getJSON) {
                $result = json_encode($result);
                if ($result === false) {
                    return "";
                }
                return $result;
            }
            return $result;
        }

        /**
         * @return string
         */
        public static function getCurrentUrl() {
            return Page::getCurrentUrl(true);
        }

        /**
         * @return array
         */
        public static function getData() {
            return array_merge([], self::$store, [
                "page:title" => Page::getTitle(),
                "page:meta" => Page::getMetaList(),
                "page:content" => self::$content,
                "url" => self::getCurrentUrl(),
            ]);
        }

        /**
         * @return string
         */
        public static function getDataJSON() {
            $result = json_encode(self::getData());
            if ($result === false) {
                return "";
            }
            return $result;
        }

        /**
         * @return array
         */
        public static function getError() {
            return self::$error;
        }

        /**
         * @return string
         */
        public static function getErrorJSON() {
            $result = json_encode(self::getError());
            if ($result === false) {
                return "";
            }
            return $result;
        }

        /**
         * @return string
         */
        public static function getPageDataUrl() {
            $data = self::getHydrateData(true);
            $data = "window['__setHydrateData'](" . $data . ")";
            return RBCache::contentCache('HydrateData', 'js', $data, true);
        }

        public static function renderData() {
            if (self::isJSON()) {
                echo self::getHydrateData(true);
            } else {
                Page::addAsset(self::getPageDataUrl());
            }
        }

        /**
         * @param string $key
         * @param $value
         */
        public static function addToStore($key, $value) {
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
        public static function renderRenderTime() {
            $time = self::getTimeGone();
            echo "<!-- render time: $time ms -->";
            echo "<script>console.log('render time: $time ms')</script>";
        }
    }
}

namespace {
    use RB\React;

    /**
     * Преобразование props компонента в html attribute (:props)
     * @param array $props
     * @param boolean $get
     * @return string
     */
    function r_props($props = [], $get = false) {
        $props = React::getPropsString($props);
        if (!$get) {
            echo $props;
        }
        return $props;
    }

    /**
     * Начало компонента
     * @param string $name Имя компонента (например Layout)
     * @param array $props
     */
    function r_begin($name, $props = []) {
        $props = r_props($props, true);
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
     * @param boolean $renderHTML
     */
    function r_store($key, $value, $renderHTML = true) {
        if ($renderHTML) {
            $props = r_props(['name' => $key, 'value' => $value], true);
            ?><Store<?= $props ?>></Store><?php
        } else {
            React::addToStore($key, $value);
        }
    }
}
