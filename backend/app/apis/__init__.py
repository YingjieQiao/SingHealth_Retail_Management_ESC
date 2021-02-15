from flask import Blueprint, render_template, current_app, jsonify, request
import time
import boto3


apis = Blueprint('apis', __name__)


@apis.route('/')
def get_homepage():
    return '<h1>hello there</h1>'


@apis.route('/time')
def get_current_time():
    return {'time': time.time()}


@apis.route('/upload_pic')
def upload_pic(path):
    s3 = boto3.resource('s3')   
    data = open(path, 'rb')
    s3.Bucket('escapp-bucket').put_object(Key='images/testpic.png', Body=data)

    return True