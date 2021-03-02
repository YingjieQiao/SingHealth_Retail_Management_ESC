Mihir Chhiber, [03.03.21 00:39]
from flask import Blueprint, request, Flask, url_for
from app.models import User
import boto3
from botocore.exceptions import ClientError
import logging
from PIL import Image
import os
from flask_mail import Mail, Message
from itsdangerous import URLSafeTimedSerializer, SignatureExpired

s = URLSafeTimedSerializer('Thisisasecret!')

from . import s3_methods


app = Flask(name)
mail= Mail(app)

app.config['MAIL_SERVER']='smtp.gmail.com'
app.config['MAIL_PORT'] = 465
app.config['MAIL_USERNAME'] = '****'
app.config['MAIL_PASSWORD'] = 'MDR-XB450AP'
app.config['MAIL_USE_TLS'] = False
app.config['MAIL_USE_SSL'] = True
app.config['MAIL_ASCII_ATTACHMENTS'] = True
mail = Mail(app)


apis = Blueprint('apis', name)


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
            return {'result': False, 'info': "password error"}, 401
    except:
        return {'result': False, 'info': "user does not exist"}, 401
    #TODO add info to global log file

    return {'result': True, 'firstName': firstName, 'lastName': lastName}, 200


@apis.route('/upload_file', methods=['GET', 'POST'])
def upload_file():
    body = request.files['file']

    img = Image.open(body.stream)
    rgb_img = img.convert('RGB')
    rgb_img.save("recogImage.jpg")

    s3_methods.upload_file('recogImage.jpg', 'escapp-bucket', None)

    os.remove(os.getcwd() + "/recogImage.jpg")
    #TODO in-memory storage like redis?

    return {'result': True}, 200


@apis.route('/download_file')
def download_file():
    return {'result': True}, 200

@apis.route('/email', methods=['GET', 'POST'])
def email():

    data = request.get_json(silent=True)
    print("It may be working")
    email = data.get('email')
    subject = data.get('subject')
    body = data.get('body')
    print(email,subject,body)
    try:
        token = s.dumps(email, salt='email-confirm')

        msg = Message(subject, sender='***', recipients=[email])

        # link = url_for('confirm_email', token=token, _external=True)
        link = "lol"
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


    return {'result': True, 'info': "Email sent"}, 200

@apis.route('/confirm_email/<token>')
def confirm_email(token):
    try:
        email = s.loads(token, salt='email-confirm', max_age=3600)
    except SignatureExpired:
        return '<h1>The token is expired!</h1>'
    return '<h1>The email and the token generated with it works!</h1>'
