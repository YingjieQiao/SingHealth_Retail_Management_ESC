from flask import Blueprint, request, url_for
from app.models import User
import boto3
from botocore.exceptions import ClientError
import logging
from PIL import Image
import os
from datetime import datetime
import ssl
from . import s3_methods
import email, smtplib, ssl
from email import encoders
from email.mime.base import MIMEBase
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from itsdangerous import URLSafeTimedSerializer, SignatureExpired

s = URLSafeTimedSerializer('Thisisasecret!')


sender_email = "starboypp69@gmail.com"
password = "MDR-XB450AP"

s = URLSafeTimedSerializer('Thisisasecret!')

apis = Blueprint('apis', __name__)

@apis.route('/')
def get_homepage():
    # for testing
    return '<h1>hello there</h1>'


@apis.route('/signup', methods=['GET', 'POST'])
def user_signup():
    body = request.get_json()
    body['verify'] = 0
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
        'location': body['location'],
        'verify' : 0
    }

    try:
        message = MIMEMultipart()
        message["From"] = sender_email
        email = body['email']
        message["To"] = email
        message["Subject"] = "Registeration Confirmation for SingHealth Account"
    except:
        print("error occured")
        return {'result': False, 'info': "user does not exist"}

    token = s.dumps(email, salt='register')

    link = url_for('apis.registeration_confirmation', token=token, _external=True)

    body = "Thank you for registering to SingHealth, Please click on the link given below to confirm your registeration \n\n {}".format(link)

    message.attach(MIMEText(body, "plain"))

    text = message.as_string()

    # Log in to server using secure context and send email
    context = ssl.create_default_context()
    with smtplib.SMTP_SSL("smtp.gmail.com", 465, context=context) as server:
        server.login(sender_email, password)
        server.sendmail(sender_email, email, text)
    return {'result': True, 'info': "Registeration Confirmation link was shared"}, 200

@apis.route('/registeration_confirmation/<token>')
def registeration_confirmation(token):

    try:
        email = s.loads(token, salt='register', max_age=3600) #age needs to be increased to allow longer duration for the link to exist
        # User.registeration_verify(email)
        User.objects(email=email).update_one(verify=1)

        return {'result': True, 'info': "Registeration Confirmed"}, 200
    except SignatureExpired:
        return {'result': False, 'info': "Link has expired"}, 200

@apis.route('/login', methods=['GET', 'POST'])
def user_login():
    body = request.get_json()
    try:
        user = User.objects.get(email=body.get('email'))
        authorized = user.check_password(body.get('password'))
        if not authorized:
            return {'result': False, 'info': "password error"}
    except:
        return {'result': False, 'info': "user does not exist"}

    try:
        message = MIMEMultipart()
        message["From"] = sender_email
        email = body.get('email')
        message["To"] = email
        message["Subject"] = "Link to login to SingHealth"
    except:
        print("error occured")
        return {'result': False, 'info': "user does not exist"}

    token = s.dumps(body.get('email'), salt='login')

    link = url_for('apis.login_2FA', token=token, _external=True)

    body = "Please click on the link given below for 2FA  \n\n {}".format(link)

    message.attach(MIMEText(body, "plain"))

    text = message.as_string()

    # Log in to server using secure context and send email
    context = ssl.create_default_context()
    with smtplib.SMTP_SSL("smtp.gmail.com", 465, context=context) as server:
        server.login(sender_email, password)
        server.sendmail(sender_email, email, text)
    #TODO add info to global log file

    return {'result': True, 'info': "2FA sent", "token":token}, 200


@apis.route('/login_verified/<token>')
def login_2FA(token):

    try:
        email = s.loads(token, salt='login', max_age=120) #age needs to be increased to allow longer duration for the link to exist
        try:
            user = User.objects.get(email=email)
            firstName = user.firstName
            lastName = user.lastName
        except:
            return {'result': False, 'info': "2FA error"}
        return {'result': True, 'firstName': firstName, 'lastName': lastName}, 200
    except SignatureExpired:
        return {'result': False, 'info': "Link has expired"}, 200


@apis.route('/upload_file', methods=['GET', 'POST'])
def upload_file():
    body = request.files['file']

    img = Image.open(body.stream)
    rgb_img = img.convert('RGB')
    
    username = "YingjieQiao"
    now = datetime.now() # current date and time
    dateTime = now.strftime("%m/%d/%Y %H:%M:%S")
    dateTimeArr = dateTime.split(" ")
    date_ = dateTimeArr[0]
    time_ = dateTimeArr[1]
    date_ = date_.replace("/", "-")
    filename = username + "_" + date_ + "_" + time_ + ".jpg"

    rgb_img.save(filename)

    s3_methods.upload_file(filename, 'escapp-bucket-dev', None)

    os.remove(os.getcwd() + "/" + filename)
    #TODO in-memory storage like redis?

    return {'result': True}, 200


@apis.route('/download_file')
def download_file():
    body = request.get_json()
    # username = body.get('username')
    username = 'YingjieQiao'

    data = s3_methods.download_user_objects('escapp-bucket-dev', username, None, None)
    
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
    receiver_email = data.get('email')
    subject = data.get('subject')
    body = data.get('content')
    print(receiver_email,subject,body)
    try:

        message = MIMEMultipart()
        message["From"] = sender_email
        message["To"] = receiver_email
        message["Subject"] = subject
        message.attach(MIMEText(body, "plain"))
    except:
        print("error occured")
        return {'result': False, 'info': "user does not exist"}

    # attaching a picture

    filename = "picture.png"  # In same directory as script

    with apis.open_resource(filename) as attachment:
    # Add file as application/octet-stream
    # Email client can usually download this automatically as attachment
        part = MIMEBase("application", "octet-stream")
        part.set_payload(attachment.read())

    # Encode file in ASCII characters to send by email    
    encoders.encode_base64(part)

    # Add header as key/value pair to attachment part
    part.add_header(
        "Content-Disposition",
        f"attachment; filename= {filename}",
    )

    # Add attachment to message and convert message to string
    message.attach(part)
    text = message.as_string()

    # Log in to server using secure context and send email
    context = ssl.create_default_context()
    with smtplib.SMTP_SSL("smtp.gmail.com", 465, context=context) as server:
        server.login(sender_email, password)
        server.sendmail(sender_email, receiver_email, text)
    return {'result': True, 'info': "Email was shared"}, 200