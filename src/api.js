"use strict";

// async function to fetch main info about the book, return as an object
const fetchBookInfo = async function (searchStr) {
  try {
    const response = await fetch(
      `https://openlibrary.org/search.json?title=${searchStr}&limit=5`
    );

    const data = await response.json();

    const booksData = await Promise.all(
      data.docs.map(async (book) => {
        const descriptionInfo = await fetchBookDescription(book.key);
        const bookCover = await fetchBookCover(book.cover_edition_key);

        const bookData = {
          book_key: book.key ?? "N/A",
          title: book.title ?? "N/A",
          author_name: book.author_name?.[0] ?? "N/A",
          author_key: book.author_key ?? "N/A",
          publish_year: book.first_publish_year ?? "N/A",
          ratings_avg: book.ratings_average ?? "N/A",
          cover_id: book.cover_edition_key ?? "N/A",
          description:
            descriptionInfo.description ?? "No description available",
          coverURL: bookCover.url ?? "No image",
        };

        return bookData;
      })
    );
    // return object about book data
    return booksData;
  } catch (err) {
    console.error("Request failed", err);
  }
};

// fetch description info about the book, using the book_key from fetchBookInfo
const fetchBookDescription = async function (bookKey) {
  try {
    const response = await fetch(`https://openlibrary.org${bookKey}.json`);

    const data = await response.json();

    const descriptionInfo = {
      description: data.description ?? "No description availabe",
      title: data.title,
      place: data.subject_places?.slice(0, 3).join(", ") ?? "No available info",
      characters:
        data.subject_people?.slice(0, 3).join(", ") ?? "No available info",
      type: data.subjects?.slice(0, 3).join(", ") ?? "No available info",
    };

    return descriptionInfo;
  } catch (err) {
    console.error("Book description request failed", err);
  }
};

// fetch book cover jpg
const fetchBookCover = async function (keyValue) {
  const response = await fetch(
    `https://covers.openlibrary.org/b/olid/${keyValue}-M.jpg`
  );

  return response;
};

export { fetchBookInfo, fetchBookDescription, fetchBookCover };
