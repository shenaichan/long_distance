from django.contrib import admin
from longdist.models import Pin, Message, Relationship

class PinAdmin(admin.ModelAdmin):
    pass

admin.site.register(Pin, PinAdmin)