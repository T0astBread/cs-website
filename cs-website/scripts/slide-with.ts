$(document).ready(() =>
{
	$(".slide-with").each((i, slideW) =>
	{
		let linked = $(".slideshow#" + slideW.getAttribute("x-slideshow"));
		let id = getIdentifier(slideW);
		slideW.setAttribute("id", id);
		let linkedAttr = linked.attr("x-linked-slideshows");
		linked.attr("x-linked-slideshows", (linkedAttr ? linkedAttr + " " : "") + id);
	});
});