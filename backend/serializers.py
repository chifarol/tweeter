from rest_framework import serializers 
from django.contrib.auth.models import User
from .models import Tweet, Profile, TweetPix

class RecursiveSerializer(serializers.Serializer):
    def to_representation(self, value):
        serializer = self.parent.parent.__class__(value, context=self.context)
        return serializer.data

class TweetPixSerializer(serializers.ModelSerializer):
    class Meta:
        model = TweetPix
        fields = ('id','url','tweet',)
        depth=2
    def create(self, validated_data):
        return TweetPix(**validated_data)

class ProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = Profile
        fields = ('user','display_name', 'bio', 'phone', 'header_pic', 'profile_pic', 'followers', 'following', 'date')
        depth=1

class UserSerializerForProfile(serializers.ModelSerializer):
    profile = ProfileSerializer(many=False)
    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'profile')
        read_only_fields=fields

class TweetSerializerForUser(serializers.ModelSerializer):
    date_string = serializers.CharField(source='get_date_string', read_only=True)
    time_string = serializers.CharField(source='get_time_string', read_only=True)
    class Meta:
        model = Tweet
        fields = ('id','text', 'time_string', 'date_string','pix', 'likes','saves','replies', 'retweets')
        read_only_fields=fields
        depth=2

class UserSerializer(serializers.ModelSerializer):
    profile = ProfileSerializer(many=False)
    tweets = TweetSerializerForUser(many=True)
    
    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'profile', 'tweets')
        read_only_fields=fields
        # exclude = ('password', )
        depth=2

# Register Serializer
class RegisterSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'password')
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        user = User.objects.create_user(validated_data['username'], validated_data['email'], validated_data['password'])

        return user

class TweetSerializerforReplies(serializers.ModelSerializer):
    author=UserSerializerForProfile(many=False)
    class Meta:
        model = Tweet
        fields = ('id','author','text', 'date', 'pix','likes')

class TweetSerializer(serializers.ModelSerializer):
    author=UserSerializerForProfile(many=False)
    replies=TweetSerializerforReplies(many=True)
    retweets=UserSerializerForProfile(many=True)
    likes=UserSerializerForProfile(many=True)
    saves=UserSerializerForProfile(many=True)
    date_string = serializers.CharField(source='get_date_string', read_only=True)
    time_string = serializers.CharField(source='get_time_string', read_only=True)
    class Meta:
        model = Tweet
        fields = ('id','author','text', 'time_string', 'date_string', 'pix','likes','saves', 'retweets', 'replies')
        depth=2
    def create(self, validated_data):
        return Tweet(**validated_data)

