let DIRECTION_LEFT = 0, DIRECTION_RIGHT = 1;

$(document).ready(() =>
{
	let slideshowChange = (event: Event) =>
	{
		let slideshowList = $(event.target).closest(".slideshow").find("ul");
		let visible = slideshowList.find("li.visible");
		
		let next = visible[0].nextElementSibling, prev = visible[0].previousElementSibling;
		let nextVisiblePanel: Element, nextVisiblePanelIsOnLeft: boolean;
		let buttonClassAttr = event.target.getAttribute("class");
		if(buttonClassAttr === "slideshow-left")
		{
			nextVisiblePanel = prev ? prev : slideshowList[0].lastElementChild;
			nextVisiblePanelIsOnLeft = false;
			visible.addClass("on-left");
		}
		else if(buttonClassAttr === "slideshow-right")
		{
			nextVisiblePanel = next ? next : slideshowList[0].firstElementChild;
			nextVisiblePanelIsOnLeft = true;
			visible.addClass("on-right");
		}
		
		$(nextVisiblePanel)
		.addClass("no-transition")
		.removeClass("on-left")
		.removeClass("on-right")
		.addClass(nextVisiblePanelIsOnLeft ? "on-left" : "on-right")
		.removeClass("no-transition")
		.addClass("visible")
		.removeClass("on-left")
		.removeClass("on-right");
		
		setTimeout(() => visible.removeClass("visible"), 500);
	};
	
	$("button.slideshow-left, button.slideshow-right").click(slideshowChange);
});