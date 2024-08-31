from django.contrib.auth.models import User
from longdist.models import Pin, Message, Relationship
from rest_framework import routers, serializers, viewsets
from rest_framework.renderers import JSONRenderer
import io
from rest_framework.parsers import JSONParser
from datetime import datetime

from rest_framework import status
from rest_framework.decorators import action
from rest_framework.response import Response

# Serializers define the API representation.
class UserSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = User
        fields = ['url', 'username', 'email', 'is_staff']

# ViewSets define the view behavior.
class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer


    # @action(detail=True, methods=['post'])
    # def set_password(self, request, pk=None):
    #     user = self.get_object()
    #     serializer = PasswordSerializer(data=request.data)
    #     if serializer.is_valid():
    #         user.set_password(serializer.validated_data['password'])
    #         user.save()
    #         return Response({'status': 'password set'})
    #     else:
    #         return Response(serializer.errors,
    #                         status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False)
    def recent_users(self, request):
        recent_users = User.objects.all().order_by('-last_login')

        page = self.paginate_queryset(recent_users)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)

        serializer = self.get_serializer(recent_users, many=True)
        return Response(serializer.data)

'''
- separate calls from client is more RESTful
- also ok to have one-off calls that do multiple things
- django ninja? alternative to django REST
- create one viewset per model and then write functions within that
- hyperlinked api could send a link to the templating url
- ninja plays well with typescript
'''

# Serializers define the API representation.
class PinSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Pin
        fields = ['url', 'username', 'email', 'is_staff']

# json that gets returned could have all the relationships a pin is part of

class PinViewSet(viewsets.ModelViewSet):
    queryset = Pin.objects.all()
    serializer_class = PinSerializer

# class UserViewSet(viewsets.ModelViewSet):
#     queryset = User.objects.all()
#     serializer_class = UserSerializer

# class UserViewSet(viewsets.ModelViewSet):
#     queryset = User.objects.all()
#     serializer_class = UserSerializer

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