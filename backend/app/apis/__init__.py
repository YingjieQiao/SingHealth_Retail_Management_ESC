from flask import Blueprint, request, session
from flask_session import Session
from app.models import User, Audit_non_FB
import boto3
from botocore.exceptions import ClientError
import logging
from PIL import Image
import os
from itsdangerous import URLSafeTimedSerializer
from datetime import datetime
import ssl

from . import settings, s3_methods
import email, smtplib, ssl
from email import encoders
from email.mime.base import MIMEBase
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
 
# new library added, please take note
# import seaborn as sns
import pandas as pd
import numpy as np



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
    user = User(**body)
    user.hash_password()
    user.setfnb(True)
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

    return {'result': True, 'firstName': firstName, 'lastName': lastName}


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
    username = settings.username

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

@apis.route('/tenant_exists', methods=['GET', 'POST'])
def tenant_exists():
    
    body = request.get_json(silent=True)
    # try:
    #     user = User.objects.get(email=body.get('tenantName'))      
    #     if user == None:
    #         return {'result': False}
    # except:
    #     return {'result': False}
        
    audit_ls = Audit_non_FB.objects(auditeeName = body.get('tenantName'))

    temp_ls = [[i.timestamp, i.profScore, i.housekeepingScore, i.workSafetyScore, i.totalScore] for i in audit_ls]
    df = pd.DataFrame(temp_ls)
    df.columns = ['timestamp','profScore', 'housekeepingScore', 'workSafetyScore','totalScore']
    df['timestamp'] = pd.to_datetime(df['timestamp'])
    df.index = df['timestamp'] 
    # delete timestamp
    print(df)
    df_year = df.resample('Y').mean()
    df_month = df.resample('M').mean()
    df_week = df.resample('W').mean()
    df_day = df.resample('D').mean()
    print(df_day)

    lines = df.plot.line() # works

    # plt.savefig('books_read.png')

    # sns.lineplot(data=data, palette="tab10", linewidth=2.5)

    return {'result': True}

@apis.route('/tenant_list', methods=['GET', 'POST'])
def tenant_list():
    
    # The statement below can be used to filter entried from the table
    # tenant_list = User.objects.filter(email = "1234")

    tenant_list = User.objects.all()

    try:
        
        temp_ls = []
        for i in tenant_list:
            temp_ls.append({'firstName': i['firstName'], 'lastName': i['lastName'], 'email': i["email"]}) # need to hash email when sent to front-end, being used as an id to find graphs later
        
        if tenant_list != None:
            return {'result': True, 'user_type': "temp", 'tenant_list': temp_ls}
        else:
            return {'result': False}
    except:
        print("error")
        return {'result': False}

@apis.route('/auditChecklist', methods=['GET', 'POST'])
def audit_checklist():
    ts = datetime.now().today()
    print(ts)
    body = request.get_json()
    audit = Audit_non_FB(**body)
    audit.timestamp = str(ts)
    audit.computeTotalScore()
    audit.save()
    return {'statusText': True}

