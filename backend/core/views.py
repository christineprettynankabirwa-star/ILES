from django.shortcuts import render
from rest_framework.generics import ListCreateAPIView
from .models import WeeklyLog, EvaluationCriteria, Evaluation, InternshipPlacement, Issue
from .serializers import WeeklyLogSerializer, EvaluationCriteriaSerializer, EvaluationSerializer, InternshipPlacementSerializer, IssueSerializer
from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from .permissions import IsStudentUser

class WeeklyLogListCreateAPIView(ListCreateAPIView):
    queryset = WeeklyLog.objects.all()
    serializer_class = WeeklyLogSerializer

class InternshipPlacementListCreateAPIView(ListCreateAPIView):
    queryset = InternshipPlacement.objects.all()
    serializer_class = InternshipPlacementSerializer

class InternshipPlacementViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    serializer_class = InternshipPlacementSerializerqueryset = InternshipPlacement.objects.all()
class EvaluationCriteriaListCreateAPIView(ListCreateAPIView):
    queryset = EvaluationCriteria.objects.all()
    serializer_class = EvaluationCriteriaSerializer
class EvaluationListCreateAPIView(ListCreateAPIView):
    queryset = Evaluation.objects.all()
    serializer_class = EvaluationSerializer

#IssueViewSet
class IssueViewSet(viewsets.ModelViewSet):
    queryset = Issue.objects.all()
    serializer_class = IssueSerializer
    permission_classes = [IsStudentUser]
