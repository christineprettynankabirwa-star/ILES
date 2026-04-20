from django.shortcuts import render
from django.views.generic import CreateView,ListView,UpdateView
from django.contrib.auth.mixins import LoginRequiredMixin
from django.urls import reverse_lazy
from django.models import WeeklyLog
from .forms import WeeklyLogform
# Create your views here
class LogEvaluationView(LoginRequiredMixin,UpdateView):
    model=WeeklyLog
    fields=['supervisor_comment','score','status']
    template_name='logs/log_evaluation.html'
    success_url=reverse_lazy('log-list')
    #Add staff/supervisor check herepython