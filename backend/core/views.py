from django.db.models import Count, Avg
from django.contrib.auth import get_user_model
from rest_framework.views import APIView
from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.authtoken.models import Token

from .models import WeeklyLog, EvaluationCriteria, Evaluation, InternshipPlacement, Issue

from .serializers import (
    WeeklyLogSerializer, EvaluationCriteriaSerializer,
    EvaluationSerializer, InternshipPlacementSerializer, IssueSerializer
)

User = get_user_model()

@api_view(['POST'])
@permission_classes([AllowAny])
def signup_view(request):
    data = request.data
    username = data.get('username')
    email = data.get('email')
    password = data.get('password')
    confirm_password = data.get('confirmPassword')
    role_value = data.get('role')

    if not username or not password:
        return Response({"error": "Username and password required"}, status=status.HTTP_400_BAD_REQUEST)

    if password != confirm_password:
        return Response({"error": "Passwords do not match"}, status=status.HTTP_400_BAD_REQUEST)

    valid_roles = [choice[0] for choice in User.ROLE_CHOICES]
    if role_value not in valid_roles:
        return Response({"error": "Invalid role selected"}, status=status.HTTP_400_BAD_REQUEST)

    try:
        if User.objects.filter(username=username).exists():
            return Response({"error": "Username already taken"}, status=status.HTTP_400_BAD_REQUEST)

        user = User.objects.create_user(
            username=username,
            email=email,
            password=password,
            role=role_value
        )

        token, _ = Token.objects.get_or_create(user=user)

        return Response({
            "message": "Registration successful",
            "token": token.key,
            "role": role_value
        }, status=status.HTTP_201_CREATED)

    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class IssueViewSet(viewsets.ModelViewSet):
    queryset = Issue.objects.all()
    serializer_class = IssueSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(student=self.request.user)


class DashboardStatsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        student_progress = InternshipPlacement.objects.annotate(
            logs_count=Count('weekly_logs')
        ).values('student__username', 'logs_count')

        pending_reviews = Evaluation.objects.filter(
            date_evaluated__isnull=True
        ).count()

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
        instance = serializer.save(student=self.request.user)
        instance._changed_by = self.request.user

    def perform_update(self, serializer):
        instance = serializer.save()
        instance._changed_by = self.request.user


class InternshipPlacementViewSet(viewsets.ModelViewSet):
    queryset = InternshipPlacement.objects.all()
    serializer_class = InternshipPlacementSerializer
    permission_classes = [IsAuthenticated]


class EvaluationCriteriaViewSet(viewsets.ModelViewSet):
    queryset = EvaluationCriteria.objects.all()
    serializer_class = EvaluationCriteriaSerializer
    permission_classes = [IsAuthenticated]


class EvaluationViewSet(viewsets.ModelViewSet):
    queryset = Evaluation.objects.all()
    serializer_class = EvaluationSerializer
    permission_classes = [IsAuthenticated]