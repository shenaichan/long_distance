from ninja import NinjaAPI, Schema
from longdist.models import Pin, Message, Relationship
from pprint import pprint
from django.db import transaction
from typing import List

api = NinjaAPI()

class PinIn(Schema):
    latitude:float
    longitude:float
    place_name:str = None

class MessageIn(Schema):
    sender:int
    recipient:int
    message:str

class PinOut(Schema):
    latitude:float
    longitude:float
    place_name:str
    public_share_token:str

def print_queryset(queryset):
    for entry in queryset:
        pprint(entry)
        print("\n")
    return

@api.post("/create_pin")
def create_pin(request, data: PinIn):
    pin = Pin.objects.create(latitude=data.latitude,
                             longitude=data.longitude,
                             place_name=data.place_name)
    return 

@api.post("/create_approve_claim_pin")
def create_approve_claim_pin(request, data: PinIn):
    with transaction.atomic():
        pin = Pin.objects.create(latitude=data.latitude,
                                longitude=data.longitude,
                                place_name=data.place_name)
        pin.approve()
        pin.claim()
    return 

@api.post("/create_relationship_and_message")
def create_relationship_and_message(request, data: MessageIn):
    with transaction.atomic():
        message = Message.objects.create(content=data.message)
        sender = Pin.objects.get(id=data.sender)
        recipient = Pin.objects.get(id=data.recipient)
        Relationship.objects.create(sender=sender,
                                    recipient=recipient,
                                    message=message)
    return

@api.patch("/create_and_add_response")
def create_and_add_response(request, data: MessageIn):
    with transaction.atomic():
        response = Message.objects.create(content=data.message)
        relationship = Relationship.objects.filter(sender=data.sender, recipient=data.recipient).first()
        relationship.add_response(response)
    return

@api.get("/get_relationships_started", response=List[PinOut])
def get_relationships_started(request, public_token: str):
    pin = Pin.objects.filter(public_share_token=public_token).first()
    return pin.get_relationships_started()

@api.get("/get_relationships_finished", response=List[PinOut])
def get_relationships_finished(request, public_token: str):
    pin = Pin.objects.filter(public_share_token=public_token).first()
    return pin.get_relationships_finished()

@api.get("/get_message_thread")
def get_message_thread(request):
    return

def write_to(request):
    return

def check_message_approval(request):
    return

def check_response_approval(request):
    return

def check_pin_access(request):
    return

def claim_pin(request):
    return
