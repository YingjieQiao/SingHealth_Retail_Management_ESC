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
list_link=[
"home",
"upload",
"email",
"viewPhoto",
"dataDashboard",
"compareTenant",
"audit",
"adminhome",
"tenantHome",
"emailReport",
"tenantUpload",
"tenantViewPhoto",
"tenantDataDashboard",


]

def testrandomizer(link1):
    browser.get("http://localhost:3000/"+link1) 
    print(link1)
    try:
        WebDriverWait(browser, 10).until(EC.alert_is_present(),
                                       'Timed out waiting for PA creation ' +
                                       'confirmation popup to appear.')

        alert = browser.switch_to.alert
        print("alert accepted")
        print(alert.text)
        alert.accept()
    except TimeoutException:
        print("no alert")	    
    time.sleep(1)

e=20
for i in list_link:
        print("***--------------for loop-------------***")
        testrandomizer(i)
print("***--------------END OF for loop-------------***")
while(e):
    print("***--------------while loop-------------***")
    n = random.randint(0,12)
    print(n)
    testrandomizer(list_link[n])
    e=e-1
print("***--------------terminate-------------***")
browser.quit()