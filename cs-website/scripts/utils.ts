interface Window
{
	language: string;
}

let generateRandomId = (elem: Element) =>
{
	let id;
	do
	{
		id = elem.tagName + "-" + Math.floor(Math.random() * 1000);
	} while($("#" + id).length > 0);
	return id;
}

let getIdentifier = (elem: Element) => elem.getAttribute("id") ? elem.getAttribute("id") as string : generateRandomId(elem);


const toggleHandler = (evt: JQueryEventObject) => $(evt.currentTarget).toggleClass("active");

let rebindToggleListeners = () =>
{
	$(".toggleable").unbind("click", toggleHandler).click(toggleHandler);
}

$(document).ready(rebindToggleListeners);


const bodyScrollingPreventer = (evt: JQueryEventObject) =>
{
	let t = evt.currentTarget, jqT = $(t);
	let scrollTop = jqT.scrollTop();
	
	let o = evt.originalEvent as any;
	let delta = o.wheelDelta||-o.detail;

	if(t.scrollHeight > jqT.height() &&
		((scrollTop <= 0 && delta > 0) || (-(scrollTop - jqT.height()) <= 0 && delta < 0))) evt.preventDefault();

	evt.stopPropagation();
}

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

let getWindowHost = () => (window.location.origin||window.location.protocol + "//" + window.location.host);

let convertStringToDBVersionTag = (str: string) =>
{
	let tokens = str.split(".");
	if(tokens.length === 2) tokens = [tokens[0], "000", tokens[1], "000"];
	if(tokens.length === 3) tokens.push("000");
	tokens = tokens.map(t =>
	{
		while(t.length < 3) t = "0" + t;
		return t;
	});
    return tokens.join("");
}

let hideComponent = (hideableComponent: Element, hidingTransitionDuration: number = 500) =>
{
	let hideable = $(hideableComponent);
	hideable.addClass("hidden");
	setTimeout(() => hideable.css("display", "none"), hidingTransitionDuration);
}

let showComponent = (hideableComponent: Element) =>
{
	$(hideableComponent).css("display", "").removeClass("hidden");
}