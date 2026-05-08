from django.shortcuts import render
from django.db.models import Count, Avg
from rest_framework.views import APIView
from rest_framework import viewsets, permissions
from rest_framework.generics import ListCreateAPIView
from .models import WeeklyLog, EvaluationCriteria, Evaluation, InternshipPlacement, Issue
from .serializers import WeeklyLogSerializer, EvaluationCriteriaSerializer, EvaluationSerializer, InternshipPlacementSerializer, IssueSerializer
from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from .permissions import IsStudentUser


class DashboardStatsView(APIView):
    """
    Provides aggregated data for the Week 10 dashboard requirements.
    """
    permission_classes = [IsAuthenticated]

    def get(self, request):
        # 1. Student Progress Dashboard that Counts how many weekly logs each student has submitted
        student_progress = InternshipPlacement.objects.annotate(
            logs_count=Count('weeklylog')
        ).values('student__username', 'logs_count')

        # 2. Supervisor Pending Reviews and Filters evaluations that have not been completed yet
        pending_reviews = Evaluation.objects.filter(status='Pending').count()

        # 3. Admin Statistics Dashboard which Calculates system-wide averages for performance metrics
        admin_stats = Evaluation.objects.aggregate(
            avg_score=Avg('total_weighted_score'),
            total_evals=Count('id')
        )

        return Response({
            "student_progress": list(student_progress),
            "pending_reviews_count": pending_reviews,
            "admin_performance": admin_stats
        })

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

class IssueViewSet(viewsets.ModelViewSet):
    queryset = Issue.objects.all()
    serializer_class = IssueSerializer
    permission_classes = [permissions.IsAuthenticated]
