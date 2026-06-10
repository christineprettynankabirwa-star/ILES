from django.contrib import admin
from django.urls import path, include 
from rest_framework.authtoken.views import obtain_auth_token
from core.views import user_profile
from django.http import HttpResponse 

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('core.urls')),
    path('api-token-auth/', obtain_auth_token),
    path('api/user/profile', user_profile),
    path('', lambda request: HttpResponse("Welcome to the API. Use /api/ endpoints.")),
]
