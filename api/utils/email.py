import os
import smtplib
from email.message import EmailMessage

email_user = os.getenv("EMAIL_USER")
email_password = os.getenv("EMAIL_PASSWORD")
email_host = os.getenv("EMAIL_HOST")
email_port = os.getenv("EMAIL_PORT")

def send_email(to_email: str, subject: str, message: str):
    msg = EmailMessage()
    msg["Subject"] = subject
    msg["From"] = email_user
    msg["To"] = to_email
    msg.set_content(message)

    with smtplib.SMTP_SSL(email_host, int(email_port)) as smtp:
        smtp.login(email_user, email_password)
        smtp.send_message(msg)
