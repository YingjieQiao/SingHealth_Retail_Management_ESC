"""
Functional unit test implemented using direct functions (instead of pytest)
"""

import logging
import os
from datetime import datetime
import boto3
from botocore.exceptions import ClientError


def list_files():
    mypath = "/Users/yingjieqiao/Desktop/term5/react-flask-app/backend"
    files = []
    for filename in os.listdir(mypath):
        filename_full = os.path.join(mypath, filename)
        if (os.path.isfile(filename_full) 
            and not filename.endswith(".py") and filename != '.DS_Store'):
            files.append(filename)
    print(files)


def datetime_to_str():
    now = datetime.now() # current date and time
    dateTime = now.strftime("%m/%d/%Y %H:%M:%S")
    print("date and time:",dateTime)
    
    username = "YingjieQiao"
    dateTimeArr = dateTime.split(" ")
    date_ = dateTimeArr[0]
    time_ = dateTimeArr[1]
    date_ = date_.replace("/", "-")
    print(date_)
    print(time_)

    filename = username + "_" + date_ + "_" + time_ + ".jpg"
    print(filename)


def test_split_filename():
    filename = "YingjieQiao_03-04-2021_23:41:41.jpg"
    filename_parts = filename.split('_')
    date_ = filename_parts[1]
    time_ = filename_parts[2][:-4]
    print(date_)
    print(time_)


def upload(file_name, bucket, object_name=None):
    """Upload a file to an S3 bucket

    :param file_name: File to upload
    :param bucket: Bucket to upload to
    :param object_name: S3 object name. If not specified then file_name is used
    :return: True if file was uploaded, else False
    """

    if object_name is None:
        object_name = file_name

    s3_client = boto3.client('s3',
                             aws_access_key_id=os.environ.get('ACCESS_KEY'),
                             aws_secret_access_key=os.environ.get('SECRET_KEY'))
    try:
        response = s3_client.upload_file(file_name, bucket, object_name)
    except ClientError as e:
        logging.error(e)
        return False
    return True


def list_all_objects(bucket, username, timeInput, dateInput):
    s3_client = boto3.client('s3',
                             aws_access_key_id=os.environ.get('ACCESS_KEY'),
                             aws_secret_access_key=os.environ.get('SECRET_KEY'))

    for key in s3_client.list_objects(Bucket=bucket)['Contents']:
        ls = key['Key'].split('_')

        if (ls[0] == username):
            print(key['Key'])
            print(ls[1])
            print(ls[2][:-4])
            # download(s3_client, key['Key'], bucket, None)
            pass

if __name__ == "__main__":
    #list_files()
    #datetime_to_str()
    list_all_objects('escapp-bucket-dev', 'YingjieQiao', None, None)
    #test_split_filename()
