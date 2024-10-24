from ninja import NinjaAPI, Schema
from longdist.models import Pin, Message, Relationship
from pprint import pprint
from django.db import transaction
from typing import List, Optional

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



'''
          // San Francisco
      const origin = [-122.414, 37.776];

      // Washington DC
      const destination = [-77.032, 38.913];

      // A simple line from origin to destination.
      const route: GeoJSON.GeoJSON = {
          'type': 'FeatureCollection',
          'features': [
              {
                  'type': 'Feature',
                  'geometry': {
                      'type': 'LineString',
                      'coordinates': [origin, destination]
                  },
                  'properties': {
                    
                  }
              }
          ]
      };
'''

class PinIn(Schema):
    latitude:float
    longitude:float
    place_name:str = None

class MessageIn(Schema):
    sender:int
    recipient:int
    message:str

class PinOutPrivate(Schema):
    id:int
    latitude:float
    longitude:float
    place_name:str
    public_share_token:str
    private_ownership_token:str
    private_allow_mail_token:str

class PinOutPublic(Schema):
    id:int
    latitude:float
    longitude:float
    place_name:str
    public_share_token:str

class MessageOut(Schema):
    sender:PinOutPublic
    recipient:PinOutPublic
    message:str
    response:Optional[str] = None

class InventoryMessageOut(Schema):
    sender_id:int
    recipient_id:int
    content:str



def print_queryset(queryset):
    for entry in queryset:
        pprint(entry)
        print("\n")
    return

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

@api.post("/create_pin", response=PinOutPrivate)
def create_pin(request, data: PinIn):
    pin = Pin.objects.create(latitude=data.latitude,
                             longitude=data.longitude,
                             place_name=data.place_name)
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

@api.post("/create_relationship_and_message")
def create_relationship_and_message(request, data: MessageIn):
    with transaction.atomic():
        message = Message.objects.create(content=data.message)
        sender = Pin.objects.get(id=data.sender)
        recipient = Pin.objects.get(id=data.recipient)
        relationship = Relationship.objects.create(sender=sender,
                                    recipient=recipient,
                                    message=message)
        relationship.calculate_distance()

        # temporarily approve all messages
        relationship.approve()
        relationship.message.approve()
        relationship.recipient.approve()
    return

@api.patch("/add_email_to_message")
def add_email_to_message(request, data: MessageIn):
    # message = Message.objects.get(id=data.message)
    # message.email = data.email
    # message.save()
    return

@api.patch("/create_and_add_response")
def create_and_add_response(request, data: MessageIn):
    with transaction.atomic():
        response = Message.objects.create(content=data.message)
        relationship = Relationship.objects.get(sender=data.sender, recipient=data.recipient)
        relationship.add_response(response)
    return

@api.get("/get_relationships_started", response=List[PinOutPublic])
def get_relationships_started(request, public_token: str):
    pin = Pin.objects.get(public_share_token=public_token)
    return pin.get_relationships_started()

@api.get("/get_relationships_finished", response=List[PinOutPublic])
def get_relationships_finished(request, public_token: str):
    pin = Pin.objects.get(public_share_token=public_token)
    return pin.get_relationships_finished()

@api.get("/get_message_thread", response=MessageOut)
def get_message_thread(request, sender_id: int, recipient_id: int):
    thread_query = Relationship.objects.select_related("message").select_related("response").select_related("sender").select_related("recipient").get(sender=sender_id, recipient=recipient_id)
    
    thread = MessageOut(sender=thread_query.sender, recipient=thread_query.recipient, message=thread_query.message.content, response=None)
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
    ret = [[],[]] # sent by me, sent to me
    relationships = ( Relationship.objects.select_related("message").select_related("response").select_related("sender").select_related("recipient").filter(sender__in=data)
                    | Relationship.objects.select_related("message").select_related("response").select_related("sender").select_related("recipient").filter(recipient__in=data) )

    for relationship in relationships:
        thread = InventoryMessageOut(sender_id=relationship.sender.id, 
                                     recipient_id=relationship.recipient.id,
                                     content=relationship.message.content)
        if relationship.sender.id in data:
            ret[0].append(thread)
            if relationship.response:
                thread.content = relationship.response.content
                ret[1].append(thread)
        else:
            ret[1].append(thread)
            if relationship.response:
                thread.content = relationship.response.content
                ret[0].append(thread)

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
