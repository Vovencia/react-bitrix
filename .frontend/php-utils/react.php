<?php

namespace RB {

    use Exception;

    class React {
        /**
         * @var React|null
         */
        protected static $instance = null;
        /**
         * @return React
         */
        public static function getInstance() {
            if (static::$instance === null) {
                static::$instance = new static();
            }

            return static::$instance;
        }
        protected function __construct() {}
        protected function __clone() {}
        protected function __wakeup() {}

        protected $content = [];
        protected $started = false;
        public $hasError = false;
        protected $error = [
            "message" => "Сервисная ошибка",
            "code" => 500,
        ];
        protected $styles = "";
        protected $store = [];

        protected $config;
        protected static function getConfig() {
            if (!self::getInstance()->config) {
                $configString = file_get_contents( __DIR__ . "/../config.json");
                self::getInstance()->config = json_decode($configString, true);
            }
            return self::getInstance()->config;
        }
        protected static function ejectContent() {
            $content = ob_get_contents();
            ob_end_clean();
            ob_start();
            return $content;
        }
        protected static function emitHtml() {
            $content = self::ejectContent();
            if ($content) {
                self::addChildren([
                    "name" => "Html",
                    "props" => [],
                    "children" => [$content],
                ]);
            }
        }
        public static function start() {
            if (self::getInstance()->started) {
                return;
            }
            self::getInstance()->started = true;
            ob_start();
        }
        public static function end() {
            if (!self::getInstance()->started) {
                return;
            }
            self::getInstance()->started = false;
            self::emitHtml();
            ob_end_clean();
        }
        public static function getErrorJSON() {
            return json_encode(["error" => self::getInstance()->error]);
        }
        public static function render() {
            $config = self::getConfig();
            $servePort = $config['servePort'];
            $serveHost = $config['serveHost'];
            $servePath = $config['servePath'];
            $url = "$serveHost:$servePort$servePath";
            $data = self::getInstance()->hasError ? self::getErrorJSON() : self::getData(true);

            $options = array(
                'http' => array(
                    'method'  => 'POST',
                    'content' => $data,
                    'header'=>  "Content-Type: application/json\r\nAccept: application/json\r\n",
                ),
                'https' => array(
                    'method'  => 'POST',
                    'content' => $data,
                    'header'=>  "Content-Type: application/json\r\nAccept: application/json\r\n",
                ),
            );

            $context  = stream_context_create( $options );
            $result = file_get_contents( $url, false, $context );
            if (is_string($result)) {
                try {
                    $result = json_decode($result);
                } catch (Exception $e) {
                    return;
                }
            }
            self::getInstance()->styles = $result->styles;

            echo $result->html;
        }
        public static function getStyles() {
            return self::getInstance()->styles;
        }
        public static function getData($isJSON = false) {
            $self = self::getInstance();
            $data = array_merge([], $self->store, [
                "page:title" => self::getTitle(),
                "page:meta" => self::getMetaList(),
                "page:content" => $self->content,
                "url" => preg_replace("/[&?]json/", '', $_SERVER['REQUEST_URI']),
            ]);
            if ($isJSON) {
                $data = json_encode($data);
            }
            return $data;
        }
        public static function renderData() {
            if (self::getInstance()->hasError) {
                echo self::getErrorJSON();
                return;
            }
            echo self::getData(true);
        }
        public static function component($name, $props = [], $children = null) {
            if (!self::getInstance()->started) {
                return;
            }
            self::emitHtml();
            self::addChildren([
                "name" => $name,
                "props" => $props,
                "children" => $children,
            ]);
        }
        protected $currentComponent = [];
        protected $currentComponentChildren = [];
        protected $currentComponentProps = [];
        public static function componentStart($name) {
            if (!self::getInstance()->started) {
                return;
            }
            $self = self::getInstance();
            $self->currentComponent[] = $name;
            $self->currentComponentChildren[] = [];
            $self->currentComponentProps[] = [];
        }
        public static function componentEnd($name) {
            if (!self::getInstance()->started) {
                return;
            }
            $self = self::getInstance();
            $start_name = array_pop($self->currentComponent);
            if ($start_name !== $name) {
                $self->hasError = true;
            }
            $children = array_pop($self->currentComponentChildren);
            $props = array_pop($self->currentComponentProps);
            $content = self::ejectContent();
            if ($content && strlen($content)) {
                $children[] = [
                    "name" => "Html",
                    "children" => [$content],
                    "props" => [],
                ];
            }
            self::addChildren([
                "name" => $name,
                "children" => $children,
                "props" => $props,
            ]);
        }
        public static function setComponentProps($props) {
            $self = self::getInstance();
            if (count($self->currentComponentProps) < 1) return;
            $self->currentComponentProps[count($self->currentComponentProps) - 1] = $props;
        }
        public static function setComponentChildren($children) {
            $self = self::getInstance();
            if (count($self->currentComponentChildren) < 1) return;
            $self->currentComponentChildren[count($self->currentComponentChildren) - 1] = $children;
        }
        protected static function addChildren($children) {
            $self = self::getInstance();
            if (count($self->currentComponentChildren) > 0) {
                $self->currentComponentChildren[count($self->currentComponentChildren) - 1][] = $children;
            } else {
                $self->content[] = $children;
            }
        }
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
        public static function getTitle() {
            global $APPLICATION;
            return $APPLICATION->GetTitle();
        }

        /**
         * @param string $key
         * @param $value
         */
        public static function addToStore($key, $value) {
            self::getInstance()->store[$key] = $value;
        }
    }

    class Component {
        public static function create($name, $props = [], $children = []) {
            return new Component($name, $props, $children);
        }
        public static function render($name, $props = [], $children = []) {
            $component = new Component($name, $props, $children);
            $component->start();
            $component->end();
        }
        protected $name;
        protected $props;
        protected $children;
        protected $started = false;
        public function __construct($name, $props = [], $children = []) {
            $this->name = $name;
            $this->props = $props;
            $this->children = $children;
        }
        public function start() {
            if ($this->started) {
                return;
            }
            $this->started = true;
            React::componentStart($this->name);
            React::setComponentProps($this->props);
            React::setComponentChildren($this->children);
        }
        public function end() {
            if (!$this->started) {
                return;
            }
            $this->started = false;
            React::componentEnd($this->name);
        }
    }
}

namespace {
    use RB\React;
    /**
     * @param string $command
     * @return string;
     */
    function React($command) {
        switch ( strtolower(trim($command)) ) {
            case 'start':
                React::start();
                break;
            case 'end';
                React::end();
                break;
            case 'render':
                React::render();
                break;
            case 'renderdata':
                React::renderData();
                break;
            case 'getdata':
                if (React::getInstance()->hasError) {
                    return React::getErrorJSON();
                }
                return React::getData(true);
        }
        return '';
    }

    /**
     * Начало компонента
     * @param string $name Имя компонента (например Layout)
     */
    function r_begin($name) {
        React::componentStart($name);
    }
    /**
     * Конец компонента
     * @param string $name Имя компонента (например Layout)
     */
    function r_end($name) {
        React::componentEnd($name);
    }

    /**
     * Вывести компонент
     * @param string $name Имя компонента (например Layout)
     * @param array $props Пропсы компонента
     */
    function r_render($name, $props = []) {
        React::component($name, $props);
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
            r_begin($el);
            React::setComponentProps($props);
            return;
        }
        if (preg_match("/^\/[A-Z][a-zA-Z0-9]*$/", $el)) {
            React::setComponentProps($props);
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
