from django.urls import path, include
from rest_framework.routers import DefaultRouter 
from .views import WeeklyLogListCreateAPIView,EvaluationCriteriaListCreateAPIView,EvaluationListCreateAPIView,InternshipPlacementListCreateAPIView, user_profile

router = DefaultRouter()
router.register('logs', WeeklyLogListCreateAPIView, basename='log')
router.register('placements', InternshipPlacementListCreateAPIView, basename='placement')
router.register('evaluation-criteria', EvaluationCriteriaListCreateAPIView, basename='evaluation-criteria')
router.register('evaluations', EvaluationListCreateAPIView, basename='evaluation')

urlpatterns = [
    path('api/weeklylogs/',WeeklyLogListCreateAPIView.as_view()),
    path('api/internshipplacements/',InternshipPlacementListCreateAPIView.as_view()),
    path('api/evaluationcriteria/',EvaluationCriteriaListCreateAPIView.as_view()),
    path('api/evaluations/',EvaluationListCreateAPIView.as_view()),
    path('api/user/profile/', user_profile, name='user-profile'),
    path('api/', include(router.urls)),
]
