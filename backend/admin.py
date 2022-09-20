from django.contrib import admin
from .models import Profile, Tweet, TweetPix

@admin.register(Profile)
class ProfileAdmin(admin.ModelAdmin):
    list_display = ('user', 'bio','phone', 'header_pic', 'profile_pic')
    
@admin.register(Tweet)
class TweetAdmin(admin.ModelAdmin):
    list_display = ('author', 'date','text',)
@admin.register(TweetPix)
class TweetAdmin(admin.ModelAdmin):
    list_display = ('url','tweet', 'date',)


# Register your models here.
