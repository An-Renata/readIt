"use strict";

import { renderMoreInfo, getBook } from "./api.js";
import {
  renderCurrentlyReading,
  renderDefaultCurrentlyReading,
  sendCurrentlyReading,
  sendFinishedBook,
  deleteFinishedBook,
  deleteCurrentlyReading,
  sendWantToRead,
  checkIfEmpty,
  addFinished,
  isBookAlreadyAdded,
} from "./helpers.js";
import {
  renderShowMoreInfo,
  renderSearchResults,
  renderUserBookList,
  renderUserCurrentlyReadingMobile,
  alertBox,
  renderWantToReadList,
  renderNoBooksInTheList,
} from "./markup.js";

// variable to get user search input value and render windown
const searchBar = document.getElementById("search-book");
const renderBooks = document.querySelector(".render-book-window");
const spinner = document.querySelector(".spinner");
const currReadingContainer = document.querySelector(
  ".currently-reading-container"
);
const btnRead = document.querySelector(".btn-read");
const btnWantToRead = document.querySelector(".btn-want-to-read");
const btnCurrReadingMobile = document.querySelector(".btn-currently-reading");
const errorBox = document.querySelector(".error-box");

let currentItems = 2;
let previuosItems = 0;
const loadMore = document.querySelector(".load-more");

// loadMoref();
//? SEARCH BAR QUERY
// ASYNC call for book info to display in the main window
searchBar.addEventListener("keypress", async (e) => {
  // Listen for a key "Enter" and do not call following code if the input is empty
  if (e.key === "Enter" && searchBar.value !== "") {
    currentItems = 10;
    previuosItems = 0;
    // Empty any previous HTML markup if any
    loadMore.style.display = "block";

    renderBooks.innerHTML = "";
    // Loader is on while searching for results
    spinner.classList.add("loader");
    try {
      // Query for a book.
      // getBook function fetches a book based on the user input value
      const searchResults = await getBook(searchBar.value);
      console.log(searchResults.length);
      // Empty search bar value after search results are shown
      searchBar.value = "";
      // Render search results in the UI as unordered list
      //!!!!!!!!!!!!
      console.log(searchResults);
      let topTen = searchResults.slice(previuosItems, currentItems);

      topTen.forEach((book) => {
        // Returns HTML markup
        const html = renderSearchResults(book);

        renderBooks.insertAdjacentHTML("beforeend", html);
        // Remove spinner after search results shown
        spinner.classList.remove("loader");
      });

      console.log("AFTER first render : ", previuosItems, currentItems);

      loadMore.addEventListener("click", () => {
        previuosItems += 10;
        currentItems += 10;

        const loadMoreEl = searchResults.slice(previuosItems, currentItems);
        // loadMore.addEventListener("click", () => {
        loadMoreEl.forEach((book) => {
          // Returns HTML markup
          const html = renderSearchResults(book);

          renderBooks.insertAdjacentHTML("beforeend", html);
          // Remove spinner after search results shown
          spinner.classList.remove("loader");
        });
        console.log(currentItems);
        if (
          currentItems === searchResults.length ||
          currentItems > searchResults.length
        ) {
          loadMore.style.display = "none";
          return;
        }
      });
    } catch (err) {
      spinner.classList.remove("loader");
      renderBooks.innerHTML = `No books found. Error occured searching for book.`;
      alertBox(renderBooks);
      throw new Error("Error occured searching for books", err);
    }
  }
});

//? SHOW MORE BUTTON
// Handle pop up window when user clicks on the show more button
let showMore = false;
document.addEventListener("click", async (e) => {
  const btnShowMore = e.target.closest(".show-more-btn");
  const readmoreBox = document.querySelector(".read-more-box");
  const bgBlur = document.querySelector(".blurred-bg");

  // If the user click on show more button add spinner while information is loading
  if (btnShowMore) {
    spinner.classList.add("loader");
    try {
      // Get the dataset key about the current book
      const key = btnShowMore.dataset.bookKey;
      // Get more information about the book
      // It includes descriotion, language, publisher etc. To get this information the another API call is needed
      const bookData = await renderMoreInfo(key);
      // Function returns an html layout to render it on the top of the app window
      const html = renderShowMoreInfo(bookData);

      // Place html and blurred background around the html box
      readmoreBox.innerHTML = html;
      bgBlur.classList.add("active");
      readmoreBox.style.display = "block";
      spinner.classList.remove("loader");
      showMore = true;
    } catch (err) {
      // Remove loader and render the error message in front of the main app window
      spinner.classList.remove("loader");

      errorBox.innerHTML = "Something went wrong! Try again later.";
      // Function sets timer and changes opacity of the box
      alertBox(errorBox);
      throw new Error("Something went wrong! Try again later", err);
    }
  }
  // if user clicks outside the box the window will close
  if (showMore && e.target.classList.contains("active")) {
    bgBlur.classList.remove("active");
    readmoreBox.style.display = "none";
    showMore = false;
  }
});

