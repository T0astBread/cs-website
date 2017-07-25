$(document).ready(() =>
{
    $("select").click(evt =>
    {
        let target = $(evt.target);
        target.data("prev", target);
    }).change(evt =>
    {
        let target = $(evt.target);
        // let clone = target.clone(false, false);
        // $("body").append(clone);
        // clone.attr("id", "resize-select-clone");

        // // resizeSelectOption.html(target.val());
        // clone.html("<option>" + target.val() + "</option>");
        // let toWidth = clone.outerWidth();

        // target.animate({width: toWidth}, 1000);
        // $("body").children().remove("#resize-select-clone");

        let val = target.val();
        let toWidth = target.outerWidth();
        target.val(target.data("prev"));

        target.animate({width: toWidth}, 1000);
    });
});