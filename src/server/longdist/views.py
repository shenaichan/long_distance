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

''' pseudocode

class 
'''

# Routers provide an easy way of automatically determining the URL conf.
router = routers.DefaultRouter()
router.register(r'users', UserViewSet)