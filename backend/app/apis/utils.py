from app.models import User, Photo
import csv, json, uuid, os, logging
from flask import current_app
import shutil


logger = logging.getLogger("logger")

def get_data():
    users = User.objects()
    photos = Photo.objects()

    return users, photos


def mongo_object_to_dict(mongoObj):
    res = {}
    res = json.loads(mongoObj.to_json())
    return res


def get_assets_folder_string():
    if os.name == "posix":
        assetsFolderName = "assets/"
    else:
        assetsFolderName = "assets\\"
    return assetsFolderName


def write_to_csv(inputData, dataType):
    '''
    inputData: list. A list of dict where each dict is an entry in database
    dataType: String. User, Photo, etc
    '''

    '''
    userdata:
    [{'_id': {'$oid': '6040f4bd56301173e753ebb6'}, 'email': 'hello@daniel.com', 
        'firstName': 'Daniel', 'lastName': 'Qiao', 'location': 'SUTD', 'mobile': 123456, 
        'password': '$2b$12$w8L95TVnSariY8X.KhCU7uQlnMujW7iOqbRs/b/tMTVHzQe01kgge'}, 
    {'_id': {'$oid': '6041101ac9863af3a5a9066f'}, 'email': 'cj@hi.com', 
        'firstName': 'Carl', 'lastName': 'Johnson', 'location': 'NUS', 'mobile': 123456, 
        'password': '$2b$12$GOQigzspIjbbFk8MCm41K.tWoQtQWNOw66Ka2htwvRJpGZcD6KgUy'}, 
        {'_id': {'$oid': '60411047c9863af3a5a90670'}, 'email': 'sutdcs@edu.com', 'firstName': 'ellohay', 'lastName': 'helloay', 'location': 'SUTD', 'mobile': 11, 'password': '$2b$12$UZttugskuB2koaBGvAZMZO3WTRoVb3MJQ1/1O.HXZO43.xXuHxjhi'}, {'_id': {'$oid': '60411060c9863af3a5a90671'}, 'email': 'testdup@sss.com', 'firstName': 'Yingjie', 'lastName': 'Qiao', 'location': 'NUS', 'mobile': 11, 'password': '$2b$12$6FlLG2uKRf0IPM76jMFhSu4zkFlTzcNfRHtpHG2EJC1yXCinTGkdu'}, {'_id': {'$oid': '6041107fc9863af3a5a90672'}, 'email': 'makesure@works.now', 'firstName': 'Yingjie', 'lastName': 'Qiao', 'location': 'None', 'mobile': 123, 'password': '$2b$12$PHgZzP4CPrXgnTgCfyNLO.8LhWVUYBNkl4oWCTYaA87zHlDBZWLHy'}, {'_id': {'$oid': '60411adacdc556947a526310'}, 'email': 'yingjie_qiao@mymail.sutd.edu.sg', 'firstName': 'Yingjie', 'lastName': 'Qiao', 'location': 'SUTD', 'mobile': 123455, 'password': '$2b$12$kTg2rD6hIsECDvqugTizAe0w6Z2vvrcysJi9RvGX4azfrgC8bHC9e'}, {'_id': {'$oid': '604185e9d9d835c990288668'}, 'email': 'cbing@friends.com', 'firstName': 'Chandler', 'lastName': 'Bing', 'location': 'SUTD', 'mobile': 1234456, 'password': '$2b$12$4i41zPD4UtTKUQE4b2n.Kuhs4vqR7xNye7sJwGAL51pcIiiBxRY9q'}]

    [{'_id': {'$oid': '60574eab3f72c4768cf624cb'}, 'caseID': '1616334460908', 'date': '03-21-2021', 
        'notes': 'carl johnson', 'staffName': 'CarlJohnson', 'tags': 'tag2', 'tenantName': 'KFC', 'time': '21:47:48'}, 
        
        {'_id': {'$oid': '605773fc6b910fe076aeb9b9'}, 'caseID': '1616344052796', 'date': '01-01-2021', 
        'notes': 'awd', 'staffName': 'CarlJohnson', 'tags': 'tag2', 'tenantName': '711', 'time': '00:27:40'}, 
        
        {'_id': {'$oid': '6057786c4e0bf23d2188bb2f'}, 'caseID': '1616345184070', 'date': '01-01-2021', 
        'notes': 'asdaw', 'staffName': 'CarlJohnson', 'tags': 'tag2', 'tenantName': '711', 'time': '00:46:36'}, {'_id': {'$oid': '60577a56059e43878344d7e6'}, 'caseID': '1616345675475', 'date': '03-22-2021', 'notes': 'hello there', 'staffName': 'CarlJohnson', 'tags': 'tag2', 'tenantName': '711', 'time': '00:54:46'}]

    '''

    fileName = dataType + '_' + str(uuid.uuid4()) + '.csv'
    fileHeaders = []
    for key in inputData[0].keys():
        if key == "_id" or key == "password":
            pass
        else:
            fileHeaders.append(key)

    assetsFolderName = get_assets_folder_string()
    filePath = os.path.join(os.getcwd(), assetsFolderName)
    print(os.path.join(filePath + fileName))
    with open(os.path.join(filePath + fileName), mode='w') as csvFile:
        writer = csv.DictWriter(csvFile, fieldnames=fileHeaders)
        writer.writeheader()
        for i in range(0, len(inputData)):
            row = {}
            for header in fileHeaders:
                value = inputData[i][header]
                row[header] = value
            writer.writerow(row)

    return filePath, fileName


