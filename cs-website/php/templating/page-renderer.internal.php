<?php
require_once realpath(__DIR__)."/twig-environment.internal.php";
require_once realpath(__DIR__)."/../jobs-count.internal.php";

function render_page(string $pageName)
{
    return render($pageName, ["jobsCount" => get_jobs_count()]);
}
?>