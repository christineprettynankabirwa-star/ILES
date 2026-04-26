from django.shortcuts import render
from rest_framework.generics import ListCreateAPIView
from .models import WeeklyLog
from .serializers import WeeklyLogSerializer

class WeeklyLogListCreateAPIView(ListCreateAPIView):
    queryset = WeeklyLog.objects.all()
    serializer_class = WeeklyLogSerializer
# Create your views here.
