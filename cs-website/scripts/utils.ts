let generateRandomId = (elem: Element) =>
{
	let id;
	do
	{
		id = elem.tagName + "-" + Math.floor(Math.random() * 1000);
	} while($("#" + id).length > 0);
	return id;
};

let getIdentifier = (elem: Element) => elem.getAttribute("id") ? elem.getAttribute("id") as string : generateRandomId(elem);


const toggleHandler = (evt: JQueryEventObject) => $(evt.currentTarget).toggleClass("active");

let rebindToggleListeners = () =>
{
	$(".toggleable").unbind("click", toggleHandler).click(toggleHandler);
};

$(document).ready(rebindToggleListeners);


const bodyScrollingPreventer = (evt: JQueryEventObject) =>
{
	let t = evt.currentTarget, jqT = $(t);
	let scrollTop = jqT.scrollTop();
	
	let o = evt.originalEvent as any;
	let delta = o.wheelDelta||-o.detail;

	if(t.scrollHeight > jqT.height() &&
		((scrollTop <= 0 && delta > 0) || (Math.abs(scrollTop - jqT.height()) <= 5 && delta < 0))) evt.preventDefault();

	evt.stopPropagation();
};

let rebindScrollingPreventers = () =>
{
	$(".isolated-scroll")
	.unbind("mousewheel DOMMouseScroll", bodyScrollingPreventer)
	.on("mousewheel DOMMouseScroll", bodyScrollingPreventer);
}

$(document).ready(rebindScrollingPreventers);