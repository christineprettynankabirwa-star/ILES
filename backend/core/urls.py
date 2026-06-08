from django.urls import path, include
from rest_framework.routers import DefaultRouter 
from .views import RegisterView, LogoutView, CustomTokenObtainPairView, CustomUserViewSet, DepartmentListCreateAPIView, WeeklyLogListCreateAPIView,EvaluationCriteriaListCreateAPIView,EvaluationListCreateAPIView,InternshipPlacementListCreateAPIView, user_profile
from rest_framework_simplejwt.views import TokenRefreshView

router = DefaultRouter() 
router.register('users', CustomUserViewSet, basename='user')    


urlpatterns = [
    path('api/logout/', LogoutView.as_view(), name='logout'),
    path('api/register/', RegisterView.as_view(), name='register'),
    path('api/departments/', DepartmentListCreateAPIView.as_view(), name='department-list-create'),
    path("api/login/", CustomTokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("api/token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
    path('api/weeklylogs/',WeeklyLogListCreateAPIView.as_view(), name='weeklylog-list-create'),
    path('api/internshipplacements/',InternshipPlacementListCreateAPIView.as_view(), name='internshipplacement-list-create'),
    path('api/evaluationcriteria/',EvaluationCriteriaListCreateAPIView.as_view(), name='evaluationcriteria-list-create'),
    path('api/evaluations/',EvaluationListCreateAPIView.as_view(), name='evaluation-list-create'),
    path('api/user/profile/', user_profile, name='user-profile'),
    path('api/', include(router.urls)),
]
