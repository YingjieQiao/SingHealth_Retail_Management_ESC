from flask import Blueprint, request
from app.models import User
from app.__init__ import mail
import boto3
from botocore.exceptions import ClientError
import logging
from PIL import Image
import os
from flask_mail import Message
from itsdangerous import URLSafeTimedSerializer

# from . import s3_methods


s = URLSafeTimedSerializer('Thisisasecret!')


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
    try:
        user = User.objects.get(email=body.get('email'))
        firstName = user.firstName
        lastName = user.lastName

        authorized = user.check_password(body.get('password'))
        if not authorized:
            return {'result': False, 'info': "password error"}
    except:
        return {'result': False, 'info': "user does not exist"}
    #TODO add info to global log file

    return {'result': True, 'firstName': firstName, 'lastName': lastName}


@apis.route('/upload_file', methods=['GET', 'POST'])
def upload_file():
    body = request.files['file']

    img = Image.open(body.stream)
    rgb_img = img.convert('RGB')
    ##TODO username from frontend as file name prefix
    rgb_img.save("recogImage.jpg")

    s3_methods.upload_file('recogImage.jpg', 'escapp-bucket', None)

    os.remove(os.getcwd() + "/recogImage.jpg")
    #TODO in-memory storage like redis?

    return {'result': True}, 200


@apis.route('/download_file')
def download_file():
    body = request.get_json()
    # username = body.get('username')
    username = 'YingjieQiao'

    data = s3_methods.download_user_objects('escapp-bucket', username, None, None)
    
    mypath = os.getcwd()
    for filename in os.listdir(mypath):
        filename_full = os.path.join(mypath, filename)
        if (os.path.isfile(filename_full) 
            and not filename.endswith(".py") and filename != '.DS_Store'):
            os.remove(filename_full)

    return {'result': True, 'photoData': data}, 200

@apis.route('/email', methods=['GET', 'POST'])
def email():

    data = request.get_json(silent=True)
    print("It may be working")
    email = data.get('email')
    subject = data.get('subject')
    body = data.get('content')
    print(email,subject,body)
    try:
        token = s.dumps(email, salt='email-confirm')

        msg = Message(subject, sender='starboypp69@mymail.sutd.edu.sg', recipients=[email])

        # link = url_for('confirm_email', token=token, _external=True)
        # link = "lol"
        msg.body = body #+"\n\n Your link is {}".format(link)
    except:
        print("error occured lmao")
        return {'result': False, 'info': "user does not exist"}, 401

    # email = request.form['email']
    

    # with app.open_resource("picture.png") as fp:
    #     msg.attach("picture.png", "picture/png", fp.read())
    # with app.open_resource("train.csv") as fp:
    #     msg.attach("train.csv", "train/csv", fp.read())

    mail.send(msg)