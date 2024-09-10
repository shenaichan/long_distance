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

# class PinManager(models.Manager):
#     def create_pin(self, latitude, longitude, place_name):
#         pin = self.create(latitude=latitude,
#                           longitude=longitude,
#                           place_name=place_name,
#                           public_share_token=generate_public_token(),
#                           private_ownership_token=generate_private_token(),
#                           private_allow_mail_token=generate_private_token(),
#                           created_at=datetime.now(UTC),
#                           approved_at=datetime.now(UTC), # question -- how to initialize this in a way that indicates it hasn't been approved
#                           is_checked=False,
#                           is_approved=False, 
#                           is_claimed=False
#                           )
#         # pin.save()
#         return pin

class ReprMixin:
    def __str__(self):

        class_name = self.__class__.__name__
        fields = self._meta.get_fields()
        field_dict = {field.name: getattr(self, field.name) for field in fields}
        pretty_field_dict = pformat(field_dict)

        return f"{class_name}({pretty_field_dict})"


# @dataclass(init=False, repr=True)
class Pin(ReprMixin, models.Model):
    public_share_token = models.CharField(max_length=24, primary_key=True, default=generate_public_token)

    latitude = models.FloatField(default=0)
    longitude = models.FloatField(default=0)
    place_name = models.CharField(max_length=255, default="unnamed")
    private_ownership_token = models.CharField(max_length=24, default=generate_private_token)
    private_allow_mail_token = models.CharField(max_length=24, default=generate_private_token)
    created_at = models.DateTimeField(default=timezone.now)
    approved_at = models.DateTimeField(default=timezone.now)
    is_checked = models.BooleanField(default=False)
    is_approved = models.BooleanField(default=False)
    is_claimed = models.BooleanField(default=False)

    # objects = PinManager()
    
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
    
    # def __repr__(self):
    #     return f"lat={self.latitude}, long={self.longitude}, place={self.place_name}, pk={self.public_share_token}"

class Message(models.Model):
    content = models.TextField() # limit text input size on frontend
    created_at = models.DateTimeField()
    approved_at = models.DateTimeField()
    is_checked = models.BooleanField()
    is_approved = models.BooleanField()

    def create_mesage(self, content):
        message = self.create(content=content,
                              created_at=datetime.now(UTC),
                              approved_at=datetime.now(UTC))
        return message
    
    def approve(self):
        self.approved_at = datetime.now(UTC)
        self.is_checked = True
        self.is_approved = True
        return
    
    def disapprove(self):
        self.is_checked = True
        self.is_approved = True
        return
    
    
class RelationshipManager(models.Manager):
    def create_relationship(self, sender, recipient, message):
        relationship = self.create(sender=sender,
                                   recipient=recipient,
                                   public_share_token=generate_public_token(),
                                   private_allow_response_token=generate_private_token(),
                                   message=message,
                                   response=None
                                   )
        return relationship


class Relationship(models.Model):
    public_share_token = models.CharField(max_length=24, primary_key=True)

    sender = models.ForeignKey(Pin, on_delete=models.CASCADE, related_name="sender_pin")
    recipient = models.ForeignKey(Pin, on_delete=models.CASCADE, related_name="recipient_pin")
    private_allow_response_token = models.CharField(max_length=24)
    message = models.OneToOneField(Message, on_delete=models.CASCADE, related_name="sender_message")
    response = models.OneToOneField(Message, on_delete=models.CASCADE, related_name="recipient_message")

    objects = RelationshipManager()
    
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

