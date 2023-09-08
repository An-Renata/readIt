// html markup to insert data about the book
const renderSearchResults = (book) => {
  return `
  <li class="search-result">
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
  </li>
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
  return `<li class="finished" data-book-key=${book.book_key}>
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
                <button class="btn btn-curr-box btn-cancel-bookshelf transition" data-book-key=${
                  book.book_key
                }>
                  Delete
                </button>
              </div>
            </li>`;
};
export { renderShowMoreInfo, renderSearchResults, renderUserBookList };
