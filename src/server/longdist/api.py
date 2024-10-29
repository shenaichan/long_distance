from ninja import NinjaAPI, Schema
from ninja.errors import HttpError
from longdist.models import Pin, Message, Relationship, MapLoadLog, GeolocateLog
from pprint import pprint
from django.db import transaction
from typing import List, Optional
from openai import OpenAI
from dotenv import load_dotenv, find_dotenv
from datetime import datetime, UTC

load_dotenv(find_dotenv())

client = OpenAI()

api = NinjaAPI()

class Geometry(Schema):
    type: str
    coordinates: List[float] | List[List[float]]

class PinProperties(Schema):
    id: int
    place_name: str
    public_share_token: str

class RouteProperties(Schema):
    sender_id: int
    recipient_id: int

class Feature(Schema):
    type: str
    geometry: Geometry
    properties: PinProperties | RouteProperties

class FeatureCollection(Schema):
    type: str
    features: List[Feature]

class PinIn(Schema):
    latitude:float
    longitude:float
    place_name:str = None

class MessageIn(Schema):
    sender:int
    senderPW:str
    recipient:int
    recipientPW:str
    message:str

class ResponseIn(Schema):
    sender:int
    recipient:int
    replyPW:str
    message:str

class PinOutPrivate(Schema):
    id:int
    latitude:float
    longitude:float
    place_name:str
    public_share_token:str
    private_ownership_token:str
    private_allow_mail_token:str

class PinOutFriend(Schema):
    id: int
    private_allow_mail_token:str

class PinOutPublic(Schema):
    id:int
    latitude:float
    longitude:float
    place_name:str
    public_share_token:str

class MessageOutPrivate(Schema):
    sender:PinOutPublic
    recipient:PinOutPrivate
    message:str
    response:Optional[str] = None

class MessageOutPublic(Schema):
    sender:PinOutPublic
    recipient:PinOutPublic
    message:str
    response:Optional[str] = None

class InventoryMessageOut(Schema):
    sender_id:int
    recipient_id:int
    content:str


MAP_LOADS_ALLOWED = 45000
GEOLOCATES_ALLOWED = 95000


def print_queryset(queryset):
    for entry in queryset:
        pprint(entry)
        print("\n")
    return

@api.get("check_if_map_load_allowed", response=bool)
def check_if_map_load_allowed(request):
    last_load = MapLoadLog.objects.last()
    monthly_quota_used = last_load.monthly_quota_used 
    last_load_time = last_load.timestamp

    prev_year = last_load_time.year
    prev_month = last_load_time.month

    now = datetime.now(UTC)
    curr_year = now.year
    curr_month = now.month

    if curr_year > prev_year or curr_month > prev_month:
        monthly_quota_used = 0
    else:
        monthly_quota_used += 1

    map_load_allowed = monthly_quota_used < MAP_LOADS_ALLOWED

    if map_load_allowed:
        MapLoadLog.objects.create(monthly_quota_used=monthly_quota_used)
        return True
    else:
        return False
    
@api.get("check_if_geolocate_allowed", response=bool)
def check_if_geolocate_allowed(request):
    last_load = GeolocateLog.objects.last()
    monthly_quota_used = last_load.monthly_quota_used 
    last_load_time = last_load.timestamp

    prev_year = last_load_time.year
    prev_month = last_load_time.month

    now = datetime.now(UTC)
    curr_year = now.year
    curr_month = now.month

    if curr_year > prev_year or curr_month > prev_month:
        monthly_quota_used = 0
    else:
        monthly_quota_used += 1

    geolocate_allowed = monthly_quota_used < GEOLOCATES_ALLOWED
    
    if geolocate_allowed:
        GeolocateLog.objects.create(monthly_quota_used=monthly_quota_used)
        return True
    else:
        return False

@api.get("check_if_message_is_safe", response=bool)
def check_if_message_is_safe(request, content: str):
    response = client.moderations.create(
        model="omni-moderation-latest",
        input=content
    )
    pprint(response)
    return not response.results[0].flagged

