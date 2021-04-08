from flask import Blueprint, request, session, jsonify, url_for, current_app, send_from_directory
from app.models import User, Audit_non_FB, Photo, Audit_FB, Covid_Compliance
import boto3
from botocore.exceptions import ClientError
import logging
from PIL import Image
import os
from datetime import datetime
import json

from . import settings, s3_methods, utils

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
from itsdangerous import URLSafeTimedSerializer, SignatureExpired

import csv #new library
from fpdf import FPDF #new library included
from reportlab.lib.enums import TA_JUSTIFY, TA_CENTER, TA_LEFT
from reportlab.lib.pagesizes import letter
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Image
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch

import shutil

s = URLSafeTimedSerializer('Thisisasecret!')

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
    print(body)
    try:
        user = User(**body)
        user.hash_password()
        user.save()
        userid = user.id
    except Exception as e:
        print("error: ", e)
        return {'result': False, 'info': "Registeration Failed"}, 500

    response = {
        'id': str(userid),
        'firstName': body['firstName'],
        'lastName': body['lastName'],
        'email': body['email'],
        'mobile': body['mobile'],
        'location': body['location'],
    }

    # code to verify user

    # try:
    #     message = MIMEMultipart()
    #     message["From"] = sender_email
    #     email = body['email']
    #     message["To"] = email
    #     message["Subject"] = "Registeration Confirmation for SingHealth Account"
    # except:
    #     print("error occured")
    #     return {'result': False, 'info': "user does not exist"}

    # token = s.dumps(email, salt='register')

    # link = url_for('apis.registeration_confirmation', token=token, _external=True)
    # link = link.replace("5000","3000")
    # print(link)

    # body = "Thank you for registering to SingHealth, Please click on the link given below to confirm your registeration \n\n {}".format(link)

    # message.attach(MIMEText(body, "plain"))

    # text = message.as_string()

    # # Log in to server using secure context and send email
    # context = ssl.create_default_context()
    # with smtplib.SMTP_SSL("smtp.gmail.com", 465, context=context) as server:
    #     server.login(sender_email, password)
    #     server.sendmail(sender_email, email, text)
    return {'result': True, 'info': "Registeration Success"}, 200

# Code to verify the link for user registration, not being used for now

# @apis.route('/registeration_confirmation/<token>')
# def registeration_confirmation(token):

#     try:
#         email = s.loads(token, salt='register', max_age=3600) #age needs to be increased to allow longer duration for the link to exist
#         # User.registeration_verify(email)
#         User.objects(email=email).update_one(verify=1)

#         return {'result': True, 'info': "Registeration Confirmed"}, 200
#     except SignatureExpired:
#         return {'result': False, 'info': "Link has expired"}, 200

@apis.route('/login', methods=['GET', 'POST'])
def user_login():
    body = request.get_json()
    try:
        print(body)
        user = User.objects.get(email=body.get('email'))
        firstName = user.firstName
        lastName = user.lastName
        authorized = user.check_password(body.get('password'))
        if not authorized:
            return {'result': False, 'info': "password error"}, 500
    except:
        return {'result': False, 'info': "user does not exist or payload error"}, 500

    settings.username = firstName + lastName

    try:
        message = MIMEMultipart()
        message["From"] = sender_email
        email = body.get('email')
        message["To"] = email
        message["Subject"] = "Link to login to SingHealth"
    except:
        print("error occured")
        return {'result': False, 'info': "user does not exist"}, 500

    token = s.dumps(body.get('email'), salt='login')

    link = url_for('apis.login_verified', token=token, _external=True)
    link = link.replace("5000","3000")

    body = "Please copy on the token for 2FA  \n\n {}".format(token)

    message.attach(MIMEText(body, "plain"))

    text = message.as_string()

    # Log in to server using secure context and send email
    context = ssl.create_default_context()
    with smtplib.SMTP_SSL("smtp.gmail.com", 465, context=context) as server:
        server.login(sender_email, password)
        server.sendmail(sender_email, email, text)
    #TODO add info to global log file

    settings.username = firstName + lastName
    print(settings.username)
    return {'result': True, 'info': "2FA sent", "token":token,
             'firstName': firstName, 'lastName': lastName,
             'staff': user.staff, 'tenant': user.tenant, 'admin': user.admin}


@apis.route('/login_verified', methods=['GET', 'POST'])
def login_verified():

    body = request.get_json()
    try:
        print(body.get('email'))
        email = s.loads(body.get("token"), salt='login', max_age=120) #age needs to be increased to allow longer duration for the link to exist
        print(email)
        user = User.objects.get(email=email)
        firstName = user.firstName
        lastName = user.lastName
        staff=user.staff
        admin=user.admin
        tenant=user.tenant
        settings.username = firstName + lastName
        print("ni")
        return {'result': True, 'firstName': firstName, 'lastName': lastName, 'staff':staff, 'admin':admin, 'tenant':tenant}, 200 #this returns the details of the user 
    except:
        print('no')
        return {'result': False, 'info': "2FA error"}, 500
    # except SignatureExpired:
    #     return {'result': False, 'info': "Link has expired"}, 200


@apis.route('/upload_file', methods=['GET', 'POST'])
def upload_file():
    if current_app.config['TESTING']:
        testFilePath = os.getcwd() + "/assets/image.jpg"
        body = Image.open(testFilePath)
    else:
        body = request.files['file']
        
    time_ = request.form['time']
    date_ = request.form['date']

    username = settings.username
    if username == "":
        username = 'UnitTester'
        print("testing s3 download") #TODO change to logging
    filename = username + "_" + date_ + "_" + time_ + ".jpg"

    if current_app.config['TESTING']:
        rgb_img = body.convert('RGB')
        rgb_img.save(filename)
    else:
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


@apis.route('/download_file', methods=['GET'])
def download_file():
    username = settings.username
    if username == "":
        username = 'UnitTester'
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
    time_ = body['time']
    date_ = body['date']
    print(body)

    if settings.username == "":
        settings.username = "UnitTester"
        print("testing") #TODO change to logging

    try:
        photoInfo = Photo.objects(date=date_, time=time_, staffName=settings.username)
        photoInfo.update(**body)
    except Exception as e:
        print("error: ", e) #TODO: change to logging
        return {'result': False}, 500

    return {'result': True}, 200


@apis.route('/display_data', methods=['POST'])
def display_data():
    
    body = request.get_json()
    tableName = body['tableName']
    try:
        mapping = {
            'User': 0,
            'Photo': 1
        }
        res = utils.get_data()
    except Exception as e:
        print("error: ", e)
        return {'result': False, 'data': None, 'info': 'failed'}, 500
    data = res[mapping[tableName]]

    return {'result': True, 'data': data, 'info': 'success'}, 200


@apis.route('/download_data_csv', methods=['POST'])
def download_data_csv():
    try:
        body = request.get_json()
        tableName = body['tableName']
        mapping = {
            'User': 0,
            'Photo': 1
        }

        res = utils.get_data()
        data = res[mapping[tableName]]

        dataDict = utils.mongo_object_to_dict(data)
        filePath, fileName = utils.write_to_csv(dataDict, tableName)
    except Exception as e:
        print("error, ", e)
        return {'result': False, 'data': None, 'info': 'failed'}, 500

    return send_from_directory(filePath, fileName, as_attachment=True), 200


@apis.route('/remove_temp_files', methods=['GET', 'POST'])
def remove_temp_files():
    try:
        utils.clear_assets()
    except Exception as e:
        print("error: ", e)
        return {'result': False}, 500

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

@apis.route('/tenant_list', methods=['GET', 'POST'])
def tenant_list():
    
    tenant_list = User.objects(tenant = True)

    try:
        temp_ls = []
        for i in tenant_list:
            if i['tenant'] == True:
                temp_ls.append({'firstName': i['firstName'], 'lastName': i['lastName'], 'email': i["email"], 'location': i['location']}) # need to hash email when sent to front-end, being used as an id to find graphs later
        
        if tenant_list != None:
            return {'result': True, 'user_type': "temp", 'tenant_list': temp_ls}
        else:
            return {'result': False}
    except:
        print("error")
        return {'result': False}

@apis.route('/tenant_list_FB', methods=['GET', 'POST'])
def tenant_list_FB():
    
    # The statement below can be used to filter entried from the table
    tenant_list = User.objects(fnb = True, tenant = True)

    try:
        
        temp_ls = []
        for i in tenant_list:
            temp_ls.append({'firstName': i['firstName'], 'lastName': i['lastName'], 'email': i["email"], 'location': i['location']}) # need to hash email when sent to front-end, being used as an id to find graphs later
        
        if tenant_list != None:
            return {'result': True, 'user_type': "temp", 'tenant_list': temp_ls}, 200
        else:
            return {'result': False}, 500
    except:
        print("error")
        return {'result': False}, 500

@apis.route('/tenant_list_non_FB', methods=['GET', 'POST'])
def tenant_list_non_FB():
    
    # The statement below can be used to filter entried from the table
    tenant_list = User.objects(fnb = False, tenant = True)

    try:
        
        temp_ls = []
        for i in tenant_list:
            temp_ls.append({'firstName': i['firstName'], 'lastName': i['lastName'], 'email': i["email"], 'location': i['location']}) # need to hash email when sent to front-end, being used as an id to find graphs later
        
        if tenant_list != None:
            return {'result': True, 'user_type': "temp", 'tenant_list': temp_ls}, 200
        else:
            return {'result': False}, 500
    except:
        print("error")
        return {'result': False}, 500

@apis.route('/auditChecklistFB', methods=['GET', 'POST'])
def auditchecklistFB():
    ts = datetime.now().today()
    body = request.get_json()
    print(body)
    body['workSafetyScore'] = body['workSafetyHealthScore'] 
    body['profScore'] = body['profStaffHydScore'] 
    body['housekeepingScore'] = body['housekeepScore']
    body['foodHygieneScore'] = body['foodHydScore']
    body.pop('workSafetyHealthScore')
    body.pop('profStaffHydScore')
    body.pop('housekeepScore')
    body.pop('foodHydScore')
    print(body)
    audit = Audit_FB(**body)
    audit.timestamp = str(ts)
    audit.computeTotalScore()
    audit.save()
    return {'statusText': True}

@apis.route('/auditChecklistNonFB', methods=['GET', 'POST'])
def auditchecklistNonFB():
    ts = datetime.now().today()
    body = request.get_json()
    try:
        body['workSafetyScore'] = body['workSafetyHealthScore']
        body['profScore'] = body['profStaffHydScore']
        body['housekeepingScore'] = body['houseGeneralScore']
        body.pop('workSafetyHealthScore')
        body.pop('profStaffHydScore')
        body.pop('houseGeneralScore')
        audit = Audit_non_FB(**body)
        audit.timestamp = str(ts)
        audit.computeTotalScore()
        audit.save()
        return {'statusText': True}, 200
    except:
        return {'statusText': False}, 500

@apis.route('/covidChecklist', methods=['GET', 'POST'])
def covidchecklist():
    ts = datetime.now().today()
    body = request.get_json()
    print(body)
    dc = {}
    dc['auditorName'] = body['auditorName']
    dc['auditeeName'] = body['auditeeName']
    dc['auditorDepartment'] = body['auditorDepartment']
    dc['comment'] = body['comment']
    ls = []
    for i in range(1,10):
        ls.append(body['00' + str(i)])
    for i in range(10,14):
        ls.append(body['0' + str(i)])    
    dc['checklist'] = ls
    audit = Covid_Compliance(**dc)
    audit.timestamp = str(ts)
    audit.save()
    return {'statusText': True}

