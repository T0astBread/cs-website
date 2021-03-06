﻿const DIRECTION_LEFT = 0, DIRECTION_RIGHT = 1;

let updateLayout = (slideshowList: JQuery, visible: JQuery) =>
{
	visible.removeClass("center-vertically");
	//void visible.offsetWidth; //Apparently not necessary
	if(visible.height() < slideshowList.height()) visible.addClass("center-vertically");
	slideshowList.height(visible.outerHeight());
	void slideshowList.offsetWidth;
};

let updateLayoutFor = (slideshow: JQuery) => updateLayout($(slideshow), $(slideshow).find("> .visible"));

let slideList = (slideshowList: JQuery, direction: number, fastTransition: boolean = false, finishCallback: Function|undefined = undefined) =>
{
	let visible = slideshowList.find("> li.visible");
	
	fastTransition ? slideshowList.addClass("fast-transition") : slideshowList.removeClass("fast-transition");
	
	let next = visible[0].nextElementSibling, prev = visible[0].previousElementSibling;
	let nextVisiblePanel: Element|null = null, nextVisiblePanelIsOnLeft: boolean = true;
	if(direction === DIRECTION_RIGHT)
	{
		nextVisiblePanel = prev ? prev : slideshowList[0].lastElementChild;
		nextVisiblePanelIsOnLeft = false;
		visible.addClass("on-left");
	}
	else if(direction === DIRECTION_LEFT)
	{
		nextVisiblePanel = next ? next : slideshowList[0].firstElementChild;
		nextVisiblePanelIsOnLeft = true;
		visible.addClass("on-right");
	}
	
	if(!nextVisiblePanel) return;
	let jqNextVisible = $(nextVisiblePanel);
	
	jqNextVisible.addClass("no-transition")
	.removeClass("on-left")
	.removeClass("on-right")
	.addClass(nextVisiblePanelIsOnLeft ? "on-left" : "on-right");
	void (nextVisiblePanel as HTMLElement).clientTop; //Triggers revalidation of layout
	jqNextVisible.removeClass("no-transition")
	.addClass("visible")
	.removeClass("on-left")
	.removeClass("on-right");
	slideshowList.find("> .priority-two").removeClass("priority-two");
	visible.addClass("priority-two").removeClass("visible");
	
	updateLayout(slideshowList, jqNextVisible);
	if(finishCallback) setTimeout(finishCallback, fastTransition ? 250 : 500);
};

let slide = (slideshow: Element, direction: number, fastTransition: boolean = false, finishCallback: Function|undefined = undefined) =>
{
	let slideshowList = $(slideshow).find("ul");
	if(!slideshowList) return;
	slideList(slideshowList, direction, fastTransition, finishCallback);
	$(slideshow).attr("x-linked-slideshows").split(" ").forEach(l =>
		slideList($("#" + l).closestChild("ul"), direction, fastTransition));
};

let slideToPanel = (slideshow: Element, panelId: string, direction: number = DIRECTION_RIGHT, fastTransition: boolean = true) =>
{
	let checkPanel = () => $(slideshow).find(".visible").attr("id") === panelId;
	let slideAndCheckPanel = () =>	//This function probably contains the bug; OR MAYBE NOT: apparently, setting overflow to visible on the ul in the slideshow fixes it (but it looks ugly, i have to find a workaround for that)
	{
		slide(slideshow, direction, fastTransition, () =>
		{
			if(!checkPanel()) slideAndCheckPanel();
		});
	};
	if(!checkPanel()) slideAndCheckPanel();
};

let shouldAutoSlide = (slideshow: Element) =>
{
	let jqSlideshow = $(slideshow);
	let linkedVisible = false;
	if(jqSlideshow.is("[x-linked-slideshows]")) jqSlideshow.attr("x-linked-slideshows").split(" ").forEach(s => linkedVisible = linkedVisible ? true : $("#" + s).visible(true));
	return jqSlideshow.visible(true) || linkedVisible;
}

let setAutoSlide = (slideshow: Element, interval: number, direction: number = DIRECTION_RIGHT, fastTransition: boolean = false, afterSlideCallback: Function|undefined = undefined) =>
{
	let jqSlideshow = $(slideshow);
	clearInterval(jqSlideshow.data("autoSlideInterval"));
	jqSlideshow.data("autoSlideInterval", setInterval(() => shouldAutoSlide(slideshow) ? jqSlideshow.is(".slideshow") ?
		slide(slideshow, direction, fastTransition, afterSlideCallback) :
		slideList(jqSlideshow, direction, fastTransition, afterSlideCallback) : console.log("out of viewport"), interval));
}

let clearAutoSlide = (slideshow: Element) => clearInterval($(slideshow).data("autoSlideInterval"));

$(document).ready(() =>
{
	let slideOnEvent = (evt: Event, direction: number) =>
		slide($(evt.target).closest(".slideshow")[0], direction);
		
	$("button.slideshow-left, button.slideshow-right").click(evt =>
	{
		let buttonClass = evt.currentTarget.getAttribute("class");
		slideOnEvent(evt, buttonClass === "slideshow-left" ? DIRECTION_LEFT : DIRECTION_RIGHT);
	}).keyup(evt =>
	{
		if(evt.keyCode !== 37 && evt.keyCode !== 39) return;
		slideOnEvent(evt, evt.keyCode === 37 ? DIRECTION_LEFT : DIRECTION_RIGHT);
	});
	
	addOnPageLinkScrollListener((evt: OnPageLinkClickEvent) =>
	{
		if(!evt.target) return;
		let slideshow = $(evt.target).closest(".slideshow");
		if(slideshow.length > 0) slideToPanel(slideshow[0], evt.anchor.slice(1, evt.anchor.length));
	}, "finish");
	
	let resizeTimeout: number;
	$(".slideshow > ul, .slide-with").each((i, e) => updateLayoutFor($(e))).resize(evt =>
		{
			clearTimeout(resizeTimeout);
			let target = $(evt.currentTarget);
			resizeTimeout = setTimeout(() => target.css("opactiy", ".25"), 300);
		});
});