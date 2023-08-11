"use strict";

// initiate currently reading list as empty array
let currReading = [];

const renderCurrentlyReading = function (book, container) {
  const html = `
   <section class="currently-reading">
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
        <button class="btn btn-curr-box btn-finished transition">
          Finished!
        </button>
        <button class="btn btn-curr-box btn-cancel transition">
          Cancel reading
        </button>
      </div>
    </section>
  `;

  container.insertAdjacentHTML("beforeend", html);
};

export { currReading, renderCurrentlyReading };
