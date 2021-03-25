from selenium import webdriver
from selenium.webdriver.common.keys import Keys
import re
import time

browser = webdriver.Chrome("\webdriver\\chromedriver") # Get local session of firefox
browser.get("http://localhost:3000/") # Load App page
browser.find_element(By.LINK_TEXT,"Register").click()
time.sleep(3)
browser.quit()
# elem = browser.find_element_by_name("LoginID") # Find the Login box
# elem.send_keys("Administrator")
# elem = browser.find_element_by_name("Password") # Find the Password box
# elem.send_keys("Administrator" + Keys.RETURN)
# #try:
# elem = browser.find_element_by_link_text("Home")
# elem.click()