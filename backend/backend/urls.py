# backend/urls.py  (root URL conf)
from django.contrib import admin
from django.urls import path, include
from django.http import JsonResponse


def api_root(request):
    return JsonResponse({"message": "Welcome to the ILES API. Use /api/ endpoints."})


urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('core.urls')),
    path('', api_root),
]
