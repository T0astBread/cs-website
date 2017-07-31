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
    return convert_db_string_response_to_version_number(strval($dbResponse));
}

function convert_db_string_response_to_version_number(string $dbResponse)
{
    while(strlen($dbResponse) < 12)
    {
        $dbResponse = "0".$dbResponse;
    }

    $tokens = str_split($dbResponse, 3);
    $assembledStr = "";
    foreach($tokens as $token)
    {
        $assembledStr .= preg_replace("/^0{1,2}/", "", $token).".";
    }

    return substr($assembledStr, 0, strlen($assembledStr) - 1);
}

function convert_string_to_db_version_number(string $str)
{
    $tokens = explode(".", $str);
    $valueStr = "";
    foreach($tokens as $token)
    {
        while(strlen($token) < 3)
        {
            $token = "0".$token;
        }
        $valueStr .= $token;
    }
    return $valueStr;
}
?>