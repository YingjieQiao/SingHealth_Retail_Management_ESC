import os
from datetime import datetime


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



if __name__ == "__main__":
    #list_files()
    #datetime_to_str()
    test_split_filename()
