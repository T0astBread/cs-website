<?php
require_once realpath(__DIR__)."/twig-environment.internal.php";
require_once realpath(__DIR__)."/../jobs-count.internal.php";

function render_page(string $pageName, $variables = [])
{
    return render($pageName, array_merge(["jobsCount" => get_jobs_count()], $variables));
}
?>