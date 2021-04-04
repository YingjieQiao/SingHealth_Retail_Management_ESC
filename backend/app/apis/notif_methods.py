from app.models import PhotoNotification
from flask import request
import logging


logger = logging.getLogger("logger")


def add_notification(body):
    """
    :param: body: json, same format as Photo
    add a column 'read' for nofitication
    """
    try:
        body['read'] = False
        body['deleted'] = False
        newPhotoNotification = PhotoNotification(**body)
        newPhotoNotification.save()
    except Exception as e:
        print("error occurred: ", e)


def tenant_update_photo_notification(op, username, body):    
    time_ = body['time']
    date_ = body['date']
    if op == "delete":
        body['deleted'] = True
    elif op == "read":
        body['read'] = True

    print(body)

    if username == "":
        username = "UnitTester"
        print("testing")
        logger.info("testing '/tenant_delete_photo_notification' endpoint")

    try:
        photoNotification = PhotoNotification.objects(date=date_, time=time_, 
                                                        tenantName=username)
        photoNotification.update(**body)
    except Exception as e:
        print("error: ", e) 
        logger.error("In '/tenant_delete_photo_notification' endpoint, error occurred: ", e)
        return {'result': False}, 500

    return {'result': True}, 200
