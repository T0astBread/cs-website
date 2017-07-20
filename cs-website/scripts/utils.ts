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