@api.get("get_pin_by_friend_code", response=PinOutPublic)
def get_pin_by_friend_code(request, friend_code: str):
    if Pin.objects.filter(private_allow_mail_token=friend_code).exists():
        return Pin.objects.get(private_allow_mail_token=friend_code)
    else:
        return PinOutPublic(id=-1, latitude=-100, longitude=-200, place_name="", public_share_token="")

@api.get("get_pin_by_public_token", response=PinOutPublic)
def get_pin_by_public_token(request, public_token: str):
    return Pin.objects.get(public_share_token=public_token)

@api.get("get_num_km", response=float)
def get_num_km(request):
    relationships = Relationship.objects.filter(is_approved=True)
    return sum(r.distance for r in relationships)

@api.get("get_approved_pins", response=FeatureCollection)
def get_approved_pins(request):
    pins = Pin.objects.filter(is_approved=True)
    features = [Feature(
                    type="Feature",
                    geometry=Geometry(
                        type="Point", 
                        coordinates=[pin.longitude, pin.latitude]),
                    properties=PinProperties(
                        id=pin.id,
                        place_name=pin.place_name,
                        public_share_token=pin.public_share_token)) 
                for pin in pins]
    return FeatureCollection(type="FeatureCollection", features=features)

@api.get("get_approved_routes", response=FeatureCollection)
def get_approved_routes(request):
    routes = Relationship.objects.select_related("sender").select_related("recipient").filter(is_approved=True)
    features = [Feature(
                    type="Feature",
                    geometry=Geometry(
                        type="LineString", 
                        coordinates=[[route.sender.longitude, route.sender.latitude], [route.recipient.longitude, route.recipient.latitude]]),
                    properties=RouteProperties(
                        sender_id=route.sender.id,
                        recipient_id=route.recipient.id)) 
                for route in routes]
    # print(features)
    return FeatureCollection(type="FeatureCollection", features=features)

@api.post("/create_friend_pin", response=PinOutFriend)
def create_friend_pin(request, data: PinIn):
    with transaction.atomic():
        pin = Pin.objects.create(latitude=data.latitude,
                                longitude=data.longitude,
                                place_name=data.place_name)
        pin.approve()
    return pin

@api.post("/create_approve_claim_pin", response=PinOutPrivate)
def create_approve_claim_pin(request, data: PinIn):
    with transaction.atomic():
        pin = Pin.objects.create(latitude=data.latitude,
                                longitude=data.longitude,
                                place_name=data.place_name)
        pin.approve()
        pin.claim()
    return pin

@api.get("/get_secret_reply_link")
def get_secret_reply_link(request, sender, senderPW, recipient):
    with transaction.atomic():
        sender = Pin.objects.get(id=sender)
        recipient = Pin.objects.get(id=recipient)
        if (sender.private_ownership_token == senderPW):
            relationship = Relationship.objects.get(sender=sender, recipient=recipient)
            return relationship.private_allow_response_token
        else:
            raise HttpError(400, "Invalid credentials")
        
@api.get("/check_if_relationship_exists")
def create_relationship_and_message(request, sender, recipient):
    if (Relationship.objects.filter(sender=sender, recipient=recipient).exists() or 
        Relationship.objects.filter(recipient=sender, sender=recipient).exists()):
        return True
    return False

@api.post("/create_relationship_and_message")
def create_relationship_and_message(request, data: MessageIn):
    if (Relationship.objects.filter(sender=data.sender, recipient=data.recipient).exists() or 
        Relationship.objects.filter(recipient=data.sender, sender=data.recipient).exists()):
        raise HttpError(400, "Cannot make two messages")

    with transaction.atomic():
        sender = Pin.objects.get(id=data.sender)
        recipient = Pin.objects.get(id=data.recipient)
        print("actual sender pw is", sender.private_ownership_token)
        print("submitted sender pw is", data.senderPW)
        print("actual recipient pw is", recipient.private_allow_mail_token)
        print("submitted recipient pw is", data.recipientPW)
        if (sender.private_ownership_token == data.senderPW and recipient.private_allow_mail_token == data.recipientPW):
            message = Message.objects.create(content=data.message)
            relationship = Relationship.objects.create(sender=sender,
                                        recipient=recipient,
                                        message=message)
            relationship.calculate_distance()

            # temporarily approve all messages
            relationship.approve()
            relationship.message.approve()
            relationship.recipient.approve()
            return relationship.private_allow_response_token
        else:
            raise HttpError(400, "Invalid credentials")
    

