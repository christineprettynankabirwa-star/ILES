from django.urls import path
from .views import WeeklyLogListCreateAPIView 
from .views import InternshipPlacementListCreateAPIView
from.views import EvaluationListCreateAPIView, EvaluationCriteriaListCreateAPIView

urlpatterns = [
    path('api/weekly-logs/', WeeklyLogListCreateAPIView.as_view()),
    path('api/internships/', InternshipPlacementListCreateAPIView.as_view()),
    path('api/evaluations/', EvaluationListCreateAPIView.as_view()),
    path('api/evaluation-criteria/', EvaluationCriteriaListCreateAPIView.as_view()),
]
