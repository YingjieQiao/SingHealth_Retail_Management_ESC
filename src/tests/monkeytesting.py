from selenium import webdriver
from random import choice
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.common.exceptions import TimeoutException
from selenium.webdriver.common.keys import Keys
import re
import time
from selenium.webdriver.common.by import By
import random 
def q1():
    driver = webdriver.Chrome("\webdriver\\chromedriver")
    driver.get("http://localhost:3000/")
    links = [link for link in driver.find_elements_by_xpath("//a[@href]") if link.is_displayed()]
    
    myUserName = "ishaan_nair@mymail.sutd.edu.sg"
    myPassword = "1234"
    username = driver.find_element_by_id("email")

    username.send_keys(myUserName)

    username = driver.find_element_by_id("password")

    username.send_keys(myPassword)

    button = driver.find_element_by_id("submit").click()
    time.sleep(1)	
    try:
        WebDriverWait(driver, 10).until(EC.alert_is_present(),
                                       'Timed out waiting for PA creation ' +
                                       'confirmation popup to appear.')

        alert = driver.switch_to.alert
        print(alert)
        alert.accept()
        print("alert accepted")
    except TimeoutException:
        print("no alert")	
    username = driver.find_element_by_id("token")
    i = random. randint(1,3)
    if(i==1):
        username.send_keys("staff")
    elif(i==2):
        username.send_keys("tenant")
    elif(i==3):
        username.send_keys("admin")
    button = driver.find_element_by_id("submiting").click()
    time.sleep(1)	
    try:
        WebDriverWait(driver, 10).until(EC.alert_is_present(),
                                       'Timed out waiting for PA creation ' +
                                       'confirmation popup to appear.')

        alert = driver.switch_to.alert
        print(alert.text)
        alert.accept()
        print("alert accepted")
    except TimeoutException:
        print("no alert")
    
    links = [link for link in driver.find_elements_by_xpath("//a[@href]") if link.is_displayed()]
    button = driver.find_element_by_class_name("menu-bars").click()
 
    while True:
        if(driver.current_url=="http://localhost:3000/"):
            break
        n = random. randint(1,2)
        print(driver.current_url)
        try:
            if(n==1 and i!=3):
                button = driver.find_element_by_class_name("menu-bars").click()
            id = driver.find_elements_by_xpath('//*[@id]')
            time.sleep(1)
            random_id = choice(id)

            print("clicking")
            print(random_id)
            driver.get(random_id.click())
        except:
            try:
                            id = driver.find_elements_by_xpath('//*[@id]')
                            time.sleep(1)
                            random_id = choice(id)

                            print("clicking")
                            print(random_id)
                            driver.get(random_id.sed_key("12342234"))
                            driver.get(random_id.click())
            except:
                            print("Element not clickable: ")
                            print("unclickable element found, terminating.")
                            try:
                                id = driver.find_elements_by_xpath('//*[@id]')
                                time.sleep(1)
                                random_id = choice(id)

                                print("clicking")
                                print(random_id)

                            except:
                                print("Element not textable: ")
                                print("unclickable element found, terminating.")
            print("Element not clickable: ")
            print("unclickable element found, terminating.")

    driver.close()


if __name__ == "__main__":
    q1()
