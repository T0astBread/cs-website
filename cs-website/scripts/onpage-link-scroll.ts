$(document).ready(() =>
{
	$("a, a *").click(evt =>
	{
		let nearestLink = $(evt.target).closest("a");
		let anchor = nearestLink[0].hash;
		if(anchor === undefined || anchor.length == 0) return;
		
		let windowLocationHash = anchor;
		let newScrollTop = 0;
		if(anchor.startsWith("#top") && anchor.length == 4)
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
		}, 800, () => window.location.hash = windowLocationHash);
	});
});