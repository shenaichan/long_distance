from django.contrib import admin
from longdist.models import Pin, Message, Relationship
from django.utils import timezone
from datetime import datetime, UTC

@admin.action(description="Mark selected messages as approved")
def approve_message(modeladmin, request, queryset):
    for q in queryset:
        q.approve()
        relationship = Relationship.objects.filter(message=q).first()
        relationship.recipient.approve()

@admin.action(description="Mark selected messages as disapproved")
def check_message(modeladmin, request, queryset):
    for q in queryset:
        q.disapprove()
        relationship = Relationship.objects.filter(message=q).first()
        relationship.recipient.disapprove()

class PinAdmin(admin.ModelAdmin):
    list_display = ["id", "is_checked", "is_approved", "place_name"]
    list_filter = ["is_checked", "is_approved"]

class MessageAdmin(admin.ModelAdmin):
    list_display = ["id", "is_checked", "is_approved", "content"]
    list_filter = ["is_checked", "is_approved"]
    actions = [approve_message, check_message]

class RelationshipAdmin(admin.ModelAdmin):
    list_display = ["id", "sender_id", "recipient", "message", "response"]

admin.site.register(Pin, PinAdmin)
admin.site.register(Message, MessageAdmin)
admin.site.register(Relationship, RelationshipAdmin)