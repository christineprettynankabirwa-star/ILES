from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import WeeklyLogViewSet

router = DefaultRouter()
router.register(r'logs', WeeklyLogViewSet, basename='weekly-log')

urlpatterns = [
    path('', include(router.urls)),
]