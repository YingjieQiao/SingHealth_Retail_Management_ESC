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
import matplotlib.pyplot as plt
import base64



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
    df_year = df.resample('Y').mean()
    df_month = df.resample('M').mean()
    df_week = df.resample('W').mean()
    df_day = df.resample('D').mean()

    plt.switch_backend('agg')
    plt.figure(figsize = (10, 6))
    plt.ylim((0,100))
    plt.plot(df_day.index,list(df_day['profScore']), color='blue')
    plt.plot(df_day.index,list(df_day['housekeepingScore']), color='orange')
    plt.plot(df_day.index,list(df_day['workSafetyScore']), color='green')
    plt.plot(df_day.index,list(df_day['totalScore']), color='red')
    plt.plot(df_day.index,list(df_day['profScore']), 'o', color='blue')
    plt.plot(df_day.index,list(df_day['housekeepingScore']), 'o', color='orange')
    plt.plot(df_day.index,list(df_day['workSafetyScore']), 'o', color='green')
    plt.plot(df_day.index,list(df_day['totalScore']), 'o', color='red')
    plt.legend(['Professional Score', 'House Keeping Score', 'Work Safety Score', 'Total Score'], loc='upper right')
    plt.title(body.get('tenantName') + "'s Audity Score")
    plt.xlabel('Time Period')
    plt.ylabel('Score')
    values = [str(i)[:-9] for i in list(df_day.index)] 
    plt.xticks(df_day.index,values)
    plt.savefig('audit_day.png', bbox_inches='tight')
    plt.close()

    plt.switch_backend('agg')
    plt.figure(figsize = (10, 6))
    plt.ylim((0,100))
    plt.plot(df_week.index,list(df_week['profScore']), color='blue')
    plt.plot(df_week.index,list(df_week['housekeepingScore']), color='orange')
    plt.plot(df_week.index,list(df_week['workSafetyScore']), color='green')
    plt.plot(df_week.index,list(df_week['totalScore']), color='red')
    plt.plot(df_week.index,list(df_week['profScore']), 'o', color='blue')
    plt.plot(df_week.index,list(df_week['housekeepingScore']), 'o', color='orange')
    plt.plot(df_week.index,list(df_week['workSafetyScore']), 'o', color='green')
    plt.plot(df_week.index,list(df_week['totalScore']), 'o', color='red')
    plt.legend(['Professional Score', 'House Keeping Score', 'Work Safety Score', 'Total Score'], loc='upper right')
    plt.title(body.get('tenantName') + "'s Audity Score")
    plt.xlabel('Time Period')
    plt.ylabel('Score')
    values = [str(i)[:-9] for i in list(df_week.index)] 
    plt.xticks(df_week.index,values)
    plt.savefig('audit_week.png', bbox_inches='tight')
    plt.close()

    plt.switch_backend('agg')
    plt.figure(figsize = (10, 6))
    plt.ylim((0,100))
    plt.plot(df_month.index,list(df_month['profScore']), color='blue')
    plt.plot(df_month.index,list(df_month['housekeepingScore']), color='orange')
    plt.plot(df_month.index,list(df_month['workSafetyScore']), color='green')
    plt.plot(df_month.index,list(df_month['totalScore']), color='red')
    plt.plot(df_month.index,list(df_month['profScore']), 'o', color='blue')
    plt.plot(df_month.index,list(df_month['housekeepingScore']), 'o', color='orange')
    plt.plot(df_month.index,list(df_month['workSafetyScore']), 'o', color='green')
    plt.plot(df_month.index,list(df_month['totalScore']), 'o', color='red')
    plt.legend(['Professional Score', 'House Keeping Score', 'Work Safety Score', 'Total Score'], loc='upper right')
    plt.title(body.get('tenantName') + "'s Audity Score")
    plt.xlabel('Time Period')
    plt.ylabel('Score')
    values = [str(i)[:-9] for i in list(df_month.index)] 
    plt.xticks(df_month.index,values)
    plt.savefig('audit_month.png', bbox_inches='tight')
    plt.close()

    plt.switch_backend('agg')
    plt.figure(figsize = (10, 6))
    plt.ylim((0,100))
    plt.plot(df_year.index,list(df_year['profScore']), color='blue')
    plt.plot(df_year.index,list(df_year['housekeepingScore']), color='orange')
    plt.plot(df_year.index,list(df_year['workSafetyScore']), color='green')
    plt.plot(df_year.index,list(df_year['totalScore']), color='red')
    plt.plot(df_year.index,list(df_year['profScore']), 'o', color='blue')
    plt.plot(df_year.index,list(df_year['housekeepingScore']), 'o', color='orange')
    plt.plot(df_year.index,list(df_year['workSafetyScore']), 'o', color='green')
    plt.plot(df_year.index,list(df_year['totalScore']), 'o', color='red')
    plt.legend(['Professional Score', 'House Keeping Score', 'Work Safety Score', 'Total Score'], loc='upper right')
    plt.title(body.get('tenantName') + "'s Audity Score")
    plt.xlabel('Time Period')
    plt.ylabel('Score')
    values = [str(i)[:-9] for i in list(df_year.index)] 
    plt.xticks(df_year.index,values)
    plt.savefig('audit_year.png', bbox_inches='tight')
    plt.close()

    with open("audit_day.png", "rb") as img_file:
        audit_day = str(base64.b64encode(img_file.read()))
    with open("audit_week.png", "rb") as img_file:
        audit_week = str(base64.b64encode(img_file.read()))
    with open("audit_month.png", "rb") as img_file:
        audit_month = str(base64.b64encode(img_file.read()))
    with open("audit_year.png", "rb") as img_file:
        audit_year = str(base64.b64encode(img_file.read()))
    
    df = df.drop(columns=["timestamp"])
    df.insert(4, 'timestamp', df.index.tolist())
    df.reset_index(drop=True, inplace=True) 
    
    df_day['timestamp'] = df_day.index
    df_week['timestamp'] = df_week.index
    df_month['timestamp'] = df_month.index
    df_year['timestamp'] = df_year.index

    print(df_day.values.T.tolist())

    print(df.values.T.tolist())
    
    # df_day.to_json("audit_day.json")
    # audit_day_csv = make_response(df_day.to_csv())

    # resp.headers["Content-Disposition"] = "attachment; filename=audit_day.csv"
    # resp.headers["Content-Type"] = "text/csv"
    # df_day.to_json("audit_day.json")
    # audit_week_csv = make_response(df_week.to_csv())
    # resp.headers["Content-Disposition"] = "attachment; filename=audit_week.csv"
    # resp.headers["Content-Type"] = "text/csv"
    # df_day.to_json("audit_day.json")
    # audit_day_csv = make_response(df_day.to_csv())
    # resp.headers["Content-Disposition"] = "attachment; filename=audit_day.csv"
    # resp.headers["Content-Type"] = "text/csv"
    # df_day.to_json("audit_day.json")
    # audit_day_csv = make_response(df_day.to_csv())
    # resp.headers["Content-Disposition"] = "attachment; filename=audit_day.csv"
    # resp.headers["Content-Type"] = "text/csv"
    # df_day.to_json("audit_day.json")
    # audit_day_csv = make_response(df_day.to_csv())
    # resp.headers["Content-Disposition"] = "attachment; filename=audit_day.csv"
    # resp.headers["Content-Type"] = "text/csv"

    # with open("audit_day.json", "r") as file:
    #     audit_day_csv = base64.b64encode(file.read())
    # with open("audit_week.json", "r") as file:
    #     audit_week_csv = base64.b64encode(file.read())
    # with open("audit_month.json", "r") as file:
    #     audit_month_csv = base64.b64encode(file.read())
    # with open("audit_year.json", "r") as file:
    #     audit_year_csv = base64.b64encode(file.read())

    # df.to_csv("audit.json")

    # with open("audit.json", "r") as file:
    #     audit_csv = base64.b64encode(file.read())

    for i in ["audit_day.png", "audit_week.png", "audit_month.png", "audit_year.png"]:#, "audit_day.csv", "audit_week.csv", "audit_month.csv", "audit_year.csv", "audit.csv"]:
        os.remove(i)

    return {'result': True, "audit_day_img": audit_day, "audit_week_img": audit_week, "audit_month_img": audit_month, "audit_year_img": audit_year, "columns": list(df_day.columns), "audit_day_csv": df_day.values.T.tolist(), "audit_week_csv": df_week.values.T.tolist(), "audit_month_csv": df_month.values.T.tolist(), "audit_year_csv": df_year.values.T.tolist(), "audit_csv": df.values.T.tolist()}

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

