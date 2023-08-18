"use strict";

import { renderMoreInfo, getBook } from "./api.js";
import { renderCurrentlyReading, sendCurrentlyReading } from "./helpers.js";
import { renderShowMoreInfo, renderSearchResults } from "./markup.js";

// variable to get user search input value and render windown
const searchBar = document.getElementById("search-book");
const renderBooks = document.querySelector(".render-book-window");
const spinner = document.querySelector(".spinner");
const currReadingContainer = document.querySelector(
  ".currently-reading-container"
);
const defaultCurrentlyReading = document.querySelector(
  ".default-currently-reading"
);
// ASYNC call for book info to display in the main window
searchBar.addEventListener("keypress", async (e) => {
  if (e.key === "Enter" && searchBar.value !== "") {
    try {
      spinner.classList.add("loader");

      const searchResults = await getBook(searchBar.value);

      if (searchResults.length === 0) {
        alert("No book found!");
        spinner.classList.remove("loader");
        return;
      }
      renderBooks.innerHTML = "";
      searchBar.value = "";

      searchResults.forEach((book) => {
        const html = renderSearchResults(book);
        renderBooks.insertAdjacentHTML("beforeend", html);
        spinner.classList.remove("loader");
      });
    } catch (err) {
      console.log("error occured, ", err);
    }
  }
});

// pop up window handling
let showMore = false;
document.addEventListener("click", async (e) => {
  const btnShowMore = e.target.closest(".show-more-btn");
  const readmoreBox = document.querySelector(".read-more-box");
  const bgBlur = document.querySelector(".blurred-bg");

  if (btnShowMore) {
    try {
      // add spinner
      spinner.classList.add("loader");
      const key = btnShowMore.dataset.bookKey;

      const bookData = await renderMoreInfo(key);

      const html = renderShowMoreInfo(bookData);

      readmoreBox.innerHTML = html;

      bgBlur.classList.add("active");
      readmoreBox.style.display = "block";

      showMore = true;
    } catch (err) {
      console.log("Error occured", err);
    }
  }
  // if user clicks outside the box the window will close
  if (showMore && e.target.classList.contains("active")) {
    bgBlur.classList.remove("active");
    readmoreBox.style.display = "none";
    spinner.classList.remove("loader");
    showMore = false;
  }
});

// listen for a click on the "currently-reading" button after user searches
document.addEventListener("click", async (e) => {
  // target for the btn
  const btnCurrentlyReading = e.target.closest(".add-currently-reading");

  if (!btnCurrentlyReading) {
    return;
  }

  if (btnCurrentlyReading) {
    try {
      const key = btnCurrentlyReading.dataset.bookKey;
      // receive data needed for currently reading book database
      const bookData = await renderMoreInfo(key);

      // sending data about current book to the server
      await sendCurrentlyReading(bookData);
      // render currently reading data to the UI

      renderCurrentlyReading(bookData, currReadingContainer);
    } catch (err) {
      console.log("Error occured", err);
    }
  }
  const currReading = document.querySelector(".currently-reading");
  // if there is
  if (currReading) {
    // empty default inner html is there are books added
    defaultCurrentlyReading.innerHTML = "";
  }
});
