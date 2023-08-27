"use strict";

import { renderMoreInfo, getBook } from "./api.js";
import {
  renderCurrentlyReading,
  renderDefaultCurrentlyReading,
  sendCurrentlyReading,
  sendFinishedBook,
  deleteFinishedBook,
} from "./helpers.js";
import {
  renderShowMoreInfo,
  renderSearchResults,
  renderUserBookList,
} from "./markup.js";

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
const btnRead = document.querySelector(".btn-read");
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
//* CURRENTLY READING BOX
// RENDER CURRENTLY READING IF THERE IS ANY AS USER LOGGED IN
const renderReadings = async function () {
  const res = await fetch("/currently-reading");
  const currentlyReading = await res.json();
  console.log(currentlyReading);

  if (currentlyReading.length > 0) {
    // remove default currently reading
    currReadingContainer.innerHTML = "";

    currentlyReading.forEach((el) => {
      renderCurrentlyReading(el, currReadingContainer);
    });
  }
};
renderReadings();

// listen for a click on the "currently-reading" button after user searches
document.addEventListener("click", async (e) => {
  // target for the btn
  const btnCurrentlyReading = e.target.closest(".add-currently-reading");

  if (!btnCurrentlyReading) return;

  // if (btnCurrentlyReading) {
  try {
    const key = btnCurrentlyReading.dataset.bookKey;
    // receive data needed for currently reading book database
    const bookData = await renderMoreInfo(key);
    // sending data about current book to the server
    await sendCurrentlyReading(bookData);

    // fetching data from the flask side about currently reading books
    const getBook = await fetch("reading");
    const book = await getBook.json();
    // take the last added book
    const lastAdded = book.slice(-1);
    // render result on the screen
    lastAdded.map((el) => {
      renderCurrentlyReading(el, currReadingContainer);
    });

    btnCurrentlyReading.innerHTML = "Added";
  } catch (err) {
    console.log("Error occured in script.js", err);
  }
  // }
  const currReading = document.querySelector(".currently-reading");

  if (currReading) {
    defaultCurrentlyReading.innerHTML = "";
  }
});

// Send data to the bookshelf when user clicks finish book button on the currently reading box
document.addEventListener("click", async (e) => {
  const btnFinished = e.target.closest(".btn-finished");
  const currReading = document.querySelector(".currently-reading");

  if (!btnFinished) return;
  // getting the key of the currently reading book box
  const key = btnFinished.dataset.bookKey;
  const bookData = await renderMoreInfo(key);
  // retrieving data about book
  console.log("KEY", key);
  // sending information to the server
  await sendFinishedBook(bookData);
  // remove currently reading book from the list
  if (currReading && currReading.dataset.bookKey === key) {
    btnFinished.closest(".currently-reading").remove();
  }
  // trim the whitespace, otherwise it still have some html left
  if (
    !currReadingContainer.textContent.trim() &&
    currReadingContainer.children.length === 0
  ) {
    currReadingContainer.innerHTML = renderDefaultCurrentlyReading();
  }
});

//* FINISHED BOOKS WINDOW
// Open window of finished books
btnRead.addEventListener("click", async function () {
  // fetch data from the server
  const res = await fetch("/bookshelf");
  const finishedBooks = await res.json();

  // delete any previous html
  renderBooks.innerHTML = "";

  finishedBooks.forEach((el) => {
    // get html markup
    const html = renderUserBookList(el);
    // insert data into main window
    renderBooks.insertAdjacentHTML("beforeend", html);
  });
});

// Delete finished book from the db
document.addEventListener("click", async function (e) {
  const btnDeleteBookshelf = e.target.closest(".btn-cancel-bookshelf");

  if (!btnDeleteBookshelf) return;
  // get key value
  const key = btnDeleteBookshelf.dataset.bookKey;
  // send to the server key and from the server delete the book info
  await deleteFinishedBook(key);

  btnDeleteBookshelf.closest(".finished").innerHTML = "";
});
