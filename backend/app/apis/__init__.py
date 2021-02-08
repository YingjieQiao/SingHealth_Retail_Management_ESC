from flask import Blueprint, render_template, current_app, jsonify, request
import time

apis = Blueprint('apis', __name__)


@apis.route('/')
def get_homepage():
    return '<h1>hello there</h1>'


@apis.route('/time')
def get_current_time():
    return {'time': time.time()}