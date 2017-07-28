<?php
function respond(int $responseCode, string $response)
{
    http_response_code($responseCode);
    exit($response);
}

function bad_request(string $response)
{
    respond(400, $response);
}

function convert_db_response_to_version_number(int $dbResponse)
{
    $str = strval($dbResponse);
    while(strlen($str) < 9)
    {
        $str = "0".$str;
    }

    $tokens = str_split($str, 3);
    $assembledStr = "";
    foreach($tokens as $token)
    {
        $assembledStr .= preg_replace("/^0{1,2}/", "", $token).".";
    }

    return substr($assembledStr, 0, strlen($assembledStr) - 1);
}
?>