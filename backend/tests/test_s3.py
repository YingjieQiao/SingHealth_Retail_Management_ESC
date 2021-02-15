import boto3

def main():
    # Let's use Amazon S3
    s3 = boto3.resource('s3')   


    # Upload a new file
    data = open('testpic.png', 'rb')
    s3.Bucket('escapp-bucket').put_object(Key='images/testpic.png', Body=data)


if __name__ == "__main__":
    main()