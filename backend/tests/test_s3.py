import boto3
from botocore.exceptions import ClientError
import logging


def upload(file_name, bucket, object_name=None):
    """Upload a file to an S3 bucket

    :param file_name: File to upload
    :param bucket: Bucket to upload to
    :param object_name: S3 object name. If not specified then file_name is used
    :return: True if file was uploaded, else False
    """

    if object_name is None:
        object_name = file_name

    s3_client = boto3.client('s3')
    try:
        response = s3_client.upload_file(file_name, bucket, object_name)
    except ClientError as e:
        logging.error(e)
        return False
    return True


def download(file_name, bucket, object_name):
    """Download a file from an S3 bucket

    :param file_name: File to download
    :param bucket: Bucket to download from
    :param object_name: S3 object name.
    :return: True if file was downloaded, else False
    """

    if object_name is None:
        return False

    s3 = boto3.client('s3')
    try:
        response = s3.download_file(bucket, object_name, file_name)
    except ClientError as e:
        logging.error(e)
        return False
    return True


if __name__ == "__main__":
    # upload('testpic.png', 'escapp-bucket', 'images/test2.png')
    download('downloaded_pic2.png', 'escapp-bucket', 'images/testpic.png')
