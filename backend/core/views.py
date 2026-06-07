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

# ✅ Always use get_user_model() instead of importing User directly
User = get_user_model()


# --- Role-Based Registration View ---
@api_view(['POST'])
@permission_classes([AllowAny])
def signup_view(request):
    data = request.data
    username = data.get('username')
    email = data.get('email')
    password = data.get('password')
    confirm_password = data.get('confirmPassword')
    raw_role = data.get('role')

    # Validate required fields
    if not username or not password:
        return Response({"error": "Username and password required"}, status=status.HTTP_400_BAD_REQUEST)

    # ✅ Validate passwords match
    if password != confirm_password:
        return Response({"error": "Passwords do not match"}, status=status.HTTP_400_BAD_REQUEST)

    # ✅ Match exactly what the frontend <option value="..."> sends
    VALID_ROLES = {
        "student": "student",
        "academic_supervisor": "acad_supervisor",
        "workplace_supervisor": "work_supervisor",
    }

    role_value = VALID_ROLES.get(raw_role)
    if not role_value:
        return Response({"error": "Invalid role selected"}, status=status.HTTP_400_BAD_REQUEST)

    try:
        if User.objects.filter(username=username).exists():
            return Response({"error": "Username already taken"}, status=status.HTTP_400_BAD_REQUEST)

        # ✅ Create CustomUser with role field set directly
        user = User.objects.create_user(
            username=username,
            email=email,
            password=password,
            role=role_value
        )

        # ✅ Return auth token so frontend can log user in immediately
        token, _ = Token.objects.get_or_create(user=user)

        return Response({
            "message": f"Registration successful as {raw_role}",
            "token": token.key,
            "role": role_value
        }, status=status.HTTP_201_CREATED)

    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


# --- Issue ViewSet ---
class IssueViewSet(viewsets.ModelViewSet):
    queryset = Issue.objects.all()
    serializer_class = IssueSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(student=self.request.user)


# --- Dashboard Stats ---
class DashboardStatsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        # ✅ Fixed: use related_name 'weekly_logs' not 'weeklylog'
        student_progress = InternshipPlacement.objects.annotate(
            logs_count=Count('weekly_logs')
        ).values('student__username', 'logs_count')

        # ✅ Fixed: Evaluation has no 'status' field — use date_evaluated instead
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


# --- Weekly Log ViewSet ---
class WeeklyLogViewSet(viewsets.ModelViewSet):
    queryset = WeeklyLog.objects.all()
    serializer_class = WeeklyLogSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        # ✅ Fixed: save first, then set _changed_by on the returned instance
        instance = serializer.save(student=self.request.user)
        instance._changed_by = self.request.user

    def perform_update(self, serializer):
        # ✅ Fixed: same pattern — save first, then set attribute
        instance = serializer.save()
        instance._changed_by = self.request.user


# --- Internship Placement ViewSet ---
class InternshipPlacementViewSet(viewsets.ModelViewSet):
    queryset = InternshipPlacement.objects.all()
    serializer_class = InternshipPlacementSerializer
    permission_classes = [IsAuthenticated]  # ✅ Fixed: was missing auth


# --- Evaluation Criteria ViewSet ---
class EvaluationCriteriaViewSet(viewsets.ModelViewSet):
    queryset = EvaluationCriteria.objects.all()
    serializer_class = EvaluationCriteriaSerializer
    permission_classes = [IsAuthenticated]  # ✅ Fixed: was missing auth


# --- Evaluation ViewSet ---
class EvaluationViewSet(viewsets.ModelViewSet):
    queryset = Evaluation.objects.all()
    serializer_class = EvaluationSerializer
    permission_classes = [IsAuthenticated]