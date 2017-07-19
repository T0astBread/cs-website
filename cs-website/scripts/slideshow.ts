const DIRECTION_LEFT = 0, DIRECTION_RIGHT = 1;

let slideshowChange = (slideshow: Element, direction: number) =>
{
	let slideshowList = $(slideshow).find("ul");
	let visible = slideshowList.find("li.visible");
	
	let next = visible[0].nextElementSibling, prev = visible[0].previousElementSibling;
	let nextVisiblePanel: Element, nextVisiblePanelIsOnLeft: boolean;
	if(direction === DIRECTION_LEFT)
	{
		nextVisiblePanel = prev ? prev : slideshowList[0].lastElementChild;
		nextVisiblePanelIsOnLeft = false;
		visible.addClass("on-left");
	}
	else if(direction === DIRECTION_RIGHT)
	{
		nextVisiblePanel = next ? next : slideshowList[0].firstElementChild;
		nextVisiblePanelIsOnLeft = true;
		visible.addClass("on-right");
	}
	
	let jqNextVisible = $(nextVisiblePanel);
	jqNextVisible.addClass("no-transition")
	.removeClass("on-left")
	.removeClass("on-right")
	.addClass(nextVisiblePanelIsOnLeft ? "on-left" : "on-right")
	void nextVisiblePanel.offsetWidth;
	jqNextVisible.removeClass("no-transition")
	.addClass("visible")
	.removeClass("on-left")
	.removeClass("on-right");
	
	visible.removeClass("visible");
};

$(document).ready(() =>
{	
	let slideshowChangeOnEvent = (evt: Event, direction: number) =>
		slideshowChange($(evt.target).closest(".slideshow"), direction);
		
	$("button.slideshow-left, button.slideshow-right").click(evt =>
	{
		let buttonClass = evt.target.getAttribute("class");
		slideshowChangeOnEvent(evt, buttonClass === "slideshow-left" ? DIRECTION_LEFT : DIRECTION_RIGHT);
	}).keyup(evt =>
	{
		if(evt.keyCode !== 37 && evt.keyCode !== 39) return;
		slideshowChangeOnEvent(evt, evt.keyCode === 37 ? DIRECTION_LEFT : DIRECTION_RIGHT);
	});
});