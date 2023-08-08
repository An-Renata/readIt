// "use strict";

import { fetchBookInfo, fetchBookDescription, fetchBookCover } from "./api.js";
import { formatRating } from "./helpers.js";

// ! use it when show more btn is clicked
// const bookDescription = await fetchBookDescription(book.book_key);
// book.description = bookDescription.description;

// variable to get user search input value and render windown
const searchBar = document.getElementById("search-book");
const renderBooks = document.querySelector(".render-book-window");

// ASYNC call for book info to display in the main window
searchBar.addEventListener("keypress", async (e) => {
  if (e.key === "Enter" && searchBar.value !== "") {
    // fetch main info about the book
    const booksData = await fetchBookInfo(searchBar.value);

    // clear the window before showing search results
    renderBooks.innerHTML = "";

    // render data based on the search results
    booksData.forEach(async (book) => {
      // fetch book description and book cover info using information from the main booksData values
      const bookCover = await fetchBookCover(book.cover_id);
      book.coverURL = bookCover.url;

      // render search results on the main window
      const html = bookSearchResultHTML(book);

      renderBooks.insertAdjacentHTML("beforeend", html);
    });
  }
});

// html markup to insert data about the book
const bookSearchResultHTML = (book) => {
  return `
  <div class="search-result">
    <div>
      <img
        class="search-book-cover"
      //  src="${book.coverURL ? book.coverURL : "#"}"
        alt="book cover photo"
      />
    </div>
    <div class="book-info-searches">
      <h3 class="book-title">${book.title}
      </h3>
      <p class="book-author-search">by ${book.author_name}</p>
      <p class="publish-year">
        Publish year: ${book.publish_year}
      </p>
      <p class="search-book-rating">
        ⭐⭐⭐⭐<span class="search-book-rating-num">${formatRating(
          book.ratings_avg
        )}</span>
      </p>
      <button class="show-more-btn">Show more</button>
    </div>
    <div class="btn-main-book">
      <button class="add-btn add-want-to-read transition">
        Wanto to read
      </button>
      <button class="add-btn add-currently-reading transition">
        Currently reading
      </button>
      <button class="add-btn add-to-read transition">Finished</button>
    </div>
  </div>
`;
};
