"use strict";

const ajaxHeader = (bookInfo) => {
  return {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(bookInfo),
  };
};

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
        <h3 class="book-title">
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

const sendCurrentlyReading = async function (bookInfo) {
  const res = await fetch("/currently-reading", ajaxHeader(bookInfo));

  if (!res.ok) {
    throw new Error("Failed to send currently reading book info to the server");
  }

  return res;
};

const sendFinishedBook = async function (bookInfo) {
  const res = await fetch("/finished", ajaxHeader(bookInfo));

  if (!res.ok) {
    throw new Error("Failed to send Finished book");
  }

  return res;
};
// delete book from the bookshelf
const deleteFinishedBook = async function (key) {
  const res = await fetch("/delete-finished", ajaxHeader(key));

  if (!res.ok) {
    throw new Error("Failed to delete the book");
  }

  return res;
};

// delete book from currently reading container
const deleteCurrentlyReading = async function (key) {
  const res = await fetch("/delete-currently-reading", ajaxHeader(key));

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
};
