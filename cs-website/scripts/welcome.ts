$(document).ready(() =>
{
    let welcomeSlider = $("#welcome .slide-with");
    setAutoSlide(welcomeSlider[0], 4500);
    updateLayout(welcomeSlider, welcomeSlider.find(".visible"));
});