from flask import Blueprint, render_template, current_app, jsonify, request, Response
from app.models import User
import time, json
import boto3
from botocore.exceptions import ClientError
import logging


apis = Blueprint('apis', __name__)


@apis.route('/')
def get_homepage():
    # for testing
    return '<h1>hello there</h1>'


@apis.route('/signup', methods=['GET', 'POST'])
def user_signup():
    body = request.get_json()
    user = User(**body)
    user.hash_password()
    user.save()
    id = user.id
    return {'id': str(id)}, 200


@apis.route('/signup_test', methods=['GET', 'POST'])
def user_signup_test():
    content = '{ "username":"007", "password": "12345678"}'
    body = json.loads(content)
    user = User(**body)
    user.hash_password()
    user.save()
    id = user.id
    return {'id': str(id)}, 200


@apis.route('/upload_file')
def upload_file(file_name, bucket, object_name=None):
    """Upload a file to an S3 bucket

    :param file_name: File to upload
    :param bucket: Bucket to upload to
    :param object_name: S3 object name. If not specified then file_name is used
    :return: True if file was uploaded, else False
    """

    if object_name is None:
        object_name = file_name

    s3_client = boto3.client('s3')
    try:
        response = s3_client.upload_file(file_name, bucket, object_name)
        #TODO log the response in the logger
    except ClientError as e:
        logging.error(e)
        return False
    return True


@apis.route('/download_file')
def download_file(file_name, bucket, object_name):
    """Download a file from an S3 bucket

    :param file_name: File to download
    :param bucket: Bucket to download from
    :param object_name: S3 object name.
    :return: True if file was downloaded, else False
    """

    if object_name is None:
        return False

    s3 = boto3.client('s3')
    try:
        response = s3.download_file(bucket, object_name, file_name)
        #TODO log the response in the logger
    except ClientError as e:
        logging.error(e)
        return False
    return True



# mongodb testing code

"""
@apis.route('/movies')
def get_movies():
    movies = Movie.objects().to_json()
    return Response(movies, mimetype="application/json", status=200)


@apis.route('/add_movies', methods=['POST'])
def add_movie():
    body = request.get_json()
    movie =  Movie(**body).save()
    id = movie.id
    return {'id': str(id)}, 200


@apis.route('/add_movies_test', methods=['GET', 'POST'])
def add_movie_test():
    content = '{ "name":"007", "casts":["james"], "genres":["fun"]}'
    body = json.loads(content)
    movie = Movie(**body).save()
    id = 123
    return {'id': str(id)}, 200
"""