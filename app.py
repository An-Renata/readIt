from flask import Flask, redirect, render_template, request, session, flash, jsonify
from flask_session import Session
from werkzeug.security import check_password_hash, generate_password_hash
from cs50 import SQL
import re
from functools import wraps

# Initialize flask app
app = Flask(__name__)
app.config['SECRET_KEY'] = 'superSecretKeyForMyProduct1on2232@'

# Configure session to use filesystem (instead of signed cookies)
# This will mean, that the session should not be permanent, and will expire then the user closes their browser
app.config["SESSION_PERMANENT"] = False
# This means that the session data will be stored on the file system of the server
app.config["SESSION_TYPE"] = "filesystem"

# Set up flask-session
Session(app)
# Connect sqlite database to an application
db = SQL("sqlite:///readit.db")

# Password validation function 
# If password doesn't match the requirements, the error will occur during the login/register forms
def password_validator(pw):
    # At least one uppercase letter
    # At least one lowercase letter
    # At least one digit
    # Password length 6 or more characters long
    regex = r"^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.{6,}).*$"

    match_patter = re.match(regex, pw)

    return bool(match_patter)

# Require login decorator to deny access for user who are not logged in
def login_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if session.get("user_id") is None:
            return redirect("/login")
        return f(*args, **kwargs)
    return decorated_function


#? LIST OF BOOK STATUS
# Depending on the users choice, the status will be changed in the SQlite databse
status = ["Currently reading", "Read", "Want to read"]

#? MAIN WINDOW AFTER USER LOGGED IN
# Only logged in user can access this route (main window HTML layout)
@app.route("/")
@login_required
def index():
    # Assign session id to variable
    userID = session["user_id"]
    # Get the current user_id username to display it in the UI once the user is logged in
    user = db.execute("SELECT username FROM users WHERE id = ?", userID)
    # db.execute returns dictionary, so to access the username I need to access the first element
    username = user[0]["username"]

    # Render template of index.html which will be displayed based on the users data
    return render_template('/index.html', username=username.capitalize())

#? LOGIN ROUTE 
# The login route is the first page to render when the app is opened
# From this route you also can access register form and create a new user
@app.route('/login', methods=["GET", "POST"])
def login():
    # clear previous sessios if any was left
    session.clear()
    # If request is "GET" and user hasn't submitted any data yet, just render HTML layout
    if request.method == "GET":
        return render_template("/login.html")
    # If request is "POST" and user has submitted required data, log in the user
    # Users data is stored in the sqlite3 database
    else:
        # Retrieve username and password from the input
        username = request.form.get("username")
        password = request.form.get("password")

        # Handling errors if user hasn't submitted any data in the input field
        if not username or username == '':
            error_text = 'Must provide username'
            # If error occurs, the login.html layout is rerendered with the error message below the input field
            return render_template('login.html', fail_username=error_text)
        # Handling errors with the password input fiel
        # If password wasn't provided, the error_text is rerendered below the input field in the login.html layout
        elif not password:
            error_text = "Must Provide password"
            return render_template("login.html", fail_password=error_text)

        # Query database for username
        # Getting information from the database about the user to compare the users input to users data in the database
        rows = db.execute("SELECT * FROM users WHERE username = ?", username)
        
        # If rows dictionary returns with length not equal to 1 this means that there is no user with provided username in the login form
        # The error message is executed for the user to rechech the information he submitted
        # chech_password_hash decrypts the username password
        if len(rows) != 1 or not check_password_hash(rows[0]["hashed"], password):
            user_not_found = "Invalid username and/or password"
            return render_template('login.html', no_user=user_not_found)
        
        # The session id is saved to access the main page of the application
        # User id retrieved from the databse
        session["user_id"] = rows[0]["id"]

        # Redirecting user to the main page of the app
        return redirect("/")

#? LOGOUT ROUTE 
# When a user clicks log out button, the function is called
# Information about the user data will be no longer available
@app.route("/logout")
def logout():
    #  Removes all keys and values from the session-state collection.
    session.clear()
    # Redirecting user to login.html layout
    return redirect("/login")

