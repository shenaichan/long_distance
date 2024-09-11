from django.db import models
from datetime import datetime, UTC
import secrets
from django.utils import timezone
from pprint import pformat

def generate_public_token():
    return secrets.token_urlsafe(16)[:32]

def generate_private_token():
    return secrets.token_urlsafe(32)[:64]

def write_to_geojson(pin):
    return True


class Pin(models.Model):
    public_share_token = models.CharField(max_length=32, default=generate_public_token)

    latitude = models.FloatField()
    longitude = models.FloatField()
    place_name = models.CharField(max_length=255)
    private_ownership_token = models.CharField(max_length=64, default=generate_private_token)
    private_allow_mail_token = models.CharField(max_length=64, default=generate_private_token)
    created_at = models.DateTimeField(default=timezone.now)
    approved_at = models.DateTimeField(null=True)
    is_checked = models.BooleanField(default=False)
    is_approved = models.BooleanField(default=False)
    is_claimed = models.BooleanField(default=False)

    def get_relationships_started(self):
        return Relationship.objects.filter(sender=self)
    
    def get_relationships_finished(self):
        return Relationship.objects.filter(recipient=self)
    
    def approve(self):
        self.approved_at = datetime.now(UTC)
        write_to_geojson(self)
        self.is_checked = True
        self.is_approved = True
        self.save()
        return
    
    def disapprove(self):
        self.is_checked = True
        self.save()
        return 
    
    def claim(self):
        self.is_claimed = True
        self.save()
        return
    
    def __str__(self):
        return str(self.id)


class Message(models.Model):
    content = models.TextField() # limit text input size on frontend
    created_at = models.DateTimeField(default=timezone.now)
    approved_at = models.DateTimeField(null=True)
    is_checked = models.BooleanField(default=False)
    is_approved = models.BooleanField(default=False)

    def approve(self):
        self.approved_at = datetime.now(UTC)
        self.is_checked = True
        self.is_approved = True
        self.save()
        return
    
    def disapprove(self):
        self.is_checked = True
        self.save()
        return
    
    def __str__(self):
        return self.content


class Relationship(models.Model):
    public_share_token = models.CharField(max_length=32, default=generate_public_token)

    sender = models.ForeignKey(Pin, on_delete=models.CASCADE, related_name="sender_pin")
    recipient = models.ForeignKey(Pin, on_delete=models.CASCADE, related_name="recipient_pin")
    private_allow_response_token = models.CharField(max_length=64, default=generate_private_token)
    message = models.OneToOneField(Message, on_delete=models.CASCADE, related_name="sender_message")
    response = models.OneToOneField(Message, on_delete=models.CASCADE, related_name="recipient_message", null=True)
    
    def __str__(self):
        return f"from {self.sender} to {self.recipient}: {self.message} | from {self.recipient} to {self.sender}: {self.response}"
    
    def add_response(self, response):
        self.response = response
        self.save()
        return
    
    # def is_approved(self):
    #     return self.message.is_approved
    
    # def response_is_approved(self):
    #     return self.response.is_approved

