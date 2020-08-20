<?php

require_once __DIR__.'/V8JsNodeModuleLoader_FileAccessInterface.php';

class V8JsNodeModuleLoader_NativeFileAccess
    implements V8JsNodeModuleLoader_FileAccessInterface
{
    public function file_get_contents($filePath)
    {
        return file_get_contents($filePath);
    }

    public function file_exists($filePath)
    {
        return file_exists($filePath);
    }
}