@apis.route('/dashboard_data', methods=['GET', 'POST'])
def dashboard_data():
    
    body = request.get_json(silent=True)

    user = User.objects.get(email=body.get('tenant'))

    if user.fnb:
        
        audit_ls = Audit_FB.objects(auditeeName = body.get('tenant'))

        if len(audit_ls) == 0:
            return {'status': False, 'info': "Not enough data entries"}

        temp_ls = [[i.timestamp, i.profScore, i.housekeepingScore, i.workSafetyScore, i.healthierScore, i.foodHygieneScore ,i.totalScore] for i in audit_ls]
        df = pd.DataFrame(temp_ls)
        df.columns = ['timestamp','profScore', 'housekeepingScore', 'workSafetyScore', 'healthierScore', 'foodHygieneScore','totalScore']
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
        plt.plot(df_day.index,list(df_day['healthierScore']), color='yellow')
        plt.plot(df_day.index,list(df_day['foodHygieneScore']), color='brown')
        plt.plot(df_day.index,list(df_day['totalScore']), color='red')
        plt.plot(df_day.index,list(df_day['profScore']), 'o', color='blue')
        plt.plot(df_day.index,list(df_day['housekeepingScore']), 'o', color='orange')
        plt.plot(df_day.index,list(df_day['workSafetyScore']), 'o', color='green')
        plt.plot(df_day.index,list(df_day['healthierScore']), 'o', color='yellow')
        plt.plot(df_day.index,list(df_day['foodHygieneScore']), 'o', color='brown')
        plt.plot(df_day.index,list(df_day['totalScore']), 'o', color='red')
        plt.legend(['Professional Score', 'House Keeping Score', 'Work Safety Score', 'Healthier Score', 'Food Hygiene Score' 'Total Score'], loc='upper right')
        plt.title(body.get('tenant') + "'s Audity Score")
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
        plt.plot(df_week.index,list(df_week['healthierScore']), color='yellow')
        plt.plot(df_week.index,list(df_week['foodHygieneScore']), color='brown')
        plt.plot(df_week.index,list(df_week['totalScore']), color='red')
        plt.plot(df_week.index,list(df_week['profScore']), 'o', color='blue')
        plt.plot(df_week.index,list(df_week['housekeepingScore']), 'o', color='orange')
        plt.plot(df_week.index,list(df_week['workSafetyScore']), 'o', color='green')
        plt.plot(df_week.index,list(df_week['healthierScore']), 'o', color='yellow')
        plt.plot(df_week.index,list(df_week['foodHygieneScore']), 'o', color='brown')
        plt.plot(df_week.index,list(df_week['totalScore']), 'o', color='red')
        plt.legend(['Professional Score', 'House Keeping Score', 'Work Safety Score', 'Healthier Score', 'Food Hygiene Score' 'Total Score'], loc='upper right')
        plt.title(body.get('tenant') + "'s Audity Score")
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
        plt.plot(df_month.index,list(df_month['healthierScore']), color='yellow')
        plt.plot(df_month.index,list(df_month['foodHygieneScore']), color='brown')
        plt.plot(df_month.index,list(df_month['totalScore']), color='red')
        plt.plot(df_month.index,list(df_month['profScore']), 'o', color='blue')
        plt.plot(df_month.index,list(df_month['housekeepingScore']), 'o', color='orange')
        plt.plot(df_month.index,list(df_month['workSafetyScore']), 'o', color='green')
        plt.plot(df_month.index,list(df_month['healthierScore']), 'o', color='yellow')
        plt.plot(df_month.index,list(df_month['foodHygieneScore']), 'o', color='brown')
        plt.plot(df_month.index,list(df_month['totalScore']), 'o', color='red')
        plt.legend(['Professional Score', 'House Keeping Score', 'Work Safety Score', 'Healthier Score', 'Food Hygiene Score' 'Total Score'], loc='upper right')
        plt.title(body.get('tenant') + "'s Audity Score")
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
        plt.plot(df_year.index,list(df_year['healthierScore']), color='yellow')
        plt.plot(df_year.index,list(df_year['foodHygieneScore']), color='brown')
        plt.plot(df_year.index,list(df_year['totalScore']), color='red')
        plt.plot(df_year.index,list(df_year['profScore']), 'o', color='blue')
        plt.plot(df_year.index,list(df_year['housekeepingScore']), 'o', color='orange')
        plt.plot(df_year.index,list(df_year['workSafetyScore']), 'o', color='green')
        plt.plot(df_year.index,list(df_year['healthierScore']), 'o', color='yellow')
        plt.plot(df_year.index,list(df_year['foodHygieneScore']), 'o', color='brown')
        plt.plot(df_year.index,list(df_year['totalScore']), 'o', color='red')
        plt.legend(['Professional Score', 'House Keeping Score', 'Work Safety Score', 'Healthier Score', 'Food Hygiene Score' 'Total Score'], loc='upper right')
        plt.title(body.get('tenant') + "'s Audity Score")
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

        for i in ["audit_day.png", "audit_week.png", "audit_month.png", "audit_year.png"]:#, "audit_day.csv", "audit_week.csv", "audit_month.csv", "audit_year.csv", "audit.csv"]:
            os.remove(i)

        return {'result': True, "audit_day_img": audit_day[2:-1], "audit_week_img": audit_week[2:-1], "audit_month_img": audit_month[2:-1], "audit_year_img": audit_year[2:-1], "audit_day_csv": [list(df_day.columns)] + df_day.values.tolist(), "audit_week_csv": [list(df_day.columns)] + df_week.values.tolist(), "audit_month_csv": [list(df_day.columns)] + df_month.values.tolist(), "audit_year_csv": [list(df_day.columns)] + df_year.values.tolist(), "audit_csv": [list(df_day.columns)] + df.values.tolist()}

    else:

        audit_ls = Audit_non_FB.objects(auditeeName = body.get('tenant'))

        if len(audit_ls) == 0:
            return {'status': False, 'info': "Not enough data entries"}

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
        plt.title(body.get('tenant') + "'s Audity Score")
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
        plt.title(body.get('tenant') + "'s Audity Score")
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
        plt.title(body.get('tenant') + "'s Audity Score")
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
        plt.title(body.get('tenant') + "'s Audity Score")
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

        for i in ["audit_day.png", "audit_week.png", "audit_month.png", "audit_year.png"]:#, "audit_day.csv", "audit_week.csv", "audit_month.csv", "audit_year.csv", "audit.csv"]:
            os.remove(i)

        return {'result': True, "audit_day_img": audit_day[2:-1], "audit_week_img": audit_week[2:-1], "audit_month_img": audit_month[2:-1], "audit_year_img": audit_year[2:-1], "audit_day_csv": df_day.values.tolist(), "audit_week_csv": [list(df_day.columns)] + df_week.values.tolist(), "audit_month_csv": [list(df_day.columns)] + df_month.values.tolist(), "audit_year_csv": [list(df_day.columns)] + df_year.values.tolist(), "audit_csv": [list(df_day.columns)] + df.values.tolist()},200


