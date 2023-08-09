import { formatRating } from "./helpers.js";

// html markup to insert data about the book
const bookSearchResultHTML = (book) => {
  return `
  <li class="search-result">
    <div>
      ${
        book.coverURL
          ? `<img class="search-book-cover" src="${book.coverURL}" alt="book cover photo" />`
          : `<div class=no-image-box">No image</div>`
      }
    </div>
    <div class="book-info-searches">
      <h3 class="book-title">${book.title}
      </h3>
      <p class="book-author-search">by ${book.author_name}</p>
      <p class="publish-year">
        Publish year: ${book.publish_year}
      </p>
      <p class="search-book-rating">
        ⭐⭐⭐⭐<span class="search-book-rating-num">${formatRating(
          book.ratings_avg
        )}</span>
      </p>
      <button class="show-more-btn"  data-book-key=${
        book.book_key
      }>Show more</button>
    </div>
    <div class="btn-main-book">
      <button class="add-btn add-want-to-read transition">
        Wanto to read
      </button>
      <button class="add-btn add-currently-reading transition">
        Currently reading
      </button>
      <button class="add-btn add-to-read transition">Finished</button>
    </div>
  </li>
`;
};

const renderShowMoreInfo = (book) => {
  return `
    <div class="show-more-container">
      <div class="read-more-book-info">
        <h3 class="read-more-title">${book.title}</h3>
        <p class="read-more-place"><span>Took place:</span> ${book.place}</p>
        <p class="book-type"><span>Book subject:</span> ${book.type} </p>
        <p class="characters"><span>Characters:</span> ${book.characters}</p>
      </div>
      <div class="read-more-info">
        <p class="description-read-more">
          ${book.description}
        </p>
      </div>
    </div>`;
};
export { bookSearchResultHTML, renderShowMoreInfo };
