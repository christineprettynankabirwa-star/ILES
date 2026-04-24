from django.urls import path
from .views import WeeklyLogListCreateAPIView 
from .views import InternshipPlacementListCreateAPIView

urlpatterns = [
    path('api/weekly-logs/', WeeklyLogListCreateAPIView.as_view()),
    path('api/internships/', InternshipPlacementListCreateAPIView.as_view()),
]
