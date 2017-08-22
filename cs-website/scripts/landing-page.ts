let sumHeightOfBodyChildren = (body: Element) =>
{
    let sum = 0;
    $(body).find(">*").each((i, elem) => {sum += elem.clientHeight;});
    console.log(sum);
    return sum;
}

let resizeIFrameToFitContentIfTooSmall = (iFrame: HTMLIFrameElement) =>
{
    let content = iFrame.contentDocument.body;
    let jqIf = $(iFrame);
    let contentWidth = content.scrollWidth;
    let contentHeight = sumHeightOfBodyChildren(content);
	if(jqIf.height() < contentHeight) jqIf.height(contentHeight);
	if(jqIf.width() < contentWidth) jqIf.width(contentWidth);
}

let resizeIFrameAccordingToSizeDefinition = (iFrame: HTMLIFrameElement) =>
{
    let jqIf = $(iFrame);
    let head = $(iFrame.contentDocument.head);
    let heightDef = head.find("meta[name=x-height]");
    let widthDef = head.find("meta[name=x-width]");
    if(heightDef.length > 0) jqIf.parent().css("height", heightDef.attr("content"));
    if(widthDef.length > 0) jqIf.parent().css("width", widthDef.attr("content"));
}

let connectStylesheetToLandingPage = (landingPageHead: JQuery, stylesheetName: string) =>
{
    landingPageHead.append($("<link/>",
    {
        rel: "stylesheet",
        href: getWindowHost() + "/styles/" + stylesheetName + ".css",
        type: "text/css"
    }));
}

let connectStylesheetsToLandingPage = (landingPage: HTMLIFrameElement, ...stylesheetNames: string[] ) =>
{
    let head = $(landingPage.contentDocument.head);
    stylesheetNames.forEach(s => connectStylesheetToLandingPage(head, s));
}

let checkIfCookieExistsAndPutCookie = () =>
{
    let cookie = document.cookie.match(/hasSeenLandingPage=true/);
    if(cookie && cookie.length > 0) return true;

    let expiryDate = new Date();
    expiryDate.setTime(expiryDate.getTime() + 24*60*60*1000);
    expiryDate.setHours(0);
    expiryDate.setMinutes(0);
    expiryDate.setSeconds(0);
    document.cookie = "hasSeenLandingPage=true; expires=" + expiryDate.toUTCString() + ";";
    return false;
}

let checkIfLandingPageExists = (landingPage: HTMLIFrameElement) =>
{
    let rMatch = landingPage.contentDocument.body.innerHTML.match(/(<h2>Error 404<\/h2>)|(File Not Found)/);
    return rMatch === null || rMatch.length === 0;
}

let getShowMeta = (landingPageHead: JQuery) =>
{
    let showMeta = landingPageHead.find("meta[name=x-show]");
    if(!showMeta || showMeta.length === 0) return "auto";
    return showMeta.attr("content");
}

let initLandingPageContainers = () =>
{
    let landingPage = document.getElementById("landing-page-container") as HTMLIFrameElement;
    landingPage.onload = () =>
    {
        let head = $(landingPage.contentDocument.head);
        let showMeta = getShowMeta(head);
        if(showMeta === "never" || !checkIfLandingPageExists(landingPage)) return;
        if(showMeta !== "always" && checkIfCookieExistsAndPutCookie()) return;

        let jqLandingPage = $(landingPage);
        resizeIFrameAccordingToSizeDefinition(landingPage);

        let title = landingPage.contentDocument.getElementsByTagName("title")[0];
        if(title) setLightboxTitle(jqLandingPage.closest(".lightbox")[0], title.innerText);
             
        if(head.find("meta[name=x-no-default-styles]").length === 0) connectStylesheetsToLandingPage(landingPage, "frame", "misc");

        showComponent(jqLandingPage.closest(".overlay")[0]);
    }
}

$(document).ready(() =>
{
    initLandingPageContainers();
})