let ghostSelect: JQuery;
const PADDING_RIGHT = 15;

let updateWidthForSelect = (select: Element) =>
{
    let target = $(select);
    ghostSelect.copyCSS(target, null, ["width"]);

    ghostSelect.html("<option>" + target.val() + "</option>");
    let toWidth = ghostSelect.outerWidth();

    target.animate({width: toWidth + PADDING_RIGHT}, 750);
}

$(document).ready(() =>
{
    let selects = $("select");
    selects.change(evt => updateWidthForSelect(evt.target));

    ghostSelect = $("<select id='ghost-select'><option></option></select>");
    $("body").append(ghostSelect);

    selects.each((i, elem) => elem ? updateWidthForSelect(elem) : undefined);
});