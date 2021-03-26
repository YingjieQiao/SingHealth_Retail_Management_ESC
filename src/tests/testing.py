from selenium import webdriver
from selenium.webdriver.common.keys import Keys
import re
import time
from selenium.webdriver.common.by import By

browser = webdriver.Chrome("\webdriver\\chromedriver") # Get local session of firefox
browser.get("http://localhost:3000/") # Load App page
time.sleep(3)
browser.find_element(By.LINK_TEXT,"Register").click()
time.sleep(3)
browser.find_element(By.LINK_TEXT,"Login").click()
time.sleep(3)
#browser.find_element(By.LINK_TEXT,"admin").click()
time.sleep(3)
print("yolo")
links = browser.find_elements_by_tag_name('a')

print(links)
time.sleep(3)				
print("***Printing all link names***")
# print all the links
for elem in links:
    href = elem.get_attribute('href')
    if href is not None:
        print(href)
time.sleep(3)	

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