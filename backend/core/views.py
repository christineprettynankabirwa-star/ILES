from django.shortcuts import render
# Create your views here.


#creating API view 
from rest_framework.generics import ListCreateAPIView
from .models import WeeklyLog
from .serializers import WeeklyLogSerializer 

class WeeklyLogListCreateAPIView(ListCreateAPIView):
    queryset = WeeklyLog.objects.all()
    serializer_class = WeeklyLogSerializer


#creating Internship API view
from .models import InternshipPlacement
from .serializers import InternshipPlacementSerializer 
from rest_framework.generics import ListCreateAPIView 

class InternshipPlacementListCreateAPIView(ListCreateAPIView):
    queryset = InternshipPlacement.objects.all()
    serializer_class = InternshipPlacementSerializer 