@apis.route('/compare_tenant', methods=['GET', 'POST'])
def compare_tenant():
    
    body = request.get_json()
    
    user = User.objects.get(email=body.get('institute1'))

    if user.fnb:

        audit_ls_1 = Audit_FB.objects(auditeeName = body.get('institute1'))
        audit_ls_2 = Audit_FB.objects(auditeeName = body.get('institute2'))

        if len(audit_ls_1) == 0 or len(audit_ls_2) == 0:
            return {'status': False, 'info': "Not enough data entries"},200

        temp_ls = [[i.timestamp, i.profScore, i.housekeepingScore, i.workSafetyScore, i.healthierScore, i.foodHygieneScore, i.totalScore] for i in audit_ls_1]
        df_1 = pd.DataFrame(temp_ls)
        df_1.columns =  ['timestamp','profScore', 'housekeepingScore', 'workSafetyScore', 'healthierScore', 'foodHygieneScore','totalScore']
        df_1['timestamp'] = pd.to_datetime(df_1['timestamp'])
        df_1.index = df_1['timestamp'] 
        df_year_1 = df_1.resample('Y').mean()
        df_month_1 = df_1.resample('M').mean()
        df_week_1 = df_1.resample('W').mean()
        df_day_1 = df_1.resample('D').mean()

        temp_ls = [[i.timestamp, i.profScore, i.housekeepingScore, i.workSafetyScore, i.healthierScore, i.foodHygieneScore, i.totalScore] for i in audit_ls_2]
        df_2 = pd.DataFrame(temp_ls)
        df_2.columns =  ['timestamp','profScore', 'housekeepingScore', 'workSafetyScore', 'healthierScore', 'foodHygieneScore','totalScore']
        df_2['timestamp'] = pd.to_datetime(df_2['timestamp'])
        df_2.index = df_2['timestamp'] 
        df_year_2 = df_2.resample('Y').mean()
        df_month_2 = df_2.resample('M').mean()
        df_week_2 = df_2.resample('W').mean()
        df_day_2 = df_2.resample('D').mean()

        plt.switch_backend('agg')
        plt.figure(figsize = (14, 8))
        plt.ylim((0,100))
        plt.plot(df_day_1.index,list(df_day_1['profScore']), color='limegreen')
        plt.plot(df_day_1.index,list(df_day_1['housekeepingScore']), color='forestgreen')
        plt.plot(df_day_1.index,list(df_day_1['workSafetyScore']), color='cornflowerblue')
        plt.plot(df_day_1.index,list(df_day_1['healthierScore']), color='yellow')
        plt.plot(df_day_1.index,list(df_day_1['foodHygieneScore']), color='brown')
        plt.plot(df_day_1.index,list(df_day_1['totalScore']), color='royalblue')
        plt.plot(df_day_2.index,list(df_day_2['profScore']), color='lightcoral')
        plt.plot(df_day_2.index,list(df_day_2['housekeepingScore']), color='indianred')
        plt.plot(df_day_2.index,list(df_day_2['workSafetyScore']), color='tomato')
        plt.plot(df_day_2.index,list(df_day_2['healthierScore']), color='hotpink')
        plt.plot(df_day_2.index,list(df_day_2['foodHygieneScore']), color='pink')
        plt.plot(df_day_2.index,list(df_day_2['totalScore']), color='peru')
        plt.plot(df_day_1.index,list(df_day_1['profScore']), 'o', color='limegreen')
        plt.plot(df_day_1.index,list(df_day_1['housekeepingScore']), 'o', color='forestgreen')
        plt.plot(df_day_1.index,list(df_day_1['workSafetyScore']), 'o', color='royalblue')
        plt.plot(df_day_1.index,list(df_day_1['healthierScore']), 'o', color='yellow')
        plt.plot(df_day_1.index,list(df_day_1['foodHygieneScore']), 'o', color='brown')
        plt.plot(df_day_1.index,list(df_day_1['totalScore']), 'o', color='limegreen')
        plt.plot(df_day_2.index,list(df_day_2['profScore']), 'o', color='lightcoral')
        plt.plot(df_day_2.index,list(df_day_2['housekeepingScore']), 'o', color='indianred')
        plt.plot(df_day_2.index,list(df_day_2['workSafetyScore']), 'o', color='tomato')
        plt.plot(df_day_2.index,list(df_day_2['healthierScore']), 'o', color='hotpink')
        plt.plot(df_day_2.index,list(df_day_2['foodHygieneScore']), 'o', color='pink')
        plt.plot(df_day_2.index,list(df_day_2['totalScore']), 'o', color='peru')
        plt.legend(['Professional Score of ' + body.get('institute1'), 'House Keeping Score of ' + body.get('institute1'), 'Work Safety Score of ' + body.get('institute1'), 'Healthier Score of ' + body.get('institute1'), 'Hygiene Score of ' + body.get('institute1'), 'Total Score of ' + body.get('institute1'), 'Professional Score of ' + body.get('institute2'), 'House Keeping Score of ' + body.get('institute2'), 'Work Safety Score of ' + body.get('institute2'), 'Healthier Score of ' + body.get('institute2'), 'Hygiene Score of ' + body.get('institute2'), 'Total Score of ' + body.get('institute2')], loc='upper right')
        plt.title('Comparing ' + body.get('institute1') + ' and ' + body.get('institute2') + " Audit Scores")
        plt.xlabel('Time Period')
        plt.ylabel('Score')
        values = [str(i)[:-9] for i in list(set(list(df_day_1.index) + list(df_day_2.index)))] 
        plt.xticks(list(set(list(df_day_1.index) + list(df_day_2.index))),values)
        plt.savefig('audit_day.png', bbox_inches='tight')
        plt.close()

        plt.switch_backend('agg')
        plt.figure(figsize = (14, 8))
        plt.ylim((0,100))
        plt.plot(df_week_1.index,list(df_week_1['profScore']), color='limegreen')
        plt.plot(df_week_1.index,list(df_week_1['housekeepingScore']), color='forestgreen')
        plt.plot(df_week_1.index,list(df_week_1['workSafetyScore']), color='cornflowerblue')
        plt.plot(df_week_1.index,list(df_week_1['healthierScore']), color='yellow')
        plt.plot(df_week_1.index,list(df_week_1['foodHygieneScore']), color='brown')
        plt.plot(df_week_1.index,list(df_week_1['totalScore']), color='royalblue')
        plt.plot(df_week_2.index,list(df_week_2['profScore']), color='lightcoral')
        plt.plot(df_week_2.index,list(df_week_2['housekeepingScore']), color='indianred')
        plt.plot(df_week_2.index,list(df_week_2['workSafetyScore']), color='tomato')
        plt.plot(df_week_2.index,list(df_week_2['healthierScore']), color='hotpink')
        plt.plot(df_week_2.index,list(df_week_2['foodHygieneScore']), color='pink')
        plt.plot(df_week_2.index,list(df_week_2['totalScore']), color='peru')
        plt.plot(df_week_1.index,list(df_week_1['profScore']), 'o', color='limegreen')
        plt.plot(df_week_1.index,list(df_week_1['housekeepingScore']), 'o', color='forestgreen')
        plt.plot(df_week_1.index,list(df_week_1['workSafetyScore']), 'o', color='royalblue')
        plt.plot(df_week_1.index,list(df_week_1['healthierScore']), 'o', color='yellow')
        plt.plot(df_week_1.index,list(df_week_1['foodHygieneScore']), 'o', color='brown')
        plt.plot(df_week_1.index,list(df_week_1['totalScore']), 'o', color='limegreen')
        plt.plot(df_week_2.index,list(df_week_2['profScore']), 'o', color='lightcoral')
        plt.plot(df_week_2.index,list(df_week_2['housekeepingScore']), 'o', color='indianred')
        plt.plot(df_week_2.index,list(df_week_2['workSafetyScore']), 'o', color='tomato')
        plt.plot(df_week_2.index,list(df_week_2['healthierScore']), 'o', color='hotpink')
        plt.plot(df_week_2.index,list(df_week_2['foodHygieneScore']), 'o', color='pink')
        plt.plot(df_week_2.index,list(df_week_2['totalScore']), 'o', color='peru')
        plt.legend(['Professional Score of ' + body.get('institute1'), 'House Keeping Score of ' + body.get('institute1'), 'Work Safety Score of ' + body.get('institute1'), 'Healthier Score of ' + body.get('institute1'), 'Hygiene Score of ' + body.get('institute1'), 'Total Score of ' + body.get('institute1'), 'Professional Score of ' + body.get('institute2'), 'House Keeping Score of ' + body.get('institute2'), 'Work Safety Score of ' + body.get('institute2'), 'Healthier Score of ' + body.get('institute2'), 'Hygiene Score of ' + body.get('institute2'), 'Total Score of ' + body.get('institute2')], loc='upper right')
        plt.title('Comparing ' + body.get('institute1') + ' and ' + body.get('institute2') + " Audit Scores")
        plt.xlabel('Time Period')
        plt.ylabel('Score')
        values = [str(i)[:-9] for i in list(set(list(df_week_1.index) + list(df_week_2.index)))] 
        plt.xticks(list(set(list(df_week_1.index) + list(df_week_2.index))),values)
        plt.savefig('audit_week.png', bbox_inches='tight')
        plt.close()

        plt.switch_backend('agg')
        plt.figure(figsize = (14, 8))
        plt.ylim((0,100))
        plt.plot(df_month_1.index,list(df_month_1['profScore']), color='limegreen')
        plt.plot(df_month_1.index,list(df_month_1['housekeepingScore']), color='forestgreen')
        plt.plot(df_month_1.index,list(df_month_1['workSafetyScore']), color='cornflowerblue')
        plt.plot(df_month_1.index,list(df_month_1['healthierScore']), color='yellow')
        plt.plot(df_month_1.index,list(df_month_1['foodHygieneScore']), color='brown')
        plt.plot(df_month_1.index,list(df_month_1['totalScore']), color='royalblue')
        plt.plot(df_month_2.index,list(df_month_2['profScore']), color='lightcoral')
        plt.plot(df_month_2.index,list(df_month_2['housekeepingScore']), color='indianred')
        plt.plot(df_month_2.index,list(df_month_2['workSafetyScore']), color='tomato')
        plt.plot(df_month_2.index,list(df_month_2['healthierScore']), color='hotpink')
        plt.plot(df_month_2.index,list(df_month_2['foodHygieneScore']), color='pink')
        plt.plot(df_month_2.index,list(df_month_2['totalScore']), color='peru')
        plt.plot(df_month_1.index,list(df_month_1['profScore']), 'o', color='limegreen')
        plt.plot(df_month_1.index,list(df_month_1['housekeepingScore']), 'o', color='forestgreen')
        plt.plot(df_month_1.index,list(df_month_1['workSafetyScore']), 'o', color='royalblue')
        plt.plot(df_month_1.index,list(df_month_1['healthierScore']), 'o', color='yellow')
        plt.plot(df_month_1.index,list(df_month_1['foodHygieneScore']), 'o', color='brown')
        plt.plot(df_month_1.index,list(df_month_1['totalScore']), 'o', color='limegreen')
        plt.plot(df_month_2.index,list(df_month_2['profScore']), 'o', color='lightcoral')
        plt.plot(df_month_2.index,list(df_month_2['housekeepingScore']), 'o', color='indianred')
        plt.plot(df_month_2.index,list(df_month_2['workSafetyScore']), 'o', color='tomato')
        plt.plot(df_month_2.index,list(df_month_2['healthierScore']), 'o', color='hotpink')
        plt.plot(df_month_2.index,list(df_month_2['foodHygieneScore']), 'o', color='pink')
        plt.plot(df_month_2.index,list(df_month_2['totalScore']), 'o', color='peru')
        plt.legend(['Professional Score of ' + body.get('institute1'), 'House Keeping Score of ' + body.get('institute1'), 'Work Safety Score of ' + body.get('institute1'), 'Healthier Score of ' + body.get('institute1'), 'Hygiene Score of ' + body.get('institute1'), 'Total Score of ' + body.get('institute1'), 'Professional Score of ' + body.get('institute2'), 'House Keeping Score of ' + body.get('institute2'), 'Work Safety Score of ' + body.get('institute2'), 'Healthier Score of ' + body.get('institute2'), 'Hygiene Score of ' + body.get('institute2'), 'Total Score of ' + body.get('institute2')], loc='upper right')
        plt.title('Comparing ' + body.get('institute1') + ' and ' + body.get('institute2') + " Audit Scores")
        plt.xlabel('Time Period')
        plt.ylabel('Score')
        values = [str(i)[:-9] for i in list(set(list(df_month_1.index) + list(df_month_2.index)))] 
        plt.xticks(list(set(list(df_month_1.index) + list(df_month_2.index))),values)
        plt.savefig('audit_month.png', bbox_inches='tight')
        plt.close()

        plt.switch_backend('agg')
        plt.figure(figsize = (14, 8))
        plt.ylim((0,100))
        plt.plot(df_year_1.index,list(df_year_1['profScore']), color='limegreen')
        plt.plot(df_year_1.index,list(df_year_1['housekeepingScore']), color='forestgreen')
        plt.plot(df_year_1.index,list(df_year_1['workSafetyScore']), color='cornflowerblue')
        plt.plot(df_year_1.index,list(df_year_1['healthierScore']), color='yellow')
        plt.plot(df_year_1.index,list(df_year_1['foodHygieneScore']), color='brown')
        plt.plot(df_year_1.index,list(df_year_1['totalScore']), color='royalblue')
        plt.plot(df_year_2.index,list(df_year_2['housekeepingScore']), color='indianred')
        plt.plot(df_year_2.index,list(df_year_2['workSafetyScore']), color='tomato')
        plt.plot(df_year_2.index,list(df_year_2['healthierScore']), color='hotpink')
        plt.plot(df_year_2.index,list(df_year_2['foodHygieneScore']), color='pink')
        plt.plot(df_year_2.index,list(df_year_2['totalScore']), color='peru')
        plt.plot(df_year_2.index,list(df_year_2['profScore']), 'o', color='lightcoral')
        plt.plot(df_year_1.index,list(df_year_1['profScore']), 'o', color='limegreen')
        plt.plot(df_year_1.index,list(df_year_1['housekeepingScore']), 'o', color='forestgreen')
        plt.plot(df_year_1.index,list(df_year_1['workSafetyScore']), 'o', color='royalblue')
        plt.plot(df_year_1.index,list(df_year_1['healthierScore']), 'o', color='yellow')
        plt.plot(df_year_1.index,list(df_year_1['foodHygieneScore']), 'o', color='brown')
        plt.plot(df_year_1.index,list(df_year_1['totalScore']), 'o', color='limegreen')
        plt.plot(df_year_2.index,list(df_year_2['profScore']), color='lightcoral')
        plt.plot(df_year_2.index,list(df_year_2['housekeepingScore']), 'o', color='indianred')
        plt.plot(df_year_2.index,list(df_year_2['workSafetyScore']), 'o', color='tomato')
        plt.plot(df_year_2.index,list(df_year_2['healthierScore']), 'o', color='hotpink')
        plt.plot(df_year_2.index,list(df_year_2['foodHygieneScore']), 'o', color='pink')
        plt.plot(df_year_2.index,list(df_year_2['totalScore']), 'o', color='peru')
        plt.legend(['Professional Score of ' + body.get('institute1'), 'House Keeping Score of ' + body.get('institute1'), 'Work Safety Score of ' + body.get('institute1'), 'Healthier Score of ' + body.get('institute1'), 'Hygiene Score of ' + body.get('institute1'), 'Total Score of ' + body.get('institute1'), 'Professional Score of ' + body.get('institute2'), 'House Keeping Score of ' + body.get('institute2'), 'Work Safety Score of ' + body.get('institute2'), 'Healthier Score of ' + body.get('institute2'), 'Hygiene Score of ' + body.get('institute2'), 'Total Score of ' + body.get('institute2')], loc='upper right')
        plt.title('Comparing ' + body.get('institute1') + ' and ' + body.get('institute2') + " Audit Scores")
        plt.xlabel('Time Period')
        plt.ylabel('Score')
        values = [str(i)[:-9] for i in list(set(list(df_year_1.index) + list(df_year_2.index)))] 
        plt.xticks(list(set(list(df_year_1.index) + list(df_year_2.index))),values)
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
        
        df_1 = df_1.drop(columns=["timestamp"])
        df_1.insert(4, 'timestamp', df_1.index.tolist())
        df_1.reset_index(drop=True, inplace=True) 

        df_2 = df_2.drop(columns=["timestamp"])
        df_2.insert(4, 'timestamp', df_2.index.tolist())
        df_2.reset_index(drop=True, inplace=True)

        df_day_1['timestamp'] = df_day_1.index
        df_week_1['timestamp'] = df_week_1.index
        df_month_1['timestamp'] = df_month_1.index
        df_year_1['timestamp'] = df_year_1.index

        df_day_2['timestamp'] = df_day_2.index
        df_week_2['timestamp'] = df_week_2.index
        df_month_2['timestamp'] = df_month_2.index
        df_year_2['timestamp'] = df_year_2.index

        for i in ["audit_day.png", "audit_week.png", "audit_month.png", "audit_year.png"]:#, "audit_day.csv", "audit_week.csv", "audit_month.csv", "audit_year.csv", "audit.csv"]:
            os.remove(i)
        
        return {'result': True, 
            "audit_day_img": audit_day[2:-1], "audit_week_img": audit_week[2:-1], 
            "audit_month_img": audit_month[2:-1], "audit_year_img": audit_year[2:-1], 
            "audit_day_csv_1": [list(df_day_1.columns)] + df_day_1.values.tolist(), 
            "audit_week_csv_1": [list(df_day_1.columns)] + df_week_1.values.tolist(), "audit_month_csv_1": [list(df_day_1.columns)] + df_month_1.values.tolist(), 
            "audit_year_csv": [list(df_day_1.columns)] + df_year_1.values.tolist(), "audit_day_csv_2": [list(df_day_1.columns)] + df_day_2.values.tolist(), 
            "audit_week_csv_2": [list(df_day_1.columns)] + df_week_2.values.tolist(), "audit_month_csv_2": [list(df_day_1.columns)] + df_month_2.values.tolist(), 
            "audit_year_csv_2": [list(df_day_1.columns)] + df_year_2.values.tolist(), "audit_csv_1": [list(df_day_1.columns)] + df_1.values.tolist(), 
            "audit_csv_2": [list(df_day_1.columns)] + df_2.values.tolist()}

    else:
        
        audit_ls_1 = Audit_non_FB.objects(auditeeName = body.get('institute1'))
        audit_ls_2 = Audit_non_FB.objects(auditeeName = body.get('institute2'))

        if len(audit_ls_1) == 0 or len(audit_ls_2) == 0:
            return {'status': False, 'info': "Not enough data entries"},200

        temp_ls = [[i.timestamp, i.profScore, i.housekeepingScore, i.workSafetyScore, i.totalScore] for i in audit_ls_1]
        df_1 = pd.DataFrame(temp_ls)
        df_1.columns = ['timestamp','profScore', 'housekeepingScore', 'workSafetyScore','totalScore']
        df_1['timestamp'] = pd.to_datetime(df_1['timestamp'])
        df_1.index = df_1['timestamp'] 
        df_year_1 = df_1.resample('Y').mean()
        df_month_1 = df_1.resample('M').mean()
        df_week_1 = df_1.resample('W').mean()
        df_day_1 = df_1.resample('D').mean()

        temp_ls = [[i.timestamp, i.profScore, i.housekeepingScore, i.workSafetyScore, i.totalScore] for i in audit_ls_2]
        df_2 = pd.DataFrame(temp_ls)
        df_2.columns = ['timestamp','profScore', 'housekeepingScore', 'workSafetyScore','totalScore']
        df_2['timestamp'] = pd.to_datetime(df_2['timestamp'])
        df_2.index = df_2['timestamp'] 
        df_year_2 = df_2.resample('Y').mean()
        df_month_2 = df_2.resample('M').mean()
        df_week_2 = df_2.resample('W').mean()
        df_day_2 = df_2.resample('D').mean()

        plt.switch_backend('agg')
        plt.figure(figsize = (14, 8))
        plt.ylim((0,100))
        plt.plot(df_day_1.index,list(df_day_1['profScore']), color='limegreen')
        plt.plot(df_day_1.index,list(df_day_1['housekeepingScore']), color='forestgreen')
        plt.plot(df_day_1.index,list(df_day_1['workSafetyScore']), color='cornflowerblue')
        plt.plot(df_day_1.index,list(df_day_1['totalScore']), color='royalblue')
        plt.plot(df_day_2.index,list(df_day_2['profScore']), color='lightcoral')
        plt.plot(df_day_2.index,list(df_day_2['housekeepingScore']), color='indianred')
        plt.plot(df_day_2.index,list(df_day_2['workSafetyScore']), color='tomato')
        plt.plot(df_day_2.index,list(df_day_2['totalScore']), color='peru')
        plt.plot(df_day_1.index,list(df_day_1['profScore']), 'o', color='limegreen')
        plt.plot(df_day_1.index,list(df_day_1['housekeepingScore']), 'o', color='forestgreen')
        plt.plot(df_day_1.index,list(df_day_1['workSafetyScore']), 'o', color='royalblue')
        plt.plot(df_day_1.index,list(df_day_1['totalScore']), 'o', color='limegreen')
        plt.plot(df_day_2.index,list(df_day_2['profScore']), 'o', color='lightcoral')
        plt.plot(df_day_2.index,list(df_day_2['housekeepingScore']), 'o', color='indianred')
        plt.plot(df_day_2.index,list(df_day_2['workSafetyScore']), 'o', color='tomato')
        plt.plot(df_day_2.index,list(df_day_2['totalScore']), 'o', color='peru')
        plt.legend(['Professional Score of ' + body.get('institute1'), 'House Keeping Score of ' + body.get('institute1'), 'Work Safety Score of ' + body.get('institute1'), 'Total Score of ' + body.get('institute1'), 'Professional Score of ' + body.get('institute2'), 'House Keeping Score of ' + body.get('institute2'), 'Work Safety Score of ' + body.get('institute2'), 'Total Score of ' + body.get('institute2')], loc='upper right')
        plt.title('Comparing ' + body.get('institute1') + ' and ' + body.get('institute2') + " Audit Scores")
        plt.xlabel('Time Period')
        plt.ylabel('Score')
        values = [str(i)[:-9] for i in list(set(list(df_day_1.index) + list(df_day_2.index)))] 
        plt.xticks(list(set(list(df_day_1.index) + list(df_day_2.index))),values)
        plt.savefig('audit_day.png', bbox_inches='tight')
        plt.close()

        plt.switch_backend('agg')
        plt.figure(figsize = (14, 8))
        plt.ylim((0,100))
        plt.plot(df_week_1.index,list(df_week_1['profScore']), color='limegreen')
        plt.plot(df_week_1.index,list(df_week_1['housekeepingScore']), color='forestgreen')
        plt.plot(df_week_1.index,list(df_week_1['workSafetyScore']), color='cornflowerblue')
        plt.plot(df_week_1.index,list(df_week_1['totalScore']), color='royalblue')
        plt.plot(df_week_2.index,list(df_week_2['profScore']), color='lightcoral')
        plt.plot(df_week_2.index,list(df_week_2['housekeepingScore']), color='indianred')
        plt.plot(df_week_2.index,list(df_week_2['workSafetyScore']), color='tomato')
        plt.plot(df_week_2.index,list(df_week_2['totalScore']), color='peru')
        plt.plot(df_week_1.index,list(df_week_1['profScore']), 'o', color='limegreen')
        plt.plot(df_week_1.index,list(df_week_1['housekeepingScore']), 'o', color='forestgreen')
        plt.plot(df_week_1.index,list(df_week_1['workSafetyScore']), 'o', color='royalblue')
        plt.plot(df_week_1.index,list(df_week_1['totalScore']), 'o', color='limegreen')
        plt.plot(df_week_2.index,list(df_week_2['profScore']), 'o', color='lightcoral')
        plt.plot(df_week_2.index,list(df_week_2['housekeepingScore']), 'o', color='indianred')
        plt.plot(df_week_2.index,list(df_week_2['workSafetyScore']), 'o', color='tomato')
        plt.plot(df_week_2.index,list(df_week_2['totalScore']), 'o', color='peru')
        plt.legend(['Professional Score of ' + body.get('institute1'), 'House Keeping Score of ' + body.get('institute1'), 'Work Safety Score of ' + body.get('institute1'), 'Total Score of ' + body.get('institute1'), 'Professional Score of ' + body.get('institute2'), 'House Keeping Score of ' + body.get('institute2'), 'Work Safety Score of ' + body.get('institute2'), 'Total Score of ' + body.get('institute2')], loc='upper right')
        plt.title('Comparing ' + body.get('institute1') + ' and ' + body.get('institute2') + " Audit Scores")
        plt.xlabel('Time Period')
        plt.ylabel('Score')
        values = [str(i)[:-9] for i in list(set(list(df_week_1.index) + list(df_week_2.index)))] 
        plt.xticks(list(set(list(df_week_1.index) + list(df_week_2.index))),values)
        plt.savefig('audit_week.png', bbox_inches='tight')
        plt.close()

        plt.switch_backend('agg')
        plt.figure(figsize = (14, 8))
        plt.ylim((0,100))
        plt.plot(df_month_1.index,list(df_month_1['profScore']), color='limegreen')
        plt.plot(df_month_1.index,list(df_month_1['housekeepingScore']), color='forestgreen')
        plt.plot(df_month_1.index,list(df_month_1['workSafetyScore']), color='cornflowerblue')
        plt.plot(df_month_1.index,list(df_month_1['totalScore']), color='royalblue')
        plt.plot(df_month_2.index,list(df_month_2['profScore']), color='lightcoral')
        plt.plot(df_month_2.index,list(df_month_2['housekeepingScore']), color='indianred')
        plt.plot(df_month_2.index,list(df_month_2['workSafetyScore']), color='tomato')
        plt.plot(df_month_2.index,list(df_month_2['totalScore']), color='peru')
        plt.plot(df_month_1.index,list(df_month_1['profScore']), 'o', color='limegreen')
        plt.plot(df_month_1.index,list(df_month_1['housekeepingScore']), 'o', color='forestgreen')
        plt.plot(df_month_1.index,list(df_month_1['workSafetyScore']), 'o', color='royalblue')
        plt.plot(df_month_1.index,list(df_month_1['totalScore']), 'o', color='limegreen')
        plt.plot(df_month_2.index,list(df_month_2['profScore']), 'o', color='lightcoral')
        plt.plot(df_month_2.index,list(df_month_2['housekeepingScore']), 'o', color='indianred')
        plt.plot(df_month_2.index,list(df_month_2['workSafetyScore']), 'o', color='tomato')
        plt.plot(df_month_2.index,list(df_month_2['totalScore']), 'o', color='peru')
        plt.legend(['Professional Score of ' + body.get('institute1'), 'House Keeping Score of ' + body.get('institute1'), 'Work Safety Score of ' + body.get('institute1'), 'Total Score of ' + body.get('institute1'), 'Professional Score of ' + body.get('institute2'), 'House Keeping Score of ' + body.get('institute2'), 'Work Safety Score of ' + body.get('institute2'), 'Total Score of ' + body.get('institute2')], loc='upper right')
        plt.title('Comparing ' + body.get('institute1') + ' and ' + body.get('institute2') + " Audit Scores")
        plt.xlabel('Time Period')
        plt.ylabel('Score')
        values = [str(i)[:-9] for i in list(set(list(df_month_1.index) + list(df_month_2.index)))] 
        plt.xticks(list(set(list(df_month_1.index) + list(df_month_2.index))),values)
        plt.savefig('audit_month.png', bbox_inches='tight')
        plt.close()

        plt.switch_backend('agg')
        plt.figure(figsize = (14, 8))
        plt.ylim((0,100))
        plt.plot(df_year_1.index,list(df_year_1['profScore']), color='limegreen')
        plt.plot(df_year_1.index,list(df_year_1['housekeepingScore']), color='forestgreen')
        plt.plot(df_year_1.index,list(df_year_1['workSafetyScore']), color='cornflowerblue')
        plt.plot(df_year_1.index,list(df_year_1['totalScore']), color='royalblue')
        plt.plot(df_year_2.index,list(df_year_2['housekeepingScore']), color='indianred')
        plt.plot(df_year_2.index,list(df_year_2['workSafetyScore']), color='tomato')
        plt.plot(df_year_2.index,list(df_year_2['totalScore']), color='peru')
        plt.plot(df_year_2.index,list(df_year_2['profScore']), 'o', color='lightcoral')
        plt.plot(df_year_1.index,list(df_year_1['profScore']), 'o', color='limegreen')
        plt.plot(df_year_1.index,list(df_year_1['housekeepingScore']), 'o', color='forestgreen')
        plt.plot(df_year_1.index,list(df_year_1['workSafetyScore']), 'o', color='royalblue')
        plt.plot(df_year_1.index,list(df_year_1['totalScore']), 'o', color='limegreen')
        plt.plot(df_year_2.index,list(df_year_2['profScore']), color='lightcoral')
        plt.plot(df_year_2.index,list(df_year_2['housekeepingScore']), 'o', color='indianred')
        plt.plot(df_year_2.index,list(df_year_2['workSafetyScore']), 'o', color='tomato')
        plt.plot(df_year_2.index,list(df_year_2['totalScore']), 'o', color='peru')
        plt.legend(['Professional Score of ' + body.get('institute1'), 'House Keeping Score of ' + body.get('institute1'), 'Work Safety Score of ' + body.get('institute1'), 'Total Score of ' + body.get('institute1'), 'Professional Score of ' + body.get('institute2'), 'House Keeping Score of ' + body.get('institute2'), 'Work Safety Score of ' + body.get('institute2'), 'Total Score of ' + body.get('institute2')], loc='upper right')
        plt.title('Comparing ' + body.get('institute1') + ' and ' + body.get('institute2') + " Audit Scores")
        plt.xlabel('Time Period')
        plt.ylabel('Score')
        values = [str(i)[:-9] for i in list(set(list(df_year_1.index) + list(df_year_2.index)))] 
        plt.xticks(list(set(list(df_year_1.index) + list(df_year_2.index))),values)
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
        
        df_1 = df_1.drop(columns=["timestamp"])
        df_1.insert(4, 'timestamp', df_1.index.tolist())
        df_1.reset_index(drop=True, inplace=True) 

        df_2 = df_2.drop(columns=["timestamp"])
        df_2.insert(4, 'timestamp', df_2.index.tolist())
        df_2.reset_index(drop=True, inplace=True)

        df_day_1['timestamp'] = df_day_1.index
        df_week_1['timestamp'] = df_week_1.index
        df_month_1['timestamp'] = df_month_1.index
        df_year_1['timestamp'] = df_year_1.index

        df_day_2['timestamp'] = df_day_2.index
        df_week_2['timestamp'] = df_week_2.index
        df_month_2['timestamp'] = df_month_2.index
        df_year_2['timestamp'] = df_year_2.index

        for i in ["audit_day.png", "audit_week.png", "audit_month.png", "audit_year.png"]:#, "audit_day.csv", "audit_week.csv", "audit_month.csv", "audit_year.csv", "audit.csv"]:
            os.remove(i)

        return {'result': True, 
            "audit_day_img": audit_day[2:-1], "audit_week_img": audit_week[2:-1], 
            "audit_month_img": audit_month[2:-1], "audit_year_img": audit_year[2:-1], 
            "audit_day_csv_1": [list(df_day_1.columns)] + df_day_1.values.tolist(), 
            "audit_week_csv_1": [list(df_day_1.columns)] + df_week_1.values.tolist(), "audit_month_csv_1": [list(df_day_1.columns)] + df_month_1.values.tolist(), 
            "audit_year_csv": [list(df_day_1.columns)] + df_year_1.values.tolist(), "audit_day_csv_2": [list(df_day_1.columns)] + df_day_2.values.tolist(), 
            "audit_week_csv_2": [list(df_day_1.columns)] + df_week_2.values.tolist(), "audit_month_csv_2": [list(df_day_1.columns)] + df_month_2.values.tolist(), 
            "audit_year_csv_2": [list(df_day_1.columns)] + df_year_2.values.tolist(), "audit_csv_1": [list(df_day_1.columns)] + df_1.values.tolist(), 
            "audit_csv_2": [list(df_day_1.columns)] + df_2.values.tolist()}