//? CURRENTLY READING BOX FROM DB
// Render currently reading books if there is any as user loogged in
// Books are taken from the database with status: currently reading
const renderReadings = async function () {
  // Get books the user currently reads from the following route
  const res = await fetch("/currently-reading");
  // Get a response of JSON content-type
  const currentlyReading = await res.json();

  // Setting default HTML layout if there is no currently reading books
  currReadingContainer.innerHTML = renderDefaultCurrentlyReading();
  // Condition to check what is the lenght of the array
  // If array length > 0, render those books in the UI
  if (currentlyReading.length > 0) {
    // Remove default currently reading HTML layout
    // The default HTML layout would be replaces by the books
    currReadingContainer.innerHTML = "";
    // Render all the books from the array using forEach
    // renderCurrentlyReading() returns and HTML layout which accepts el and container as parameters
    currentlyReading.forEach((el) => {
      renderCurrentlyReading(el, currReadingContainer);
    });
  }
};
// Calling this function to trigget it when the user is logged in
renderReadings();

//? SEARCH QUERY/ ADD CURRENTLY READING
// Listen for a click on the "currently-reading" button after user search input
document.addEventListener("click", async (e) => {
  // Target for the btn
  const btnCurrentlyReading = e.target.closest(".add-currently-reading");
  const defaultHTML = document.querySelector(".default-currently-reading");

  if (!btnCurrentlyReading) return;

  spinner.classList.add("loader");

  try {
    // Get the dataset book key from the selected book
    const key = btnCurrentlyReading.dataset.bookKey;
    // Call function to compare currently-reading books book_key with the key value
    if (isBookAlreadyAdded(key, currReadingContainer, ".currently-reading")) {
      // Select div container to store error message
      errorBox.innerHTML =
        "This book is already in the currently reading list!";
      // Function sets timer and changes opacity of the box
      alertBox(errorBox);

      spinner.classList.remove("loader");
      return;
      // Checking if currently reading button is clicked in the want-to-read window.
      // If it's cliked there, it should delete the info about the book in the container and the following code is rendered
    } else if (isBookAlreadyAdded(key, renderBooks, ".finished")) {
      if (btnCurrentlyReading.closest(".finished")) {
        btnCurrentlyReading.closest(".finished").remove();

        // If no books left in the want to read container, render default HTML layout
        if (checkIfEmpty(renderBooks)) {
          renderBooks.innerHTML = renderNoBooksInTheList();
        }
      }
    }
    // Get info about the book to save in the database
    const bookData = await renderMoreInfo(key);
    // Send data about selected book to the server and save it
    await sendCurrentlyReading(bookData);
    // Fetching data from the server side about currently reading books to render on the UI
    const getBook = await fetch("/reading");
    const books = await getBook.json();
    // Take the last added book from the list
    const lastAdded = books.slice(-1);
    // Render result in the UI
    lastAdded.forEach((book) => {
      renderCurrentlyReading(book, currReadingContainer);
    });

    // Handle default HMTL markup if there is the list of books
    if (defaultHTML) {
      defaultHTML.remove();
    }
    spinner.classList.remove("loader");
  } catch (err) {
    renderBooks.innerHTML =
      "An error occured while adding the book. Please try again later!";
    alertBox(renderBooks);
    throw new Error("An error occured", err);
  }
});

