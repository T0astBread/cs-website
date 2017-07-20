class OnPageLinkClickEvent
{
	target: HTMLElement|null;
	anchor: string;

	constructor(target: HTMLElement|null, anchor: string)
	{
		this.target = target;
		this.anchor = anchor;
	}
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


$(document).ready(() =>
{
	$("a, a *").click(evt =>
	{
		let nearestLink = $(evt.target).closest("a");
		let anchor = (nearestLink[0] as HTMLAnchorElement).hash;
		if(anchor === undefined || anchor.length == 0) return;
		
		let eventToFire = new OnPageLinkClickEvent(document.querySelector(anchor) as HTMLElement|null, anchor);
		fireEventIn(onPageLinkScrollListenersBefore, eventToFire);
		
		let windowLocationHash = anchor;
		let newScrollTop = 0;
		if(anchor === "#top")
		{
			windowLocationHash = "";
		}
		else
		{
			newScrollTop = $(anchor).offset().top;
		}
		
		evt.preventDefault();
		$("html, body").animate(
		{
			scrollTop: newScrollTop
		}, 800, () =>
		{
			window.location.hash = windowLocationHash;
		});
		setTimeout(() => fireEventIn(onPageLinkScrollListenersAfter, eventToFire), 800);
	});
});