from django.urls import path, include
from rest_framework.routers import DefaultRouter 
from .views import (
    IssueViewSet, 
    WeeklyLogViewSet, 
    EvaluationCriteriaViewSet, 
    EvaluationViewSet, 
    InternshipPlacementViewSet,
    DashboardStatsView
)

router = DefaultRouter()
router.register(r'issues', IssueViewSet)
router.register(r'weekly-logs', WeeklyLogViewSet)
router.register(r'placements', InternshipPlacementViewSet)
router.register(r'criteria', EvaluationCriteriaViewSet)
router.register(r'evaluations', EvaluationViewSet)


urlpatterns = [
    # All your API routes are now handled by the router
    path('', include(router.urls)),
    path('api/dashboard-stats/', DashboardStatsView.as_view(), name='dashboard-stats'),
]