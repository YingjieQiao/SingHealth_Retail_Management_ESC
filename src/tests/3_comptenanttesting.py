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

    


def testinghomekeys():
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
    button = browser.find_element_by_id("tent").click()
    time.sleep(1)
    time.sleep(1)
    button = browser.find_element_by_id("type")
    time.sleep(1)	
    button.send_keys( "Non-F&B"  )
    time.sleep(1)
    button = browser.find_element_by_id("selector")
    time.sleep(1)	
    button.send_keys( "mihir chibs"  )
    time.sleep(1)
    button = browser.find_element_by_id("selector2")
    time.sleep(1)	
    button.send_keys( "aum bansal"  )
    time.sleep(1)
    button = browser.find_element_by_id("button").click()
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


    button = browser.find_element_by_id("range")
    time.sleep(1)	
    button.send_keys( "month"  )
    time.sleep(1)

    button = browser.find_element_by_class_name("menu-bars").click()
    time.sleep(1)
    
    button = browser.find_element_by_id("signout").click()
    time.sleep(1)


testinglink()
testingsigninsignout()
testinghomekeys()
print("***testing ended successfully***")
browser.quit()
