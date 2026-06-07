from django.urls import path, include
from rest_framework.routers import DefaultRouter 
from .views import CustomTokenObtainPairView, CustomUserViewSet, DepartmentListCreateAPIView, WeeklyLogListCreateAPIView,EvaluationCriteriaListCreateAPIView,EvaluationListCreateAPIView,InternshipPlacementListCreateAPIView, user_profile
from rest_framework_simplejwt.views import TokenRefreshView

router = DefaultRouter()
router.register('departments', DepartmentListCreateAPIView, basename='department')  
router.register('users', CustomUserViewSet, basename='user')    
router.register('logs', WeeklyLogListCreateAPIView, basename='log')
router.register('placements', InternshipPlacementListCreateAPIView, basename='placement')
router.register('evaluation-criteria', EvaluationCriteriaListCreateAPIView, basename='evaluation-criteria')
router.register('evaluations', EvaluationListCreateAPIView, basename='evaluation')

urlpatterns = [
    path("api/token/", CustomTokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("api/token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
    path('api/weeklylogs/',WeeklyLogListCreateAPIView.as_view()),
    path('api/internshipplacements/',InternshipPlacementListCreateAPIView.as_view()),
    path('api/evaluationcriteria/',EvaluationCriteriaListCreateAPIView.as_view()),
    path('api/evaluations/',EvaluationListCreateAPIView.as_view()),
    path('api/user/profile/', user_profile, name='user-profile'),
    path('api/', include(router.urls)),
]
