from ninja import NinjaAPI, Schema
from longdist.models import Pin, Message, Relationship

api = NinjaAPI()

'''
class UserSchema(Schema):
    username : str
    is_authenticated : bool
    email : str = None
    first_name : str = None
    last_name : str = None

@api.get("/me", response=UserSchema)
def me(request):
    return request.user

class HelloSchema(Schema):
    name : str = "world"

@api.post("/hello")
def hello(request, data : HelloSchema):
    print(data.name)
    return f"Hello {data.name}!"
'''

class PinSchema(Schema):
    latitude : float
    longitude : float
    place_name : str = None

@api.post("/create_pin")
def create_pin(request, data: PinSchema):
    pin = Pin.objects.create_pin(latitude=data.latitude,
                                 longitude=data.longitude,
                                 place_name=data.place_name)
    pin.save()
    print(Pin.objects.all())
    return 

def create_tentative_pin(request):
    return

def create_message(request):
    return

def create_response(request):
    return

def get_pin(request):
    return

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

def approve_pin(request):
    return

def disapprove_pin(request):
    return

def approve_message(request):
    return

def disapprove_message(request):
    return

def approve_response(request):
    return

def disapprove_response(request):
    return