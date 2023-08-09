// "use strict";

import { fetchBookInfo, fetchBookDescription, fetchBookCover } from "./api.js";
import { formatRating } from "./helpers.js";
import { bookSearchResultHTML, renderShowMoreInfo } from "./markup.js";

// variable to get user search input value and render windown
const searchBar = document.getElementById("search-book");
const renderBooks = document.querySelector(".render-book-window");

// ASYNC call for book info to display in the main window
searchBar.addEventListener("keypress", async (e) => {
  if (e.key === "Enter" && searchBar.value !== "") {
    // fetch main info about the book
    const booksData = await fetchBookInfo(searchBar.value.replaceAll(" ", "+"));
    console.log(booksData);
    // handle error if no book is found
    if (booksData.length === 0) {
      alert("no book found");
    }
    // clear the window before showing search results
    renderBooks.innerHTML = "";
    searchBar.value = "";
    // render data based on the search results
    booksData.forEach((book) => {
      // render search results on the main window
      const html = bookSearchResultHTML(book);
      renderBooks.insertAdjacentHTML("beforeend", html);
    });
  }
});

// pop up window handling
let showMore = false;
document.addEventListener("click", async (e) => {
  const btnShowMore = e.target.closest(".show-more-btn");
  const readmoreBox = document.querySelector(".read-more-box");
  const bgBlur = document.querySelector(".blurred-bg");

  if (btnShowMore) {
    const bookKey = btnShowMore.dataset.bookKey;
    const bookData = await fetchBookDescription(bookKey);

    const html = renderShowMoreInfo(bookData);

    readmoreBox.innerHTML = html;

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

// INTERSECTION OBSERVER TO DEAL WITH DATA MORE EFFECTIVELY
// const observerOptions = {
//   root: renderBooks,
//   threshold: 0.5,
//   rootMargin: "0px",
// };

// const callback = async (entries) => {
//   entries.forEach(async (entry) => {
//     if (entry.isIntersecting) {
//       const renderNewData = await fetchBookInfo(searchBar.value);

//       renderNewData.forEach((book) => {
//         const html = bookSearchResultHTML(book);
//         renderBooks.insertAdjacentHTML("beforeend", html);
//       });
//     }
//   });
// };
// const observer = new IntersectionObserver(callback, observerOptions);

// // if (document.querySelectorAll(".search-result")) {
// //   observer.observe(document.querySelectorAll(".search-result"));
// // }
// const searchResults = document.querySelectorAll(".search-result");
// searchResults.forEach((result) => {
//   observer.observe(result);
// });
