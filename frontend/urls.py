from django.urls import path, include, re_path
from django.shortcuts import render
from . import views

urlpatterns = [
re_path(r'.*', views.index)
]