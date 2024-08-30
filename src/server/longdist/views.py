from django.contrib.auth.models import User
from longdist.models import Pin, Message, Relationship
from rest_framework import routers, serializers, viewsets
from rest_framework.renderers import JSONRenderer
import io
from rest_framework.parsers import JSONParser
from datetime import datetime

# Serializers define the API representation.
class UserSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = User
        fields = ['url', 'username', 'email', 'is_staff']

# ViewSets define the view behavior.
class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer

def create_pin(request):
    if request.method == "POST":
        data = JSONParser().parse(request)

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

''' pseudocode

class 
'''

# Routers provide an easy way of automatically determining the URL conf.
router = routers.DefaultRouter()
router.register(r'users', UserViewSet)