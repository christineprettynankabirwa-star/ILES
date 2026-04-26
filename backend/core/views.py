from django.shortcuts import render
from rest_framework.generics import ListCreateAPIView
from .models import WeeklyLog, EvaluationCriteria, Evaluation
from .serializers import WeeklyLogSerializer, EvaluationCriteriaSerializer, EvaluationSerialiser

class WeeklyLogListCreateAPIView(ListCreateAPIView):
    queryset = WeeklyLog.objects.all()
    serializer_class = WeeklyLogSerializer
class EvaluationCriteriaListCreateAPIView(ListCreateAPIView):
    queryset = EvaluationCriteria.objects.all()
    serializer_class = EvaluationCriteriaSerializer
class EvaluationListCreateAPIView(ListCreateAPIView):
    queryset = Evaluation.objects.all()
    serializer_class = EvaluationSerialiser
