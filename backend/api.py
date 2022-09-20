from django.http import JsonResponse
from rest_framework import generics, permissions
from django.contrib.auth import login
from django.contrib.auth.models import User
from django.shortcuts import get_object_or_404
from django.db.models import Count, Q
from rest_framework.response import Response
from knox.models import AuthToken
from .serializers import UserSerializer, RegisterSerializer, TweetSerializer, ProfileSerializer, TweetPixSerializer, UserSerializerForProfile
from .models import Profile,Tweet, TweetPix
from rest_framework import permissions
from rest_framework.authtoken.serializers import AuthTokenSerializer
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import api_view,permission_classes
from knox.views import LoginView as KnoxLoginView
from .blacklisted_words import blacklist


@api_view(['GET'])
@permission_classes((IsAuthenticated,))
def main_user(req):
    following = UserSerializerForProfile(req.user.profile.following, many=True)
    followers = UserSerializerForProfile(req.user.profile.followers, many=True)
    profile = ProfileSerializer(req.user.profile, many=False)
    return JsonResponse({
        'id':req.user.id,
        'email':req.user.email,
        'username':req.user.username,
        'profile':profile.data,
        # 'tweets':tweets.data,
        'following':following.data,
        'followers':followers.data,
        })

@api_view(['POST'])
@permission_classes((IsAuthenticated,))
def update_main_user(req):
    try:
        Profile.objects.filter(user=req.user).update(**req.data)
        return JsonResponse({'status':'valid'})
    except:
        return JsonResponse({'status':req.data})

@api_view(['POST'])
@permission_classes((IsAuthenticated,))
def follow(req, username):
    try:
        target_user = User.objects.get(username=username)
        if target_user == req.user:
            return JsonResponse({'status':'you can\'t follow yourself'})
        elif req.user in target_user.profile.followers.all():
            req.user.profile.following.remove(target_user)
            target_user.profile.followers.remove(req.user)
            return JsonResponse({'status':'unfollowed'})
        else:
            req.user.profile.following.add(target_user)
            target_user.profile.followers.add(req.user)
            return JsonResponse({'status':'followed'})
    except:
        return JsonResponse({'status':False})


@api_view(['GET'])
@permission_classes((IsAuthenticated,))
def user(req, username):
    try:
        user = User.objects.get(username=username)
        following = UserSerializerForProfile(user.profile.following, many=True)
        followers = UserSerializerForProfile(user.profile.followers, many=True)
        profile = ProfileSerializer(user.profile, many=False)
        return JsonResponse({
            'id':user.id,
            'email':user.email,
            'username':user.username,
            'profile':profile.data,
            'followers':followers.data,
            'following':following.data,
            })
    except:
        JsonResponse({'status':'Couldn\'t fetch user'})

@api_view(['GET'])
@permission_classes((IsAuthenticated,))
def usertweets(req, username):
    try:
        tweet_type = req.GET.get('type')
        user = User.objects.get(username=username)
        tweets_r = Tweet.objects.prefetch_related('replies').filter(author=user)[:30]
        if tweet_type=="Tweets":
            tweets_r = Tweet.objects.prefetch_related('replies').filter(author=user,reply_to=None)[:30]
        elif tweet_type=="Media":
            tweets_r = Tweet.objects.prefetch_related('replies').prefetch_related('pix').filter(author=user).exclude(pix=None)
        elif tweet_type=="Likes":
            tweets_r = user.liked
        tweets = TweetSerializer(tweets_r, many=True)
        return JsonResponse({
            'tweets':tweets.data,
            'tweet_type':tweet_type
            })
    except:
        JsonResponse({'status':'Couldn\'t fetch user'})

@api_view(['GET'])
@permission_classes((IsAuthenticated,))
def follow_suggestions(req):
    try:
        top_users = User.objects.select_related('profile').annotate(follow_count=Count('profile__followers')).order_by('-follow_count').exclude(Q(id__in=req.user.profile.following.all())| Q(username=req.user.username))[:10]
        users = UserSerializerForProfile(top_users, many=True)
        return JsonResponse({
            'suggestions':users.data,
            })
    except:
        return JsonResponse({'status':'Couldn\'t fetch user suggestions'})

