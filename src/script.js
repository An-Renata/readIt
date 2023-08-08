// "use strict";

import { fetchBookInfo, fetchBookDescription, fetchBookCover } from "./api.js";
import { formatRating } from "./helpers.js";
import { bookSearchResultHTML } from "./markup.js";

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

let showMore = false;
document.addEventListener("click", (e) => {
  const btnShowMore = e.target.closest(".show-more-btn");
  const readmoreBox = document.querySelector(".read-more-box");
  const bgBlur = document.querySelector(".blurred-bg");
  // handle error

  if (btnShowMore) {
    bgBlur.classList.add("active");
    readmoreBox.style.display = "block";
    showMore = true;
  }

  if (showMore && e.target.classList.contains("active")) {
    bgBlur.classList.remove("active");
    readmoreBox.style.display = "none";
    showMore = false;
  }
});
