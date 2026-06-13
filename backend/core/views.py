from django.contrib.auth import get_user_model
from django.contrib.auth.tokens import default_token_generator
from django.core.mail import send_mail
from django.conf import settings
from django.db.models import Count, Avg, Q
from django.utils import timezone
from django.utils.encoding import force_bytes
from django.utils.http import urlsafe_base64_encode
from datetime import timedelta
from rest_framework import viewsets, generics, status
from rest_framework.decorators import api_view, permission_classes, action
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.generics import ListCreateAPIView
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.tokens import RefreshToken

from .models import (
    CustomUser, Department, WeeklyLog,
    EvaluationCriteria, Evaluation, InternshipPlacement,
)
from .serializers import (
    UserRegistrationSerializer, CustomTokenObtainPairSerializer,
    CustomUserSerializer, DepartmentSerializer, WeeklyLogSerializer,
    EvaluationCriteriaSerializer, EvaluationSerializer,
    InternshipPlacementSerializer,
)
from .permissions import (
    IsStudentUser, IsWorkplaceSupervisor,
    IsAcademicSupervisor, IsAdminUser, IsAdminOrReadOnly,
)

User = get_user_model()

# AUTH
class CustomTokenObtainPairView(TokenObtainPairView):
    """Login — returns JWT pair + user info (Week 4)."""
    serializer_class = CustomTokenObtainPairSerializer


