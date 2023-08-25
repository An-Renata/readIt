"use strict";
import { API_KEY } from "./key.js";

let headers = {
  "Content-Type": "application/json",
  Authorization: API_KEY,
};

const getBook = async (search) => {
  try {
    const res = await fetch(`https://api2.isbndb.com/books/${search}`, {
      headers: headers,
    });

    if (!res.ok) {
      throw new Error(`Request failed with status: ${res.status}`);
    }
    const data = await res.json();
    if (data.length === 0) {
      return "No book found";
    }
    const booksData = await Promise.all(
      data.books.map(async (book) => {
        // map through array to get info that I need
        const bookData = {
          author: book.authors ?? "No info",
          published: book.date_published ?? "No info",
          publisher: book.publisher ?? "No info",
          book_cover: book.image,
          pages: book.pages ?? "No info",
          subject: book.subjects ?? "No info",
          description: book.synopsis ?? "No info",
          title: book.title,
          language: book.language ?? "No info",
          key: book.isbn ?? book.isbn13 ?? book.isbn10,
        };

        return bookData;
      })
    );

    return booksData;
  } catch (error) {
    console.error("An error occurred:", error);
  }
};

// fetch more info
const renderMoreInfo = async function (key) {
  // get key after search results rendered and use it to fetch more about book
  const response = await fetch(`https://api2.isbndb.com/book/${key}`, {
    headers: headers,
  });
  const data = await response.json();
  // put related info to an object
  const moreInfo = {
    title: data.book.title,
    book_cover: data.book.image,
    author: data.book.authors ?? "No info",
    publisher: data.book.publisher ?? "No info",
    language: data.book.language ?? "No info",
    subject: data.book.subjects?.slice(0, 3).join(", ") ?? "No info",
    description: data.book.synopsis ?? "Description not available",
    book_key: data.book.isbn ?? data.book.isbn13,
  };
  return moreInfo;
};
// export api calls to access them from script.js
export { renderMoreInfo, getBook };
