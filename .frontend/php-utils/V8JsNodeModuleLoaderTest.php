<?php

require_once __DIR__.'/V8JsNodeModuleLoader.php';
require_once __DIR__.'/V8JsNodeModuleLoader_NormalisePath.php';

class V8JsNodeModuleLoaderTest extends PHPUnit_Framework_TestCase
{
    use V8JsNodeModuleLoader_NormalisePath;

    /**
     * @dataProvider normalisePathProvider
     */
    public function testNormalisePath($in, $out)
    {
        $mockFai = $this
                 ->getMockBuilder('V8JsNodeModuleLoader_FileAccessInterface')
                 ->getMock();
        $loader = new V8JsNodeModuleLoader($mockFai);
        $result = $loader->normalisePath($in);
        $this->assertEquals($out, $result);
    }

    public function normalisePathProvider()
    {
        return array(
            array(
                array('foo'),
                array('foo')),
            array(
                array('foo', 'bar'),
                array('foo', 'bar')),
            array(
                array('.', 'foo'),
                array('foo')),
            array(
                array('foo', '.', 'bar'),
                array('foo', 'bar')),
            array(
                array('..', 'foo'),
                array('foo')),
            array(
                array('foo', '..', 'bar'),
                array('bar')),
        );
    }

    public function testNormaliseIdentifierFindsRelativeFiles()
    {
        $mockFai = $this
                 ->getMockBuilder('V8JsNodeModuleLoader_FileAccessInterface')
                 ->setMethods(array('file_exists', 'file_get_contents'))
                 ->getMock();
        $mockFai
            ->method('file_exists')
            ->willReturnCallback(function ($path) { return $path === 'node_modules/blar/foo.js'; });

        $loader = new V8JsNodeModuleLoader($mockFai);
        $result = $loader->normaliseIdentifier('node_modules/blar', './foo');
        $this->assertEquals(array('node_modules/blar', 'foo'), $result);
    }

    /**
     * @expectedException Exception
     */
    public function testNormaliseIdentifierThrowsRelativeFileMissing()
    {
        $mockFai = $this
                 ->getMockBuilder('V8JsNodeModuleLoader_FileAccessInterface')
                 ->setMethods(array('file_exists', 'file_get_contents'))
                 ->getMock();
        $mockFai
            ->method('file_exists')
            ->withConsecutive(
                array($this->equalTo('node_modules/blar/foo')),
                array($this->equalTo('node_modules/blar/foo.js')),
                array($this->equalTo('node_modules/blar/foo.json'))
            )
            ->willReturn(false);

        $loader = new V8JsNodeModuleLoader($mockFai);
        $result = $loader->normaliseIdentifier('node_modules/blar', './foo');
        $this->assertEquals(array('node_modules/blar', 'foo'), $result);
    }

    public function testNormaliseIdentifierChecksPackageJson()
    {
        $mockFai = $this
                 ->getMockBuilder('V8JsNodeModuleLoader_FileAccessInterface')
                 ->setMethods(array('file_exists', 'file_get_contents'))
                 ->getMock();
        $mockFai
            ->method('file_exists')
            ->withConsecutive(
                array($this->equalTo('node_modules/blar')),
                array($this->equalTo('node_modules/blar/package.json'))
            )
            ->willReturn(true);
        $mockFai
            ->method('file_get_contents')
            ->with($this->equalTo('node_modules/blar/package.json'))
            ->willReturn(json_encode(array('main' => 'lib/foo')));

        $loader = new V8JsNodeModuleLoader($mockFai);
        $result = $loader->normaliseIdentifier('', 'blar');
        $this->assertEquals(array('node_modules/blar/lib', 'foo'), $result);
    }

    public function testNormaliseIdentifierLoadsRelativeToModule()
    {
        $mockFai = $this
                 ->getMockBuilder('V8JsNodeModuleLoader_FileAccessInterface')
                 ->setMethods(array('file_exists', 'file_get_contents'))
                 ->getMock();
        $mockFai
            ->method('file_exists')
            ->withConsecutive(
                array($this->equalTo('node_modules/blar'))
            )
            ->willReturn(true);

        $loader = new V8JsNodeModuleLoader($mockFai);
        $result = $loader->normaliseIdentifier('', 'blar/path/to/file');
        $this->assertEquals(array('node_modules/blar/path/to', 'file'), $result);
    }

    public function testNormaliseIdentifierModuleInModule()
    {
        $mockFai = $this
                 ->getMockBuilder('V8JsNodeModuleLoader_FileAccessInterface')
                 ->setMethods(array('file_exists', 'file_get_contents'))
                 ->getMock();
        $mockFai
            ->method('file_exists')
            ->withConsecutive(
                array($this->equalTo('node_modules/noflo/node_modules/underscore')),
                array($this->equalTo('node_modules/noflo/node_modules/underscore/package.json'))
            )
            ->willReturn(true);
        $mockFai
            ->method('file_get_contents')
            ->with($this->equalTo('node_modules/noflo/node_modules/underscore/package.json'))
            ->willReturn(json_encode(array('main' => 'lib/foo.js')));

        $loader = new V8JsNodeModuleLoader($mockFai);
        $result = $loader->normaliseIdentifier('node_modules/noflo/lib', 'underscore');
        $this->assertEquals(array('node_modules/noflo/node_modules/underscore/lib', 'foo'), $result);
    }

    public function testNormaliseIdentifierUsesOverrides()
    {
        $mockFai = $this
                 ->getMockBuilder('V8JsNodeModuleLoader_FileAccessInterface')
                 ->setMethods(array('file_exists', 'file_get_contents'))
                 ->getMock();
        $mockFai
            ->expects($this->never())
            ->method('file_exists');

        $loader = new V8JsNodeModuleLoader($mockFai);
        $loader->addOverride('events', 'EventEmitter');
        $result = $loader->normaliseIdentifier('', 'events');
        $this->assertEquals(array('', 'EventEmitter'), $result);
    }

    public function testNormaliseIdentifierUsesOverridesInRelativeLoad()
    {
        $mockFai = $this
                 ->getMockBuilder('V8JsNodeModuleLoader_FileAccessInterface')
                 ->setMethods(array('file_exists', 'file_get_contents'))
                 ->getMock();
        $mockFai
            ->expects($this->never())
            ->method('file_exists');

        $loader = new V8JsNodeModuleLoader($mockFai);
        $loader->addOverride('node_modules/noflo/lib/Platform', 'Hacks/Platform');
        $result = $loader->normaliseIdentifier('node_modules/noflo/lib', './Platform');
        $this->assertEquals(array('Hacks', 'Platform'), $result);
    }

}