@apis.route('/report_dashboard', methods=['GET', 'POST'])
def report_dashboard():
    
    body = request.get_json(silent=True)

    user = User.objects.get(email=body.get('tenant'))

    if user.fnb:
        
        audit_ls = Audit_FB.objects(auditeeName = body.get('tenant'))

        if len(audit_ls) == 0:
            return {'status': False, 'info': "Not enough data entries"}

        temp_ls = [[i.timestamp, i.profScore, i.housekeepingScore, i.workSafetyScore, i.healthierScore, i.foodHygieneScore ,i.totalScore] for i in audit_ls]
        df = pd.DataFrame(temp_ls)
        df.columns = ['timestamp','profScore', 'housekeepingScore', 'workSafetyScore', 'healthierScore', 'foodHygieneScore','totalScore']
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
        plt.plot(df_day.index,list(df_day['healthierScore']), color='yellow')
        plt.plot(df_day.index,list(df_day['foodHygieneScore']), color='brown')
        plt.plot(df_day.index,list(df_day['totalScore']), color='red')
        plt.plot(df_day.index,list(df_day['profScore']), 'o', color='blue')
        plt.plot(df_day.index,list(df_day['housekeepingScore']), 'o', color='orange')
        plt.plot(df_day.index,list(df_day['workSafetyScore']), 'o', color='green')
        plt.plot(df_day.index,list(df_day['healthierScore']), 'o', color='yellow')
        plt.plot(df_day.index,list(df_day['foodHygieneScore']), 'o', color='brown')
        plt.plot(df_day.index,list(df_day['totalScore']), 'o', color='red')
        plt.legend(['Professional Score', 'House Keeping Score', 'Work Safety Score', 'Healthier Score', 'Food Hygiene Score' 'Total Score'], loc='upper right')
        plt.title(body.get('tenant') + "'s Audity Score")
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
        plt.plot(df_week.index,list(df_week['healthierScore']), color='yellow')
        plt.plot(df_week.index,list(df_week['foodHygieneScore']), color='brown')
        plt.plot(df_week.index,list(df_week['totalScore']), color='red')
        plt.plot(df_week.index,list(df_week['profScore']), 'o', color='blue')
        plt.plot(df_week.index,list(df_week['housekeepingScore']), 'o', color='orange')
        plt.plot(df_week.index,list(df_week['workSafetyScore']), 'o', color='green')
        plt.plot(df_week.index,list(df_week['healthierScore']), 'o', color='yellow')
        plt.plot(df_week.index,list(df_week['foodHygieneScore']), 'o', color='brown')
        plt.plot(df_week.index,list(df_week['totalScore']), 'o', color='red')
        plt.legend(['Professional Score', 'House Keeping Score', 'Work Safety Score', 'Healthier Score', 'Food Hygiene Score' 'Total Score'], loc='upper right')
        plt.title(body.get('tenant') + "'s Audity Score")
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
        plt.plot(df_month.index,list(df_month['healthierScore']), color='yellow')
        plt.plot(df_month.index,list(df_month['foodHygieneScore']), color='brown')
        plt.plot(df_month.index,list(df_month['totalScore']), color='red')
        plt.plot(df_month.index,list(df_month['profScore']), 'o', color='blue')
        plt.plot(df_month.index,list(df_month['housekeepingScore']), 'o', color='orange')
        plt.plot(df_month.index,list(df_month['workSafetyScore']), 'o', color='green')
        plt.plot(df_month.index,list(df_month['healthierScore']), 'o', color='yellow')
        plt.plot(df_month.index,list(df_month['foodHygieneScore']), 'o', color='brown')
        plt.plot(df_month.index,list(df_month['totalScore']), 'o', color='red')
        plt.legend(['Professional Score', 'House Keeping Score', 'Work Safety Score', 'Healthier Score', 'Food Hygiene Score' 'Total Score'], loc='upper right')
        plt.title(body.get('tenant') + "'s Audity Score")
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
        plt.plot(df_year.index,list(df_year['healthierScore']), color='yellow')
        plt.plot(df_year.index,list(df_year['foodHygieneScore']), color='brown')
        plt.plot(df_year.index,list(df_year['totalScore']), color='red')
        plt.plot(df_year.index,list(df_year['profScore']), 'o', color='blue')
        plt.plot(df_year.index,list(df_year['housekeepingScore']), 'o', color='orange')
        plt.plot(df_year.index,list(df_year['workSafetyScore']), 'o', color='green')
        plt.plot(df_year.index,list(df_year['healthierScore']), 'o', color='yellow')
        plt.plot(df_year.index,list(df_year['foodHygieneScore']), 'o', color='brown')
        plt.plot(df_year.index,list(df_year['totalScore']), 'o', color='red')
        plt.legend(['Professional Score', 'House Keeping Score', 'Work Safety Score', 'Healthier Score', 'Food Hygiene Score' 'Total Score'], loc='upper right')
        plt.title(body.get('tenant') + "'s Audity Score")
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
        
        df_day.to_csv('audit_day.csv')
        df_week.to_csv('audit_week.csv')
        df_month.to_csv('audit_month.csv')
        df_year.to_csv('audit_year.csv')

        try:
            message = MIMEMultipart()
            message["From"] = sender_email
            email = body.get('email')
            message["To"] = email
            message["Subject"] = body.get("subject")
        except:
            print("error occured")
            return {'result': False, 'info': "user does not exist"}, 500

        message.attach(MIMEText(body.get("body"), "plain"))

        text = message.as_string()

        for filename in ["audit_day.png", "audit_week.png", "audit_month.png", "audit_year.png", "audit_day.csv", "audit_week.csv", "audit_month.csv", "audit_year.csv", "audit.csv"]:

            # Open PDF file in binary mode
            with open(filename, "rb") as attachment:
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

        # Log in to server using secure context and send email
        context = ssl.create_default_context()
        with smtplib.SMTP_SSL("smtp.gmail.com", 465, context=context) as server:
            server.login(sender_email, password)
            server.sendmail(sender_email, email, text)

        for i in ["audit_day.png", "audit_week.png", "audit_month.png", "audit_year.png", "audit_day.csv", "audit_week.csv", "audit_month.csv", "audit_year.csv"]:
            os.remove(i)

        return {'status': True}, 200

    else:

        audit_ls = Audit_non_FB.objects(auditeeName = body.get('tenant'))

        if len(audit_ls) == 0:
            return {'status': False, 'info': "Not enough data entries"}

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
        plt.title(body.get('tenant') + "'s Audity Score")
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
        plt.title(body.get('tenant') + "'s Audity Score")
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
        plt.title(body.get('tenant') + "'s Audity Score")
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
        plt.title(body.get('tenant') + "'s Audity Score")
        plt.xlabel('Time Period')
        plt.ylabel('Score')
        values = [str(i)[:-9] for i in list(df_year.index)] 
        plt.xticks(df_year.index,values)
        plt.savefig('audit_year.png', bbox_inches='tight')
        plt.close()
        
        df = df.drop(columns=["timestamp"])
        df.insert(4, 'timestamp', df.index.tolist())
        df.reset_index(drop=True, inplace=True) 
        
        df_day['timestamp'] = df_day.index
        df_week['timestamp'] = df_week.index
        df_month['timestamp'] = df_month.index
        df_year['timestamp'] = df_year.index

        df_day.to_csv('audit_day.csv')
        df_week.to_csv('audit_week.csv')
        df_month.to_csv('audit_month.csv')
        df_year.to_csv('audit_year.csv')

        try:
            message = MIMEMultipart()
            message["From"] = sender_email
            email = body.get('email')
            message["To"] = email
            message["Subject"] = body.get("subject")
        except:
            print("error occured")
            return {'result': False, 'info': "user does not exist"}, 500

        message.attach(MIMEText(body.get("body"), "plain"))

        text = message.as_string()

        for filename in ["audit_day.png", "audit_week.png", "audit_month.png", "audit_year.png", "audit_day.csv", "audit_week.csv", "audit_month.csv", "audit_year.csv"]:

            # Open PDF file in binary mode
            with open(filename, "rb") as attachment:
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

        # Log in to server using secure context and send email
        context = ssl.create_default_context()
        with smtplib.SMTP_SSL("smtp.gmail.com", 465, context=context) as server:
            server.login(sender_email, password)
            server.sendmail(sender_email, email, text)

        for i in ["audit_day.png", "audit_week.png", "audit_month.png", "audit_year.png", "audit_day.csv", "audit_week.csv", "audit_month.csv", "audit_year.csv"]:
            os.remove(i)

        return {'status': True}, 200

