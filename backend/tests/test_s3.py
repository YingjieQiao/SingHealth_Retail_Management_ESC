import boto3
from botocore.exceptions import ClientError
import logging
import os


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


def download(s3, file_name, bucket, object_name):
    """Download a file from an S3 bucket

    :param file_name: File to download
    :param bucket: Bucket to download from
    :param object_name: S3 object name.
    :return: True if file was downloaded, else False
    """

    if object_name is None:
        object_name = file_name

    if s3 == None:
        s3 = boto3.client('s3',
                aws_access_key_id=os.environ.get('ACCESS_KEY'),
                aws_secret_access_key=os.environ.get('SECRET_KEY'))
    try:
        response = s3.download_file(bucket, object_name, file_name)
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
    # upload('testpic.png', 'escapp-bucket-dev', 'images/test2.png')
    # download(None, 'YingjieQiao_time_date.jpg', 'escapp-bucket-dev', 'YingjieQiao_time_date.jpg')
    list_all_objects('escapp-bucket-dev', 'YingjieQiao', None, None)
    print("done")
