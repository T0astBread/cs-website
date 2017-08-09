//// <reference path="lib/pikaday.ts"/>

class RequestParams
{
    product: string;
    offset: number;limit: number;
    versionFrom: string|undefined;
    versionTo: string|undefined;
    dateFrom: string|undefined;
    dateTo: string|undefined;
    query: string|undefined;
}

/**
 * Loads news-list.php with the given parameters
 */
let loadNewsArticles = (finishCallback: (request: XMLHttpRequest) => any, criteria: RequestParams) =>
{
    let request = new XMLHttpRequest();
    request.onload = () => finishCallback(request);
    let requestUrl = getWindowHost() + "/php/news-list.php?lang=" + window.language + "&product=" + criteria.product + "&offset=" + criteria.offset + "&limit=" + criteria.limit;
    if(criteria.query) requestUrl += "&query=" + criteria.query;
    if(criteria.versionFrom) requestUrl += "&versionFrom=" + criteria.versionFrom;
    if(criteria.versionTo) requestUrl += "&versionTo=" + criteria.versionTo;
    if(criteria.dateFrom) requestUrl += "&dateFrom=" + criteria.dateFrom;
    if(criteria.dateTo) requestUrl += "&dateTo=" + criteria.dateTo;
    console.log(requestUrl);
    request.open("get", requestUrl, true);
    request.send(null);
}

let updateNewsExplorerHeight = (newsExplorer: JQuery) =>
{
    let newsListUl = newsExplorer.find("ul");
    let loadMoreButton = newsExplorer.find("button.load-more");

    newsListUl.css("overflow-y", "hidden");
    let childrenHeight = 0;
    newsListUl.children().each((i, elem) =>
    {
        childrenHeight += $(elem).height();
    });
    setTimeout(() => newsListUl.css("overflow-y", ""), 1100);
    
    if(!newsExplorer.is("[x-keep-size-on-load]")) newsListUl.height(childrenHeight);
    loadMoreButton.removeAttr("disabled");
}

let rebindMouseListenersForNewsExplorer = (newsExplorer: JQuery) =>
{
    rebindToggleListeners();
    newsExplorer.find(".news-list-item").click(() => setTimeout(() => newsExplorer.find("ul").css("overflow-y", newsExplorer.find(".news-list-item.active").length <= 0 ? "hidden" : ""), 50));
}

let loadNewsArticlesIntoNewsExplorer = (newsExplorer: JQuery) =>
{
    if(newsExplorer.is("[is-loading]")) return;
    newsExplorer.attr("is-loading", "true");

    let loadMoreButton = newsExplorer.find("button.load-more");
    loadMoreButton.attr("disabled", "");
    
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
        
        updateNewsExplorerHeight(newsExplorer);

        // $(".news-list-item.long-text[just-loaded]").click(evt => loadNewsTextIntoArticles(parseInt($(evt.currentTarget).attr("x-news-article-id")))).removeAttr("just-loaded");
        rebindMouseListenersForNewsExplorer(newsExplorer);
        $(".news-list-item[just-loaded]").removeAttr("just-loaded");
        
        newsExplorer.removeAttr("is-loading");
    },
    {
        product: newsExplorer.find(".product-selector").val(),
        offset: newsListUl.children().length,
        limit: 7,
        versionFrom: newsExplorer.find(".version.from").val(),
        versionTo: newsExplorer.find(".version.to").val(),
        dateFrom: newsExplorer.find(".date.from").val(),
        dateTo: newsExplorer.find(".date.to").val(),
        query: newsExplorer.find(".search input").val()
    });
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

let convertToSelectOption = (anchor: string) =>
{
    if(anchor.slice(6, 9) === "cs-")
    {
        return "CS-" + anchor.substr(9, 1).toUpperCase() + anchor.slice(10, anchor.length).replace("-v", " V");
    }
    else
    {
        let crop = anchor.replace("#news-", "");
        return crop.substr(0, 1).toUpperCase() + crop.slice(1, crop.length).toLowerCase();
    }
}

let scrollToNewsCategory = (category: string) =>
{
    if(!(category.substr(0, 6) === "#news-")) return false;
    let ref = $(category);
    console.log(convertToSelectOption(category))
    smoothScrollTo(ref.closest("section").offset().top, () =>
        ref.parent("select").val(convertToSelectOption(category)).change()); //Turns #news-cs-transport into CS-Transport
    return true;
}

let currentReloadTimeout: number;

$(document).ready(() =>
{
    $(".news-explorer").each((i, exp) =>
    {
        let jqExp = $(exp);
        // loadNewsArticlesIntoNewsExplorer(jqExp); //Not needed anymore since news are now initially loaded from the server
        updateNewsExplorerHeight(jqExp);
        jqExp.find("button.load-more").click(evt => loadNewsArticlesIntoNewsExplorer(jqExp));

        jqExp.find(".toggle-additional-filters").click(evt =>
        {
            let row3 = jqExp.find("header .row-3");
            row3.toggleClass("visible");
        });
        jqExp.find(".reset-additional-filters").click(() =>
        {
            $(jqExp.find(".additional-filters input").val("")[0]).change();
        })

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
        jqExp.find(".product-selector, .additional-filters").change(() => reloadNewsArticlesInNewsExplorer(jqExp));
    });

    addOnPageLinkScrollListener(evt =>
    {
        if(scrollToNewsCategory(evt.anchor)) evt.preventScrolling();
        pushLocationWithHashToHistory(evt.anchor);
    });
    scrollToNewsCategory(window.location.hash);
});