//? SEARCH QUERY / WANT TO READ
// Function to handle want to read book and save it on the want to read shelf
document.addEventListener("click", async (e) => {
  // Target for the button
  const wantToRead = e.target.closest(".add-want-to-read");
  // Create variable of currently-reading book section
  // Need to check if a selected book is not on currently reading list, if yes: update the UI
  if (!wantToRead) return;

  spinner.classList.add("loader");

  try {
    const key = wantToRead.dataset.bookKey;
    // Collecting data about selected book
    const bookData = await renderMoreInfo(key);
    // Sending collected data to the server
    await sendWantToRead(bookData);

    // If Book is already on the currently reading list and user clicks want-to-read, remove the book from currently while in the backend it is inserted in "want to read" shelf
    if (isBookAlreadyAdded(key, currReadingContainer, ".currently-reading")) {
      // Select all currently-reading sections
      const removeEl = document.querySelectorAll(".currently-reading");
      // Loop through each of them and search for the same key
      for (const book of removeEl) {
        if (book.dataset.bookKey === key) {
          book.remove();
        }
      }
    }
    // Display box when user clicks on the button
    errorBox.innerHTML = "Added";
    alertBox(errorBox);

    // Function returns boolean value if its true this means that the currReadingContainer is empty so the default HTML markup should be rendered
    if (checkIfEmpty(currReadingContainer)) {
      currReadingContainer.innerHTML = renderDefaultCurrentlyReading();
    }

    spinner.classList.remove("loader");
  } catch (err) {
    renderBooks.innerHTML =
      "An error occured while adding the book. Please try again later!";
    alertBox(renderBooks);
    throw new Error("An error occured", err);
  }
});

//? SEARCH QUERY / FINISHED
// Send data to the bookshelf when user clicks finish button in the rendered rsearch results
document.addEventListener("click", async (e) => {
  // look for the closest button Finished
  const read = e.target.closest(".add-to-read");

  if (!read) return;
  // Add loader till try block is done executing
  spinner.classList.add("loader");
  try {
    const key = read.dataset.bookKey;
    // Getting data about the book from the fetch function
    const bookData = await renderMoreInfo(key);
    // Send book data to the server side to insert a new book or update its status
    await addFinished(bookData);

    if (isBookAlreadyAdded(key, currReadingContainer, ".currently-reading")) {
      // Select all currently-reading sections
      const removeEl = document.querySelectorAll(".currently-reading");
      // Loop through each of them and search for the same key
      for (const book of removeEl) {
        if (book.dataset.bookKey === key) {
          book.remove();
        }
      }
    }
    if (checkIfEmpty(currReadingContainer)) {
      currReadingContainer.innerHTML = renderDefaultCurrentlyReading();
    }
    // Remove spinner when book is added/updated
    spinner.classList.remove("loader");

    // Display box when user clicks on the button
    errorBox.innerHTML = "Added";
    alertBox(errorBox);
  } catch (err) {
    renderBooks.innerHTML =
      "An error occured while adding the book. Please try again later!";
    alertBox(renderBooks);
    spinner.classList.remove("loader");
    throw new Error("An error occured", err);
  }
});

//? FINISH BUTTON IN CURRENTLY READING CONTAINER
// Send data to the bookshelf when user clicks finish book button in the currently reading box
// Waiting for a user to click on one of the finish buttons
document.addEventListener("click", async (e) => {
  // Store into variables to avoid repetitive code
  const btnFinished = e.target.closest(".btn-finished");

  // Don't throw an error if the btnFinished isn't clicked
  if (!btnFinished) return;

  // Getting the dataset key of the currently reading book box
  const key = btnFinished.dataset.bookKey;
  // Sending information about the to the server with the book_key
  await sendFinishedBook(key);
  // Remove currently reading book from the list in the UI
  if (isBookAlreadyAdded(key, currReadingContainer, ".currently-reading")) {
    if (btnFinished.closest(".currently-reading")) {
      btnFinished.closest(".currently-reading").remove();
    }
    // Check if finish button is in currently-reading box, or want-to-read box
  }
  if (isBookAlreadyAdded(key, renderBooks, ".finished")) {
    if (btnFinished.closest(".finished")) {
      btnFinished.closest(".finished").remove();

      // If no books left in the want to read container, render default HTML layout
      if (checkIfEmpty(renderBooks)) {
        renderBooks.innerHTML = renderNoBooksInTheList();
      }
    }
  }
  // Function returns boolean value if its true this means that the currReadingContainer is empty so the default HTML markup should be rendered
  if (checkIfEmpty(currReadingContainer)) {
    currReadingContainer.innerHTML = renderDefaultCurrentlyReading();
  }
});

