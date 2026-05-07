from django.shortcuts import render
from rest_framework.generics import ListCreateAPIView
from .models import WeeklyLog, EvaluationCriteria, Evaluation, InternshipPlacement, Issue
from .serializers import WeeklyLogSerializer, EvaluationCriteriaSerializer, EvaluationSerialiser, InternshipPlacementSerializer, IssueSerializer
from rest_framework import viewsets, permissions
from rest_framework.permissions import IsAuthenticated, IsStudentUser


class WeeklyLogListCreateAPIView(ListCreateAPIView):
    queryset = WeeklyLog.objects.all()
    serializer_class = WeeklyLogSerializer

class InternshipPlacementListCreateAPIView(ListCreateAPIView):
    queryset = InternshipPlacement.objects.all()
    serializer_class = InternshipPlacementSerializer

class InternshipPlacementViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
class EvaluationCriteriaListCreateAPIView(ListCreateAPIView):
    queryset = EvaluationCriteria.objects.all()
    serializer_class = EvaluationCriteriaSerializer
class EvaluationListCreateAPIView(ListCreateAPIView):
    queryset = Evaluation.objects.all()
    serializer_class = EvaluationSerialiser

#IssueViewSet
class IssueViewSet(viewsets.ModelViewSet):
    queryset = Issue.objects.all()
    serializer_class = IssueSerializer
    permission_classes = [IsStudentUser]

# Custom Role-based "Lock"
class IsStudentuser(permissions.BasePermission):
    """
    Allows access only to users with the 'student' role.
    """

    def has_permission(self, request, view):
        return bool(
            request.user and 
            request.user.is_authenticated and
            getattr(request.user, 'role', None) == 'student'
        )