from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
import ssl
import smtplib

def send_text_email(receiver_email, sender_email, subject, body, password):
    # print(receiver_email, sender_email, subject, body)

    try:
        message = MIMEMultipart()
        message["From"] = sender_email
        message["To"] = receiver_email
        message["Subject"] = subject
        message.attach(MIMEText(body, "plain"))
    except:
        # print("error occured")
        return {'result': False, 'info': "user does not exist"}

    text = message.as_string()

    # Log in to server using secure context and send email
    context = ssl.create_default_context()
    with smtplib.SMTP_SSL("smtp.gmail.com", 465, context=context) as server:
        server.login(sender_email, password)
        server.sendmail(sender_email, receiver_email, text)
    return True
