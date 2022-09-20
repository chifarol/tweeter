from django.urls import path
from knox import views as knox_views
from . import api

urlpatterns = [
    path('user/', api.main_user),
    path('user/update/', api.update_main_user),
    path('users/<str:username>/', api.user, name='user'),
    path('usertweets/<str:username>', api.usertweets, name='user'),
    path('post_tweet', api.post_tweet),
    path('get_tweets', api.get_tweets),
    path('tweet/<int:id>/reply', api.tweet_reply, name='tweet_reply'),
    path('tweet/<int:id>/like', api.like_tweet),
    path('tweet/<int:id>/retweet', api.retweet_tweet),
    path('tweet/<int:id>/save', api.save_tweet),
    path('tweet/<int:id>/delete', api.delete_tweet),
    path('tweet/<int:id>/', api.get_tweet, name='get_tweet'),
    path('follow/<str:username>/', api.follow),
    path('tweetpix/<int:id>/', api.post_tweet_pix),
    path('search', api.search_tweets),
    path('followsuggestions/', api.follow_suggestions),
    path('trends/', api.trends),
    path('cloudinary_signature/', api. cloudinary_signature),
    path('authstatus/', api.authstatus),
    path('register/', api.RegisterAPI.as_view(), name='register'),
    path('login/', api.LoginAPI.as_view(), name='login'),
    path('logout/', knox_views.LogoutView.as_view(), name='logout'),
    path('logoutall/', knox_views.LogoutAllView.as_view(), name='logoutall'),

]