@apis.route('/report_compare_tenant', methods=['GET', 'POST'])
def report_compare_tenant():
    
    body = request.get_json()
    
    user = User.objects.get(email=body.get('institute1'))

    if user.fnb:

        audit_ls_1 = Audit_FB.objects(auditeeName = body.get('institute1'))
        audit_ls_2 = Audit_FB.objects(auditeeName = body.get('institute2'))

        if len(audit_ls_1) == 0 or len(audit_ls_2) == 0:
            return {'status': False, 'info': "Not enough data entries"},200

        temp_ls = [[i.timestamp, i.profScore, i.housekeepingScore, i.workSafetyScore, i.healthierScore, i.foodHygieneScore, i.totalScore] for i in audit_ls_1]
        df_1 = pd.DataFrame(temp_ls)
        df_1.columns =  ['timestamp','profScore', 'housekeepingScore', 'workSafetyScore', 'healthierScore', 'foodHygieneScore','totalScore']
        df_1['timestamp'] = pd.to_datetime(df_1['timestamp'])
        df_1.index = df_1['timestamp'] 
        df_year_1 = df_1.resample('Y').mean()
        df_month_1 = df_1.resample('M').mean()
        df_week_1 = df_1.resample('W').mean()
        df_day_1 = df_1.resample('D').mean()

        temp_ls = [[i.timestamp, i.profScore, i.housekeepingScore, i.workSafetyScore, i.healthierScore, i.foodHygieneScore, i.totalScore] for i in audit_ls_2]
        df_2 = pd.DataFrame(temp_ls)
        df_2.columns =  ['timestamp','profScore', 'housekeepingScore', 'workSafetyScore', 'healthierScore', 'foodHygieneScore','totalScore']
        df_2['timestamp'] = pd.to_datetime(df_2['timestamp'])
        df_2.index = df_2['timestamp'] 
        df_year_2 = df_2.resample('Y').mean()
        df_month_2 = df_2.resample('M').mean()
        df_week_2 = df_2.resample('W').mean()
        df_day_2 = df_2.resample('D').mean()

        plt.switch_backend('agg')
        plt.figure(figsize = (14, 8))
        plt.ylim((0,100))
        plt.plot(df_day_1.index,list(df_day_1['profScore']), color='limegreen')
        plt.plot(df_day_1.index,list(df_day_1['housekeepingScore']), color='forestgreen')
        plt.plot(df_day_1.index,list(df_day_1['workSafetyScore']), color='cornflowerblue')
        plt.plot(df_day_1.index,list(df_day_1['healthierScore']), color='yellow')
        plt.plot(df_day_1.index,list(df_day_1['foodHygieneScore']), color='brown')
        plt.plot(df_day_1.index,list(df_day_1['totalScore']), color='royalblue')
        plt.plot(df_day_2.index,list(df_day_2['profScore']), color='lightcoral')
        plt.plot(df_day_2.index,list(df_day_2['housekeepingScore']), color='indianred')
        plt.plot(df_day_2.index,list(df_day_2['workSafetyScore']), color='tomato')
        plt.plot(df_day_2.index,list(df_day_2['healthierScore']), color='hotpink')
        plt.plot(df_day_2.index,list(df_day_2['foodHygieneScore']), color='pink')
        plt.plot(df_day_2.index,list(df_day_2['totalScore']), color='peru')
        plt.plot(df_day_1.index,list(df_day_1['profScore']), 'o', color='limegreen')
        plt.plot(df_day_1.index,list(df_day_1['housekeepingScore']), 'o', color='forestgreen')
        plt.plot(df_day_1.index,list(df_day_1['workSafetyScore']), 'o', color='royalblue')
        plt.plot(df_day_1.index,list(df_day_1['healthierScore']), 'o', color='yellow')
        plt.plot(df_day_1.index,list(df_day_1['foodHygieneScore']), 'o', color='brown')
        plt.plot(df_day_1.index,list(df_day_1['totalScore']), 'o', color='limegreen')
        plt.plot(df_day_2.index,list(df_day_2['profScore']), 'o', color='lightcoral')
        plt.plot(df_day_2.index,list(df_day_2['housekeepingScore']), 'o', color='indianred')
        plt.plot(df_day_2.index,list(df_day_2['workSafetyScore']), 'o', color='tomato')
        plt.plot(df_day_2.index,list(df_day_2['healthierScore']), 'o', color='hotpink')
        plt.plot(df_day_2.index,list(df_day_2['foodHygieneScore']), 'o', color='pink')
        plt.plot(df_day_2.index,list(df_day_2['totalScore']), 'o', color='peru')
        plt.legend(['Professional Score of ' + body.get('institute1'), 'House Keeping Score of ' + body.get('institute1'), 'Work Safety Score of ' + body.get('institute1'), 'Healthier Score of ' + body.get('institute1'), 'Hygiene Score of ' + body.get('institute1'), 'Total Score of ' + body.get('institute1'), 'Professional Score of ' + body.get('institute2'), 'House Keeping Score of ' + body.get('institute2'), 'Work Safety Score of ' + body.get('institute2'), 'Healthier Score of ' + body.get('institute2'), 'Hygiene Score of ' + body.get('institute2'), 'Total Score of ' + body.get('institute2')], loc='upper right')
        plt.title('Comparing ' + body.get('institute1') + ' and ' + body.get('institute2') + " Audit Scores")
        plt.xlabel('Time Period')
        plt.ylabel('Score')
        values = [str(i)[:-9] for i in list(set(list(df_day_1.index) + list(df_day_2.index)))] 
        plt.xticks(list(set(list(df_day_1.index) + list(df_day_2.index))),values)
        plt.savefig('audit_day.png', bbox_inches='tight')
        plt.close()

        plt.switch_backend('agg')
        plt.figure(figsize = (14, 8))
        plt.ylim((0,100))
        plt.plot(df_week_1.index,list(df_week_1['profScore']), color='limegreen')
        plt.plot(df_week_1.index,list(df_week_1['housekeepingScore']), color='forestgreen')
        plt.plot(df_week_1.index,list(df_week_1['workSafetyScore']), color='cornflowerblue')
        plt.plot(df_week_1.index,list(df_week_1['healthierScore']), color='yellow')
        plt.plot(df_week_1.index,list(df_week_1['foodHygieneScore']), color='brown')
        plt.plot(df_week_1.index,list(df_week_1['totalScore']), color='royalblue')
        plt.plot(df_week_2.index,list(df_week_2['profScore']), color='lightcoral')
        plt.plot(df_week_2.index,list(df_week_2['housekeepingScore']), color='indianred')
        plt.plot(df_week_2.index,list(df_week_2['workSafetyScore']), color='tomato')
        plt.plot(df_week_2.index,list(df_week_2['healthierScore']), color='hotpink')
        plt.plot(df_week_2.index,list(df_week_2['foodHygieneScore']), color='pink')
        plt.plot(df_week_2.index,list(df_week_2['totalScore']), color='peru')
        plt.plot(df_week_1.index,list(df_week_1['profScore']), 'o', color='limegreen')
        plt.plot(df_week_1.index,list(df_week_1['housekeepingScore']), 'o', color='forestgreen')
        plt.plot(df_week_1.index,list(df_week_1['workSafetyScore']), 'o', color='royalblue')
        plt.plot(df_week_1.index,list(df_week_1['healthierScore']), 'o', color='yellow')
        plt.plot(df_week_1.index,list(df_week_1['foodHygieneScore']), 'o', color='brown')
        plt.plot(df_week_1.index,list(df_week_1['totalScore']), 'o', color='limegreen')
        plt.plot(df_week_2.index,list(df_week_2['profScore']), 'o', color='lightcoral')
        plt.plot(df_week_2.index,list(df_week_2['housekeepingScore']), 'o', color='indianred')
        plt.plot(df_week_2.index,list(df_week_2['workSafetyScore']), 'o', color='tomato')
        plt.plot(df_week_2.index,list(df_week_2['healthierScore']), 'o', color='hotpink')
        plt.plot(df_week_2.index,list(df_week_2['foodHygieneScore']), 'o', color='pink')
        plt.plot(df_week_2.index,list(df_week_2['totalScore']), 'o', color='peru')
        plt.legend(['Professional Score of ' + body.get('institute1'), 'House Keeping Score of ' + body.get('institute1'), 'Work Safety Score of ' + body.get('institute1'), 'Healthier Score of ' + body.get('institute1'), 'Hygiene Score of ' + body.get('institute1'), 'Total Score of ' + body.get('institute1'), 'Professional Score of ' + body.get('institute2'), 'House Keeping Score of ' + body.get('institute2'), 'Work Safety Score of ' + body.get('institute2'), 'Healthier Score of ' + body.get('institute2'), 'Hygiene Score of ' + body.get('institute2'), 'Total Score of ' + body.get('institute2')], loc='upper right')
        plt.title('Comparing ' + body.get('institute1') + ' and ' + body.get('institute2') + " Audit Scores")
        plt.xlabel('Time Period')
        plt.ylabel('Score')
        values = [str(i)[:-9] for i in list(set(list(df_week_1.index) + list(df_week_2.index)))] 
        plt.xticks(list(set(list(df_week_1.index) + list(df_week_2.index))),values)
        plt.savefig('audit_week.png', bbox_inches='tight')
        plt.close()

        plt.switch_backend('agg')
        plt.figure(figsize = (14, 8))
        plt.ylim((0,100))
        plt.plot(df_month_1.index,list(df_month_1['profScore']), color='limegreen')
        plt.plot(df_month_1.index,list(df_month_1['housekeepingScore']), color='forestgreen')
        plt.plot(df_month_1.index,list(df_month_1['workSafetyScore']), color='cornflowerblue')
        plt.plot(df_month_1.index,list(df_month_1['healthierScore']), color='yellow')
        plt.plot(df_month_1.index,list(df_month_1['foodHygieneScore']), color='brown')
        plt.plot(df_month_1.index,list(df_month_1['totalScore']), color='royalblue')
        plt.plot(df_month_2.index,list(df_month_2['profScore']), color='lightcoral')
        plt.plot(df_month_2.index,list(df_month_2['housekeepingScore']), color='indianred')
        plt.plot(df_month_2.index,list(df_month_2['workSafetyScore']), color='tomato')
        plt.plot(df_month_2.index,list(df_month_2['healthierScore']), color='hotpink')
        plt.plot(df_month_2.index,list(df_month_2['foodHygieneScore']), color='pink')
        plt.plot(df_month_2.index,list(df_month_2['totalScore']), color='peru')
        plt.plot(df_month_1.index,list(df_month_1['profScore']), 'o', color='limegreen')
        plt.plot(df_month_1.index,list(df_month_1['housekeepingScore']), 'o', color='forestgreen')
        plt.plot(df_month_1.index,list(df_month_1['workSafetyScore']), 'o', color='royalblue')
        plt.plot(df_month_1.index,list(df_month_1['healthierScore']), 'o', color='yellow')
        plt.plot(df_month_1.index,list(df_month_1['foodHygieneScore']), 'o', color='brown')
        plt.plot(df_month_1.index,list(df_month_1['totalScore']), 'o', color='limegreen')
        plt.plot(df_month_2.index,list(df_month_2['profScore']), 'o', color='lightcoral')
        plt.plot(df_month_2.index,list(df_month_2['housekeepingScore']), 'o', color='indianred')
        plt.plot(df_month_2.index,list(df_month_2['workSafetyScore']), 'o', color='tomato')
        plt.plot(df_month_2.index,list(df_month_2['healthierScore']), 'o', color='hotpink')
        plt.plot(df_month_2.index,list(df_month_2['foodHygieneScore']), 'o', color='pink')
        plt.plot(df_month_2.index,list(df_month_2['totalScore']), 'o', color='peru')
        plt.legend(['Professional Score of ' + body.get('institute1'), 'House Keeping Score of ' + body.get('institute1'), 'Work Safety Score of ' + body.get('institute1'), 'Healthier Score of ' + body.get('institute1'), 'Hygiene Score of ' + body.get('institute1'), 'Total Score of ' + body.get('institute1'), 'Professional Score of ' + body.get('institute2'), 'House Keeping Score of ' + body.get('institute2'), 'Work Safety Score of ' + body.get('institute2'), 'Healthier Score of ' + body.get('institute2'), 'Hygiene Score of ' + body.get('institute2'), 'Total Score of ' + body.get('institute2')], loc='upper right')
        plt.title('Comparing ' + body.get('institute1') + ' and ' + body.get('institute2') + " Audit Scores")
        plt.xlabel('Time Period')
        plt.ylabel('Score')
        values = [str(i)[:-9] for i in list(set(list(df_month_1.index) + list(df_month_2.index)))] 
        plt.xticks(list(set(list(df_month_1.index) + list(df_month_2.index))),values)
        plt.savefig('audit_month.png', bbox_inches='tight')
        plt.close()

        plt.switch_backend('agg')
        plt.figure(figsize = (14, 8))
        plt.ylim((0,100))
        plt.plot(df_year_1.index,list(df_year_1['profScore']), color='limegreen')
        plt.plot(df_year_1.index,list(df_year_1['housekeepingScore']), color='forestgreen')
        plt.plot(df_year_1.index,list(df_year_1['workSafetyScore']), color='cornflowerblue')
        plt.plot(df_year_1.index,list(df_year_1['healthierScore']), color='yellow')
        plt.plot(df_year_1.index,list(df_year_1['foodHygieneScore']), color='brown')
        plt.plot(df_year_1.index,list(df_year_1['totalScore']), color='royalblue')
        plt.plot(df_year_2.index,list(df_year_2['housekeepingScore']), color='indianred')
        plt.plot(df_year_2.index,list(df_year_2['workSafetyScore']), color='tomato')
        plt.plot(df_year_2.index,list(df_year_2['healthierScore']), color='hotpink')
        plt.plot(df_year_2.index,list(df_year_2['foodHygieneScore']), color='pink')
        plt.plot(df_year_2.index,list(df_year_2['totalScore']), color='peru')
        plt.plot(df_year_2.index,list(df_year_2['profScore']), 'o', color='lightcoral')
        plt.plot(df_year_1.index,list(df_year_1['profScore']), 'o', color='limegreen')
        plt.plot(df_year_1.index,list(df_year_1['housekeepingScore']), 'o', color='forestgreen')
        plt.plot(df_year_1.index,list(df_year_1['workSafetyScore']), 'o', color='royalblue')
        plt.plot(df_year_1.index,list(df_year_1['healthierScore']), 'o', color='yellow')
        plt.plot(df_year_1.index,list(df_year_1['foodHygieneScore']), 'o', color='brown')
        plt.plot(df_year_1.index,list(df_year_1['totalScore']), 'o', color='limegreen')
        plt.plot(df_year_2.index,list(df_year_2['profScore']), color='lightcoral')
        plt.plot(df_year_2.index,list(df_year_2['housekeepingScore']), 'o', color='indianred')
        plt.plot(df_year_2.index,list(df_year_2['workSafetyScore']), 'o', color='tomato')
        plt.plot(df_year_2.index,list(df_year_2['healthierScore']), 'o', color='hotpink')
        plt.plot(df_year_2.index,list(df_year_2['foodHygieneScore']), 'o', color='pink')
        plt.plot(df_year_2.index,list(df_year_2['totalScore']), 'o', color='peru')
        plt.legend(['Professional Score of ' + body.get('institute1'), 'House Keeping Score of ' + body.get('institute1'), 'Work Safety Score of ' + body.get('institute1'), 'Healthier Score of ' + body.get('institute1'), 'Hygiene Score of ' + body.get('institute1'), 'Total Score of ' + body.get('institute1'), 'Professional Score of ' + body.get('institute2'), 'House Keeping Score of ' + body.get('institute2'), 'Work Safety Score of ' + body.get('institute2'), 'Healthier Score of ' + body.get('institute2'), 'Hygiene Score of ' + body.get('institute2'), 'Total Score of ' + body.get('institute2')], loc='upper right')
        plt.title('Comparing ' + body.get('institute1') + ' and ' + body.get('institute2') + " Audit Scores")
        plt.xlabel('Time Period')
        plt.ylabel('Score')
        values = [str(i)[:-9] for i in list(set(list(df_year_1.index) + list(df_year_2.index)))] 
        plt.xticks(list(set(list(df_year_1.index) + list(df_year_2.index))),values)
        plt.savefig('audit_year.png', bbox_inches='tight')
        plt.close()
        
        df_1 = df_1.drop(columns=["timestamp"])
        df_1.insert(4, 'timestamp', df_1.index.tolist())
        df_1.reset_index(drop=True, inplace=True) 

        df_2 = df_2.drop(columns=["timestamp"])
        df_2.insert(4, 'timestamp', df_2.index.tolist())
        df_2.reset_index(drop=True, inplace=True)

        df_day_1['timestamp'] = df_day_1.index
        df_week_1['timestamp'] = df_week_1.index
        df_month_1['timestamp'] = df_month_1.index
        df_year_1['timestamp'] = df_year_1.index

        df_day_2['timestamp'] = df_day_2.index
        df_week_2['timestamp'] = df_week_2.index
        df_month_2['timestamp'] = df_month_2.index
        df_year_2['timestamp'] = df_year_2.index

        df_day_1.to_csv('audit_day_1.csv')
        df_week_1.to_csv('audit_week_1.csv')
        df_month_1.to_csv('audit_month_1.csv')
        df_year_1.to_csv('audit_year_1.csv')

        df_day_2.to_csv('audit_day_2.csv')
        df_week_2.to_csv('audit_week_2.csv')
        df_month_2.to_csv('audit_month_2.csv')
        df_year_2.to_csv('audit_year_2.csv')

        for i in ["audit_day.png", "audit_week.png", "audit_month.png", "audit_year.png", "audit_day_1.csv", "audit_week_1.csv", "audit_month_1.csv", "audit_year_1.csv", "audit_day_2.csv", "audit_week_2.csv", "audit_month_2.csv", "audit_year_2.csv"]:
            os.remove(i)
        
        try:
            message = MIMEMultipart()
            message["From"] = sender_email
            email = body.get('email')
            message["To"] = email
            message["Subject"] = body.get("subject")
        except:
            print("error occured")
            return {'result': False, 'info': "user does not exist"}, 500

        message.attach(MIMEText(body.get("body"), "plain"))

        text = message.as_string()

        for filename in ["audit_day.png", "audit_week.png", "audit_month.png", "audit_year.png", "audit_day_1.csv", "audit_week_1.csv", "audit_month_1.csv", "audit_year_1.csv", "audit_day_2.csv", "audit_week_2.csv", "audit_month_2.csv", "audit_year_2.csv"]:
            
            # Open PDF file in binary mode
            with open(filename, "rb") as attachment:
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

        # Log in to server using secure context and send email
        context = ssl.create_default_context()
        with smtplib.SMTP_SSL("smtp.gmail.com", 465, context=context) as server:
            server.login(sender_email, password)
            server.sendmail(sender_email, email, text)

        for i in ["audit_day.png", "audit_week.png", "audit_month.png", "audit_year.png", "audit_day_1.csv", "audit_week_1.csv", "audit_month_1.csv", "audit_year_1.csv", "audit_day_2.csv", "audit_week_2.csv", "audit_month_2.csv", "audit_year_2.csv"]:
            os.remove(i)

        return {'status': True}, 200

    else:
        
        audit_ls_1 = Audit_non_FB.objects(auditeeName = body.get('institute1'))
        audit_ls_2 = Audit_non_FB.objects(auditeeName = body.get('institute2'))

        if len(audit_ls_1) == 0 or len(audit_ls_2) == 0:
            return {'status': False, 'info': "Not enough data entries"},200

        temp_ls = [[i.timestamp, i.profScore, i.housekeepingScore, i.workSafetyScore, i.totalScore] for i in audit_ls_1]
        df_1 = pd.DataFrame(temp_ls)
        df_1.columns = ['timestamp','profScore', 'housekeepingScore', 'workSafetyScore','totalScore']
        df_1['timestamp'] = pd.to_datetime(df_1['timestamp'])
        df_1.index = df_1['timestamp'] 
        df_year_1 = df_1.resample('Y').mean()
        df_month_1 = df_1.resample('M').mean()
        df_week_1 = df_1.resample('W').mean()
        df_day_1 = df_1.resample('D').mean()

        temp_ls = [[i.timestamp, i.profScore, i.housekeepingScore, i.workSafetyScore, i.totalScore] for i in audit_ls_2]
        df_2 = pd.DataFrame(temp_ls)
        df_2.columns = ['timestamp','profScore', 'housekeepingScore', 'workSafetyScore','totalScore']
        df_2['timestamp'] = pd.to_datetime(df_2['timestamp'])
        df_2.index = df_2['timestamp'] 
        df_year_2 = df_2.resample('Y').mean()
        df_month_2 = df_2.resample('M').mean()
        df_week_2 = df_2.resample('W').mean()
        df_day_2 = df_2.resample('D').mean()

        plt.switch_backend('agg')
        plt.figure(figsize = (14, 8))
        plt.ylim((0,100))
        plt.plot(df_day_1.index,list(df_day_1['profScore']), color='limegreen')
        plt.plot(df_day_1.index,list(df_day_1['housekeepingScore']), color='forestgreen')
        plt.plot(df_day_1.index,list(df_day_1['workSafetyScore']), color='cornflowerblue')
        plt.plot(df_day_1.index,list(df_day_1['totalScore']), color='royalblue')
        plt.plot(df_day_2.index,list(df_day_2['profScore']), color='lightcoral')
        plt.plot(df_day_2.index,list(df_day_2['housekeepingScore']), color='indianred')
        plt.plot(df_day_2.index,list(df_day_2['workSafetyScore']), color='tomato')
        plt.plot(df_day_2.index,list(df_day_2['totalScore']), color='peru')
        plt.plot(df_day_1.index,list(df_day_1['profScore']), 'o', color='limegreen')
        plt.plot(df_day_1.index,list(df_day_1['housekeepingScore']), 'o', color='forestgreen')
        plt.plot(df_day_1.index,list(df_day_1['workSafetyScore']), 'o', color='royalblue')
        plt.plot(df_day_1.index,list(df_day_1['totalScore']), 'o', color='limegreen')
        plt.plot(df_day_2.index,list(df_day_2['profScore']), 'o', color='lightcoral')
        plt.plot(df_day_2.index,list(df_day_2['housekeepingScore']), 'o', color='indianred')
        plt.plot(df_day_2.index,list(df_day_2['workSafetyScore']), 'o', color='tomato')
        plt.plot(df_day_2.index,list(df_day_2['totalScore']), 'o', color='peru')
        plt.legend(['Professional Score of ' + body.get('institute1'), 'House Keeping Score of ' + body.get('institute1'), 'Work Safety Score of ' + body.get('institute1'), 'Total Score of ' + body.get('institute1'), 'Professional Score of ' + body.get('institute2'), 'House Keeping Score of ' + body.get('institute2'), 'Work Safety Score of ' + body.get('institute2'), 'Total Score of ' + body.get('institute2')], loc='upper right')
        plt.title('Comparing ' + body.get('institute1') + ' and ' + body.get('institute2') + " Audit Scores")
        plt.xlabel('Time Period')
        plt.ylabel('Score')
        values = [str(i)[:-9] for i in list(set(list(df_day_1.index) + list(df_day_2.index)))] 
        plt.xticks(list(set(list(df_day_1.index) + list(df_day_2.index))),values)
        plt.savefig('audit_day.png', bbox_inches='tight')
        plt.close()

        plt.switch_backend('agg')
        plt.figure(figsize = (14, 8))
        plt.ylim((0,100))
        plt.plot(df_week_1.index,list(df_week_1['profScore']), color='limegreen')
        plt.plot(df_week_1.index,list(df_week_1['housekeepingScore']), color='forestgreen')
        plt.plot(df_week_1.index,list(df_week_1['workSafetyScore']), color='cornflowerblue')
        plt.plot(df_week_1.index,list(df_week_1['totalScore']), color='royalblue')
        plt.plot(df_week_2.index,list(df_week_2['profScore']), color='lightcoral')
        plt.plot(df_week_2.index,list(df_week_2['housekeepingScore']), color='indianred')
        plt.plot(df_week_2.index,list(df_week_2['workSafetyScore']), color='tomato')
        plt.plot(df_week_2.index,list(df_week_2['totalScore']), color='peru')
        plt.plot(df_week_1.index,list(df_week_1['profScore']), 'o', color='limegreen')
        plt.plot(df_week_1.index,list(df_week_1['housekeepingScore']), 'o', color='forestgreen')
        plt.plot(df_week_1.index,list(df_week_1['workSafetyScore']), 'o', color='royalblue')
        plt.plot(df_week_1.index,list(df_week_1['totalScore']), 'o', color='limegreen')
        plt.plot(df_week_2.index,list(df_week_2['profScore']), 'o', color='lightcoral')
        plt.plot(df_week_2.index,list(df_week_2['housekeepingScore']), 'o', color='indianred')
        plt.plot(df_week_2.index,list(df_week_2['workSafetyScore']), 'o', color='tomato')
        plt.plot(df_week_2.index,list(df_week_2['totalScore']), 'o', color='peru')
        plt.legend(['Professional Score of ' + body.get('institute1'), 'House Keeping Score of ' + body.get('institute1'), 'Work Safety Score of ' + body.get('institute1'), 'Total Score of ' + body.get('institute1'), 'Professional Score of ' + body.get('institute2'), 'House Keeping Score of ' + body.get('institute2'), 'Work Safety Score of ' + body.get('institute2'), 'Total Score of ' + body.get('institute2')], loc='upper right')
        plt.title('Comparing ' + body.get('institute1') + ' and ' + body.get('institute2') + " Audit Scores")
        plt.xlabel('Time Period')
        plt.ylabel('Score')
        values = [str(i)[:-9] for i in list(set(list(df_week_1.index) + list(df_week_2.index)))] 
        plt.xticks(list(set(list(df_week_1.index) + list(df_week_2.index))),values)
        plt.savefig('audit_week.png', bbox_inches='tight')
        plt.close()

        plt.switch_backend('agg')
        plt.figure(figsize = (14, 8))
        plt.ylim((0,100))
        plt.plot(df_month_1.index,list(df_month_1['profScore']), color='limegreen')
        plt.plot(df_month_1.index,list(df_month_1['housekeepingScore']), color='forestgreen')
        plt.plot(df_month_1.index,list(df_month_1['workSafetyScore']), color='cornflowerblue')
        plt.plot(df_month_1.index,list(df_month_1['totalScore']), color='royalblue')
        plt.plot(df_month_2.index,list(df_month_2['profScore']), color='lightcoral')
        plt.plot(df_month_2.index,list(df_month_2['housekeepingScore']), color='indianred')
        plt.plot(df_month_2.index,list(df_month_2['workSafetyScore']), color='tomato')
        plt.plot(df_month_2.index,list(df_month_2['totalScore']), color='peru')
        plt.plot(df_month_1.index,list(df_month_1['profScore']), 'o', color='limegreen')
        plt.plot(df_month_1.index,list(df_month_1['housekeepingScore']), 'o', color='forestgreen')
        plt.plot(df_month_1.index,list(df_month_1['workSafetyScore']), 'o', color='royalblue')
        plt.plot(df_month_1.index,list(df_month_1['totalScore']), 'o', color='limegreen')
        plt.plot(df_month_2.index,list(df_month_2['profScore']), 'o', color='lightcoral')
        plt.plot(df_month_2.index,list(df_month_2['housekeepingScore']), 'o', color='indianred')
        plt.plot(df_month_2.index,list(df_month_2['workSafetyScore']), 'o', color='tomato')
        plt.plot(df_month_2.index,list(df_month_2['totalScore']), 'o', color='peru')
        plt.legend(['Professional Score of ' + body.get('institute1'), 'House Keeping Score of ' + body.get('institute1'), 'Work Safety Score of ' + body.get('institute1'), 'Total Score of ' + body.get('institute1'), 'Professional Score of ' + body.get('institute2'), 'House Keeping Score of ' + body.get('institute2'), 'Work Safety Score of ' + body.get('institute2'), 'Total Score of ' + body.get('institute2')], loc='upper right')
        plt.title('Comparing ' + body.get('institute1') + ' and ' + body.get('institute2') + " Audit Scores")
        plt.xlabel('Time Period')
        plt.ylabel('Score')
        values = [str(i)[:-9] for i in list(set(list(df_month_1.index) + list(df_month_2.index)))] 
        plt.xticks(list(set(list(df_month_1.index) + list(df_month_2.index))),values)
        plt.savefig('audit_month.png', bbox_inches='tight')
        plt.close()

        plt.switch_backend('agg')
        plt.figure(figsize = (14, 8))
        plt.ylim((0,100))
        plt.plot(df_year_1.index,list(df_year_1['profScore']), color='limegreen')
        plt.plot(df_year_1.index,list(df_year_1['housekeepingScore']), color='forestgreen')
        plt.plot(df_year_1.index,list(df_year_1['workSafetyScore']), color='cornflowerblue')
        plt.plot(df_year_1.index,list(df_year_1['totalScore']), color='royalblue')
        plt.plot(df_year_2.index,list(df_year_2['housekeepingScore']), color='indianred')
        plt.plot(df_year_2.index,list(df_year_2['workSafetyScore']), color='tomato')
        plt.plot(df_year_2.index,list(df_year_2['totalScore']), color='peru')
        plt.plot(df_year_2.index,list(df_year_2['profScore']), 'o', color='lightcoral')
        plt.plot(df_year_1.index,list(df_year_1['profScore']), 'o', color='limegreen')
        plt.plot(df_year_1.index,list(df_year_1['housekeepingScore']), 'o', color='forestgreen')
        plt.plot(df_year_1.index,list(df_year_1['workSafetyScore']), 'o', color='royalblue')
        plt.plot(df_year_1.index,list(df_year_1['totalScore']), 'o', color='limegreen')
        plt.plot(df_year_2.index,list(df_year_2['profScore']), color='lightcoral')
        plt.plot(df_year_2.index,list(df_year_2['housekeepingScore']), 'o', color='indianred')
        plt.plot(df_year_2.index,list(df_year_2['workSafetyScore']), 'o', color='tomato')
        plt.plot(df_year_2.index,list(df_year_2['totalScore']), 'o', color='peru')
        plt.legend(['Professional Score of ' + body.get('institute1'), 'House Keeping Score of ' + body.get('institute1'), 'Work Safety Score of ' + body.get('institute1'), 'Total Score of ' + body.get('institute1'), 'Professional Score of ' + body.get('institute2'), 'House Keeping Score of ' + body.get('institute2'), 'Work Safety Score of ' + body.get('institute2'), 'Total Score of ' + body.get('institute2')], loc='upper right')
        plt.title('Comparing ' + body.get('institute1') + ' and ' + body.get('institute2') + " Audit Scores")
        plt.xlabel('Time Period')
        plt.ylabel('Score')
        values = [str(i)[:-9] for i in list(set(list(df_year_1.index) + list(df_year_2.index)))] 
        plt.xticks(list(set(list(df_year_1.index) + list(df_year_2.index))),values)
        plt.savefig('audit_year.png', bbox_inches='tight')
        plt.close()
        
        df_1 = df_1.drop(columns=["timestamp"])
        df_1.insert(4, 'timestamp', df_1.index.tolist())
        df_1.reset_index(drop=True, inplace=True) 

        df_2 = df_2.drop(columns=["timestamp"])
        df_2.insert(4, 'timestamp', df_2.index.tolist())
        df_2.reset_index(drop=True, inplace=True)

        df_day_1['timestamp'] = df_day_1.index
        df_week_1['timestamp'] = df_week_1.index
        df_month_1['timestamp'] = df_month_1.index
        df_year_1['timestamp'] = df_year_1.index

        df_day_2['timestamp'] = df_day_2.index
        df_week_2['timestamp'] = df_week_2.index
        df_month_2['timestamp'] = df_month_2.index
        df_year_2['timestamp'] = df_year_2.index

        df_day_1.to_csv('audit_day_1.csv')
        df_week_1.to_csv('audit_week_1.csv')
        df_month_1.to_csv('audit_month_1.csv')
        df_year_1.to_csv('audit_year_1.csv')

        df_day_2.to_csv('audit_day_2.csv')
        df_week_2.to_csv('audit_week_2.csv')
        df_month_2.to_csv('audit_month_2.csv')
        df_year_2.to_csv('audit_year_2.csv')

        for i in ["audit_day.png", "audit_week.png", "audit_month.png", "audit_year.png", "audit_day_1.csv", "audit_week_1.csv", "audit_month_1.csv", "audit_year_1.csv", "audit_day_2.csv", "audit_week_2.csv", "audit_month_2.csv", "audit_year_2.csv"]:
            os.remove(i)
        
        try:
            message = MIMEMultipart()
            message["From"] = sender_email
            email = body.get('email')
            message["To"] = email
            message["Subject"] = body.get("subject")
        except:
            print("error occured")
            return {'result': False, 'info': "user does not exist"}, 500

        message.attach(MIMEText(body.get("body"), "plain"))

        text = message.as_string()

        for filename in ["audit_day.png", "audit_week.png", "audit_month.png", "audit_year.png", "audit_day_1.csv", "audit_week_1.csv", "audit_month_1.csv", "audit_year_1.csv", "audit_day_2.csv", "audit_week_2.csv", "audit_month_2.csv", "audit_year_2.csv"]:
            
            # Open PDF file in binary mode
            with open(filename, "rb") as attachment:
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

        # Log in to server using secure context and send email
        context = ssl.create_default_context()
        with smtplib.SMTP_SSL("smtp.gmail.com", 465, context=context) as server:
            server.login(sender_email, password)
            server.sendmail(sender_email, email, text)

        for i in ["audit_day.png", "audit_week.png", "audit_month.png", "audit_year.png", "audit_day_1.csv", "audit_week_1.csv", "audit_month_1.csv", "audit_year_1.csv", "audit_day_2.csv", "audit_week_2.csv", "audit_month_2.csv", "audit_year_2.csv"]:
            os.remove(i)

        return {'status': True}, 200

