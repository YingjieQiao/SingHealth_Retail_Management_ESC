from selenium import webdriver
from random import choice
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.common.exceptions import TimeoutException
from selenium.webdriver.common.keys import Keys
import re
import time
from selenium.webdriver.common.by import By

def q1():
    driver = webdriver.Chrome("\webdriver\\chromedriver")
    driver.get("http://localhost:3000/")
    links = [link for link in driver.find_elements_by_xpath("//a[@href]") if link.is_displayed()]
    
    myUserName = "ishaan_nair@mymail.sutd.edu.sg"
    myPassword = "1234"
    username = driver.find_element_by_id("email")
    time.sleep(1)	
    username.send_keys(myUserName)
    time.sleep(1)
    username = driver.find_element_by_id("password")
    time.sleep(1)	
    username.send_keys(myPassword)
    time.sleep(1)
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
    links = [link for link in driver.find_elements_by_xpath("//a[@href]") if link.is_displayed()]
    
    while True:
        links = [link for link in driver.find_elements_by_xpath("//a[@href]") if link.is_displayed()]
        random_link = choice(links)
        try:
            driver.get(random_link.get_attribute("href"))
            links = [link for link in driver.find_elements_by_xpath("//a[@href]") if link.is_displayed()]
        except:
            print("Element not clickable: ", random_link)
            print("unclickable element found, terminating.")
            break
    driver.close()


if __name__ == "__main__":
    q1()