#? REGISTER ROUTE 
# Register form which can be access with the link tag from the login.html layout
@app.route("/register", methods=["GET", "POST"])
def register():
    # If request is "GET" and user hasn't submitted any data yet, just render HTML layout
    if request.method == "GET":
        return render_template("register.html")
    # If request is "POST" and user has submitted required data, create a new user
    # Users data is stored in the sqlite3 database
    else:
        # Retrieve username, password, password confirmation from the input fields
        username = request.form.get("username")
        password = request.form.get("password")
        confirm_pw = request.form.get("confirm-password")

        # Call this function to check if all regex requirements are matched
        # If password match requirements, it's encrypted
        if password_validator(password):
            hashed_password = generate_password_hash(password)
        # If password doesn't match requirements the error message is rerendered below the input field
        else:
            failed_pw = "Password needs to be not less than 6 characters long, contain at least one uppercase letter, one lowercase letter, one digit "
            return render_template("register.html", failed_pw=failed_pw)

        # Getting information about all the usernames in the database
        # This is mandatory to check if there is a user already containing the same username
        db_username = db.execute(
            "SELECT username FROM users WHERE username = ?", username)
        
        # If user didn't fill in the username field, return error message
        if username is None or username == '':
            username_required = "Username is required"
            return render_template("register.html", username_required=username_required)
        # If user didn't fill in the password field, return error message
        if password is None or password == '':
            pw_required = "Must provide password"
            return render_template("register.html", pw_required=pw_required)

        # If password doesn't match, return error message
        if password != confirm_pw:
            pw_match = "Password doesn't match"
            return render_template("register.html", pw_match=pw_match)
        # If the previous call db_username already have user with the same username, return error message
        elif len(db_username) == 1:
            user_exists = "User already exists"
            return render_template("register.html", user_exists=user_exists)
        
        # If no error occurs, the new user is registered
        # User information is saved in the database
        db.execute(
            "INSERT INTO users (username, hashed) VALUES (?, ?)", username, hashed_password)
        # Get the user id 
        rows = db.execute(
            "SELECT * FROM users WHERE username = ?", username)
        # Save session id with retrieved user id
        session["user_id"] = rows[0]["id"]
        # Redirecting new user instantly to the main page, without the need to log in again
        return redirect("/")

#? ADD CURRENTLY READING
# Add information about a book user is currently reading
# This route will wait for the currently reading button click
# It inserts or updates the book data and set book status as currently reading
@app.route('/currently-reading', methods=["GET", "POST"])
def update_curr_reading():
    # Create variable for user_id
    userID = session["user_id"]
    # Get data about the book from the JS side and update/insert the book in the db
    # User id is mandatory to save iformation for the right user
    if request.method == "POST":
        # Get data about the book from AJAX call from JS side
        book_data = request.json

        # Query table with user_id and book title
        # We will chech if the book already exist in the database but with another status
        book_row = db.execute(
            "SELECT * FROM readings WHERE user_id = ? AND title = ?", userID, book_data["title"])
        
        # If the book doesn't exist, add it to the database
        if len(book_row) != 1:
            authors = ", ".join(book_data["author"])
            db.execute("INSERT INTO readings (user_id, title, author, book_cover, book_key, status) VALUES (?, ?, ?, ?, ?, ?)",
                    userID, book_data["title"], authors, book_data["book_cover"], book_data["book_key"], status[0])
        # if book already exists, update its status to currently reading
        else:
            db.execute("UPDATE readings SET status = ? WHERE user_id = ? AND title = ?", status[0], userID, book_data["title"])
    
        return redirect("/")
    else:
        book = db.execute("SELECT * FROM readings WHERE user_id = ? AND status = ?", userID, status[0])
        # Sending data about the book back to the JS side
        # Return JSON-formatted data from the route to JS
        return jsonify(book)

