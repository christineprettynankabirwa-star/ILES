from django.urls import path
from .views import WeeklyLogListCreateAPIView,EvaluationCriteriaListCreateAPIView,EvaluationListCreateAPIView,InternshipPlacementListCreateAPIView
urlpatterns = [
    path('api/weeklylogs/',WeeklyLogListCreateAPIView.as_view()),
    path('api/internshipplacements/',InternshipPlacementListCreateAPIView.as_view()),
    path('api/evaluationcriteria/',EvaluationCriteriaListCreateAPIView.as_view()),
    path('api/evaluations/',EvaluationListCreateAPIView.as_view()),
]
