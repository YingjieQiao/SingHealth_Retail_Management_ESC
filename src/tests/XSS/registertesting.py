from selenium import webdriver
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.common.exceptions import TimeoutException
from selenium.webdriver.common.keys import Keys
import re
import time
from selenium.webdriver.common.by import By

browser = webdriver.Chrome("\webdriver\\chromedriver") # Get local session of firefox
browser.get("http://localhost:3000/Register") # Load App page



browser.find_element(By.LINK_TEXT,"Login").click()
browser.find_element(By.LINK_TEXT,"Register").click()
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
ls_inputs = [
"<script>alert('...haha, you have been XSS-ed...')</script>",

'data" onerror="alert("Hacked!")',

'data "/><script>alert("...haha, you have been XSS-ed...")</script><input type="text" value="lol',

'data "/><b onmouseover=alert("Wufff!")>click me!</b><input type="text" value="lol',

'data "/><body onload=alert("XSS")><input type="text" value="lol',

'data "/><img lowsrc="javascript:alert("XSS")"><input type="text" value="lol',

'data "/><input type="image" src="javascript:alert("XSS");"><input type="text" value="lol',

'data "/><link rel="stylesheet" href="javascript:alert("XSS");"><input type="text" value="lol',

'data "/>"\uFE64script\uFE65 alert("TEST") \uFE64/script\uFE65 <input type="text" value="lol'

]
def testregister(value):
    myUserName = value
    myPassword = value
    firstName = value
    lastName =value
    mobile = value
    myPassword = value
    repassword=value
    location=value

    # username = browser.find_element_by_id("email")
    # time.sleep(1)	
    # username.send_keys(myUserName)
    # time.sleep(1)
    # username = browser.find_element_by_id("password")
    # time.sleep(1)	
    # username.send_keys(myPassword)
    # time.sleep(1)
    # button = browser.find_element_by_id("submit").click()
    # time.sleep(1)	
    # try:
    #     WebDriverWait(browser, 3).until(EC.alert_is_present(),
    #                                    'Timed out waiting for PA creation ' +
    #                                    'confirmation popup to appear.')

    #     alert = browser.switch_to.alert
    #     print(alert)
    #     alert.accept()
    #     print("alert accepted")
    # except TimeoutException:
    #     print("no alert")	
    # browser.find_element(By.LINK_TEXT,"Register").click()
    # time.sleep(1)
    browser.find_element_by_id("emailid").clear()
    username = browser.find_element_by_id("emailid")
    time.sleep(1)	
    username.send_keys(myUserName)

    browser.find_element_by_id("password").clear()
    username = browser.find_element_by_id("password")
	
    username.send_keys(myPassword)

    browser.find_element_by_id("firstname").clear()
    username = browser.find_element_by_id("firstname")

    username.send_keys(firstName)

    browser.find_element_by_id("lastname").clear()
    username = browser.find_element_by_id("lastname")

    username.send_keys(lastName)

    browser.find_element_by_id("mobile").clear()
    username = browser.find_element_by_id("mobile")
	
    username.send_keys(123124)

    browser.find_element_by_id("repassword").clear()
    username = browser.find_element_by_id("repassword")

    username.send_keys(myPassword)

    username.send_keys(location)
    time.sleep(1)
    button = browser.find_element_by_id("submit").click()
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

for i in ls_inputs:
    testregister(i)
browser.quit()
    # print all the hyper links
    # for  i in range(links.size()) :
    # 	print(i + " " + links.get(i).getAttribute("href"))
    # time.sleep(3)	
    # browser.quit()
    # elem = browser.find_element_by_name("LoginID") # Find the Login box
    # elem.send_keys("Administrator")
    # elem = browser.find_element_by_name("Password") # Find the Password box
    # elem.send_keys("Administrator" + Keys.RETURN)
    # #try:
    # elem = browser.find_element_by_link_text("Home")
    # elem.click()