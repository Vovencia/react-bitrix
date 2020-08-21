<?php
namespace RB;

use \Exception;
use DOMDocument;
use DOMElement;

class HTMLParser {
    /**
     * @param string $html
     * @return array
     */
    public static function parse($html) {
        $html = self::prepareHTML($html);
        $dom = new DOMDocument();
        //libxml_use_internal_errors(true);
        $dom->loadXML( '<HTML>' . $html . '</HTML>');
        //libxml_clear_errors();
        $result = self::elementToObject($dom->documentElement);
        try {
            if (!empty($result) && $result['tag'] === 'HTML') {
                return $result['children'];
            }
        } catch (Exception $e) {}
        return null;
    }
    /**
     * @param string $html
     * @return string
     */
    protected static function prepareHTML($html) {
        $selfClosingTags = [
            "area",
            "base",
            "br",
            "col",
            "embed",
            "hr",
            "img",
            "input",
            "link",
            "meta",
            "param",
            "source",
            "track",
            "wbr",
            "command",
            "keygen",
            "menuitem",
        ];
        foreach ($selfClosingTags as $tag) {
            $html = preg_replace("/(<".$tag."(.*?[^\/])?>)/", "$1</$tag>", $html);
        }
        return $html;
    }
    /**
     * @param DOMElement $element
     * @return array
     */
    protected static function elementToObject($element) {
        $obj = array(
            "type" => "tag",
            "tag" => $element->tagName,
            "children" => [],
            "props" => [],
        );
        foreach ($element->attributes as $attribute) {
            $obj["props"][$attribute->name] = $attribute->value;
        }
        foreach ($element->childNodes as $subElement) {
            if ($subElement->nodeType == XML_TEXT_NODE) {
                $obj["children"][] = [
                    "type" => "text",
                    "children" => $subElement->wholeText,
                ];
            }
            else {
                $obj["children"][] = self::elementToObject($subElement);
            }
        }
        return $obj;
    }
}