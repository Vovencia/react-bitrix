<?php
namespace RB;
use \Exception;
use Closure;

class RBCache {
    public static function scriptChangedTime() {
        return filemtime(Config::reactScriptPath());
    }
    /**
     * @param string $data
     * @param Closure $handler
     * @return mixed
     */
    public static function dataCache($data, $handler) {
        $cacheDir = Config::cachePath();
        $salt = Config::cacheSalt();
        $ext = Config::cacheExt();
        $url = Page::getCurrentUrl(true);

        $cacheFileName = sha1($salt . $url) . $ext;
        $cacheFile = Config::cachePath($cacheFileName);

        if (!file_exists($cacheDir)) {
            mkdir($cacheDir, 0777, true);
        }
        if (!file_exists($cacheFile)) {
            $result = file_put_contents($cacheFile, "");
            if ($result === false) {
                return $handler();
            }
        }
        $cache = file_get_contents($cacheFile);
        $cacheNeedUpdate = false;
        if ($cache === false) {
            $cacheNeedUpdate = true;
        }
        $cache = json_decode($cache, true);
        if ($cache === null) {
            $cacheNeedUpdate = true;
        }
        if (!$cacheNeedUpdate) {
            if (
                !isset($cache['data']) ||
                !isset($cache['result']) ||
                !isset($cache['scriptChangedTime'])
            ){
                $cacheNeedUpdate = true;
            }
        }
        if (!$cacheNeedUpdate) {
            $lastScriptChangedTime = json_encode($cache['scriptChangedTime']);
            $scriptChangedTime = json_encode(self::scriptChangedTime());
            if ($lastScriptChangedTime !== $scriptChangedTime) {
                $cacheNeedUpdate = true;
            }
        }
        if (!$cacheNeedUpdate) {
            $cacheDataStr = trim(json_encode($cache['data']));
            $currentDataStr = trim(json_encode($data));
            if ($cacheDataStr !== $currentDataStr) {
                $cacheNeedUpdate = true;
            }
        }

        if ($cacheNeedUpdate) {
            try {
                $result = $handler();
                $cache = [
                    "cache:date" => date("Y-m-d H:i:s"),
                    "url" => $url,
                    "scriptChangedTime" => self::scriptChangedTime(),
                    "data" => $data,
                    "result" => $result,
                ];
                $cache = json_decode(json_encode($cache), true);
                file_put_contents($cacheFile, json_encode($cache));
            } catch (Exception $e) {}
        }

        return $cache['result'];
    }

    /**
     * @param string $name
     * @param string $ext
     * @param string $content
     * @param boolean $uniqPage
     * @return string
     */
    public static function contentCache($name, $ext, $content, $uniqPage = false) {
        $cacheDirName = 'content-cache';
        $cacheDir = Config::cachePath($cacheDirName);
        $salt = Config::cacheSalt();
        if ($ext[0] !== '.') {
            $ext = '.' . $ext;
        }
        if ($uniqPage) {
            $salt .= Page::getCurrentUrl(true);
        }
        $cacheFileName = sha1($salt . $name) . $ext;
        $cacheFile = Config::cachePath($cacheDirName, $cacheFileName);
        $publicUrl = Config::getUrl($cacheFile);
        if (!file_exists($cacheDir)) {
            mkdir($cacheDir, 0777, true);
        }
        if (!file_exists($cacheFile)) {
            file_put_contents($cacheFile, "");
        }
        $lastContent = file_get_contents($cacheFile);
        if ($lastContent !== $content) {
            file_put_contents($cacheFile, $content);
        }
        return $publicUrl;
    }

    /**
     * @param string $name
     * @param string $input
     * @param boolean $uniqPage
     * @param Closure $handler
     * @return mixed
     */
    public static function resultCache($name, $input, $uniqPage, $handler) {
        $cacheDirName = 'result-cache';
        $cacheDir = Config::cachePath($cacheDirName);
        $salt = Config::cacheSalt();
        $ext = ".json";
        if ($uniqPage) {
            $salt .= Page::getCurrentUrl(true);
        }
        $cacheFileName = sha1($salt . $name) . $ext;
        $cacheFile = Config::cachePath($cacheDirName, $cacheFileName);

        $needUpdate = false;
        if (!file_exists($cacheDir)) {
            mkdir($cacheDir, 0777, true);
        }
        if (!file_exists($cacheFile)) {
            $needUpdate = true;
        }
        $lastContent = "";

        if (!$needUpdate) {
            $lastContent = file_get_contents($cacheFile);
        }
        if (!$needUpdate && empty($lastContent)) {
            $needUpdate = true;
        }
        if (!$needUpdate) {
            $lastContent = json_decode($lastContent, true);
            if ($lastContent === null) {
                $needUpdate = true;
            }
        }
        if (!$needUpdate) {
            if ($lastContent['input'] !== $input || !isset($lastContent['result'])) {
                $needUpdate = true;
            }
        }
        if ($needUpdate) {
            $result = $handler();
            $content = json_encode([
                'input' => $input,
                'result' => $result,
            ]);
            if ($content === null) {
                return null;
            }
            file_put_contents($cacheFile, $content);
        } else {
            $result = $lastContent['result'];
        }
        return $result;
    }
}