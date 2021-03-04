import os

def list_files():
    mypath = "/Users/yingjieqiao/Desktop/term5/react-flask-app/backend"
    files = []
    for filename in os.listdir(mypath):
        filename_full = os.path.join(mypath, filename)
        if (os.path.isfile(filename_full) 
            and not filename.endswith(".py") and filename != '.DS_Store'):
            files.append(filename)
    print(files)


if __name__ == "__main__":
    list_files()