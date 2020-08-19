<?php
namespace RB;

class Config {
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
        return self::rootPath(SITE_TEMPLATE_PATH, ...$paths);
    }
    public static function mainScriptFile($url = false) {
        $path = self::templatePath('public', 'main.js');
        if ($url) {
            $path = self::getUrl($path);
        }
        return $path;
    }
    public static function getUrl(...$paths) {
        $paths = resolve(...$paths);
        $root = self::rootPath();
        if (strpos($paths, $root) === 0) {
            return str_replace($root, '', $paths);
        }
        return '';
    }
    public static function mainStylesFile($url = false) {
        $path = self::templatePath('public', 'styles.css');
        if ($url) {
            $path = self::getUrl($path);
        }
        return $path;
    }
}
