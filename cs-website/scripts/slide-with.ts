$(document).ready(() =>
{
	$(".slide-with").each((i, slideW) =>
	{
		let sldShow = slideW.getAttribute("x-slideshow");
		if(!sldShow || sldShow === "") return;
		let linked = $(".slideshow#" + sldShow);
		let id = getIdentifier(slideW);
		slideW.setAttribute("id", id);
		let linkedAttr = linked.attr("x-linked-slideshows");
		linked.attr("x-linked-slideshows", (linkedAttr ? linkedAttr + " " : "") + id);
	});
});