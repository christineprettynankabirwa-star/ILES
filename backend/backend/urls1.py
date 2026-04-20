from django.urls import path
from .import views
urlpatterns = [
    path('logs/<int.pk>/evaluate/',views.LogEvaluationView.as_view(),name='log-evaluate')
]
