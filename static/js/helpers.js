"use strict";
//? AJAX HEADER FOR "POST" request
// Generates and return a configuration object that can be used for making a "POST" request to a server using AJAX.
// The purpose of this function is to prevent code redundancy and repetition.
const ajaxHeader = (bookInfo) => {
  return {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(bookInfo),
  };
};

//? CHECK CURRENTLY READING CONTAINER
// Function returns boolean value if the currently reading container empty: render default value, otherwise display books
const checkIfEmpty = function (container) {
  return !container.textContent.trim() && container.children.length === 0;
};

//? CURRENTLY READING BOX MARKUP
// Generate and insert HTML content into a specified container on the UI.
// It represents a "currently reading" book section, including its cover image, title, author and action buttons (finished, cancel reading)
const renderCurrentlyReading = function (book, container) {
  const html = `
   <section class="currently-reading" data-book-key=${book.book_key}>
      <div class="img-box">
        <img
          class="book-cover-img"
          src="${book.book_cover}"
          alt="book cover photo"
        />
      </div>
      <div class="book-info">
        <h3 class="book-title-curr-reading">
          ${book.title}
        </h3>
        <p class="book-author">${book.author}</p>
        <button class="btn btn-curr-box btn-finished transition" data-book-key=${book.book_key}>
          Finished!
        </button>
        <button class="btn btn-curr-box btn-cancel transition" data-book-key=${book.book_key}>
          Cancel reading
        </button>
      </div>
    </section>
  `;

  container.insertAdjacentHTML("beforeend", html);
};

//? CHECK IF BOOK CURRENTLY READING TO AVOID RECURRENCE
// Looping through currently reading container to check if the same book user wants to add are already in the list
const isBookAlreadyAdded = function (key, container, attr) {
  // Select currently reading books
  const booksInCurrReading = container.querySelectorAll(attr);
  // Compare the dataset book keys with the key from "add-currently-reading" button
  for (const book of booksInCurrReading) {
    if (book.dataset.bookKey === key) {
      return true;
    }
  }
  // If no match found, return false and render book in the UI
  return false;
};

//? DEFAULT CURRENTLY READING MARKUP
// Generate and return HTML content representing a default message with an icon for a "currently reading" section when no books are actively being read.
const renderDefaultCurrentlyReading = function () {
  return `<div class="default-currently-reading">
            <img
              src="../static/img/currently-reading.svg"
              alt="reading girl icon"
              width="100"
            />
            <p>Add books you are currently reading</p>
          </div>`;
};

//? AJAX / CURRENTLY READING
// Sending information about a currently reading book to a server. The function utilizes the fetch API to make a POST request with the provided book information.
const sendCurrentlyReading = async function (bookInfo) {
  const res = await fetch("/currently-reading", ajaxHeader(bookInfo));

  // Checks if the server response (res) indicates a successful operation.
  // If the res indicates an error, an error message is thrown.
  if (!res.ok) {
    throw new Error("Failed to send currently reading book info to the server");
  }

  return res;
};

//? AJAX / WANT TO READ
// Sending information about want to read book to a server.
// Making a post request to save book as status "want to read"
const sendWantToRead = async function (bookInfo) {
  const res = await fetch("/want-to-read", ajaxHeader(bookInfo));

  if (!res.ok) {
    throw new Error("Failed to send currently reading book info to the server");
  }
};

//? AJAX / FINISHED (btn from search results)
// Sending information about finished book to a server. The button that triggers this call is from search results "finished" button
const addFinished = async function (bookInfo) {
  const res = await fetch("/add-finished", ajaxHeader(bookInfo));

  if (!res.ok) {
    throw new Error("Failed to send Finished book");
  }

  return res;
};
//? AJAX / FINISH BUTTON from currently reading box
// Sending information about finished book to a server. The function utilizes the fetch API to make a POST request with the provided book information.
const sendFinishedBook = async function (bookInfo) {
  const res = await fetch("/finished", ajaxHeader(bookInfo));

  // Checks if the server response (res) indicates a successful operation.
  // If the res indicates an error, an error message is thrown.
  if (!res.ok) {
    throw new Error("Failed to send Finished book");
  }

  return res;
};
//? CANCEL READING BUTTON / currently reading box
// Delete book with the status of 'currently reading'
const deleteCurrentlyReading = async function (key) {
  // Posting data with the book key
  const res = await fetch("/delete-currently-reading", ajaxHeader(key));

  if (!res.ok) {
    throw new Error("Failed to delete the book");
  }

  return res;
};

//? AJAX / DELETE FROM BOOKSHELF
// Sending information about canceled book to a server. The function utilizes the fetch API to make a POST request with the provided book information.
// This function button is available in the currently reading container.
const deleteFinishedBook = async function (key) {
  const res = await fetch("/delete-finished", ajaxHeader(key));

  // Checks if the server response (res) indicates a successful operation.
  // If the res indicates an error, an error message is thrown.
  if (!res.ok) {
    throw new Error("Failed to delete the book");
  }

  return res;
};

export {
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
};
