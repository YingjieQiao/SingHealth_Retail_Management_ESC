import time
from flask import Flask

app = Flask(__name__)


@app.route('/')
def get_homepage():
    return '<h1>hello there</h1>'


@app.route('/time')
def get_current_time():
    return {'time': time.time()}