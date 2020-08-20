<?php
require_once __DIR__.'/V8JsNodeModuleLoader_FileAccessInterface.php';
require_once __DIR__.'/V8JsNodeModuleLoader_NormalisePath.php';

/**
 * Simple Node.js module loader for use with V8Js PHP extension
 *
 * This class understands Node.js' node_modules/ directory structure
 * and can require modules/files from there.
 *
 * @copyright 2015,2018 Stefan Siegl <stesie@brokenpipe.de>
 * @author Stefan Siegl <stesie@brokenpipe.de>
 * @package V8JsNodeModuleLoader
 */
class V8JsNodeModuleLoader
{
    use V8JsNodeModuleLoader_NormalisePath;

    /**
     * @var V8JsNodeModuleLoader_FileAccessInterface
     */
    private $fai;

    /**
     * Collection of override rules
     *
     * "from" identifiers are stored as keys to the array, associated
     * replacements are the array's values.
     *
     * @var string[]
     */
    private $overrides = array();

    /**
     * Create V8JsNodeModuleLoader instance
     *
     * The class needs to query the filesystem (or any replacement) to query
     * for existing files and loading their data.  The interface is a simple
     * abstraction of that access; if you'd like to just pick any content
     * from the node_modules/ folder, simply pass an instance of
     * V8JsNodeModuleLoader_NativeFileAccess.
     *
     * @param V8JsNodeModuleLoader_FileAccessInterface $fai
     * @access public
     */
    function __construct(V8JsNodeModuleLoader_FileAccessInterface $fai) {
        $this->fai = $fai;
    }

    /**
     * Normalisation handler, to be passed to V8Js
     *
     * @param string $base
     * @param string $module_name
     * @access public
     * @return string[]
     */
    function normaliseIdentifier($base, $module_name) {
        if(isset($this->overrides[$module_name])) {
            $normalisedParts = $this->normalisePath(
                explode('/', $this->overrides[$module_name]));
            $moduleName = array_pop($normalisedParts);
            $normalisedPath = implode('/', $normalisedParts);

            return array($normalisedPath, $moduleName);
        }

        $baseParts = explode('/', $base);
        $parts = explode('/', $module_name);

        if($parts[0] == '.' or $parts[0] == '..' or preg_match("/^[A-Z]:/", $parts[0])) {
            // relative path, prepend base path
            if (!preg_match("/^[A-Z]:/", $parts[0])) {
                $parts = array_merge($baseParts, $parts);
            }
            return $this->handleRelativeLoad($parts);
        }
        else {
            return $this->handleModuleLoad($baseParts, $parts);
        }
    }

    /**
     * Module loader, to be passed to V8Js
     *
     * @param string $moduleName
     * @access public
     * @return string|object
     */
    function loadModule($moduleName) {
        $filePath = null;

        foreach (array('', '.js', '.json') as $extension) {
            if ($this->fai->file_exists($moduleName.$extension)) {
                $filePath = $moduleName.$extension;
                break;
            }
        }

        if ($filePath === null) {
            throw new \Exception('File not found: '.$filePath);
        }

        $content = $this->fai->file_get_contents($filePath);

        if (substr($filePath, -5) === '.json') {
            $content = \json_decode($content);
        }

        return $content;
    }

    /**
     * Add a loader override rule
     *
     * This can be used to load a V8Js-specific module instead of one
     * shipped with e.g. a npm package.
     *
     * @param mixed $from
     * @param mixed $to
     * @access public
     */
    function addOverride($from, $to) {
        $this->overrides[$from] = $to;
    }

    private function handleRelativeLoad(array $parts) {
        $normalisedParts = $this->normalisePath($parts);
        $normalisedId = implode('/', $normalisedParts);

        if(isset($this->overrides[$normalisedId])) {
            $normalisedParts = $this->normalisePath(
                explode('/', $this->overrides[$normalisedId]));
            $moduleName = array_pop($normalisedParts);
            $normalisedPath = implode('/', $normalisedParts);

            return array($normalisedPath, $moduleName);
        }

        $sourcePath = implode('/', $normalisedParts);

        if($this->fai->file_exists($sourcePath) ||
           $this->fai->file_exists($sourcePath.'.js') ||
           $this->fai->file_exists($sourcePath.'.json')) {
            $moduleName = array_pop($normalisedParts);
            $normalisedPath = implode('/', $normalisedParts);

            return array($normalisedPath, $moduleName);
        }

        throw new \Exception('File not found: '.$sourcePath);
    }

    private function handleModuleLoad(array $baseParts, array $parts) {
        $moduleName = array_shift($parts);

        $baseModules = array_keys($baseParts, 'node_modules');

        if(empty($baseModules)) {
            $moduleParts = array();
        }
        else {
            $moduleParts = array_slice($baseParts, 0, end($baseModules) + 2);
        }

        $moduleParts[] = 'node_modules';
        $moduleParts[] = $moduleName;

        $moduleDir = implode('/', $moduleParts);

        if(!$this->fai->file_exists($moduleDir)) {
            throw new \Exception('Module not found: ' . $moduleName);
        }

        $moduleDir .= '/';

        if(empty($parts)) {
            $packageJsonPath = $moduleDir.'package.json';

            if(!$this->fai->file_exists($packageJsonPath)) {
                throw new \Exception('File not exists: '.$packageJsonPath);
            }

            $packageJson = json_decode($this->fai->file_get_contents($packageJsonPath));

            if(!isset($packageJson->main)) {
                throw new \Exception('package.json does not declare main');
            }

            $normalisedParts = $this->normalisePath(
                array_merge($moduleParts, explode('/', $packageJson->main)));
        }
        else {
            $normalisedParts = $this->normalisePath(
                array_merge($moduleParts, $parts));
        }

        $moduleName = array_pop($normalisedParts);
        $normalisedPath = implode('/', $normalisedParts);

        if(substr($moduleName, -3) == '.js') {
            $moduleName = substr($moduleName, 0, -3);
        }

        return array($normalisedPath, $moduleName);
    }
}