#? FINISH BUTTON 
# When you click the 'Finish' button in the 'Currently Reading' box, it updates the book's status to 'Finished,' and the book is then displayed in the bookshelf.
@app.route("/finished", methods=["POST"])
def insert_to_bookshelf():
    userID = session["user_id"]
    # Getting data from the JS (book key) about finished book
    book_key = request.json
   
    # Update the status of the book to "Read"
    db.execute("UPDATE readings SET status = ? WHERE user_id = ? AND book_key = ?", status[1], userID, book_key)

    return redirect('/')


#? CANCEL READING THE BOOK (currently reading box)
# Delete the book data from the currently reading container
@app.route("/delete-currently-reading", methods=["POST"])
def delete_from_currently_reading():
    book_key = request.json

    db.execute("DELETE FROM readings WHERE user_id = ? AND book_key = ?", session["user_id"], book_key)
    
    return redirect('/')

#? SENDING DATA TO THE CLIENT SIDE ABUOT CURRENTLY READING BOOKS
# Send json data from the server to js about currently reading books
@app.route('/reading')
def reading():
    userID = session["user_id"]

    curr_reading = db.execute("SELECT * FROM readings WHERE user_id = ? AND status = ?", userID, status[0])

    return jsonify(curr_reading)


#? BOOKSHELF 
# Return book data of finished books to the UI 
@app.route("/bookshelf")
def finished():
    # Getting list of books user already read using status 'read'
    read = db.execute("SELECT * FROM readings WHERE user_id = ? AND status = ?", session["user_id"], status[1])

    return jsonify(read)


#? DELETE FROM BOOKSHELF
# Delete books with status "read"
@app.route("/delete-finished", methods=["POST"])
def delete_finished():
    userID = session["user_id"]
    # Get the book_key from the client side 
    book_key = request.json
    # Delete book info from the readings db
    db.execute("DELETE FROM readings WHERE user_id = ? AND book_key = ? ", userID, book_key)

    return redirect("/")

#? SENDING BOOKS USER WANTS TO READ 
# send book list of want-to-read to client side
@app.route("/want-to-read", methods=["GET", "POST"])
def want_to_read():
    userID = session["user_id"]
    # Condition to check if user wants to look at the 'want to read' list or the "POST" request has been made
    if request.method == "POST":
        # Getting data about the book user selected
        book_data = request.json

        # Retrieve information and verify whether the book already exists with a different status
        book_row = db.execute("SELECT * FROM readings WHERE user_id = ? AND title = ?", userID, book_data["title"])

        # If the book doesn't exist, add it to the database
        if len(book_row) != 1:
            authors = ", ".join(book_data["author"])
            db.execute("INSERT INTO readings (user_id, title, author, book_cover, book_key, status) VALUES (?, ?, ?, ?, ?, ?)",
                    userID, book_data["title"], authors, book_data["book_cover"], book_data["book_key"], status[2])
        else:
            # Update status if the book exists with different status
            db.execute("UPDATE readings SET status = ? WHERE user_id = ? AND title = ?", status[2], userID, book_data["title"])
    
        return redirect("/")
    else:
        # Send list of books back to client side to update the UI
        want_to_read = db.execute("SELECT * FROM readings WHERE user_id = ? AND status = ?", userID, status[2])

        return jsonify(want_to_read)

#? ADD FINISHED BOOK (from search results btn)
# Insert book to the bookshelf or update book status
@app.route("/add-finished", methods=["POST"])
def addBook():
    userID = session["user_id"]

    book_data = request.json

    book_row = db.execute("SELECT * FROM readings WHERE user_id = ? AND title = ?", userID, book_data["title"])

    if len(book_row) != 1:
        authors = ", ".join(book_data["author"])
        db.execute("INSERT INTO readings (user_id, title, author, book_cover, book_key, status) VALUES (?, ?, ?, ?, ?, ?)", userID, book_data["title"], authors, book_data["book_cover"], book_data["book_key"], status[1])
    else:
        db.execute("UPDATE readings SET status = ? WHERE user_id = ? AND title = ?", status[1], userID, book_data["title"])

    return redirect("/")
