<?php
namespace RB;
use Bitrix\Main\DB\Exception;
use Closure;

class RBCache {
    public $enabled = true;

    public function scriptChangedTime() {
        return filemtime(Config::reactScriptPath());
    }
    /**
     * @param array $data
     * @param Closure $handler
     * @return mixed
     */
    public function run($data, $handler) {
        if (!$this->enabled) {
            return $handler();
        }
        $cacheDir = Config::cachePath();
        $salt = Config::cacheSalt();
        $ext = Config::cacheExt();
        $url = getCurrentUrl(true);

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
        $cache = json_decode($cache);
        if ($cache === null) {
            $cacheNeedUpdate = true;
        }
        if (!$cacheNeedUpdate) {
            if (
                !isset($cache->data) ||
                !isset($cache->result) ||
                !isset($cache->scriptChangedTime)
            ){
                $cacheNeedUpdate = true;
            }
        }
        if (!$cacheNeedUpdate) {
            $lastScriptChangedTime = json_encode($cache->scriptChangedTime);
            $scriptChangedTime = json_encode(self::scriptChangedTime());
            if ($lastScriptChangedTime !== $scriptChangedTime) {
                $cacheNeedUpdate = true;
            }
        }
        if (!$cacheNeedUpdate) {
            $cacheDataStr = trim(json_encode($cache->data));
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
                $cache = json_decode(json_encode($cache));
                file_put_contents($cacheFile, json_encode($cache));
            } catch (Exception $e) {}
        }

        return $cache->result;
    }
}