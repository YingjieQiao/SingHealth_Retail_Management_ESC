from selenium import webdriver
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.common.exceptions import TimeoutException
from selenium.webdriver.common.keys import Keys
import re
import time
from selenium.webdriver.common.by import By

browser = webdriver.Chrome("\webdriver\\chromedriver") # Get local session of firefox
browser.get("http://localhost:3000/") # Load App page

browser.find_element(By.LINK_TEXT,"Register").click()

browser.find_element(By.LINK_TEXT,"Login").click()

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

print("***sign in sign out functionality***")

myUserName = "ishaan_nair@mymail.sutd.edu.sg"
incorrectuser = "ishaan@mymail.sutd.edu.sg"
myPassword = "1234"
incorrectpass="asdadfdasf"
tokenadmin = "admin"
tokentenant = "tenant"
mobile = "12345678"
myPassword = "1234"
repassword="1234"
location="SUTD"
def logintesting(email,Password):
    browser.find_element_by_id("email").clear()
    browser.find_element_by_id("password").clear()
    username = browser.find_element_by_id("email")
    time.sleep(1)	
    username.send_keys(email)
    time.sleep(1)
    username = browser.find_element_by_id("password")
    time.sleep(1)	
    username.send_keys(Password)
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

def finalaily():        
    username = browser.find_element_by_id("token")
    time.sleep(1)	
    username.send_keys(tokenadmin)
    time.sleep(1)
    button = browser.find_element_by_id("submiting").click()
    time.sleep(1)	
    try:
        WebDriverWait(browser, 3).until(EC.alert_is_present(),
                                       'Timed out waiting for PA creation ' +
                                       'confirmation popup to appear.')

        alert = browser.switch_to.alert
        print(alert)
        alert.accept()
        print("alert accepted")
    except TimeoutException:
        print("no alert")	

    print("***testing ended successfully***")
    browser.quit()

logintesting(myUserName,incorrectpass)
logintesting(incorrectuser,incorrectpass)
logintesting(incorrectuser,myPassword)
logintesting(myUserName,myPassword)
finalaily()