import { formatRating } from "./helpers.js";

// html markup to insert data about the book
const bookSearchResultHTML = (book) => {
  return `
  <div class="search-result">
    <div>
      <img
        class="search-book-cover"
      //  src="${book.coverURL ? book.coverURL : "#"}"
        alt="book cover photo"
      />
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
      <button class="show-more-btn">Show more</button>
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
  </div>
`;
};

export { bookSearchResultHTML };
