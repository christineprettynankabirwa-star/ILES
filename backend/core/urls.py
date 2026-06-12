from django.urls import path, include
from rest_framework.routers import DefaultRouter 
from .views import (
    RegisterView, LogoutView, 
    CustomTokenObtainPairView, CustomUserViewSet, 
    DepartmentListCreateAPIView, WeeklyLogListCreateAPIView, 
    user_profile,
    DashboardStatsView,
    signup_view, WeeklyLogViewSet, InternshipPlacementViewSet, EvaluationCriteriaViewSet, EvaluationViewSet,
    ForgotPasswordView
)
from rest_framework_simplejwt.views import TokenRefreshView, TokenObtainPairView


router = DefaultRouter() 
router.register(r'users', CustomUserViewSet, basename='user') 
router.register(r'weekly-logs', WeeklyLogViewSet)
router.register(r'internshipplacements', InternshipPlacementViewSet)
router.register(r'criteria', EvaluationCriteriaViewSet)
router.register(r'evaluations', EvaluationViewSet)


urlpatterns = [
    path('', include(router.urls)),
    path('dashboard-stats/', DashboardStatsView.as_view(), name='dashboard-stats'),
    path('signup/', signup_view, name='signup'),
    path('logout/', LogoutView.as_view(), name='logout'),
    path('register/', RegisterView.as_view(), name='register'),
    path('departments/', DepartmentListCreateAPIView.as_view(), name='department-list-create'),
    path('login/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('weeklylogs/', WeeklyLogListCreateAPIView.as_view(), name='weeklylog-list-create'),
    path('user/profile/', user_profile, name='user-profile'),
    path('forgot-password/', ForgotPasswordView.as_view(), name='forgot-password'),
]