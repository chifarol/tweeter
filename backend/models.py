from django.db import models
from django.contrib.auth.models import User

# Create your models here.

class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    bio = models.CharField(max_length=250, blank=True, null=True)
    display_name = models.CharField(max_length=50, blank=True, default='')
    phone = models.CharField(max_length=50, blank=True, null=True)
    profile_pic = models.CharField(max_length=250, blank=True, null=True)
    header_pic = models.CharField(max_length=250, blank=True, null=True)
    followers = models.ManyToManyField(User, blank=True, related_name="following")
    following = models.ManyToManyField(User, blank=True,  related_name="followers")
    date = models.DateTimeField(auto_now_add=True)

    def profile_pic_url(self):
        if self.profile_pic:
            return self.profile_pic.url
        else:
            return '/static/frontend/temp-images/no_image.png'
    def header_pic_url(self):
        if self.header_pic:
            return self.header_pic.url
        else:
            return '/static/frontend/temp-images/no_image.png'
    
class Tweet(models.Model):
    author = models.ForeignKey(User, related_name="tweets", on_delete=models.CASCADE)
    text = models.CharField(max_length=250, blank=True, null=True)
    likes = models.ManyToManyField(User, blank=True,  related_name="liked")
    retweets = models.ManyToManyField(User, blank=True, related_name="retweeted")
    saves = models.ManyToManyField(User, blank=True, related_name="saved")
    reply_to = models.ForeignKey('self', on_delete=models.DO_NOTHING, blank=True, null=True, related_name='replies')
    date = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.author.username
    class Meta:
        ordering=['-date']
    def get_date_string(self):
        return self.date.strftime("%b %d %Y")
    def get_time_string(self):
        return self.date.strftime("%H:%M")
    

class TweetPix(models.Model):
    url = models.CharField(max_length=250, blank=True, null=True)
    tweet = models.ForeignKey(Tweet, related_name="pix", on_delete=models.CASCADE)
    date = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.url
    class Meta:
        ordering=['date']
    def get_date_string(self):
        return self.date.strftime("%b %d %Y")
    def get_time_string(self):
        return self.date.strftime("%H:%M")
    
    

