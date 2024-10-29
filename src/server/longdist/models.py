from django.db import models
from datetime import datetime, UTC
import secrets
from django.utils import timezone
from pprint import pformat
from math import radians, cos, sin, sqrt, atan2

def generate_public_token():
    return secrets.token_urlsafe(16)[:32]

def generate_private_token():
    return secrets.token_urlsafe(32)[:64]

def haversine(lat1, lon1, lat2, lon2):
    R = 6371 # Earth's radius in kilometers
    # Convert latitude and longitude from degrees to radians
    lat1, lon1, lat2, lon2 = map(radians, [lat1, lon1, lat2, lon2])

    # Haversine formula
    dlon = lon2 - lon1
    dlat = lat2 - lat1
    a = sin(dlat / 2)**2 + cos(lat1) * cos(lat2) * sin(dlon / 2)**2
    c = 2 * atan2(sqrt(a), sqrt(1 - a))
    distance = R * c
    return distance

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
        return [relationship.recipient for relationship in Relationship.objects.filter(sender=self)]
    
    def get_relationships_finished(self):
        return [relationship.sender for relationship in Relationship.objects.filter(recipient=self)]
    
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
    email = models.EmailField(null=True)

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
    distance = models.FloatField(null=True)
    is_approved = models.BooleanField(default=False)

    def __str__(self):
        return f"from {self.sender} to {self.recipient}: {self.message} | from {self.recipient} to {self.sender}: {self.response}"
    
    def add_response(self, response):
        self.response = response
        self.save()
        return
    
    def approve(self):
        self.is_approved = True
        self.save()
        return
    
    def response_is_approved(self):
        return self.response.is_approved
    
    def calculate_distance(self):
        self.distance = haversine(self.sender.latitude, self.sender.longitude, self.recipient.latitude, self.recipient.longitude)
        self.save()
        return
    
class MapLoadLog(models.Model):
    monthly_quota_used = models.IntegerField(default=0)
    timestamp = models.DateTimeField(default=timezone.now)

class GeolocateLog(models.Model):
    monthly_quota_used = models.IntegerField(default=0)
    timestamp = models.DateTimeField(default=timezone.now)
