import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from django.conf import settings

INTRO_SUBJECT = "Thank you for submitting a note to Notes from Afar!"
INTRO_BODY = """ 
    Howdy!
    
    Thanks for contributing to Notes From Afar :) Here's the note I got from you: 

    > <em>"{note content}"</em>

    I try to review all notes within a week of submission.
    Once I get to yours, you'll receive another email notifying you whether your note has been approved or not. 
    If your note is approved, it'll go live on the site, and you'll receive a link to view and share it. 
    In the meantime, feel free to submit another note!
    
    <3 Shenai
    """

INTRO_SUBJECT = "Your note is here!"
INTRO_BODY = "Your note has been reviewed and is now live on Notes from Afar. Click the link below to view it."

def send_email(recipient_email, subject, body):
    # Email configuration
    sender_email = "notes.from.afar.notifications@gmail.com"
    smtp_server = "smtp.gmail.com"
    smtp_port = 587
    
    # Create the email message
    message = MIMEMultipart()
    message["From"] = sender_email
    message["To"] = recipient_email
    message["Subject"] = subject
    
    # Attach the body of the email
    message.attach(MIMEText(body, "plain"))
    
    try:
        # Create a secure SSL/TLS connection
        server = smtplib.SMTP(smtp_server, smtp_port)
        server.starttls()
        
        # Login to the email account
        server.login(sender_email, settings.EMAIL_HOST_PASSWORD)
        
        # Send the email
        server.send_message(message)
        
        # Close the connection
        server.quit()
        
        print(f"Email sent successfully to {recipient_email}")
        return True
    except Exception as e:
        print(f"Failed to send email: {str(e)}")
        return False