//? CANCEL BUTTON IN CURRENTLY READING CONTAINER
// Cancel/delete from the list the currently reading book
// This means, that the user didn't finish the book and want to delete it from the list
document.addEventListener("click", async function (e) {
  const btnCancel = e.target.closest(".btn-cancel");

  if (!btnCancel) return;
  // Getting book key to send information about the book to the server
  const key = btnCancel.dataset.bookKey;
  // Send data to delete the book from currently reading list
  await deleteCurrentlyReading(key);
  // Update the UI and remove the selected book box
  // If user on the phone, remove from the reading box list
  if (btnCancel.closest(".currently-reading")) {
    btnCancel.closest(".currently-reading").remove();
  } else {
    btnCancel.closest(".finished").remove();
  }
  // btnCancel.closest(".currently-reading").remove();

  // Handle condition if there is no currently reading books, render default HTML markup
  if (
    !currReadingContainer.textContent.trim() &&
    currReadingContainer.children.length === 0
  ) {
    currReadingContainer.innerHTML = renderDefaultCurrentlyReading();
  }
});

//? FINISHED BOOKS WINDOW (BOOKSHELF)
// Open window of finished books
// Render it in the main window of the app
btnRead.addEventListener("click", async function () {
  // Fetch data from the server with a list of books
  const res = await fetch("/bookshelf");
  const finishedBooks = await res.json();

  renderBooks.innerHTML = renderNoBooksInTheList();
  // Delete any previous html if there is any
  // It could display users search results.
  // The previous HTML should be deleted to insert the users readings
  if (finishedBooks.length > 0) {
    renderBooks.innerHTML = "";
    // Loop through all book elements to render the result in the UI
    finishedBooks.forEach((el) => {
      // Function returns HTML layout as <li><li>
      const html = renderUserBookList(el);
      // Render data in the main window of the app
      renderBooks.insertAdjacentHTML("beforeend", html);
    });
  }
});

//? DELETE BOOK FROM BOOKSHELF
// Send book_key to the server and deletes the selected book from the database
// Update the UI, remove the selected book
document.addEventListener("click", async function (e) {
  const btnDeleteBookshelf = e.target.closest(".btn-cancel-bookshelf");
  // Handle errors if btn isn't clicked
  if (!btnDeleteBookshelf) return;
  // Get book key from the button
  const key = btnDeleteBookshelf.dataset.bookKey;
  // Sending selected book key to the sever where the books is deleted from the list
  await deleteFinishedBook(key);

  // Delete the selected book whole innerHTML
  btnDeleteBookshelf.closest(".finished")?.remove();
  // If no books left in the bookshelf, render default HTML layout
  if (checkIfEmpty(renderBooks)) {
    renderBooks.innerHTML = renderNoBooksInTheList();
  }
});

//? WANT TO READ CONTAINER
// Get list of books user wants to read
// Update the UI
btnWantToRead.addEventListener("click", async function () {
  // Get response from the server
  const res = await fetch("/want-to-read");
  // JSON format data
  const toReadBook = await res.json();

  // Empty renderBooks HTML before showing want to read window if a user used search bar or the bookshelf was opened
  renderBooks.innerHTML = renderNoBooksInTheList();

  if (toReadBook.length > 0) {
    // Remove previous default HTML layout
    renderBooks.innerHTML = "";
    // Loop through the list of books to display them as <li></li> elements
    toReadBook.forEach((el) => {
      // Function returns HTML markup as unordered list
      const html = renderWantToReadList(el);
      console.log(el);
      // Insert HTML markup to the UI
      renderBooks.insertAdjacentHTML("beforeend", html);
    });
  }
});

//? CURRENTLY READING CONTAINER (MOBILE VERSION)
// Open currently reading books in separate window like bookshefl and want to read boxes
btnCurrReadingMobile.addEventListener("click", async function () {
  // Fetch books user is currently reading from the server
  const res = await fetch("/reading");
  const readingNow = await res.json();

  // Empty renderBooks HTML before showing want to read window if a user used search bar or the bookshelf was opened
  renderBooks.innerHTML = "";

  if (readingNow.length > 0) {
    readingNow.forEach((el) => {
      // Function returns HTML markup as unordered list
      const html = renderUserCurrentlyReadingMobile(el);
      // Insert HTML markup to the UI
      renderBooks.insertAdjacentHTML("beforeend", html);
    });
  } else {
    renderBooks.innerHTML = renderNoBooksInTheList();
  }
});
