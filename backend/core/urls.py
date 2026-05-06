from django.urls import path, include
from rest_framework.routers import DefaultRouter 
from .views import IssueViewSet,InternshipPlacementViewSet,WeeklyLogListCreateAPIView,EvaluationCriteriaListCreateAPIView,EvaluationListCreateAPIView,InternshipPlacementListCreateAPIView

router = DefaultRouter()
router.register(r'issues', IssueViewSet)
router.register(r'internshipplacements', InternshipPlacementViewSet)

urlpatterns = [
    path('api/weeklylogs/',WeeklyLogListCreateAPIView.as_view()),
    path('api/internshipplacements/',InternshipPlacementListCreateAPIView.as_view()),
    path('api/evaluationcriteria/',EvaluationCriteriaListCreateAPIView.as_view()),
    path('api/evaluations/',EvaluationListCreateAPIView.as_view()),
]
