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
    let heightDef = head.find("meta[name=x-parent-height]");
    let widthDef = head.find("meta[name=x-parent-width]");
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

let initLandingPageContainers = () =>
{
    let landingPage = document.getElementById("landing-page-container") as HTMLIFrameElement;
    landingPage.onload = () =>
    {
        let rMatch = landingPage.contentDocument.body.innerHTML.match(/<h2>Error 404<\/h2>/);
        if(rMatch && rMatch.length > 0) return;

        let jqLandingPage = $(landingPage);
        resizeIFrameAccordingToSizeDefinition(landingPage);

        let title = landingPage.contentDocument.getElementsByTagName("title")[0];
        if(title) setLightboxTitle(jqLandingPage.closest(".lightbox")[0], title.innerText);
             
        connectStylesheetsToLandingPage(landingPage, "frame", "misc");

        showComponent(jqLandingPage.closest(".overlay")[0]);
    }
}

$(document).ready(() =>
{
    initLandingPageContainers();
})