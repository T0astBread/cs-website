let ghostSelect: JQuery;
const PADDING_RIGHT = 5;

$(document).ready(() =>
{
    $("select").change(evt =>
    {
        let target = $(evt.target);
        ghostSelect.copyCSS(target, null, ["width"]);

        ghostSelect.html("<option>" + target.val() + "</option>");
        let toWidth = ghostSelect.outerWidth();

        target.animate({width: toWidth + PADDING_RIGHT}, 750);
    })
    .each((i, elem) => void $(elem).width(elem.clientWidth + PADDING_RIGHT)); //Initially applies the padding without the need for a change event

    ghostSelect = $("<select id='ghost-select'><option></option></select>");
    $("body").append(ghostSelect);
});