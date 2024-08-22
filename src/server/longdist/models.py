from django.db import models

class Pin(models.Model):
    latitude = models.FloatField()
    longitude = models.FloatField()
    place_name = models.CharField(max_length=255)
    add_recipient_hash = models.CharField(max_length=24)
    written_to_json = models.BooleanField

class Message(models.Model):
    content = models.TextField()
    created_at = models.DateTimeField()
    approved_at = models.DateTimeField()

class Relationship(models.Model):
    sender = models.ForeignKey(Pin, on_delete=models.CASCADE, related_name="sender_pin")
    recipient = models.ForeignKey(Pin, on_delete=models.CASCADE, related_name="recipient_pin")
    share_hash = models.CharField(max_length=24)
    add_response_hash = models.CharField(max_length=24)
    message = models.OneToOneField(Message, on_delete=models.CASCADE, related_name="sender_message")
    response = models.OneToOneField(Message, on_delete=models.CASCADE, related_name="recipient_message")