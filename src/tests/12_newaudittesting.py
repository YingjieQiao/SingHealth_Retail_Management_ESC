from selenium import webdriver
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.common.exceptions import TimeoutException
from selenium.webdriver.common.keys import Keys
import re
import time
from selenium.webdriver.common.by import By
import random
browser = webdriver.Chrome("\webdriver\\chromedriver") # Get local session of firefox
browser.get("http://localhost:3000/") # Load App page
print("***setup complete***")
def testinglink():


    #browser.find_element(By.LINK_TEXT,"admin").click()

    print("yolo")
    links = browser.find_elements_by_tag_name('a')

    print(links)
    
    print("***Printing all link names***")
    # print all the links
    for elem in links:
        href = elem.get_attribute('href')
        if href is not None:
            print(href)
def testingsigninsignout():    
    print("***sign in sign out functionality***")

    myUserName = "ishaan_nair@mymail.sutd.edu.sg"
    myPassword = "1234"
    tokenadmin = "admin"
    tokentenant = "tenant"
    tokenstaff = "staff"
    mobile = "12345678"
    myPassword = "1234"
    repassword="1234"
    location="SUTD"

    username = browser.find_element_by_id("email")
    time.sleep(1)	
    username.send_keys(myUserName)
    time.sleep(1)
    username = browser.find_element_by_id("password")
    time.sleep(1)	
    username.send_keys(myPassword)
    time.sleep(1)
    button = browser.find_element_by_id("submit").click()
    time.sleep(1)	
    try:
        WebDriverWait(browser, 10).until(EC.alert_is_present(),
                                       'Timed out waiting for PA creation ' +
                                       'confirmation popup to appear.')

        alert = browser.switch_to.alert
        print(alert)
        alert.accept()
        print("alert accepted")
    except TimeoutException:
        print("no alert")	
    username = browser.find_element_by_id("token")
    time.sleep(1)	
    username.send_keys(tokenstaff)
    time.sleep(1)
    button = browser.find_element_by_id("submiting").click()
    time.sleep(1)	
    try:
        WebDriverWait(browser, 10).until(EC.alert_is_present(),
                                       'Timed out waiting for PA creation ' +
                                       'confirmation popup to appear.')

        alert = browser.switch_to.alert
        print(alert.text)
        alert.accept()
        print("alert accepted")
    except TimeoutException:
        print("no alert")	
    # browser.execute_script("arguments[0].click();", WebDriverWait(browser, 20).until(EC.element_to_be_clickable((By.CSS_SELECTOR, "li.navigationbar__item a[data-link-name='login'][href='/login']"))))

    time.sleep(1)	


