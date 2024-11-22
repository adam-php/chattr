import os
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from dotenv import load_dotenv

load_dotenv()

class EmailService:
    def __init__(self):
        self.smtp_server = os.getenv('SMTP_SERVER', 'smtp.gmail.com')
        self.smtp_port = int(os.getenv('SMTP_PORT', 587))
        self.smtp_username = os.getenv('SMTP_USERNAME')
        self.smtp_password = os.getenv('SMTP_PASSWORD')

    def send_email(self, to_email, subject, body):
        try:
            # Create message
            message = MIMEMultipart()
            message['From'] = self.smtp_username
            message['To'] = to_email
            message['Subject'] = subject

            # Add body to email
            message.attach(MIMEText(body, 'plain'))

            # Create SMTP session
            with smtplib.SMTP(self.smtp_server, self.smtp_port) as server:
                server.starttls()
                server.login(self.smtp_username, self.smtp_password)
                
                # Send email
                server.send_message(message)
                return True, "Email sent successfully"
                
        except Exception as e:
            return False, f"Failed to send email: {str(e)}"

if __name__ == "__main__":
    import sys
    if len(sys.argv) != 4:
        print("Usage: python email_service.py <to_email> <subject> <body>")
        sys.exit(1)
        
    email_service = EmailService()
    success, message = email_service.send_email(sys.argv[1], sys.argv[2], sys.argv[3])
    
    if success:
        print(message)
        sys.exit(0)
    else:
        print(message, file=sys.stderr)
        sys.exit(1)
