# core/urls.py
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenRefreshView
from .views import (
    RegisterView, LogoutView, signup_view,
    CustomTokenObtainPairView, CustomUserViewSet,
    DepartmentListCreateAPIView,
    WeeklyLogListCreateAPIView, WeeklyLogViewSet,
    InternshipPlacementViewSet,
    EvaluationCriteriaViewSet, EvaluationViewSet,
    DashboardStatsView, ForgotPasswordView,
    user_profile,
)

router = DefaultRouter()
router.register(r'users', CustomUserViewSet, basename='user')
router.register(r'weekly-logs', WeeklyLogViewSet, basename='weeklylog')
router.register(r'placements', InternshipPlacementViewSet, basename='placement')
router.register(r'criteria', EvaluationCriteriaViewSet, basename='criteria')
router.register(r'evaluations', EvaluationViewSet, basename='evaluation')

urlpatterns = [
    path('', include(router.urls)),
    path('login/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('register/', RegisterView.as_view(), name='register'),
    path('signup/', signup_view, name='signup'),
    path('logout/', LogoutView.as_view(), name='logout'),
    path('forgot-password/', ForgotPasswordView.as_view(), name='forgot-password'),
    path('user/profile/', user_profile, name='user-profile'),
    path('departments/', DepartmentListCreateAPIView.as_view(), name='department-list'),
    path('dashboard-stats/', DashboardStatsView.as_view(), name='dashboard-stats'),
    path('weeklylogs/', WeeklyLogListCreateAPIView.as_view(), name='weeklylog-list'),
]
