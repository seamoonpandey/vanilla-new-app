# Guide to this app

## Step 1 : Setup the project structure

Create a new folder for your project and name it something like "NewsApp." Inside the "NewsApp" folder, create the following files: `index.html`, `styles.css`, `script.js`, and `config.js`.

## Step 2 : Design HTML structure

### The initial boilerprete and some more tags

```html

<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>News Web Application</title>
    <link rel="stylesheet" href="styles.css">
</head>

<body>

    <header>
    </header>

    <main>
    </main>

    <footer>
    </footer>
   
</body>

</html>

```

### Linking the script and the css

```html

//inside the head
<link rel="stylesheet" href="styles.css">

//all other code 

//at the end just above the body tag
<script src="config.js" defer></script>
<script src="script.js" defer></script>

```

### Our css is still empty we will see that a bit later on and we are adding more things in the html structure since we need something more to it

```html

    <header>
        <nav>
            <div class="navbar">
                <h1><a href="/">i-CES</a></h1>
            </div>
        </nav>
    </header>

    //all the other things are same 

    <footer>
        <p>&copy; 2023 Ices World News</p>
    </footer>    

```

### Let us add some styling in `styles.css`

```css

header {
  background-color: #333;
  color: #fff;
  padding: 10px;
}

.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

footer {
  background-color: #333;
  color: #fff;
  text-align: center;
  padding: 10px;
}

```

## Step 3 : Adding javascript to the app

```javascript

let articlesData = [];

async function fetchNews() {
  const API_ENDPOINT = `https://newsapi.org/v2/everything?domains=wsj.com&apiKey=${API_KEY}`;

  try {
    const response = await fetch(API_ENDPOINT);
    const data = await response.json();
    articlesData = data.articles;
    return articlesData;
  } catch (error) {
    console.error('Error fetching news:', error);
    return [];
  }
}

function updateNewsDisplay(articles) {
  const mainElement = document.querySelector('main');
  mainElement.innerHTML = '';

  const currentArticles = articles;
  currentArticles.forEach(article => {
    const articleElement = document.createElement('div');
    articleElement.classList.add('article');

    const titleElement = document.createElement('h2');
    titleElement.textContent = article.title;

    const imageElement = document.createElement('img');
    imageElement.src = article.urlToImage;
    imageElement.alt = article.title;
    
    const descriptionElement = document.createElement('p');
    descriptionElement.textContent = article.description;

    const readMoreElement = document.createElement('a');
    readMoreElement.textContent = 'Read More';
    readMoreElement.href = article.url;
    readMoreElement.target = '_blank';
    readMoreElement.classList.add('read-more');

    articleElement.appendChild(titleElement);
    articleElement.appendChild(imageElement);
    articleElement.appendChild(descriptionElement);
    articleElement.appendChild(readMoreElement);

    mainElement.appendChild(articleElement);
  });

}

async function loadNews() {
  const articles = await fetchNews();
  updateNewsDisplay(articles);
}

```

## Step 4 : Now adding more styling

```css

main {
  margin: auto;
  padding: 20px;
  display: grid;
  grid-template-columns: repeat(3, minmax(300px, 1fr));
  gap: 20px;
}

.article {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  border: 1px solid #ccc;
  border-radius: 5px;
  padding: 2rem;
}

.article h2 {
  margin: 0;
  border-bottom: 2px solid;
}

.article p {
  margin-top: 5px;
}

.article .read-more {
  width: fit-content;
  color: #fff;
  background-color: #007bff;
  padding: 5px 10px;
  border-radius: 5px;
  text-decoration: none;
  display: inline-block;
  margin-top: 10px;
}

```

## Step 5 : We are almost done with the app just giving the final touch adding the pagination

```javascript

let currentArticleIndex = 0;
const articlesPerPage = 6;
let selectedCategory = '';
let articlesData = [];

```

### Update the current articles with 

```js

