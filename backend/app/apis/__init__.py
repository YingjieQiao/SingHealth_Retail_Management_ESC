from flask import Blueprint, request, session, jsonify, url_for, current_app, send_from_directory
from app.models import User, Audit_non_FB, Photo
import boto3
from botocore.exceptions import ClientError
import logging
from PIL import Image
import os
from datetime import datetime

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
    try:
        user = User(**body)
        user.hash_password()
        user.setfnb(True)
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
        user = User.objects.get(email=body.get('email'))
        firstName = user.firstName
        lastName = user.lastName
        authorized = user.check_password(body.get('password'))
        print(authorized)
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

    body = "Please click on the link given below for 2FA  \n\n {}".format(token)

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
        email = s.loads(body.get("token"), salt='login', max_age=120) #age needs to be increased to allow longer duration for the link to exist
        user = User.objects.get(email=email)
        firstName = user.firstName
        lastName = user.lastName
        staff=user.staff
        admin=user.admin
        tenant=user.tenant
        settings.username = firstName + lastName
        return {'result': True, 'firstName': firstName, 'lastName': lastName, 'staff':staff, 'admin':admin, 'tenant':tenant}, 200 #this returns the details of the user 
    except:
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
    try:
        body = request.get_json()
        tableName = body['tableName']
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

@apis.route('/tenant_exists', methods=['GET', 'POST'])
def tenant_exists():
    
    body = request.get_json(silent=True)
        
    audit_ls = Audit_non_FB.objects(auditeeName = body.get('tenant'))

    if len(audit_ls) == 0:
        return {'status': False, 'info': "Not enough data entries"}

    print(audit_ls)

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

    # for i in ["audit_day.png", "audit_week.png", "audit_month.png", "audit_year.png"]:#, "audit_day.csv", "audit_week.csv", "audit_month.csv", "audit_year.csv", "audit.csv"]:
    #     os.remove(i)

    print(type(df_day.values.T.tolist()))

    return {'result': True, "audit_day_img": audit_day[2:-1], "audit_week_img": audit_week[2:-1], "audit_month_img": audit_month[2:-1], "audit_year_img": audit_year[2:-1], "columns": list(df_day.columns), "audit_day_csv": df_day.values.T.tolist(), "audit_week_csv": df_week.values.T.tolist(), "audit_month_csv": df_month.values.T.tolist(), "audit_year_csv": df_year.values.T.tolist(), "audit_csv": df.values.T.tolist()}

@apis.route('/tenant_list', methods=['GET', 'POST'])
def tenant_list():
    
    # The statement below can be used to filter entried from the table
    # tenant_list = User.objects.filter(email = "1234")

    tenant_list = User.objects.all()

    try:
        
        temp_ls = []
        for i in tenant_list:
            temp_ls.append({'firstName': i['firstName'], 'lastName': i['lastName'], 'email': i["email"], 'location': i['location']}) # need to hash email when sent to front-end, being used as an id to find graphs later
        
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
    print(body)
    body['workSafetyScore'] = body['workSafetyHealthScore'] 
    body['profScore'] = body['profStaffHydScore'] 
    body['housekeepingScore'] = 11 #body['houseGeneralScore']
    body.pop('workSafetyHealthScore')
    body.pop('profStaffHydScore')
    body.pop('houseGeneralScore')
    print(body)
    audit = Audit_non_FB(**body)
    audit.timestamp = str(ts)
    audit.computeTotalScore()
    audit.save()
    return {'statusText': True}

@apis.route('/compare_tenant', methods=['GET', 'POST'])
def compare_tenant():
    
    body = request.get_json()

    print(body)
        
    audit_ls_1 = Audit_non_FB.objects(auditeeName = body.get('institute1'))
    audit_ls_2 = Audit_non_FB.objects(auditeeName = body.get('institute2'))

    if len(audit_ls_1) == None or len(audit_ls_2) == None:
        return {'status': False, 'info': "Not enough data entries"}

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
        "audit_day_img": audit_day, "audit_week_img": audit_week, 
        "audit_month_img": audit_month, "audit_year_img": audit_year, 
        "columns": list(df_day_1.columns), "audit_day_csv_1": df_day_1.values.T.tolist(), 
        "audit_week_csv_1": df_week_1.values.T.tolist(), "audit_month_csv_1": df_month_1.values.T.tolist(), 
        "audit_year_csv": df_year_1.values.T.tolist(), "audit_day_csv_2": df_day_2.values.T.tolist(), 
        "audit_week_csv_2": df_week_2.values.T.tolist(), "audit_month_csv_2": df_month_2.values.T.tolist(), 
        "audit_year_csv_2": df_year_2.values.T.tolist(), "audit_csv_1": df_1.values.T.tolist(), 
        "audit_csv_2": df_2.values.T.tolist()}

