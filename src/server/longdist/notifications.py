import os
import smtplib, ssl
from dotenv import load_dotenv
from email.mime.text import MIMEText
from email.header import Header

# INTRO_SUBJECT = "Thank you for submitting your message to Notes From Afar!"
# INTRO_BODY = """
# Thank you for submitting your message to Notes From Afar!

# We will review your message and get back to you soon.
# """

def send_email(recipient: str, subject: str, body: str):
    load_dotenv()

    port = 465  # For SSL
    password = os.getenv("EMAIL_PASSWORD")
    print(password)

    sender_email = "notes.from.afar.notifications@gmail.com"
    sender_name = "Shenai from Notes From Afar"

    msg = MIMEText(body, 'plain', 'utf-8')
    msg['Subject'] = Header(subject, 'utf-8')
    msg['From'] = f"{sender_name} <{sender_email}>"
    msg['To'] = recipient

    context = ssl.create_default_context()

    with smtplib.SMTP_SSL("smtp.gmail.com", port, context=context) as server:
        server.login(sender_email, password)
        server.send_message(msg)
        print("sent message")
