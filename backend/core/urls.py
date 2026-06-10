from django.urls import path, include
from rest_framework.routers import DefaultRouter 
from .views import (
    RegisterView, LogoutView, 
    CustomTokenObtainPairView, CustomUserViewSet, 
    DepartmentListCreateAPIView, WeeklyLogListCreateAPIView, 
    user_profile,
    DashboardStatsView,
    signup_view, WeeklyLogViewSet, InternshipPlacementViewSet, EvaluationCriteriaViewSet, EvaluationViewSet
)
from rest_framework_simplejwt.views import TokenRefreshView


# Create a router and register our viewsets with it.
router = DefaultRouter() 
router.register(r'users', CustomUserViewSet, basename='user') 
router.register(r'weekly-logs', WeeklyLogViewSet)
router.register(r'placements', InternshipPlacementViewSet)
router.register(r'criteria', EvaluationCriteriaViewSet)
router.register(r'evaluations', EvaluationViewSet)
  


urlpatterns = [
    path('api/', include(router.urls)),
    path('dashboard-stats/', DashboardStatsView.as_view(), name='dashboard-stats'),
    path('signup/', signup_view, name='signup'),
    path('api/logout/', LogoutView.as_view(), name='logout'),
    path('api/register/', RegisterView.as_view(), name='register'),
    path('api/departments/', DepartmentListCreateAPIView.as_view(), name='department-list-create'),
    path("api/login/", CustomTokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("api/token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
    path('api/weeklylogs/',WeeklyLogListCreateAPIView.as_view(), name='weeklylog-list-create'),
    path('api/user/profile/', user_profile, name='user-profile'),
]



