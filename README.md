# ReadIt - book app

## CS50's Introduction to Computer Science _final project_

#### Video Demo: <https://youtu.be/xpF2rAq_qOY>

#### Description:

A book app, where user can create an account and track their own readings (currently reading, read and want to read). It's like the [Goodreads](https://www.goodreads.com/) app, just much more simpler and without an access to other users data. As I embarked on my journey with the CS50 course, this project has consistently occupied my thoughts, exploring how I could bring it to life. It represents the starting point of my journey into working dynamically with both back-end and front-end technologies.

> [!NOTE]
> For this project I used `ISBN API v2` to get information about the book.

### Technologies

Project is created with:

- Flask
- Python3
- Sqlite3
- Jinja
- HTML
- CSS
- JavaScript

### Features

#### Register form

The user registration form requires a `username`, `password` and `password confirmation`. Errors are handled if the user submits an empty form, if the `username` already exists, or if the `password` does not match. The password is also encrypted. I know there is no sensitive users data, but it was a good practice for me how its done. After successful registration users are immediately redirected to the main page of the app without the need to log in first. The user data is saved in an SQLite3 database.

```
CREATE TABLE users (
  id INTEGER NOT NULL,
  username TEXT NOT NULL,
  hashed TEXT NOT NULL
);
```

#### Log in form

The log in form requires `username` and `password`. Similar to the user registration form, it also handles errors if the user submits an empty form or inputs an incorrect `username` or `password`.

![](https://github.com/An-Renata/readIt/blob/main/app_screenshots/Animation.gif)

#### Search bar

The user can search books based on **title** or **author**. The search results are rendered on the main app window with this information for each book:

- Book cover
- Title, author, publish year, pages
- Show more button
  - Show more button provides a more information about the book, such as **description**, **book subject** etc.
- Buttons to interact with the database and UI
  - Want to read button
    - It adds a book to wishlist container.
  - Currently reading
    - Renders a book in a currently reading container.
  - Finished
    - Sends book data to the **bookshelf** container.

> [!NOTE]
> Book information is stored in the database. When a user clicks one of the buttons mentioned above, a new row is inserted into the `readings` table with the necessary book data, and the reading `status` is set to match the clicked button. If the book already exists in the database it's `status` is simply updated.

#### Book storing containers

Containers display books that match the selected status among the three available options: 'Currently reading,' 'Read,' and 'Want to read.' These statuses are managed on the Python side when receiving information from the client.

- `Want to read container`
- This container stands out because of the additional buttons `Finished`, `Currently reading` and `Delete`. These buttons make it convenient for the user to naturally update the status of books in the wishlist without needing to search for them again when updating their status from the search results.

Information about the book is stored in the SQLite3 database with the following information:

```
CREATE TABLE readings (
  id INTEGER NOT NULL,
  user_id INTEGER NOT NULL,
  title TEXT NOT NULL,
  author TEXT,
  book_cover TEXT,
  book_key TEXT,
  status TEXT
);
```

### Resources

For this project, I had to delve deeper into various concepts and browse the internet to gain a better understanding of them. Here are the main websites that helped me grasp the functions and usage.

- [Jinja documentation](https://jinja.palletsprojects.com/en/3.1.x/)
- [Python documentation](https://docs.python.org/3/)
- [Flask documentation](https://flask.palletsprojects.com/en/2.3.x/)
- AJAX calls
  - [W3schools](https://www.w3schools.com/xml/ajax_intro.asp)
  - [MDN web docs](https://developer.mozilla.org/en-US/docs/Web/Guide/AJAX)
  - [Geeksforgeeks](https://www.geeksforgeeks.org/how-to-make-ajax-call-from-javascript/)
  - [Net Ninja](https://www.youtube.com/watch?v=h0ZUpPiV1ac&t=719s&ab_channel=NetNinja) youtube channel
- Styling with css
  - I really enjoyed how [CSS-TRICKS](https://css-tricks.com/) provided comprehensive explanations about CSS grid and Flexbox. It always helps me grasp these concepts clearly.
  - [Grid](https://css-tricks.com/snippets/css/complete-guide-grid/)
  - [Flexbox](https://css-tricks.com/snippets/css/a-guide-to-flexbox/)
