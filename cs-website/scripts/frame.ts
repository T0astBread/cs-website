$(document).ready(() =>
{
    $(".overlay").click(evt =>
    {
        if(evt.target !== evt.currentTarget) return;
        hideComponent(evt.currentTarget);
    });
});