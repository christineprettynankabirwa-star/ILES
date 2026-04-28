from django.contrib import admin
<<<<<<< HEAD
from django.urls import path, include 

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', include('core.urls')),
=======
from django.urls import path, include   
from django.urls import path

urlpatterns = [
    path('admin/', admin.site.urls),
    path('',include('core.urls')),
>>>>>>> 9f3db957eed762e12f701331e3dd645dc1bf2130
]
