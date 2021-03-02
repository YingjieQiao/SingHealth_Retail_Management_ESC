import boto3
from botocore.exceptions import ClientError


def upload_file(file_name, bucket, object_name):
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
        #TODO log the response in the logger
    except ClientError as e:
        logging.error(e)
        return False
    return True


def download_file(file_name, bucket, object_name):
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
        #TODO log the response in the logger
    except ClientError as e:
        logging.error(e)
        return False
    return True
