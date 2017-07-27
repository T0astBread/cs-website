//// <reference path="lib/pikaday.ts"/>

/**
 * Loads news-list.php with the given parameters
 */
let loadNewsArticles = (finishCallback: (request: XMLHttpRequest) => any, product: string, offset: number, limit: number) =>
{
    let request = new XMLHttpRequest();
    request.onload = () => finishCallback(request);
    request.open("get", getWindowHost() + "/php/news-list.php?lang=de&product=" + product + "&offset=" + offset + "&limit=" + limit, true);
    request.send(null);
}

let loadNewsArticlesIntoNewsExplorer = (newsExplorer: JQuery) =>
{
    let newsListUl = newsExplorer.find("ul.news-list");
    loadNewsArticles(request =>
    {
        newsListUl.append(request.responseText);
        rebindToggleListeners();
        rebindScrollingPreventers();
        $(".news-list-item[just-loaded] .news-article-container").click(evt => evt.stopPropagation());
        
        newsExplorer.find("button.load-more").removeAttr("disabled");

        if(!newsExplorer.is("[x-keep-size-on-load]")) newsListUl.css("height", newsListUl.children().length * 5 + "rem");

        $(".news-list-item[just-loaded]").click(evt => loadNewsTextIntoArticles(parseInt($(evt.currentTarget).attr("x-news-article-id")))).removeAttr("just-loaded");
    }, newsExplorer.find(".product-selector").val(), newsListUl.children().length, 7);
}

let loadNewsText = (articleId: number, finishCallback: (request: XMLHttpRequest) => any) =>
{
    let request = new XMLHttpRequest();
    request.onload = () => finishCallback(request);
    request.open("get", getWindowHost() + "/php/news-text.php?lang=de&id=" + articleId, true);
    request.send(null);
}

let loadNewsTextIntoArticles = (id: number) =>
{
    let jqArticles = $("[x-news-article-id='" + id + "'] .news-article-content");
    if(jqArticles.is("[unloaded]")) loadNewsText(id, request => jqArticles.html(request.responseText).removeAttr("unloaded"));
}

$(document).ready(() =>
{
    $(".news-explorer").each((i, exp) =>
    {
        let jqExp = $(exp);
        loadNewsArticlesIntoNewsExplorer(jqExp);
        jqExp.find("button.load-more").click(evt =>
        {
            $(evt.target).attr("disabled", "");
            loadNewsArticlesIntoNewsExplorer(jqExp);
        });
        jqExp.find(".toggle-additional-filters").click(evt =>
        {
            let row3 = jqExp.find("header .row-3");
            row3.toggleClass("visible");
        });

        // jqExp.data("datepicker-from", new Pikaday(
        // {
        //     field: jqExp.find(".datepicker")[0],
        //     format: "YYYY-MM-DD"
        // }));
        // jqExp.data("datepicker-to", new Pikaday(
        // {
        //     field: jqExp.find(".datepicker")[1],
        // }));
    });
});