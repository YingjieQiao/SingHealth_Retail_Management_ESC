import base64
from io import BytesIO

import boto3
from botocore.exceptions import ClientError
import os
from PIL import Image



def upload_file(file_name, bucket, object_name):
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
        #TODO log the response in the logger
    except ClientError as e:
        logging.error(e)
        return False
    return True


def download(s3, file_name, bucket, object_name):
    """Download a file from an S3 bucket

    :param file_name: File to download
    :param bucket: Bucket to download from
    :param object_name: S3 object name.
    :return: path to the downloaded photo
    """

    filename_full = ""

    if object_name is None:
        object_name = file_name

    if s3 == None:
        s3 = boto3.client('s3',
                aws_access_key_id=os.environ.get('ACCESS_KEY'),
                aws_secret_access_key=os.environ.get('SECRET_KEY'))
    try:
        s3.download_file(bucket, object_name, file_name)
        filename_full = os.getcwd() + '/' + file_name
    except ClientError as e:
        logging.error(e)
    return filename_full


def download_user_objects(bucket, username, timeInput, dateInput):
    s3_client = boto3.client('s3',
                aws_access_key_id=os.environ.get('ACCESS_KEY'),
                aws_secret_access_key=os.environ.get('SECRET_KEY'))
    res = []

    for key in s3_client.list_objects(Bucket=bucket)['Contents']:
        ls = key['Key'].split('_')
        if (ls[0] == username):
            photoPath = download(s3_client, key['Key'], bucket, None)
            img = Image.open(photoPath)
            in_mem_file = BytesIO()
            img.save(in_mem_file, format='JPEG')
            in_mem_file.seek(0)
            img_data = in_mem_file.read()
            encoded_img_bytes = base64.b64encode(img_data)
            encoded_img_string = encoded_img_bytes.decode('ascii')
            
            res.append(encoded_img_string)
    return res
