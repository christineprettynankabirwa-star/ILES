from django.urls import path, include
from rest_framework.routers import DefaultRouter 
from .views import (
    IssueViewSet, 
    WeeklyLogViewSet, 
    EvaluationCriteriaViewSet, 
    EvaluationViewSet, 
    InternshipPlacementViewSet,
    DashboardStatsView,
    signup_view
)

# Create a router and register our viewsets with it.
router = DefaultRouter()
router.register(r'issues', IssueViewSet)
router.register(r'weekly-logs', WeeklyLogViewSet)
router.register(r'placements', InternshipPlacementViewSet)
router.register(r'criteria', EvaluationCriteriaViewSet)
router.register(r'evaluations', EvaluationViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('dashboard-stats/', DashboardStatsView.as_view(), name='dashboard-stats'),
    path('signup/', signup_view, name='signup'),
]