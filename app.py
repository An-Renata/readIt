from flask import Flask, redirect, render_template, request, session, flash
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
    # At least one of the following symbols (!@#$%&*)
    # Password length 6 or more characters long
    regex = r"^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%&*])(?=.{6,}).*$"

    match_patter = re.match(regex, pw)

    return bool(match_patter)


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

    return render_template('/index.html')


@app.route('/login', methods=["GET", "POST"])
def login():

    # empty previous session
    session.clear()
    if request.method == "GET":
        return render_template("/login.html")
    else:
        username = request.form.get("username")
        password = request.form.get("password")

        if not username:
            flash("provide username")
            return redirect('/login')

        elif not password:
            flash("provide a password")
            return redirect('/login')

        # query database for username
        rows = db.execute("SELECT * FROM users WHERE username = ?", username)

        if len(rows) != 1 or not check_password_hash(rows[0]["hashed"], password):
            flash("INVALID USERNAME and/or PASSWORD")
            return redirect('/login')

        session["user_id"] = rows[0]["id"]

        return redirect("/")


@app.route("/register", methods=["GET", "POST"])
def register():
    if request.method == "GET":
        return render_template("register.html")
    elif request.moethod == "POST":
        username = request.form.get("username")
        password = request.form.get("password")
        confirm_pw = request.form.get("confirm-password")

        if password_validator(password):
            hashed_password = generate_password_hash(password)
        else:
            flash("Password needs to contain at least one uppercase letter, one lowercase letter, one digit and following symbols (!@#$%&*)")
            return redirect("/register")

        db_username = db.execute(
            "SELECT username FROM users WHERE username = ?", username)

        if username is None or username == '':
            flash("Username is required")
            return redirect("/register")

        if password is None or password == '':
            flash("Must provide password")
            return redirect("/register")

        if password != confirm_pw:
            flash("Password doesn't match")
            return redirect("/register")
        elif len(db_username) == 1:
            flash("User already exists")
            return redirect("/register")

        # if above doesn't run, insert new user
        db.execute(
            "INSERT INTO users (username, hashed) VALUES (?, ?)", username, hashed_password)
        rows = db.execute(
            "SELECT * FROM users WHERE username = ?", username)

        session["user_id"] = rows[0]["id"]
        flash("User registered successfully")

        return redirect("/")
