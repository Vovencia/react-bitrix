<?php

interface V8JsNodeModuleLoader_FileAccessInterface
{
    public function file_get_contents($filePath);
    public function file_exists($filePath);
}
