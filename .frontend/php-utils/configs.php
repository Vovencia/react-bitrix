<?php
namespace RB;


class Config {
    protected static $frontendConfig;

    public static function getFrontendConfig() {
        if (self::$frontendConfig == null) {
            self::$frontendConfig = json_decode(file_get_contents( __DIR__ . "/../config.json"), true);
        }
        return self::$frontendConfig;
    }
    public static function rootPath(...$paths) {
        return resolve(__DIR__, '..', '..', ...$paths);
    }
    public static function frontendPath(...$paths) {
        return resolve(__DIR__, '..', ...$paths);
    }
    public static function reactScriptPath() {
        return self::frontendPath('dist', 'main.js');
    }
    public static function cachePath(...$paths) {
        return self::rootPath('bitrix', 'cache', 'react', ...$paths);
    }
    public static function cacheSalt() {
        return 'salt::';
    }
    public static function cacheExt() {
        return '.cache';
    }
    public static function templatePath(...$paths) {
        return self::rootPath(Page::getTemplatePath(), ...$paths);
    }
    /**
     * @param boolean $url
     * @return string
     */
    public static function mainScriptFile($url = false) {
        $path = self::templatePath('public', 'main.js');
        if ($url) {
            $path = self::getUrl($path);
        }
        return $path;
    }

    /**
     * @param string ...$paths
     * @return string
     */
    public static function getUrl(...$paths) {
        $paths = resolve(...$paths);
        $root = self::rootPath();
        if (strpos($paths, $root) === 0) {
            return str_replace($root, '', $paths);
        }
        return '';
    }
    /**
     * @param string $url
     * @return string;
     */
    public static function getPathFromUrl($url) {
        return self::rootPath($url);
    }
}
