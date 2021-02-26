from flask import Blueprint, request
from app.models import User
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
    userid = user.id

    response = {
        'id': str(userid),
        'firstName': body['firstName'],
        'lastName': body['lastName'],
        'email': body['email'],
        'mobile': body['mobile'],
        'location': body['location']
    }

    return response, 200


@apis.route('/login', methods=['GET', 'POST'])
def user_login():
    body = request.get_json()
    user = User.objects.get(email=body.get('email'))
    authorized = user.check_password(body.get('password'))
    if not authorized:
        return {'error': 'Email or password invalid'}, 401
    return {'result': True}, 200


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

