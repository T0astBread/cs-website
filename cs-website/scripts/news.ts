/**
 * Loads news-list.php with the given parameters
 */
let loadNewsArticles = (onFinish: {(request: XMLHttpRequest): void}, product: string, offset: number, limit: number) =>
{
    let request = new XMLHttpRequest();
    request.onloadend = () => onFinish(request);
    request.open("get", window.location.origin + "/php/news-list.php?product=" + product + "&offset=" + offset + "&limit=" + limit, true);
    request.send(null);
}

let loadNewsArticlesIntoNewsExplorer = (newsExplorer: JQuery) =>
{
    let newsListUl = newsExplorer.find("ul.news-list");
    loadNewsArticles(request =>
    {
        newsListUl.html(newsListUl.html() + request.responseText);
        rebindToggleListeners();
        
        newsExplorer.find("button").removeAttr("disabled");

        if(!newsExplorer.is("[x-keep-size-on-load]")) newsListUl.css("height", newsListUl.children().length * 5 + "rem");
    }, newsExplorer.find(".product-selector").val(), newsListUl.children().length, 5);
}

let loadNewsText = (id: number) => $("[x-news-article-id='" + id + "'] .news-article-content").html("Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.").removeAttr("unloaded");

$(document).ready(() => $(".news-explorer").each((i, exp) =>
{
    let jqExp = $(exp);
    loadNewsArticlesIntoNewsExplorer(jqExp);
    jqExp.find("button").click(evt =>
    {
        $(evt.target).attr("disabled", "");
        loadNewsArticlesIntoNewsExplorer(jqExp);
    });
}));