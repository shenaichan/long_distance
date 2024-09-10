from django.db import models
from datetime import datetime, UTC
import secrets
from django.utils import timezone
from pprint import pformat

def generate_public_token():
    return secrets.token_urlsafe(16)

def generate_private_token():
    return secrets.token_urlsafe(32)

def write_to_geojson(pin):
    return True


class ReprMixin:
    def __str__(self):

        class_name = self.__class__.__name__
        fields = self._meta.get_fields()

        field_dict = {}

        for field in fields:
            if field.is_relation and class_name != "Relationship":
                field_dict[field.name] = field.related_model
            else:
                field_dict[field.name] = getattr(self, field.name)

        pretty_field_dict = pformat(field_dict)

        return f"\n{class_name}({pretty_field_dict})\n"


class Pin(ReprMixin, models.Model):
    public_share_token = models.CharField(max_length=24, primary_key=True, default=generate_public_token)

    latitude = models.FloatField()
    longitude = models.FloatField()
    place_name = models.CharField(max_length=255)
    private_ownership_token = models.CharField(max_length=24, default=generate_private_token)
    private_allow_mail_token = models.CharField(max_length=24, default=generate_private_token)
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
        return
    
    def disapprove(self):
        self.is_checked = True
        self.is_approved = False # not really necessary since initialized to False, but good as a note
        return 
    
    def claim(self):
        self.is_claimed = True
        return


class Message(ReprMixin, models.Model):
    content = models.TextField() # limit text input size on frontend
    created_at = models.DateTimeField(default=timezone.now)
    approved_at = models.DateTimeField(null=True)
    is_checked = models.BooleanField(default=False)
    is_approved = models.BooleanField(default=False)

    
    def approve(self):
        self.approved_at = datetime.now(UTC)
        self.is_checked = True
        self.is_approved = True
        return
    
    def disapprove(self):
        self.is_checked = True
        self.is_approved = True
        return


class Relationship(ReprMixin, models.Model):
    public_share_token = models.CharField(max_length=24, primary_key=True, default=generate_public_token)

    sender = models.ForeignKey(Pin, on_delete=models.CASCADE, related_name="sender_pin")
    recipient = models.ForeignKey(Pin, on_delete=models.CASCADE, related_name="recipient_pin")
    private_allow_response_token = models.CharField(max_length=24, default=generate_private_token)
    message = models.OneToOneField(Message, on_delete=models.CASCADE, related_name="sender_message")
    response = models.OneToOneField(Message, on_delete=models.CASCADE, related_name="recipient_message", null=True)

    
    def add_response(self, response):
        # remember to have this the right way around
        self.response = response
        return 
    
    def approve_message(self):
        self.message.approve()
        return 
    
    def approve_response(self):
        self.response.approve()
        return 
    
    def disapprove_message(self):
        self.message.disapprove()
        return 
    
    def disapprove_response(self):
        self.response.disapprove()
        return 
    
    def is_approved(self):
        return self.message.is_approved
    
    def response_is_approved(self):
        return self.response.is_approved