@apis.route('/report_timeframe', methods=['GET', 'POST'])
def report_timeframe():  

    body = request.get_json()

    print(body)

    report_timeframe_ls = []
    
    audit_ls = Audit_FB.objects(auditeeName = body.get('email'))

    for i in audit_ls:
        report_timeframe_ls.append("FnB_Audit_"+str(i.timestamp))

    audit_ls = Audit_non_FB.objects(auditeeName = body.get('email'))

    for i in audit_ls:
        report_timeframe_ls.append("Non_FnB_Audit_"+str(i.timestamp))

    audit_ls = Covid_Compliance.objects(auditeeName = body.get('email'))

    for i in audit_ls:
        report_timeframe_ls.append("Covid_Audit_"+str(i.timestamp))

    print(report_timeframe_ls)

    return {'status': True, 'timeframe_list': report_timeframe_ls}

def addTitle(doc, title):
    doc.append(Spacer(1, 20))
    doc.append(Paragraph(title , ParagraphStyle(name='Name', fontFamily='Arial', fontSize=20, spaceAfter=1.5, alignment=TA_CENTER, bold=1)))
    return doc

def addParagraphs(doc, text):
    for line in text.split('\n'):
        doc.append(Paragraph(line))
        doc.append(Spacer(1,1))
    return doc

