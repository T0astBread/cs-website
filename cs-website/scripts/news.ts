//// <reference path="lib/pikaday.ts"/>

/**
 * Loads news-list.php with the given parameters
 */
let loadNewsArticles = (finishCallback: (request: XMLHttpRequest) => any, criteria: {product: string, offset: number, limit: number, query: string|undefined}) =>
{
    let request = new XMLHttpRequest();
    request.onload = () => finishCallback(request);
    let requestUrl = getWindowHost() + "/php/news-list.php?lang=de&product=" + criteria.product + "&offset=" + criteria.offset + "&limit=" + criteria.limit;
    if(criteria.query) requestUrl += "&query=" + criteria.query;
    console.log(requestUrl);
    request.open("get", requestUrl, true);
    request.send(null);
}

let loadNewsArticlesIntoNewsExplorer = (newsExplorer: JQuery) =>
{
    let newsListUl = newsExplorer.find("ul.news-list");
    loadNewsArticles(request =>
    {
        newsListUl.append(request.responseText);
        $(".news-list-item[just-loaded] .news-article-container").click(evt => evt.stopPropagation());

        let inner = $(".news-list-item[just-loaded] .news-list-item-inner .preview-wrapper");
        inner.each((i, elem) =>
        {
            let jqElem = $(elem);
            if(jqElem.find("> div").height() > jqElem.height())
                jqElem.closest(".news-list-item").addClass("long-text toggleable");
        });
        
        newsExplorer.find("button.load-more").removeAttr("disabled");

        if(!newsExplorer.is("[x-keep-size-on-load]")) newsListUl.height(newsListUl[0].scrollHeight);

        // $(".news-list-item.long-text[just-loaded]").click(evt => loadNewsTextIntoArticles(parseInt($(evt.currentTarget).attr("x-news-article-id")))).removeAttr("just-loaded");
        rebindToggleListeners();
        $(".news-list-item[just-loaded]").removeAttr("just-loaded");
    }, {product: newsExplorer.find(".product-selector").val(), offset: newsListUl.children().length, limit: 7, query: newsExplorer.find(".search input").val()});
}

let reloadNewsArticlesInNewsExplorer = (newsExplorer: JQuery) =>
{
    newsExplorer.find("ul").html("");
    loadNewsArticlesIntoNewsExplorer(newsExplorer);
}

/**
 * @deprecated Deprecated since the whole news article is loaded immediately instead of just a preview.
 * @param articleId 
 * @param finishCallback 
 */
let loadNewsText = (articleId: number, finishCallback: (request: XMLHttpRequest) => any) =>
{
    let request = new XMLHttpRequest();
    request.onload = () => finishCallback(request);
    request.open("get", getWindowHost() + "/php/news-text.php?lang=de&id=" + articleId, true);
    request.send(null);
}


/**
 * @deprecated Deprecated since the whole news article is loaded immediately instead of just a preview.
 * @param id 
 */
let loadNewsTextIntoArticles = (id: number) =>
{
    let jqArticles = $("[x-news-article-id='" + id + "'] .news-article-content");
    if(jqArticles.is("[unloaded]")) loadNewsText(id, request => jqArticles.html(request.responseText).removeAttr("unloaded"));
}

let currentReloadTimeout: number;

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

        jqExp.find(".search").keyup(evt =>
        {
            let target = $(evt.currentTarget).find("input");
            if(target.data("lastVal") === target.val()) return;
            target.data("lastVal", target.val());

            clearTimeout(currentReloadTimeout);
            currentReloadTimeout = setTimeout(() => reloadNewsArticlesInNewsExplorer(jqExp), 300);
        });
        jqExp.find(".product-selector").change(() => reloadNewsArticlesInNewsExplorer(jqExp));
    });
});