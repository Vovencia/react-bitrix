<?php
namespace RB;

//require_once __DIR__.'/V8JsNodeModuleLoader.php';
//require_once __DIR__.'/V8JsNodeModuleLoader_NativeFileAccess.php';

class NodeConnect {
    protected static function execNode($data) {
        $cmd = '"node.exe"';
        $descriptorspec = array(
            0 => array("pipe", "r"),
            1 => array("pipe", "w"),
            2 => array("pipe", "w"),
        );
        $cwd = Config::frontendPath();
        $env = array(
            'test' => '1',
        );

        $process = proc_open($cmd, $descriptorspec, $pipes, $cwd, $env);

        if (is_resource($process)) {
            fwrite($pipes[0], "console.log('test')");
            fclose($pipes[0]);

            $result =  stream_get_contents($pipes[1]);
            fclose($pipes[1]);
            var_dump(["result" => $result]);

            $error =  stream_get_contents($pipes[2]);
            fclose($pipes[2]);
            var_dump(["error" => $error]);

            $return_value = proc_close($process);
            var_dump(["return_value" => $return_value]);
        }
        return "";
    }
    protected static function execNodeServer($data) {
        $config = Config::getFrontendConfig();
        $servePort = $config['servePort'];
        $serveHost = $config['serveHost'];
        $servePath = $config['servePath'];
        $url = "$serveHost:$servePort$servePath";

        $data = json_encode($data);
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
        $result = file_get_contents($url, false, $context);
        try {
            if (is_string($result)) {
                $result = json_decode($result, true);
            }
        } catch (\Exception $e) {
            return ["html" => "", "styles" => ""];
        }
        return $result;
    }
    protected static function execV8JS(){
//        $v8 = new \V8Js();
//
//        $fai = new \V8JsNodeModuleLoader_NativeFileAccess();
//        $loader = new \V8JsNodeModuleLoader($fai);
//
//        $loader->addOverride('fs', 'Hacks/fs');
//        $loader->addOverride('vm', 'Hacks/vm');
//        $loader->addOverride('path', 'Hacks/path');
//        $v8->setModuleNormaliser([ $loader, 'normaliseIdentifier' ]);
//        $v8->setModuleLoader([ $loader, 'loadModule' ]);
//
//        $v8->react = new NodeConnectReact($data, $callback);
//        $file = Config::frontendPath('php-index.js');
//        $fileContent = file_get_contents(Config::frontendPath('php-index.js'));
//        $v8->executeString("require('". $file ."')");
    }
    public static function exec($data) {
        return self::execNodeServer($data);
    }
}
//class NodeConnectReact {
//    protected $data;
//    protected $callbackFN;
//    public function __construct($data, $callback) {
//        $this->data = $data;
//        $this->callbackFN = $callback;
//    }
//    public function callback(...$args) {
//        $callback = $this->callbackFN;
//        return $callback(...$args);
//    }
//}