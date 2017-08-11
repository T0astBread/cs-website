$(document).ready(() =>
{
    let match = document.cookie.match(/hasSeenCookieBar=true/);
    if(match && match.length > 0) $("#cookie-bar-outer").hide();

    $("#cookie-bar .close").click(() =>
    {
        hideComponent($("#cookie-bar-outer")[0]);
        let expiryDate = new Date();
        expiryDate.setTime(expiryDate.getTime() + 14*25*60*60*1000);
        document.cookie = "hasSeenCookieBar=true; expires=" + expiryDate.toUTCString() + ";";
    });
});