@api_view(['GET'])
@permission_classes((IsAuthenticated,))
def get_tweets(req):
    try:
        tweet_type = req.GET.get('type')
        tweets_r = req.user.saved
        if tweet_type=="Home":
            tweets_r = Tweet.objects.prefetch_related('replies').filter(author__in=req.user.profile.following.all())[:30]
            if len(tweets_r)<6:
                tweets_d = Tweet.objects.prefetch_related('replies').filter(author__username__icontains='chifarol')[:15]
                tweets_f=tweets_r | tweets_d
                tweets = TweetSerializer(tweets_f, many=True)
                return JsonResponse({
                        'tweets':tweets.data,
                        'tweet_type':tweet_type
                        })
        elif tweet_type=="Explore":
            tweets_r = Tweet.objects.prefetch_related('replies').filter(author__in=req.user.profile.following.all())
        tweets = TweetSerializer(tweets_r, many=True)
        return JsonResponse({
            'tweets':tweets.data,
            'tweet_type':tweet_type
            })
    except:
        JsonResponse({'status':'Couldn\'t fetch tweets'})

def search_tweets(req):
    try:
        search_string=req.GET.get('search')
        tweet_type=req.GET.get('type')
        if tweet_type=="Top":
            tweets_r = Tweet.objects.prefetch_related('replies').filter(text__icontains=search_string).annotate(likes_count=Count('likes')).order_by('-likes_count').annotate(retweets_count=Count('retweets')).order_by('-retweets_count')[:40]
        elif tweet_type=="Latest":
            tweets_r = Tweet.objects.prefetch_related('replies').filter(text__icontains=search_string)[:40]
        elif tweet_type=="People":
            tweets_r = Tweet.objects.prefetch_related('replies').filter(Q(author__username__icontains=search_string) | Q(author__profile__bio__icontains=search_string) | Q(author__profile__display_name__icontains=search_string))
        elif tweet_type=="Media":
            tweets_r = Tweet.objects.prefetch_related('replies').filter(text__icontains=search_string).exclude(pix=None)[:40]
        tweets = TweetSerializer(tweets_r, many=True)
        return JsonResponse({
            'tweets':tweets.data,
            'tweet_type':tweet_type
            })
    except:
        JsonResponse({'status':'Couldn\'t fetch tweets'})


# Register API
class RegisterAPI(generics.GenericAPIView):
    serializer_class = RegisterSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        profile=Profile.objects.create(user=user)
        return Response({
        "user": UserSerializer(user, context=self.get_serializer_context()).data,
        "token": AuthToken.objects.create(user)[1]
        })

class LoginAPI(KnoxLoginView):
    permission_classes = (permissions.AllowAny,)

    def post(self, request, format=None):
        serializer = AuthTokenSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data['user']
        login(request, user)
        user = serializer.validated_data['user']
        token= AuthToken.objects.create(user)[1]
        return super(LoginAPI, self).post(request, format=None)

@api_view(['POST'])
@permission_classes((IsAuthenticated,))
def tweet_reply(req, id):
    try:
        target_tweet = get_object_or_404(Tweet, id=id)
        try:
            new_tweet = Tweet.objects.create(text=req.data['text'], author=req.user, reply_to=target_tweet)
            # new_tweet_s = TweetSerializer(new_tweet,  many=False)
            return JsonResponse({'status':'reply saved','tweet_id':new_tweet.id})
        except:
            return JsonResponse({'status':'reply couldnt"t be saved'})
    
    except:
        return JsonResponse({'status':"couldn't find tweet"})
        
@api_view(['POST'])
@permission_classes((IsAuthenticated,))
def like_tweet(req, id):
    try:
        target_tweet = get_object_or_404(Tweet, id=id)
        try:
            if req.user not in target_tweet.likes.all():
                target_tweet.likes.add(req.user)
                return JsonResponse({'status':'liked'})
            else:
                target_tweet.likes.remove(req.user)
                return JsonResponse({'status':'unliked'})
        except:
            return JsonResponse({'status':'like couldnt"t be registered'})
    
    except:
        return JsonResponse({'status':"couldn't find tweet"})