def clear_assets():
    assetsFolderName = get_assets_folder_string()
    assetsPath = os.path.join(os.getcwd(), assetsFolderName)

    shutil.rmtree(assetsPath) 


def check_if_staff(username, flag):
    if flag:
        username = "UNITTEST"
    users = User.objects(staff=True)
    for user in users:
        username_check = "".join([user["firstName"], user["lastName"]])
        if (username == username_check):
            print("found staff: ", username)
            return True
    return False


def check_if_tenant(username, flag):
    if flag:
        username = "UNITTEST"
    users = User.objects(tenant=True)
    for user in users:
        username_check = "".join([user["firstName"], user["lastName"]])
        if (username == username_check):
            print("found tenant: ", username)
            return True
    return False


def assign_s3_bucket(username):
    if username == "UnitTester":
        return "escapp-bucket-dev", "escapp-bucket-dev-tenant"

    bucketName, counterPart_bucketName = "", ""
    if (check_if_staff(username, False)):
        bucketName, counterPart_bucketName = "escapp-bucket-dev", "escapp-bucket-dev-tenant"
    elif (check_if_tenant(username, False)):
        bucketName, counterPart_bucketName = "escapp-bucket-dev-tenant", "escapp-bucket-dev"
    else:
        print("something wrong")

    return bucketName, counterPart_bucketName


def assign_audience_name(username, staffName, tenantName):
    if username == "":
        return "UnitTester"

    res = ""
    if check_if_staff(username, False):
        res = tenantName
    elif check_if_tenant(username, False):
        res = staffName
    else:
        res = ""
    return res


def get_tenant_email(tenantName):
    tenantEmail = ""
    users = User.objects(tenant=True)
    for user in users:
        tenantName_check = "".join([user["firstName"], user["lastName"]])
        if (tenantName == tenantName_check):
            tenantEmail = user["email"]
            print("found tenant email: ", tenantEmail)
            break
    return tenantEmail


def get_staff_email(staffName):
    staffEmail = ""
    users = User.objects(staff=True)
    for user in users:
        staffName_check = "".join([user["firstName"], user["lastName"]])
        if (staffName == staffName_check):
            staffEmail = user["email"]
            print("found tenant email: ", staffEmail)
            break
    return staffEmail
