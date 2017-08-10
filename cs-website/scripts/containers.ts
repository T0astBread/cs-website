let setLightboxTitle = (lightbox: Element, title: string) =>
{
    $(lightbox).find(".lightbox-title").text(title);
}

$(document).ready(() =>
{
    $(".lightbox .close").click(evt =>
    {
        let target = $(evt.currentTarget);
        hideComponent(target.closest(".lightbox-outer")[0]);
        setTimeout(() => hideComponent(target.closest(".overlay")[0]), 250);
    });
})