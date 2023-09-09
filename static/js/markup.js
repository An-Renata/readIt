// html markup to insert data about the book
const renderSearchResults = (book) => {
  return `
  <div class="search-result">
      ${
        book.book_cover
          ? `<img class="search-book-cover" src="${book.book_cover}" alt="book cover photo" />`
          : `<div class=no-image-box">No image</div>`
      }
    <div class="book-info-searches">
      <h3 class="book-title">${book.title}
      </h3>
      <p class="book-author-search">by ${book.author}</p>
      <p class="publish-year">
        Publish year: ${book.published}
      </p>
      <p class="pages">
        Pages: ${book.pages}
      </p>
      <button class="show-more-btn" data-book-key=${book.key}>Show more</button>
    </div>
    <div class="btn-main-book mobile-query" >
        <button class="add-btn add-want-to-read transition " data-book-key=${
          book.key
        }>
          Want to read
        </button>
        <button class="add-btn add-currently-reading transition " data-book-key=${
          book.key
        }>
          Currently reading
        </button>
      <button class="add-btn add-to-read transition " data-book-key=${
        book.key
      }>Finished</button>
    </div>
  </div>
`;
};

// HTML markup when user clicks "Show more" button
const renderShowMoreInfo = (book) => {
  return `
    <div class="show-more-container">
      <div class="read-more-book-info">
        <h3 class="read-more-title">${book.title}</h3>
        <p class="read-more-place"><span>Author: </span> ${book.author}</p>
        <p class="read-more-place"><span>Publisher: </span> ${book.publisher}</p>
        <p class="book-type"><span>Book subject:</span> ${book.subject} </p>
        <p class="characters"><span>Language:</span> ${book.language}</p>
      </div>
      <div class="read-more-info">
        <p class="description-read-more">
          ${book.description}
        </p>
      </div>
    </div>`;
};

const renderUserBookList = (book) => {
  return `<div class="finished" data-book-key=${book.book_key}>
              <div class="finished-book-info">
                <img
                  class="book-cover-img"
                  src="${book.book_cover}"
                  alt="book cover photo"
                  width="100"
                />
              <div class="book-info-finished">
                <h3 class="book-title-bookshelf">
                  ${book.title}
                </h3>
                <p class="book-author-bookshelf">${book.author
                  .split(",")
                  .join(" ")}</p>
              </div>
              </div>
                <div>
                <button class="btn btn-curr-box btn-cancel-bookshelf transition"  id="btn-delete-bookshelf" data-book-key=${
                  book.book_key
                }>
                  Delete
                </button>
              </div>
            </div>`;
};

const renderWantToReadList = (book) => {
  return `<div class="finished" id="want-to-read-box" data-book-key=${
    book.book_key
  }>
              <div class="finished-book-info">
                <img
                  class="book-cover-img"
                  src="${book.book_cover}"
                  alt="book cover photo"
                  width="100"
                />
              <div class="book-info-finished">
                <h3 class="book-title-bookshelf">
                  ${book.title}
                </h3>
                <p class="book-author-bookshelf">${book.author
                  .split(",")
                  .join(" ")}</p>
              </div>
              </div>
                 <div class="btn-main-book mobile-query" >
                    <button class="add-btn add-currently-reading transition " data-book-key=${
                      book.book_key
                    }>
                      Currently reading
                    </button>
                 <button class="btn btn-finished  btn-curr-box" id="to-read-box-finished" data-book-key=${
                   book.book_key
                 }>
                Finished!
              </button>
                  <button class="btn btn-cancel-bookshelf" data-book-key=${
                    book.book_key
                  }>
                  Delete
                  </button>
            </div>`;
};

const renderUserCurrentlyReadingMobile = (book) => {
  return `<div class="finished" data-book-key=${book.book_key}>
              <div class="finished-book-info">
                  <img
                    class="book-cover-img"
                    src="${book.book_cover}"
                    alt="book cover photo"
                    width="100"
                  />
                <div class="book-info-finished">
                  <h3 class="book-title-bookshelf">
                    ${book.title}
                  </h3>
                  <p class="book-author-bookshelf">${book.author
                    .split(",")
                    .join(" ")}</p>
                </div>
              </div>
              <div class="btn-reading-books">
              <button class="btn btn-curr-box btn-finished transition" data-book-key=${
                book.book_key
              }>
                Finished!
              </button>
              <button class="btn btn-curr-box btn-cancel transition" data-book-key=${
                book.book_key
              }>
                Cancel reading
              </button>
            </div>
          </div>`;
};

const alertBox = (box) => {
  box.style.opacity = 1; // Show the error box
  setTimeout(() => {
    box.style.opacity = 0; // Hide the error box after 3 seconds
  }, 2000);
  // return `<p>${text}</p>`;
};

export {
  renderShowMoreInfo,
  renderSearchResults,
  renderUserBookList,
  renderUserCurrentlyReadingMobile,
  alertBox,
  renderWantToReadList,
};
