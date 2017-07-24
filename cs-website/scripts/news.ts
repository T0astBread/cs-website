/**
 * Loads the news-list.php with the given parameters
 * @param product 
 * @param offset 
 * @param limit 
 */
let loadNewsArticles = (onFinish: {(request: XMLHttpRequest): void}, product: string, offset: number, limit: number) =>
{
    // let tempContainer = document.createElement("div");
    // $(tempContainer).load(window.location.origin + "/php/news-list.php?product=" + product + "&offset=" + offset + "&limit=" + limit);

    let request = new XMLHttpRequest();
    request.onloadend = () => onFinish(request);
    // request.open("get", window.location.origin + "/php/news-list.php", true);
    // request.setRequestHeader("product", product);
    // request.setRequestHeader("offset", offset.toString());
    // request.setRequestHeader("limit", limit.toString());
    request.open("get", window.location.origin + "/php/news-list.php?product=" + product + "&offset=" + offset + "&limit=" + limit, true);
    request.send(null);
}

let loadNewsArticlesIntoNewsList = (newsList: JQuery) =>
{
    loadNewsArticles(request =>
    {
        let newsListUl = newsList.find("ul");
        newsListUl.html(newsListUl.html() + request.responseText);
    }, newsList.find(".product-selector").val(), newsList.children().length, 5);
}

let loadNewsText = (id: number) =>
{
    
}

$(document).ready(() =>
{
    $(".news-list").each((i, elem) => loadNewsArticlesIntoNewsList($(elem)));
});