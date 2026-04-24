from django.urls import path
from .views import WeeklyLogListCreateAPIView 

urlpatterns = [
    path('api/weekly-logs/', WeeklyLogListCreateAPIView.as_view()),
]