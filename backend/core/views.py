from django.shortcuts import render
from rest_framework.generics import ListCreateAPIView
from .models import WeeklyLog, EvaluationCriteria, Evaluation, InternshipPlacement, Issue
from .serializers import WeeklyLogSerializer, EvaluationCriteriaSerializer, EvaluationSerializer, InternshipPlacementSerializer, IssueSerializer
from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from .permissions import IsStudentUser

class WeeklyLogViewSet(viewsets.ModelViewSet):
    queryset = WeeklyLog.objects.all()
    serializer_class = WeeklyLogSerializer

    def perform_create(self, serializer):
        # Attach the logged-in user as the person creating/starting the log
        serializer.instance._changed_by = self.request.user
        serializer.save(student=self.request.user)

    def perform_update(self, serializer):
        """
        When a supervisor reviews or approves a log, this method 
        passes the supervisor's identity to the signal.
        """
        # bridge that allows the signal to know who made the change
        serializer.instance._changed_by = self.request.user
        serializer.save()

class InternshipPlacementViewSet(viewsets.ModelViewSet):
    queryset = InternshipPlacement.objects.all()
    serializer_class = InternshipPlacementSerializer

class EvaluationCriteriaViewSet(viewsets.ModelViewSet):
    queryset = EvaluationCriteria.objects.all()
    serializer_class = EvaluationCriteriaSerializer

class EvaluationViewSet(viewsets.ModelViewSet):
    queryset = Evaluation.objects.all()
    serializer_class = EvaluationSerializer

# This was the missing piece causing your error!
class IssueViewSet(viewsets.ModelViewSet):
    queryset = Issue.objects.all()
    serializer_class = IssueSerializer
    permission_classes = [IsStudentUser]