def AuditChecklistNonFB():
    print("non fnb selected")
    time.sleep(1)	
    n = random.randint(1,3)
    chooseFile = browser.find_element_by_id("Auditee")
    # if(n==1):
    #     chooseFile.send_keys("KFC")
    # elif(n==2): 
    chooseFile.send_keys("mihir chibs")
    # elif(n==3):
    #     chooseFile.send_keys("MosB")
    # r = random.randint(1,3)
    chooseFile = browser.find_element_by_id("auditorName")
    # if(r==1):
    #     chooseFile.send_keys("Tom")
    # elif(r==2): 
    chooseFile.send_keys("ishaannair")
    # elif(r==3):
    #     chooseFile.send_keys("Charlie")

    t = random.randint(1,3)
    chooseFile = browser.find_element_by_id("auditorDepartment")
    if(t==1):
        chooseFile.send_keys("CSR")
    elif(t==2): 
        chooseFile.send_keys("HR")
    elif(t==3):
        chooseFile.send_keys("Risk")
    data = random.randint(0,10)
    chooseFile = browser.find_element_by_id("1").click()
    chooseFile.send_keys(data)
    data = random.randint(0,10)
    chooseFile = browser.find_element_by_id("002")
    chooseFile.send_keys(data)
    data = random.randint(0,10)
    chooseFile = browser.find_element_by_id("003")
    chooseFile.send_keys(data)
    data = random.randint(0,10)
    chooseFile = browser.find_element_by_id("004")
    chooseFile.send_keys(data)
    data = random.randint(0,10)
    chooseFile = browser.find_element_by_id("005")
    chooseFile.send_keys(data)
    data = random.randint(0,10)
    chooseFile = browser.find_element_by_id("006")
    chooseFile.send_keys(data)
    data = random.randint(0,10)
    chooseFile = browser.find_element_by_id("007")
    chooseFile.send_keys(data)
    data = random.randint(0,10)
    chooseFile = browser.find_element_by_id("008")
    chooseFile.send_keys(data)
    data = random.randint(0,10)
    chooseFile = browser.find_element_by_id("009")
    chooseFile.send_keys(data)
    data = random.randint(0,10)
    chooseFile = browser.find_element_by_id("010")
    chooseFile.send_keys(data)
    data = random.randint(0,10)
    chooseFile = browser.find_element_by_id("011")
    chooseFile.send_keys(data)
    data = random.randint(0,10)
    chooseFile = browser.find_element_by_id("012")
    chooseFile.send_keys(data)
    data = random.randint(0,10)
    chooseFile = browser.find_element_by_id("013")
    chooseFile.send_keys(data)
    data = random.randint(0,10)
    chooseFile = browser.find_element_by_id("014")
    chooseFile.send_keys(data)
    data = random.randint(0,10)
    chooseFile = browser.find_element_by_id("015")
    chooseFile.send_keys(data)
    data = random.randint(0,10)
    chooseFile = browser.find_element_by_id("016")
    chooseFile.send_keys(data)
    data = random.randint(0,10)
    chooseFile = browser.find_element_by_id("017")
    chooseFile.send_keys(data)
    data = random.randint(0,10)
    chooseFile = browser.find_element_by_id("018")
    chooseFile.send_keys(data)
    data = random.randint(0,10)
    chooseFile = browser.find_element_by_id("019")
    chooseFile.send_keys(data)
    data = random.randint(0,10)
    chooseFile = browser.find_element_by_id("020")
    chooseFile.send_keys(data)
    data = random.randint(0,10)
    chooseFile = browser.find_element_by_id("021")
    chooseFile.send_keys(data)
    data = random.randint(0,10)
    chooseFile = browser.find_element_by_id("022")
    chooseFile.send_keys(data)
    data = random.randint(0,10)
    chooseFile = browser.find_element_by_id("023")
    chooseFile.send_keys(data)
    data = random.randint(0,10)
    chooseFile = browser.find_element_by_id("024")
    chooseFile.send_keys(data)
    data = random.randint(0,10)
    chooseFile = browser.find_element_by_id("025")
    chooseFile.send_keys(data)
    data = random.randint(0,10)
    chooseFile = browser.find_element_by_id("026")
    chooseFile.send_keys(data)
    data = random.randint(0,10)
    chooseFile = browser.find_element_by_id("027")
    chooseFile.send_keys(data)
    data = random.randint(0,10)
    chooseFile = browser.find_element_by_id("028")
    chooseFile.send_keys(data)
    data = random.randint(0,10)
    chooseFile = browser.find_element_by_id("029")
    chooseFile.send_keys(data)
    data = random.randint(0,10)
    chooseFile = browser.find_element_by_id("030")
    chooseFile.send_keys(data)
    data = random.randint(0,10)
    chooseFile = browser.find_element_by_id("031")
    chooseFile.send_keys(data)
    data = random.randint(0,10)
    chooseFile = browser.find_element_by_id("032")
    chooseFile.send_keys(data)
    data = random.randint(0,10)
    chooseFile = browser.find_element_by_id("033")
    chooseFile.send_keys(data)
    data = random.randint(0,10)
    chooseFile = browser.find_element_by_("034")
    chooseFile.send_keys(data)
    # button = browser.find_elem    ent_by_id("button22").click()
    # time.sleep(1)
    time.sleep(1)
    chooseFile = browser.find_element_by_id("comments")
    chooseFile.send_keys("this is a test")
    time.sleep(1)
    chooseFile = browser.find_element_by("Submit").click()
    time.sleep(1)
    print("non fnb completed")

def AuditChecklistTest():
    print("non fnb test selected")
    time.sleep(1)


def testinghomekeys():
    n = random.randint(1,4)
    links = browser.find_elements_by_tag_name('a')
    print("yolo")
    print("***testing all home buttons***")
    time.sleep(1)
    button = browser.find_element_by_class_name("menu-bars").click()
    time.sleep(1)
    time.sleep(1)
    for elem in links:
        href = elem.get_attribute('className')
        if href is not None:
            print(href)
    button = browser.find_element_by_id("audit").click()
    time.sleep(1)
    chooseFile = browser.find_element_by_id("auditType")
    n=2
    if(n==1):
        chooseFile.send_keys("F&B")
        time.sleep(1)
        n = random.randint(2,3)

    if(n==4):
        chooseFile.send_keys("Covid Safe Management Measures")
        time.sleep(1)
        n = random.randint(2,3)
    if(n==2): 
        chooseFile.send_keys("Non-F&B")
        time.sleep(1)
        AuditChecklistNonFB()
    elif(n==3):
        chooseFile.send_keys("Non-F&B Test")
        time.sleep(1)
        AuditChecklistTest()

    # chooseFile = browser.find_element_by_id("select")
    # chooseFile.send_keys("HouseKeeping and General Cleanliness")
    # chooseFile = browser.find_element_by_id("notes")
    # chooseFile.send_keys("HouseKeeping and General Cleanliness")
    # chooseFile = browser.find_element_by_id("tenant")
    # chooseFile.send_keys("RossGeller")
    # button = browser.find_element_by_id("button").click()
    # time.sleep(1)
    # try:
    #     WebDriverWait(browser, 10).until(EC.alert_is_present(),
    #                                    'Timed out waiting for PA creation ' +
    #                                    'confirmation popup to appear.')

    #     alert = browser.switch_to.alert
    #     print(alert.text)
    #     alert.accept()
    #     print("alert accepted")
    # except TimeoutException:
    #     print("no alert")	
    button = browser.find_element_by_class_name("menu-bars").click()
    time.sleep(1)
    
    button = browser.find_element_by_id("signout").click()
    time.sleep(1)
    print("***testing ended successfully***")
    browser.quit()


testinglink()
testingsigninsignout()
testinghomekeys()