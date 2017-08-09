class OnPageLinkClickEvent
{
	target: HTMLElement|null;
	anchor: string;
	source: HTMLElement|null;
	noScroll: boolean = false;

	constructor(target: HTMLElement|null, anchor: string, source: HTMLElement|null = null)
	{
		this.target = target;
		this.anchor = anchor;
		this.source = source;
	}

	preventScrolling = () => this.noScroll = true;
}

let onPageLinkScrollListenersBefore: {(evt: OnPageLinkClickEvent): void}[] = [], onPageLinkScrollListenersAfter: {(evt: OnPageLinkClickEvent): void}[] = [];
let addOnPageLinkScrollListener = (listener: {(evt: OnPageLinkClickEvent): void}, trigger: "start"|"finish" = "start") =>
{
	(trigger === "start" ? onPageLinkScrollListenersBefore : onPageLinkScrollListenersAfter).push(listener);
};

let fireEventIn = (handlers: {(evt: OnPageLinkClickEvent): void}[], event: OnPageLinkClickEvent) =>
{
	handlers.forEach((l: {(evt: OnPageLinkClickEvent): void}) => l(event));
};

let smoothScrollTo = (y: number, finishCallback: (() => any)|undefined = undefined) =>
{
	$("html, body").animate(
	{
		scrollTop: y
	}, 800, finishCallback);
}

let pushLocationWithHashToHistory = (windowLocationHash: string) =>
{
	if(history.pushState) history.pushState(null, $("title").html(), window.location.pathname + windowLocationHash);
	else window.location.hash = windowLocationHash;
}

$(document).ready(() =>
{
	$("a, a *").click(evt =>
	{
		let nearestLink = $(evt.target).closest("a");
		let anchor = (nearestLink[0] as HTMLAnchorElement).hash;
		if(anchor === undefined || anchor.length == 0) return;
		
		let eventToFire = new OnPageLinkClickEvent(document.querySelector(anchor) as HTMLElement|null, anchor, evt.originalEvent.target as HTMLElement);
		fireEventIn(onPageLinkScrollListenersBefore, eventToFire);
		
		let windowLocationHash = anchor;
		let newScrollTop = 0;
		if(anchor === "#top")
		{
			windowLocationHash = "";
		}
		else
		{
			let target = $(anchor);
			newScrollTop = target.offset().top;
			let offset = target.attr("x-anchor-offset");
			if(offset) newScrollTop += target.height() * parseFloat(offset);
		}
		
		evt.preventDefault();
		if(!eventToFire.noScroll) smoothScrollTo(newScrollTop, () =>
		{
			pushLocationWithHashToHistory(windowLocationHash);
		});
		setTimeout(() => fireEventIn(onPageLinkScrollListenersAfter, eventToFire), 800);
	});
});