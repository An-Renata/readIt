from flask import Flask, redirect, render_template, request, session, flash, jsonify
from flask_session import Session
from werkzeug.security import check_password_hash, generate_password_hash
from cs50 import SQL
import re
from functools import wraps

# initialize flask app
app = Flask(__name__)
app.config['SECRET_KEY'] = 'superSecretKeyForMyProduct1on2232@'

# Configure session to use filesystem (instead of signed cookies)
# This will mean, that the session should not be permanent, and will expire then the user closes their browser
app.config["SESSION_PERMANENT"] = False
# This means that the session data will be stored on the file system of the server
app.config["SESSION_TYPE"] = "filesystem"

# set up flask-session
Session(app)
# connect sqlite database to application
db = SQL("sqlite:///readit.db")

def password_validator(pw):
    # At least one uppercase letter
    # At least one lowercase letter
    # At least one digit
    # Password length 6 or more characters long
    regex = r"^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.{6,}).*$"

    match_patter = re.match(regex, pw)

    return bool(match_patter)

# require login decorator to deny access for user who are not logged in


def login_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if session.get("user_id") is None:
            return redirect("/login")
        return f(*args, **kwargs)
    return decorated_function


@app.route("/")
@login_required
def index():
    userID = session["user_id"]
    # get the current user_id username to display in the UI once the user is logged in
    user = db.execute("SELECT username FROM users WHERE id = ?", userID)
    username = user[0]["username"]

    curr_reading = db.execute(
        "SELECT * FROM currently_reading WHERE user_id = ?", userID)
    curr_reading=curr_reading

    return render_template('/index.html', username=username.capitalize(), curr_reading=curr_reading)


@app.route('/login', methods=["GET", "POST"])
def login():

    # empty previous session
    session.clear()
    if request.method == "GET":
        return render_template("/login.html")
    else:
        username = request.form.get("username")
        password = request.form.get("password")

        if not username or username == '':
            error_text = 'Must provide username'
            return render_template('login.html', fail_username=error_text)

        elif not password:
            error_text = "Must Provide password"
            return render_template("login.html", fail_password=error_text)

        # query database for username
        rows = db.execute("SELECT * FROM users WHERE username = ?", username)

        if len(rows) != 1 or not check_password_hash(rows[0]["hashed"], password):
            user_not_found = "Invalid username and/or password"
            return render_template('login.html', no_user=user_not_found)

        session["user_id"] = rows[0]["id"]

        return redirect("/")


@app.route("/logout")
def logout():
    # empty sessions user_id
    session.clear()
    # redirect user to login form
    return redirect("/login")


@app.route("/register", methods=["GET", "POST"])
def register():
    if request.method == "GET":
        return render_template("register.html")
    else:
        username = request.form.get("username")
        password = request.form.get("password")
        confirm_pw = request.form.get("confirm-password")

        if password_validator(password):
            hashed_password = generate_password_hash(password)
        else:
            failed_pw = "Password needs to be not less than 6 characters long, contain at least one uppercase letter, one lowercase letter, one digit "
            return render_template("register.html", failed_pw=failed_pw)

        db_username = db.execute(
            "SELECT username FROM users WHERE username = ?", username)

        if username is None or username == '':
            username_required = "Username is required"
            return render_template("register.html", username_required=username_required)

        if password is None or password == '':
            pw_required = "Must provide password"
            return render_template("register.html", pw_required=pw_required)

        if password != confirm_pw:
            pw_match = "Password doesn't match"
            return render_template("register.html", pw_match=pw_match)
        elif len(db_username) == 1:
            user_exists = "User already exists"
            return render_template("register.html", user_exists=user_exists)

        # if above doesn't run, insert new user
        db.execute(
            "INSERT INTO users (username, hashed) VALUES (?, ?)", username, hashed_password)
        rows = db.execute(
            "SELECT * FROM users WHERE username = ?", username)

        session["user_id"] = rows[0]["id"]

        return redirect("/")

# add information about book user is currently reading
@app.route('/currently-reading', methods=["POST"])
def update_curr_reading():
    userID = session["user_id"]
    # get data about the book from ajax call JS side
    book_data = request.json

    # query table with user_id and book title
    book_row = db.execute(
        "SELECT * FROM currently_reading WHERE user_id = ? AND title = ?", userID, book_data["title"])

    # if the book doesn't exist, add it to the database
    if len(book_row) != 1:
        authors = ", ".join(book_data["author"])
        db.execute("INSERT INTO currently_reading (user_id, title, author, book_cover, book_key) VALUES (?, ?, ?, ?, ?)",
                userID, book_data["title"], authors, book_data["book_cover"], book_data["book_key"])
    # if book already exists, and receives the same info, it means user want to delete it from the list
    else:
        db.execute("DELETE FROM currently_reading WHERE user_id = ? AND title = ?", userID, book_data["title"])

    return redirect("/")

@app.route("/finished", methods=["POST"])
def update_finished():
    userID = session["user_id"]
    book_data = request.json
    
    # print(book_data)

    book_row = db.execute("SELECT * FROM currently_reading WHERE user_id = ? AND book_key = ?", userID, book_data["book_key"])

    # print(book_row)

    if len(book_row) == 1:
        authors = ", ".join(book_data["author"])
        # insert into bookshelf if book is finished
        db.execute("INSERT INTO read (user_id, title, author, book_cover, book_key) VALUES (?, ?, ?, ?, ?)", userID, book_data["title"], authors, book_data["book_cover"], book_data["book_key"])
        # Delete book from currently reading list
        db.execute("DELETE FROM currently_reading WHERE user_id = ? AND title = ?", userID, book_data["title"])

    return redirect('/')

# sen json data from the server to js
@app.route('/reading')
def reading():
    curr_reading = db.execute("SELECT * FROM currently_reading WHERE user_id = ?", session["user_id"])
    # for debugging
    print(curr_reading)

    return jsonify(curr_reading)