@api_view(['POST'])
@permission_classes((IsAuthenticated,))
def save_tweet(req, id):
    try:
        target_tweet = get_object_or_404(Tweet, id=id)
        try:
            if req.user not in target_tweet.saves.all():
                target_tweet.saves.add(req.user)
                return JsonResponse({'status':'saved'})
            else:
                target_tweet.saves.remove(req.user)
                return JsonResponse({'status':'unsaved'})
        except:
            return JsonResponse({'status':'save couldnt"t be registered'})
    
    except:
        return JsonResponse({'status':"couldn't find tweet"})

@api_view(['POST'])
@permission_classes((IsAuthenticated,))
def retweet_tweet(req, id):
    try:
        target_tweet = get_object_or_404(Tweet, id=id)
        try:
            if req.user not in target_tweet.retweets.all():
                target_tweet.retweets.add(req.user)
                return JsonResponse({'status':'retweeted'})
            else:
                target_tweet.retweets.remove(req.user)
                return JsonResponse({'status':'unretweeted'})
        except:
            return JsonResponse({'status':'retweet couldnt"t be registered'})
    
    except:
        return JsonResponse({'status':"couldn't find tweet"})
        
@api_view(['GET'])
@permission_classes((IsAuthenticated,))
def get_tweet(req, id):
    tweet = Tweet.objects.get(id=id)
    serializer = TweetSerializer(tweet, many=False)
    return Response(serializer.data)

@api_view(['POST'])
@permission_classes((IsAuthenticated,))
def post_tweet(req):
    new_tweet = Tweet(text=req.data['text'], author=req.user)
    try:
        new_tweet.save()
        return JsonResponse({'tweet_id':new_tweet.id})
    except:
        return JsonResponse({'status':'failed to create tweet'})

@api_view(['POST'])
@permission_classes((IsAuthenticated,))
def post_tweet_pix(req, id):
    try:
        urls = req.data['urls']
        tweet = Tweet.objects.get(id=id)
        for index in range(len(urls)):
            new_tweet_pix = TweetPix(url=urls[index],tweet=tweet)
            new_tweet_pix.save()
            new_tweet_pix = TweetPixSerializer(new_tweet_pix, many=False)
        return JsonResponse({'status':'tweetpix created successfully', 'tweet':urls})
    except:
        return JsonResponse({'status':'failed to create tweet_pix', 'urls':len(urls)})

@api_view(['GET'])
@permission_classes((IsAuthenticated,))
def trends(req):
    try:
        tweets = Tweet.objects.all()[:100]
        word_collection = ''
        word_counter={}
        for tweet in tweets:
            word_collection += ' '+tweet.text
        word_array=word_collection.lower().split(' ')
        for word in word_array:
            if len(word)>2 and word not in blacklist:
                if word in word_counter:
                    word_counter[word] += 1
                else:
                    word_counter[word] = 1
                    
        top_5_words = sorted(word_counter.items(),key=lambda x:-x[1])[:5]
        return JsonResponse({'trends':top_5_words})
    except:
        return JsonResponse({'status':'failed to fetch trends'})
   

@api_view(['DELETE'])
@permission_classes((IsAuthenticated,))
def delete_tweet(req, id):
    try:
        target_tweet = get_object_or_404(Tweet, id=id)
        if req.user == target_tweet.author:
            target_tweet.delete()
            return JsonResponse({'status':'deleted'})
        else:
            return JsonResponse({'status':'you are not unauthorised'})
    
    except:
        return JsonResponse({'status':"couldn't find tweet"})

@api_view(['GET'])
@permission_classes((IsAuthenticated,))
def authstatus(req):
    return JsonResponse({'valid':True})

# cloudinary  

import cloudinary
from pathlib import Path
import time
import environ
BASE_DIR = Path(__file__).resolve().parent.parent
env = environ.Env()
environ.Env.read_env(env.str(BASE_DIR, '/tweeter/.env'))
@api_view(['POST'])
# @permission_classes((IsAuthenticated,))
def cloudinary_signature(req):
    params_to_sign = req.data['params']
    timestamp =  int((time.time()))
    api_secret = env("CLOUD_SECRET")
    signature = cloudinary.utils.api_sign_request({**params_to_sign, 'timestamp':timestamp}, api_secret)
    return JsonResponse({'signature':signature, "timestamp":timestamp})
