"""
URL configuration for longdist project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
from django.contrib.auth.models import User
from longdist.models import Pin, Message, Relationship
from rest_framework import routers, serializers, viewsets

# Serializers define the API representation.
'''
useful for filtering on a queryset

User.objects.all() <-- user is django object
making a SQL query and returning a "queryset" object

defining a subset of fields that it's returning

don't need the rest for my view

django rest framework thing haha

return it as json

without the serializer you would have to loop through the queryset itself

print out what the object looks like before and after you run it through
the serializer

you can use it for validation of fields (inbound)

some inbound and some outbound

builtin validate function (look for this)

CORS for validating frontend calls to my api

django app is going to have http headers that it sets and checks that interact
with headers set and checked by the client

what domain it's on

you can restrict it this way

https://pypi.org/project/django-cors-headers/

might want to move serializers to their own file

look at django docs
'''
class UserSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = User
        fields = ['url', 'username', 'email', 'is_staff']

# ViewSets define the view behavior.
class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer

# Routers provide an easy way of automatically determining the URL conf.
router = routers.DefaultRouter()
router.register(r'users', UserViewSet)

# Wire up our API using automatic URL routing.
# Additionally, we include login URLs for the browsable API.
urlpatterns = [
    path('', include(router.urls)),
    # path('api-auth/', include('rest_framework.urls', namespace='rest_framework')),
    path('admin/', admin.site.urls)
]
