"use strict";
import { API_KEY } from "./key.js";
// Required header object to make API calls from ISBN database
let headers = {
  "Content-Type": "application/json",
  Authorization: API_KEY,
};
// Get information from ISBN database to render search results to the UI
// Search parameter will be the value of search bar input.
const getBook = async (search) => {
  try {
    // Retrieve information about the book based on the users search query
    const res = await fetch(
      `https://api2.isbndb.com/books/${search}?pageSize=100`,
      {
        headers: headers,
      }
    );

    // If request fails, throw an error
    if (!res.ok) {
      throw new Error(`Request failed with status: ${res.status}`);
    }

    // Converting the API call into JSON format
    const data = await res.json();

    // Using Promise.all ensures that all the ASYNC operations within the `map` function are executed concurrently.
    // The `map` function will create an array of promises, each representing an ASYNC operation to gather information about a book.
    // Promise. all waits for all these promises to be fulfilled or rejected.
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
    // Return `booksData` object to render information in the UI.
    return booksData;
  } catch (error) {
    // !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!1
    console.error("An error occurred:", error);
  }
};

// Retrieve more information about the book using book_key obtained from the initial fetch which generated search results.
const renderMoreInfo = async function (key) {
  // Get key after search results obtained and use it to fetch more information about the book
  // Book keys are placed at rendered search results buttons as dataset property
  const response = await fetch(`https://api2.isbndb.com/book/${key}`, {
    headers: headers,
  });
  const data = await response.json();

  // Put related information to an object which was retrieved by {response} call
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

  // Return moreInfo object which contains the information about the book, which will be used to render it in the UI
  return moreInfo;
};

// Export api calls to access them from script.js
export { renderMoreInfo, getBook };
