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

//Currently not used anywhere
let animateToAutoHeight = (element: Element, options: {duration: number, finishCallback: ((elem: Element) => any)|undefined} = {duration: 1000, finishCallback: undefined}) =>
{
	let jqElem = $(element);
	let heightBefore = jqElem.height();
	jqElem.css("height", "auto");
	let autoHeight = jqElem.height();
	jqElem.height(heightBefore)
	.animate({height: autoHeight}, options.duration, () => options.finishCallback ? options.finishCallback(element) : null);
}