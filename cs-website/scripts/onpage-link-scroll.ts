class OnPageLinkClickEvent extends Event
{
	anchor: string;
}

let onPageLinkScrollListenersBefore = [], onPageLinkScrollListenersAfter = [];
let addOnPageLinkScrollListener = (listener: Function<OnPageLinkClickEvent>, trigger: "start"|"finish" = "start") =>
{
	(trigger === "start" ? onPageLinkScrollListenersBefore : onPageLinkScrollListenersAfter).push(listener);
};


$(document).ready(() =>
{
	$("a, a *").click(evt =>
	{
		let nearestLink = $(evt.target).closest("a");
		let anchor = nearestLink[0].hash;
		if(anchor === undefined || anchor.length == 0) return;
		
		let eventToFire = {target: $(anchor), anchor: anchor};
		onPageLinkScrollListenersBefore.forEach(l => l(eventToFire));
		
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
			window.location.hash = windowLocationHash);
			onPageLinkScrollListenersAfter.forEach(l => l(eventToFire));
		};
	});
});