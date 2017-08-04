let setAutoSlideOnProductsSlideshow = () => setAutoSlide($(".products .slideshow")[0], 4000);

$(document).ready(() =>
{
    let products = $(".products .slideshow");
    products.closest("section").mouseenter(() => clearAutoSlide(products[0])).mouseleave(setAutoSlideOnProductsSlideshow);
});