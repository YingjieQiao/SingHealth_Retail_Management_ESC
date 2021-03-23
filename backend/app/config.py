class Config():
    DEBUG = True
    MONGODB_SETTINGS = {
        'host': 'mongodb://localhost/escapp'
    }
    ASSET_DIR = "./backend/assets/" # seems doesnt work
    #TODO update directory to relative path, need to test from frontend side
    