let DIRECTION_LEFT = 0, DIRECTION_RIGHT = 1;

$(document).ready(() =>
{
	let slideshowChange = (event: Event) =>
	{
		let slideshowList = $(event.target).closest(".slideshow").find("ul");
		let visible = slideshowList.find("li.visible");
		visible.removeClass("visible");
		let next = visible[0].nextElementSibling, prev = visible[0].previousElementSibling;
		let nextVisiblePanel;
		let buttonClassAttr = event.target.getAttribute("class");
		if(buttonClassAttr.includes("slideshow-left"))
		{
			nextVisiblePanel = prev ? prev : slideshowList[0].lastElementChild;
		}
		else if(buttonClassAttr.includes("slideshow-right"))
		{
			nextVisiblePanel = next ? next : slideshowList[0].firstElementChild;
		}
		console.log(nextVisiblePanel);
		$(nextVisiblePanel).addClass("visible");
	};
	
	$("button.slideshow-left, button.slideshow-right").click(slideshowChange);
});