const currentArticles = articles.slice(currentArticleIndex, currentArticleIndex + articlesPerPage);

```

### Due to this we will see just 6 articles loading for that we need pagination so in `index.html`

#### We added the piece of code for a nice pagination

```html

    <div class="pagination-container">
        <button class="prev-button">Previous</button>
        <div class="pagination">
            <!-- This contains pagination number boxes -->
        </div>
        <button class="next-button">Next</button>
    </div>

```

### We added the pagination container so we need to add more in `styles.css`

```css

.pagination-container {
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 5rem;
}

.pagination {
  display: flex;
  gap: 10px;
}


.prev-button,
.next-button,
.pagination button {
  background-color: #333;
  color: #fff;
  border: none;
  padding: 8px 12px;
  border-radius: 5px;
  cursor: pointer;
  margin: 1rem;
}

```

### Now the turn for `script.js`

```js

function updatePagination(totalArticles) {
  const totalPages = Math.ceil(totalArticles / articlesPerPage);
  const paginationElement = document.querySelector('.pagination');
  paginationElement.innerHTML = '';

  for (let i = 1; i <= totalPages; i++) {
    const pageButton = document.createElement('button');
    pageButton.textContent = i;
    pageButton.addEventListener('click', () => {
      currentArticleIndex = (i - 1) * articlesPerPage;
      updateNewsDisplay(articlesData);
    });
    paginationElement.appendChild(pageButton);
  }

  // Display fewer pagination buttons if there are only a few articles
  const maxVisibleButtons = Math.min(totalPages, 5);
  paginationElement.style.gridTemplateColumns = `repeat(${maxVisibleButtons}, 1fr)`;

  // Highlight the active pagination button
  const allButtons = document.querySelectorAll('.pagination button');
  allButtons.forEach(button => button.classList.remove('active'));
  allButtons[currentArticleIndex / articlesPerPage].classList.add('active');
}

```

```js

//at the end of the updateNewsDisplay function

updatePagination(articles.length);

```

## Final touch

```js

  // Display fewer pagination buttons if there are only a few articles
  const maxVisibleButtons = Math.min(totalPages, 5);
  paginationElement.style.gridTemplateColumns = `repeat(${maxVisibleButtons}, 1fr)`;

  // Highlight the active pagination button
  const allButtons = document.querySelectorAll('.pagination button');
  allButtons.forEach(button => button.classList.remove('active'));
  allButtons[currentArticleIndex / articlesPerPage].classList.add('active');
}

document.querySelector('.prev-button').addEventListener('click', () => {
  if (currentArticleIndex > 0) {
    currentArticleIndex -= articlesPerPage;
    updateNewsDisplay(articlesData);
  }
});

document.querySelector('.next-button').addEventListener('click', () => {
  if (currentArticleIndex + articlesPerPage < articlesData.length) {
    currentArticleIndex += articlesPerPage;
    updateNewsDisplay(articlesData);
  }
});

async function loadNews() {
  const articles = await fetchNews();
  updateNewsDisplay(articles);

  const categoriesResponse = await fetch('https://newsapi.org/v2/top-headlines/sources?apiKey=' + API_KEY);
  const categoriesData = await categoriesResponse.json();
  const categories = categoriesData.sources.map(source => source.category);
  const uniqueCategories = [...new Set(categories)];

  updateCategoryNav(uniqueCategories);
}

document.addEventListener('DOMContentLoaded', loadNews);

```

```css

.pagination button.active {
  background-color: #007bff;
}

@media (max-width: 1024px) {
  main {
    grid-template-columns: repeat(2, minmax(300px, 1fr));
  }
}

@media (max-width: 768px) {
  body {
    overflow-x: hidden;
  }
  main {
    display: flex;
    flex-direction: column;
    gap: 3rem;
  }
  .pagination-container {
    justify-content: space-between;
  }
  .pagination,
  .category-nav {
    display: none;
  }
}


```

this completes the app
