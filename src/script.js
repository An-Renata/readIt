// "use strict";
// variable to get user search input value
// renderBooks window to render user searches
const search = document.getElementById("search-book");
const renderBooks = document.querySelector(".render-book-window");

// ASYNC call for book info to display in the main window
search.addEventListener("keypress", async (e) => {
  // listen for enter key
  if (e.key === "Enter" && search.value !== "") {
    // fetch main info about the book
    const booksData = await fetchBookInfo(search.value);

    // clear the window before showing search results
    renderBooks.innerHTML = "";

    // render data based on the search results
    booksData.forEach(async (book) => {
      // fetch book description and book cover info using information from the main booksData values
      const bookDescription = await fetchBookDescription(book.book_key);
      const bookCover = await fetchBookCover(book.cover_id);

      book.description = bookDescription.description;
      book.coverURL = bookCover.url;

      // render search results on the main window
      const html = bookSearchResultHTML(book);

      renderBooks.insertAdjacentHTML("beforeend", html);
    });
  }
});

// async function to fetch main info about the book, return as an object
const fetchBookInfo = async function (searchStr) {
  const response = await fetch(
    `https://openlibrary.org/search.json?title=${searchStr}`
  );
  // OL21552900M
  const data = await response.json();
  console.log(data);
  const booksData = data.docs.map((book) => ({
    book_key: book.key,
    title: book.title ?? "Not found",
    author_name: book.author_name?.[0] ?? "Unknown",
    publish_year: book.first_publish_year ?? "Unknown",
    ratings_avg: book.ratings_average ?? "N/A",
    cover_id: book.cover_edition_key,
  }));

  return booksData;
};

// fetch description info about the book, using the book_key from fetchBookInfo
const fetchBookDescription = async function (bookKey) {
  const response = await fetch(`https://openlibrary.org${bookKey}.json`);

  const data = await response.json();

  const descriptionInfo = {
    description: data.description ?? "No description availabe",
  };

  return descriptionInfo;
};

// fetch book cover jpg
const fetchBookCover = async function (keyValue) {
  const response = await fetch(
    `https://covers.openlibrary.org/b/olid/${keyValue}-M.jpg`
  );

  return response;
};

// html markup to insert data about the book
const bookSearchResultHTML = (book) => {
  return `
  <div class="search-result">
    <div>
      <img
        class="search-book-cover"
        src="${book.coverURL}"
        alt="book cover photo"
      />
    </div>
      <div class="book-info-searches">
        <h3 class="book-title">
          ${book.title}
        </h3>
        <p class="book-author-search">${book.author_name}</p>
        <p class="book-description-search">
          ${book.description}
        </p>
        <p class="search-book-rating">
          ⭐⭐⭐⭐<span class="search-book-rating-num">${book.ratings_avg}</span>
        </p>
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