@api.patch("/create_and_add_response")
def create_and_add_response(request, data: ResponseIn):
    if Relationship.objects.filter(sender=data.sender, recipient=data.recipient).first().response:
        raise HttpError(400, "Cannot make two responses")
    
    with transaction.atomic():
        relationship = Relationship.objects.get(sender=data.sender, recipient=data.recipient)
        if relationship.private_allow_response_token == data.replyPW:
            response = Message.objects.create(content=data.message)
            
            relationship.add_response(response)

            # temporarily approve response
            relationship.response.approve()
            return
        else:
            raise HttpError(400, "Invalid credentials")

@api.get("/can_write_response")
def can_write_response(request, secret: str):
    relationship_exists = Relationship.objects.filter(private_allow_response_token=secret).exists()
    if not relationship_exists:
        return False
    response_exists = Relationship.objects.get(private_allow_response_token=secret).response
    if response_exists:
        return False
    return True

@api.get("/get_relationships_started", response=List[PinOutPublic])
def get_relationships_started(request, public_token: str):
    pin = Pin.objects.get(public_share_token=public_token)
    return pin.get_relationships_started()

@api.get("/get_relationships_finished", response=List[PinOutPublic])
def get_relationships_finished(request, public_token: str):
    pin = Pin.objects.get(public_share_token=public_token)
    return pin.get_relationships_finished()

@api.get("/get_message_thread", response=MessageOutPublic)
def get_message_thread(request, sender_id: int, recipient_id: int):
    thread_query = Relationship.objects.select_related("message").select_related("response").select_related("sender").select_related("recipient").get(sender=sender_id, recipient=recipient_id)
    
    thread = MessageOutPublic(sender=thread_query.sender, recipient=thread_query.recipient, message=thread_query.message.content, response=None)
    if (thread_query.response):
        thread.response = thread_query.response.content
    
    print(thread)
    '''
    get relationship from relationships table given these two IDs
    ^ query to the model
    want to return message contents only
    want to specifically return contents?
    have to jump into message object for this
    specify return type
    '''
    return thread

@api.get("/get_message_thread_by_secret", response=MessageOutPrivate)
def get_message_thread_by_secret(request, secret: str):
    thread_query = Relationship.objects.select_related("message").select_related("response").select_related("sender").select_related("recipient").get(private_allow_response_token=secret)
    
    thread = MessageOutPrivate(sender=thread_query.sender, recipient=thread_query.recipient, message=thread_query.message.content, response=None)
    if (thread_query.response):
        thread.response = thread_query.response.content
    
    print(thread)
    '''
    get relationship from relationships table given these two IDs
    ^ query to the model
    want to return message contents only
    want to specifically return contents?
    have to jump into message object for this
    specify return type
    '''
    return thread

@api.post("/get_all_my_message_threads", response=List[List[InventoryMessageOut]])
def get_all_my_message_threads(request, data: List[int]):
    print(data)
    ret = [[],[]] # sent by me, sent to me
    relationships = ( Relationship.objects.select_related("message").select_related("response").select_related("sender").select_related("recipient").filter(sender__in=data)
                    | Relationship.objects.select_related("message").select_related("response").select_related("sender").select_related("recipient").filter(recipient__in=data) )

    for relationship in relationships:
        msg = InventoryMessageOut(sender_id=relationship.sender.id, 
                                     recipient_id=relationship.recipient.id,
                                     content=relationship.message.content)

        if relationship.sender.id in data:
            ret[0].append(msg)
            if relationship.response:
                rsp = InventoryMessageOut(sender_id=relationship.sender.id, 
                                            recipient_id=relationship.recipient.id,
                                            content=relationship.response.content)
                ret[1].append(rsp)
        else:
            ret[1].append(msg)
            if relationship.response:
                rsp = InventoryMessageOut(sender_id=relationship.sender.id, 
                                            recipient_id=relationship.recipient.id,
                                            content=relationship.response.content)
                ret[0].append(rsp)

    return ret

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
