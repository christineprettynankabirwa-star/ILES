from django.urls import path
from .views import WeeklyLogListCreateAPIView

urlpatterns = [
    path('api/weeklylogs/',WeeklyLogListCreateAPIView.as_view()),
]
