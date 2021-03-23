from flask import Blueprint, request, session, jsonify
from app.models import User, Photo
from PIL import Image
import os
from itsdangerous import URLSafeTimedSerializer
from datetime import datetime

from . import settings, s3_methods
import email, smtplib, ssl
from email import encoders
from email.mime.base import MIMEBase
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText


sender_email = "starboypp69@gmail.com"
password = "MDR-XB450AP"

s = URLSafeTimedSerializer('Thisisasecret!')

apis = Blueprint('apis', __name__)


@apis.route('/get_current_username_and_datetime', methods=['GET', 'POST'])
def get_current_username_and_datetime():
    now = datetime.now() # current date and time
    dateTime = now.strftime("%m/%d/%Y %H:%M:%S")
    dateTimeArr = dateTime.split(" ")
    date_ = dateTimeArr[0]
    date_ = date_.replace("/", "-")
    time_ = dateTimeArr[1]

    return {"username": settings.username, "time": time_, "date": date_}, 200


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

    settings.username = firstName + lastName
    print(settings.username)

    return {'result': True, 'firstName': firstName, 'lastName': lastName}


@apis.route('/upload_file', methods=['GET', 'POST'])
def upload_file():
    body = request.files['file']
    time_ = request.form['time']
    date_ = request.form['date']

    username = settings.username
    if username == "":
        username = 'YingjieQiao'
        print("testing s3 download") #TODO change to logging
    filename = username + "_" + date_ + "_" + time_ + ".jpg"

    img = Image.open(body.stream)
    rgb_img = img.convert('RGB')

    rgb_img.save(filename)

    try:
        s3_methods.upload_file(filename, 'escapp-bucket-dev', None)
    except Exception as e:
        print("Error occurred: ", e) #TODO change to logging
        return {'result': False}, 500

    os.remove(os.getcwd() + "/" + filename)
    #TODO in-memory storage like redis?

    return {'result': True}, 200


@apis.route('/download_file', methods=['GET', 'POST'])
def download_file():
    username = settings.username
    if username == "":
        username = 'YingjieQiao'
        print("testing s3 download") #TODO change to logging
    timeInput = None
    dateInput = None

    try:
        res = s3_methods.download_user_objects('escapp-bucket-dev', username, timeInput, dateInput)
    except Exception as e:
        print("Error occurred: ", e) #TODO change to logging
        return {'result': False, 'photoData': None, 'photoAttrData': None}, 500
    photoData = res[0]
    photoAttrData = res[1]

    mypath = os.getcwd()
    for filename in os.listdir(mypath):
        filename_full = os.path.join(mypath, filename)
        if (os.path.isfile(filename_full) 
            and not filename.endswith(".py") and filename != '.DS_Store'):
            os.remove(filename_full)

    return {'result': True, 'photoData': photoData, 'photoAttrData': photoAttrData}, 200


@apis.route('/upload_photo_info', methods=['GET', 'POST'])
def upload_photo_info():
    body = request.get_json()

    print(body)

    try:
        photo = Photo(**body)
        photo.save()
    except Exception as e:
        print("Error occurred: ", e) #TODO change to logging
        return {'result': False}, 500

    return {'result': True}, 200


@apis.route('/rectify_photo', methods=['GET', 'POST'])
def rectify_photo():
    body = request.get_json()
    body['rectified'] = True
    time_ = request.form['time']
    date_ = request.form['date']
    print(body)

    if settings.username == "":
        settings.username = "YingjieQiao"
        print("testing") #TODO change to logging

    try:
        photoInfo = Photo.objects(date=date_, time=time_, staffName=settings.username)
        photoInfo.update(**body)
    except:
        print("error") #TODO: change to logging
        return None

    return {'result': True}, 200


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
        return {'result': False, 'info': "user does not exist"}, 401

    message.attach(MIMEText(body, "plain"))

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
