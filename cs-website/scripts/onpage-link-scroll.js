"use strict";
$(document).ready(function () {
    $("a, a *").click(function (evt) {
        var nearestLink = $(evt.target).closest("a");
        var anchor = nearestLink[0].hash;
        console.log(anchor);
        if (anchor === undefined || anchor.length == 0)
            return;
        var windowLocationHash = anchor;
        var newScrollTop = 0;
        if (anchor.startsWith("#top") && anchor.length == 4) {
            windowLocationHash = "";
        }
        else {
            newScrollTop = $(anchor).offset().top;
        }
        evt.preventDefault();
        $("html, body").animate({
            scrollTop: newScrollTop
        }, 800, function () { return window.location.hash = windowLocationHash; });
    });
});
