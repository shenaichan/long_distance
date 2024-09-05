from ninja import NinjaAPI, Schema
from longdist.models import Pin, Message, Relationship

api = NinjaAPI()

class PinSchema(Schema):
    latitude:float
    longitude:float
    place_name:str = None

class MessageSchema(Schema):
    sender:str
    recipient:str
    message:str

@api.post("/create_pin")
def create_pin(request, data: PinSchema):
    pin = Pin.objects.create_pin(latitude=data.latitude,
                                 longitude=data.longitude,
                                 place_name=data.place_name)
    pin.save()
    print(Pin.objects.all())
    return 

@api.post("/create_relationship_and_message")
def create_relationship_and_message(request, data: MessageSchema):
    relationship = Relationship.objects.create_relationship(sender=data.sender,
                                                            recipient=data.recipient,
                                                            message=data.message)
    relationship.save()
    return

@api.put("/create_and_add_response")
def create_and_add_response(request, data: MessageSchema):
    '''
    try:
        # Use Django's transaction management to ensure atomicity
        with transaction.atomic():
            # Create a new user
            user = User.objects.create(name=payload.name, email=payload.email)

            # Assign a role to the newly created user
            Role.objects.create(name=payload.role, user=user)

        # Return a success response
        return 200, {
            "id": user.id,
            "name": user.name,
            "email": user.email,
            "roles": [role.name for role in user.roles.all()]
        }

    except Exception as e:
        # Handle exceptions and return a failure response
        return 400, {"error": str(e)}
    '''
    return

@api.get("/get_pin_info")
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

@api.patch("/approve")
def approve_pin(request):
    return

@api.patch("/disapprove")
def disapprove_pin(request):
    return

@api.patch("/approve")
def approve_message(request):
    return

@api.patch("/disapprove")
def disapprove_message(request):
    return

@api.patch("/approve")
def approve_response(request):
    return

@api.patch("/disapprove")
def disapprove_response(request):
    return