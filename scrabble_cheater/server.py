from flask import Flask, request, render_template, redirect
app = Flask(__name__)

@app.before_request
def before_request():
    pass

@app.route('/')
def index():
    return render_template("index.html")
