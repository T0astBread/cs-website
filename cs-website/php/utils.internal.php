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
?>