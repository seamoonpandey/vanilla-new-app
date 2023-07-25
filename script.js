// script.js

let currentArticleIndex = 0;
const articlesPerPage = 10;
let selectedCategory = "";
let articlesData = [];

async function fetchNews() {
  const API_ENDPOINT = "dummy.json";

  try {
    const response = await fetch(API_ENDPOINT);
    const data = await response.json();
    articlesData = data.articles;
    return articlesData;
  } catch (error) {
    console.error("Error fetching news:", error);
    return [];
  }
}

function updateCategoryNav(categories) {
  const categoryNav = document.querySelector(".category-nav");
  categoryNav.innerHTML = "";
  categories.forEach((category) => {
    const liElement = document.createElement("li");
    const linkElement = document.createElement("a");
    linkElement.textContent = category.toUpperCase();
    linkElement.href = "";
    linkElement.addEventListener("click", () => {
      selectedCategory = category;
      currentArticleIndex = 0;
      loadNews();
    });
    liElement.appendChild(linkElement);
    categoryNav.appendChild(liElement);
  });
}

function updateNewsDisplay(articles) {
  const mainElement = document.querySelector("main");
  mainElement.innerHTML = "";

  const currentArticles = articles.slice(
    currentArticleIndex,
    currentArticleIndex + articlesPerPage
  );
  currentArticles.forEach((article) => {
    const articleElement = document.createElement("div");
    articleElement.classList.add("article");

    const titleElement = document.createElement("h2");
    titleElement.textContent = article.title;

    const imageElement = document.createElement("img");
    imageElement.src = article.urlToImage;
    imageElement.alt = article.title;

    const descriptionElement = document.createElement("p");
    descriptionElement.textContent = article.description;

    const readMoreElement = document.createElement("a");
    readMoreElement.textContent = "Read More";
    readMoreElement.href = article.url;
    readMoreElement.target = "_blank";
    readMoreElement.classList.add("read-more");

    articleElement.appendChild(titleElement);
    articleElement.appendChild(imageElement);
    articleElement.appendChild(descriptionElement);
    articleElement.appendChild(readMoreElement);

    mainElement.appendChild(articleElement);
  });

  updatePagination(articles.length);
}

function updatePagination(totalArticles) {
  const totalPages = Math.ceil(totalArticles / articlesPerPage);
  const paginationElement = document.querySelector(".pagination");
  paginationElement.innerHTML = "";

  for (let i = 1; i <= totalPages; i++) {
    const pageButton = document.createElement("button");
    pageButton.textContent = i;
    pageButton.addEventListener("click", () => {
      currentArticleIndex = (i - 1) * articlesPerPage;
      updateNewsDisplay(articlesData);
    });
    paginationElement.appendChild(pageButton);
  }

  // Display fewer pagination buttons if there are only a few articles
  const maxVisibleButtons = Math.min(totalPages, 5);
  paginationElement.style.gridTemplateColumns = `repeat(${maxVisibleButtons}, 1fr)`;

  // Highlight the active pagination button
  const allButtons = document.querySelectorAll(".pagination button");
  allButtons.forEach((button) => button.classList.remove("active"));
  allButtons[currentArticleIndex / articlesPerPage].classList.add("active");
}

document.querySelector(".prev-button").addEventListener("click", () => {
  if (currentArticleIndex > 0) {
    currentArticleIndex -= articlesPerPage;
    updateNewsDisplay(articlesData);
  }
});

document.querySelector(".next-button").addEventListener("click", () => {
  if (currentArticleIndex + articlesPerPage < articlesData.length) {
    currentArticleIndex += articlesPerPage;
    updateNewsDisplay(articlesData);
  }
});

async function loadNews() {
  const articles = await fetchNews();
  updateNewsDisplay(articles);

  const categoriesResponse = await fetch(
    "https://newsapi.org/v2/top-headlines/sources?apiKey=" + API_KEY
  );
  const categoriesData = await categoriesResponse.json();
  const categories = categoriesData.sources.map((source) => source.category);
  const uniqueCategories = [...new Set(categories)];

  updateCategoryNav(uniqueCategories);
}

document.addEventListener("DOMContentLoaded", loadNews);
