from app.models import PhotoNotification, PhotoNotificationFromTenant
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
        #print("error occurred: ", e)
        pass

def add_notification_from_tenant(body):
    """
    :param: body: json, same format as Photo
    add a column 'read' for nofitication
    """
    try:
        body['read'] = False
        body['deleted'] = False
        newPhotoNotification = PhotoNotificationFromTenant(**body)
        newPhotoNotification.save()
    except Exception as e:
        # print("error occurred: ", e)
        pass

def tenant_update_photo_notification(op, username, body):    
    time_ = body['time']
    date_ = body['date']
    if op == "delete":
        body['deleted'] = True
    elif op == "read":
        body['read'] = True

    if username == "":
        username = "UnitTester"
        # print("testing")
        logger.info("testing '/tenant_delete_photo_notification' endpoint")

    try:
        photoNotification = PhotoNotification.objects(date=date_, time=time_, 
                                                        tenantName=username)
        photoNotification.update(**body)
    except Exception as e:
        # print("error: ", e) 
        logger.error("In '/tenant_delete_photo_notification' endpoint, error occurred: ", e)
        return {'result': False}, 500

    return {'result': True}, 200


def staff_update_photo_notification(op, username, body):    
    time_ = body['time']
    date_ = body['date']
    if op == "delete":
        body['deleted'] = True
    elif op == "read":
        body['read'] = True

    if username == "":
        username = "UnitTesterStaff"
        # print("testing: ", username)
        logger.info("testing '/staff_delete_photo_notification' endpoint")

    try:
        photoNotificationFromTenant = PhotoNotificationFromTenant.objects(date=date_, time=time_,
                                                        staffName=username)
        photoNotificationFromTenant.update(**body)
    except Exception as e:
        # print("error: ", e) 
        logger.error("In '/staff_delete_photo_notification' endpoint, error occurred: ", e)
        return {'result': False}, 500

    return {'result': True}, 200