@apis.route('/report_checklist', methods=['GET', 'POST'])
def report_checklistt():

    body = request.get_json()

    timeframe = body.get('report')

    document = []

    if timeframe[:3] == "Cov":

        df = pd.read_csv("covid_audit.csv")
        audit_ls = Covid_Compliance.objects(timestamp = timeframe[12:])[0]

        document.append(Paragraph(str(audit_ls["id"]),ParagraphStyle(name='Name', fontFamily='Arial', fontSize=14, bold=1)))
        document.append(Image('singhealth_logo.png', 2.2*inch, 2.2*inch))
        document = addTitle(document, "COVID SAFE MANAGEMENT MEASURES ")
        document = addTitle(document, "COMPLIANCE CHECKLIST GUIDE")
        document.append(Spacer(1,20))
        document.append(Paragraph("Name of Auditee : " + audit_ls['auditeeName'],ParagraphStyle(name='Name', fontFamily='Arial', fontSize=14, bold=1)))
        document.append(Spacer(1,1))
        document.append(Paragraph("Name of Auditor : " + audit_ls['auditorName'], ParagraphStyle(name='Name', fontFamily='Arial', fontSize=14, bold=1)))
        document.append(Spacer(1,1))
        document.append(Paragraph("Name of Auditor's department : " + audit_ls['auditorDepartment'], ParagraphStyle(name='Name', fontFamily='Arial', fontSize=14, bold=1)))
        document.append(Spacer(1,1))
        document.append(Paragraph("Timestamp : " + audit_ls['timestamp'], ParagraphStyle(name='Name', fontFamily='Arial', fontSize=14, bold=1)))
        document.append(Spacer(1,1))
        
        checklist = audit_ls['checklist']
        checklist = [''] + checklist[:8] + [''] + checklist[8:]

        for i in range(len(checklist)):
            if checklist[i] == -1:
                checklist[i] = 'NA'
            elif checklist[i] == 1:
                checklist[i] = 'yes'
            elif checklist[i] == 0:
                checklist[i] = 'no'

        df['data'] = checklist

        text = ""

        for i in range(len(df)-1):
            text += df["Audit Questions"][i] + " : " + df["data"][i] + '\n'

        document.append(Spacer(1,20))

        document = addParagraphs(document, text)
        document.append(Spacer(1,5))
        document.append(Paragraph("Comments : " + audit_ls['comment']))

        SimpleDocTemplate('audit_checklist.pdf', pagesize=letter, rightMargin=12, leftMargin=12, topMargin=12, bottomMargin=6).build(document)
        
    elif timeframe[:3] == "Non":

        df = pd.read_csv("non_fnb_audit.csv")
        audit_ls = Audit_non_FB.objects(timestamp = timeframe[12:])[0]

        document.append(Paragraph(str(audit_ls["id"]),ParagraphStyle(name='Name', fontFamily='Arial', fontSize=14, bold=1)))
        document.append(Image('singhealth_logo.png', 2.2*inch, 2.2*inch))
        document = addTitle(document, "COVID SAFE MANAGEMENT MEASURES ")
        document = addTitle(document, "COMPLIANCE CHECKLIST GUIDE")
        document.append(Spacer(1,20))
        document.append(Paragraph("Name of Auditee : " + audit_ls['auditeeName'],ParagraphStyle(name='Name', fontFamily='Arial', fontSize=14, bold=1)))
        document.append(Spacer(1,1))
        document.append(Paragraph("Name of Auditor : " + audit_ls['auditorName'], ParagraphStyle(name='Name', fontFamily='Arial', fontSize=14, bold=1)))
        document.append(Spacer(1,1))
        document.append(Paragraph("Name of Auditor's department : " + audit_ls['auditorDepartment'], ParagraphStyle(name='Name', fontFamily='Arial', fontSize=14, bold=1)))
        document.append(Spacer(1,1))
        document.append(Paragraph("Timestamp : " + audit_ls['timestamp'], ParagraphStyle(name='Name', fontFamily='Arial', fontSize=14, bold=1)))
        document.append(Spacer(1,1))
        
        checklist = audit_ls['checklist']
        checklist = ['',''] + checklist[:3] + [''] + checklist[3:13] + ['']

        for i in range(len(checklist)):
            if checklist[i] == -1:
                checklist[i] = 'NA'
            elif checklist[i] == 1:
                checklist[i] = 'yes'
            elif checklist[i] == 0:
                checklist[i] = 'no'

        df['data'] = checklist

        text = ""

        for i in range(len(df)-1):
            text += df["Audit Questions"][i] + " : " + df["data"][i] + '\n'

        document.append(Spacer(1,20))

        document = addParagraphs(document, text)
        document.append(Spacer(1,5))
        document.append(Paragraph("Comments : " + audit_ls['comment']))

        SimpleDocTemplate('audit_checklist.pdf', pagesize=letter, rightMargin=12, leftMargin=12, topMargin=12, bottomMargin=6).build(document)
    elif timeframe[:3] == 'FnB':

        df = pd.read_csv("fnb_audit.csv")
        print(timeframe[10:])
        audit_ls = Audit_FB.objects(timestamp = timeframe[10:])[0]

        document.append(Paragraph(str(audit_ls["id"]),ParagraphStyle(name='Name', fontFamily='Arial', fontSize=14, bold=1)))
        document.append(Image('singhealth_logo.png', 2.2*inch, 2.2*inch))
        document = addTitle(document, "COVID SAFE MANAGEMENT MEASURES ")
        document = addTitle(document, "COMPLIANCE CHECKLIST GUIDE")
        document.append(Spacer(1,20))
        document.append(Paragraph("Name of Auditee : " + audit_ls['auditeeName'],ParagraphStyle(name='Name', fontFamily='Arial', fontSize=14, bold=1)))
        document.append(Spacer(1,1))
        document.append(Paragraph("Name of Auditor : " + audit_ls['auditorName'], ParagraphStyle(name='Name', fontFamily='Arial', fontSize=14, bold=1)))
        document.append(Spacer(1,1))
        document.append(Paragraph("Name of Auditor's department : " + audit_ls['auditorDepartment'], ParagraphStyle(name='Name', fontFamily='Arial', fontSize=14, bold=1)))
        document.append(Spacer(1,1))
        document.append(Paragraph("Timestamp : " + audit_ls['timestamp'], ParagraphStyle(name='Name', fontFamily='Arial', fontSize=14, bold=1)))
        document.append(Spacer(1,1))
        
        checklist = audit_ls['profstaffhydScoreList'] + audit_ls['housekeepScoreList'] + audit_ls['foodhydScoreList'] + audit_ls['healthierScoreList'] + audit_ls['worksafetyhealthScoreList']
        for i in range(len(checklist)):
            checklist[i] = str(checklist[i])
        print(len(checklist))
        print(len(audit_ls['worksafetyhealthScoreList']))
        checklist = ['',''] + checklist[:3] + [''] + checklist[3:13] + ['',''] + checklist[13:28] + [''] + checklist[28:30] + ['',''] + checklist[30:56] + [''] + checklist[56:67] + ['',''] + checklist[67:74] + [''] + checklist[74:78] + ['',''] + checklist[78:89] + [''] + checklist[89:92] + [''] + checklist[92:96]

        print(len(df['data']))

        df['data'] = checklist

        print(df)

        text = ""

        for i in range(len(df)-1):
            text += df["Audit Questions"][i] + " : " + df["data"][i] + '\n'

        document.append(Spacer(1,20))

        document = addParagraphs(document, text)
        document.append(Spacer(1,5))
        document.append(Paragraph("Comments : " + audit_ls['comment']))

        SimpleDocTemplate('audit_checklist.pdf', pagesize=letter, rightMargin=12, leftMargin=12, topMargin=12, bottomMargin=6).build(document)

    original = "audit_checklist.pdf"
    target = "app/apis/audit_checklist.pdf"

    shutil.move(original,target)

    receiver_email = body.get('email')
    subject = body.get('subject')
    try:

        message = MIMEMultipart()
        message["From"] = sender_email
        message["To"] = receiver_email
        message["Subject"] = subject
        message.attach(MIMEText(body.get("body"), "plain"))
    except:
        print("error occured")
        return {'result': False, 'info': "user does not exist"}

    filename = "audit_checklist.pdf"  # In same directory as script

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


    return {'status': True}