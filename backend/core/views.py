from django.shortcuts import render
from django.db.models import Count, Avg
from django.contrib.auth.models import User, Group
from rest_framework.views import APIView
from rest_framework import viewsets, permissions, status
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny

from .models import WeeklyLog, EvaluationCriteria, Evaluation, InternshipPlacement, Issue
from .serializers import (
    WeeklyLogSerializer, EvaluationCriteriaSerializer, 
    EvaluationSerializer, InternshipPlacementSerializer, IssueSerializer
)

# --- Role-Based Registration View ---
@api_view(['POST'])
@permission_classes([AllowAny])
def signup_view(request):
    """
    Handles registration and assigns users to groups (Student, Academic/Workplace Supervisor).
    """
    data = request.data
    username = data.get('username')
    email = data.get('email')
    password = data.get('password')
    role = data.get('role')

    if not username or not password:
        return Response({"error": "Username and password required"}, status=status.HTTP_400_BAD_REQUEST)

    try:
        if User.objects.filter(username=username).exists():
            return Response({"error": "Username already taken"}, status=status.HTTP_400_BAD_REQUEST)

        # Create User
        user = User.objects.create_user(username=username, email=email, password=password)

        # Assign Role via Groups (e.g., student, academic_supervisor)
        if role:
            group, created = Group.objects.get_or_create(name=role)
            user.groups.add(group)

        return Response({"message": f"Registration successful as {role}"}, status=status.HTTP_201_CREATED)
    
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


# --- FIXED: The missing IssueViewSet ---
class IssueViewSet(viewsets.ModelViewSet):
    queryset = Issue.objects.all()
    serializer_class = IssueSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        # Automatically assign the student to the issue
        serializer.save(student=self.request.user)


class DashboardStatsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        student_progress = InternshipPlacement.objects.annotate(
            logs_count=Count('weeklylog')
        ).values('student__username', 'logs_count')

        pending_reviews = Evaluation.objects.filter(status='Pending').count()

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
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        serializer.instance._changed_by = self.request.user
        serializer.save(student=self.request.user)

    def perform_update(self, serializer):
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