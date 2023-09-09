# CS50's Introduction to Computer Science _final project_

# ReadIt - book app

A book app, where user can create an account and track their own readings (currently reading, read and want to read). It's like the [Goodreads](https://www.goodreads.com/) app, just much more simpler and without an access to other users data.As I embarked on my journey with the CS50 course, this project has consistently occupied my thoughts, exploring how I could bring it to life. It represents the starting point of my journey into working dynamically with both back-end and front-end technologies.

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

The user registration form requires a `username`, `password` and `password confirmation`. Errors are handled if the user submits an empty form, if the `username` already exists, or if the `password` does not match. The password is also encrypted. I know there is no sensitive users data, but it was a good practice for me how its done. After successful registration users are immediatelly redirected to the main page of the app without the need to log in first. The user data is saved in an SQLite3 database.

#### Log in form

The log in form requires `username` and `password`. Similar to the user registration form, it also handles errors if the user submits an empty form or inputs an incorrect `username` or `password`.

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
    - Sens book data to the **bookshelf** container.

> [!NOTE]
> Book information is stored in the database. When a user clicks one of the buttons mentioned above, a new row is inserted into the `readings` table with the necessary book data, and the reading `status` is set to match the clicked button. If the book already exists in the database it's `status` is simply updated.
