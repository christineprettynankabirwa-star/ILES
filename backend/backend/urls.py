from django.contrib import admin
from django.urls import path, include 
from rest_framework.authtoken.views import obtain_auth_token

from backend.core.views import user_profile

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', include('core.urls')),
    path('api-token-auth/', obtain_auth_token),
    path('api/user/profile', user_profile),
]