class RegisterView(generics.CreateAPIView):
    """Full registration with validation (Week 4)."""
    serializer_class = UserRegistrationSerializer
    permission_classes = [AllowAny]

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            return Response(
                {
                    "user": {
                        "id": user.id,
                        "username": user.username,
                        "email": user.email,
                        "role": user.role,
                    },
                    "message": "User registered successfully.",
                },
                status=status.HTTP_201_CREATED,
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([AllowAny])
def signup_view(request):
    """
    Quick signup (used by the React frontend form).
    Delegates to UserRegistrationSerializer for DRY validation.
    """
    serializer = UserRegistrationSerializer(data=request.data)
    if not serializer.is_valid():
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    user = serializer.save()
    refresh = RefreshToken.for_user(user)
    return Response(
        {
            "message": "Registration successful",
            "access": str(refresh.access_token),
            "refresh": str(refresh),
            "role": user.role,
        },
        status=status.HTTP_201_CREATED,
    )


class LogoutView(generics.GenericAPIView):
    """Blacklist the refresh token on logout (Week 4)."""
    permission_classes = [IsAuthenticated]

    def post(self, request):
        refresh_token = request.data.get("refresh")
        if not refresh_token:
            return Response(
                {"error": "Refresh token is required."},
                status=status.HTTP_400_BAD_REQUEST,
            )
        try:
            token = RefreshToken(refresh_token)
            token.blacklist()
            return Response({"message": "Logged out successfully."}, status=200)
        except Exception as e:
            return Response({"error": str(e)}, status=400)


class ForgotPasswordView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        email = request.data.get('email')
        if not email:
            return Response(
                {'error': 'Email is required.'}, status=status.HTTP_400_BAD_REQUEST
            )
        try:
            user = User.objects.get(email=email)
            token = default_token_generator.make_token(user)
            uid = urlsafe_base64_encode(force_bytes(user.pk))
            reset_link = f"http://localhost:3000/reset-password/{uid}/{token}/"
            send_mail(
                subject='ILES Password Reset Request',
                message=(
                    f'Hi {user.username},\n\n'
                    f'Click the link below to reset your password:\n\n{reset_link}\n\n'
                    f'If you did not request this, please ignore this email.'
                ),
                from_email=settings.DEFAULT_FROM_EMAIL,
                recipient_list=[email],
                fail_silently=False,
            )
        except User.DoesNotExist:
            pass
        return Response(
            {'message': 'If that email is registered, a reset link has been sent.'},
            status=status.HTTP_200_OK,
        )

# USER PROFILE

@api_view(['GET', 'PATCH'])
@permission_classes([IsAuthenticated])
def user_profile(request):
    user = request.user
    if request.method == 'PATCH':
        serializer = CustomUserSerializer(user, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    return Response(CustomUserSerializer(user).data)

# USER MANAGEMENT  

class CustomUserViewSet(viewsets.ModelViewSet):
    queryset = CustomUser.objects.all()
    serializer_class = CustomUserSerializer
    # FIX: was AllowAny — exposing all user data to anyone is a security risk
    permission_classes = [IsAuthenticated]

    def get_permissions(self):
        """Admins can write; others can only read their own data."""
        if self.action in ('list', 'retrieve'):
            return [IsAuthenticated()]
        return [IsAdminUser()]

# DEPARTMENT

class DepartmentListCreateAPIView(ListCreateAPIView):
    queryset = Department.objects.all()
    serializer_class = DepartmentSerializer
    permission_classes = [IsAdminOrReadOnly]

# INTERNSHIP PLACEMENT

class InternshipPlacementViewSet(viewsets.ModelViewSet):
    serializer_class = InternshipPlacementSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        # Students see only their own placements
        if user.role == 'student':
            return InternshipPlacement.objects.filter(student=user)
        # Workplace supervisor sees placements they supervise
        if user.role == 'work_supervisor':
            return InternshipPlacement.objects.filter(workplace_supervisor=user)
        # Academic supervisor sees their assigned placements
        if user.role == 'acad_supervisor':
            return InternshipPlacement.objects.filter(academic_supervisor=user)
        # Admin sees everything
        return InternshipPlacement.objects.all()

    def perform_create(self, serializer):
        # If the requester is a student, auto-assign them
        if self.request.user.role == 'student':
            serializer.save(student=self.request.user)
        else:
            serializer.save()

# WEEKLY LOG 


class WeeklyLogListCreateAPIView(ListCreateAPIView):
    """Simple list/create (kept for backward compat)."""
    serializer_class = WeeklyLogSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.role == 'student':
            return WeeklyLog.objects.filter(student=user)
        return WeeklyLog.objects.all()


class WeeklyLogViewSet(viewsets.ModelViewSet):
    serializer_class = WeeklyLogSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.role == 'student':
            return WeeklyLog.objects.filter(student=user)
        if user.role == 'work_supervisor':
            return WeeklyLog.objects.filter(
                placement__workplace_supervisor=user
            )
        if user.role == 'acad_supervisor':
            return WeeklyLog.objects.filter(
                placement__academic_supervisor=user
            )
        return WeeklyLog.objects.all()

    def perform_create(self, serializer):
        """Auto-assign the logged-in student as the log owner."""
        if self.request.user.role != 'student':
            raise serializers.ValidationError("Only students can create weekly logs.")
        instance = serializer.save(student=self.request.user)
        instance._changed_by = self.request.user

    def perform_update(self, serializer):
        instance = serializer.save()
        instance._changed_by = self.request.user

    @action(detail=True, methods=['patch'],
            permission_classes=[IsWorkplaceSupervisor],
            url_path='review')
    def review(self, request, pk=None):
        """
        Workplace supervisor submits a review with comments.
        Transitions: submitted → reviewed
        """
        log = self.get_object()
        if log.status != 'submitted':
            return Response(
                {"error": "Only submitted logs can be reviewed."},
                status=status.HTTP_400_BAD_REQUEST,
            )
        comments = request.data.get('supervisor_comments', '')
        log._changed_by = request.user
        log.supervisor_comments = comments
        log.reviewed_by = request.user
        log.reviewed_at = timezone.now()
        log.status = 'reviewed'
        log.save()
        return Response(WeeklyLogSerializer(log).data)
    
    @action(detail=True, methods=['patch'],
            permission_classes=[IsAcademicSupervisor],
            url_path='approve')
    def approve(self, request, pk=None):
        """
        Academic supervisor approves a reviewed log.
        Transitions: reviewed → approved
        """
        log = self.get_object()
        if log.status != 'reviewed':
            return Response(
                {"error": "Only reviewed logs can be approved."},
                status=status.HTTP_400_BAD_REQUEST,
            )
        log._changed_by = request.user
        log.status = 'approved'
        log.save()
        return Response(WeeklyLogSerializer(log).data)

# EVALUATION 

class EvaluationCriteriaViewSet(viewsets.ModelViewSet):
    queryset = EvaluationCriteria.objects.all()
    serializer_class = EvaluationCriteriaSerializer
    permission_classes = [IsAdminOrReadOnly]


class EvaluationViewSet(viewsets.ModelViewSet):
    serializer_class = EvaluationSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.role == 'acad_supervisor':
            return Evaluation.objects.filter(academic_supervisor=user)
        if user.role == 'student':
            return Evaluation.objects.filter(placement__student=user)
        return Evaluation.objects.all()

    def perform_create(self, serializer):
        # FIX: auto-assign the academic supervisor from the request user
        if self.request.user.role != 'acad_supervisor':
            from rest_framework.exceptions import PermissionDenied
            raise PermissionDenied("Only academic supervisors can create evaluations.")
        serializer.save(academic_supervisor=self.request.user)

# DASHBOARD 

class DashboardStatsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        date_range = request.query_params.get('range', '30d')
        now = timezone.now()

        range_map = {'7d': 7, '30d': 30, '90d': 90}
        days = range_map.get(date_range)
        since = now - timedelta(days=days) if days else None

        placements = InternshipPlacement.objects.all()
        if since:
            placements = placements.filter(created_at__gte=since)

        # Role-specific filtering
        if user.role == 'student':
            placements = placements.filter(student=user)
        elif user.role == 'acad_supervisor':
            placements = placements.filter(academic_supervisor=user)
        elif user.role == 'work_supervisor':
            placements = placements.filter(workplace_supervisor=user)

        student_progress = list(
            placements.annotate(logs_count=Count('weekly_logs'))
            .values('student__username', 'student__id', 'logs_count', 'final_grade', 'total_score')
        )

        pending_reviews = WeeklyLog.objects.filter(status='submitted')
        if user.role == 'work_supervisor':
            pending_reviews = pending_reviews.filter(
                placement__workplace_supervisor=user
            )
        pending_reviews_count = pending_reviews.count()

        admin_stats = None
        if user.role in ('admin',) or user.is_superuser:
            admin_stats = Evaluation.objects.aggregate(
                avg_score=Avg('total_weighted_score'),
                total_evals=Count('id'),
            )
            grade_dist = list(
                InternshipPlacement.objects.values('final_grade')
                .annotate(count=Count('id'))
                .order_by('final_grade')
            )
            admin_stats['grade_distribution'] = grade_dist

        return Response({
            "student_progress": student_progress,
            "pending_reviews_count": pending_reviews_count,
            "admin_performance": admin_stats,
        })
