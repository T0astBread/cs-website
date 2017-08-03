<?php
namespace XBundle;

class XBundle_Extension extends \Twig_Extension
{
    private $bundle;
    private $bundleLocation;

    public function __construct(string $bundleLocation)
    {
        $this->bundle = [];
        $this->bundleLocation = $bundleLocation;
    }

    public function loadBundle(string $bundleName)
    {
        $content = file_get_contents($this->bundleLocation.$bundleName);
        $lines = preg_split("/\r\n/", $content);
        for($i = 0; $i < count($lines); $i++)
        {
            $line = $lines[$i];
            if(strpos($line, "=") !== false) $this->loadInlineValue($line);
            else if(strlen($line) > 0) $i = $this->loadBlockValue($lines, $i);
        }
        return $this;
    }

    private function loadInlineValue(string $line)
    {
        $id = strstr($line, "=", true);
        $value = strstr($line, "=");
        $value = substr($value, 1, strlen($value) - 1);
        $this->bundle[$id] = $value;
    }

    private function loadBlockValue($lines, int $pointer) //Pointer must point at line that contains the ID
    {
        $id = $lines[$pointer++];

        $value = "";
        $i = $pointer;
        for(; $i < count($lines); $i++)
        {
            $line = $lines[$i];
            if($line === "=") break;
            // if($value !== "") $value .= "<br>";
            $value .= $line;
        }
        $this->bundle[$id] = $value;
        return $i;
    }

    public function getFilters()
    {
        return [new \Twig_SimpleFilter("bundle", [$this, "bundleFilter"])];
    }

    public function bundleFilter(string $key)
    {
        return isset($this->bundle[$key]) ? $this->bundle[$key] : $key;
    }
}
?>