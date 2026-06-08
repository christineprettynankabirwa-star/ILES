from django.shortcuts import render
from rest_framework.generics import ListCreateAPIView
from .models import CustomUser, Department, WeeklyLog, EvaluationCriteria, Evaluation, InternshipPlacement
from .serializers import  UserRegistrationSerializer, CustomTokenObtainPairSerializer, CustomUserSerializer, DepartmentSerializer, WeeklyLogSerializer, EvaluationCriteriaSerializer, EvaluationSerializer, InternshipPlacementSerializer
from rest_framework import viewsets,generics,status
from rest_framework.permissions import IsAuthenticated, AllowAny
from .permissions import IsStudentUser
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from django.contrib.auth import authenticate, get_user_model
from rest_framework_simplejwt.views import TokenObtainPairView

class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer

class CustomUserViewSet(viewsets.ModelViewSet):
    queryset = CustomUser.objects.all()
    serializer_class = CustomUserSerializer
    permission_classes = [AllowAny]
class DepartmentListCreateAPIView(ListCreateAPIView):
    queryset = Department.objects.all()
    serializer_class = DepartmentSerializer
class WeeklyLogListCreateAPIView(ListCreateAPIView):
    queryset = WeeklyLog.objects.all()
    serializer_class = WeeklyLogSerializer

class InternshipPlacementListCreateAPIView(ListCreateAPIView):
    permission_classes = [IsAuthenticated]
    queryset = InternshipPlacement.objects.all().order_by('-id')
    serializer_class = InternshipPlacementSerializer

class EvaluationCriteriaListCreateAPIView(ListCreateAPIView):
    queryset = EvaluationCriteria.objects.all()
    serializer_class = EvaluationCriteriaSerializer
class EvaluationListCreateAPIView(ListCreateAPIView):
    queryset = Evaluation.objects.all()
    serializer_class = EvaluationSerializer

User = get_user_model()

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def user_profile(request):
    user = request.user
    serializer = CustomUserSerializer(user)
    return Response({
        'id': user.id,
        'username': user.username,
        'email': user.email,
        'role': user.role,
        'first_name': user.first_name,
        'last_name': user.last_name,
        'department': user.department.name if hasattr(user, 'department') and user.department else None,
    })


class RegisterView(generics.CreateAPiView):
    """User registration endpoint"""
    serializer_class = UserRegistrationSerializer
    permission_classes = [AllowAny]

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()    
            return Response({
                "user": {
                    'id': user.id,
                    'username': user.username,
                    'email': user.email,
                    'role': user.role
                },                    
                "message": "User registered successfully."
            }, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
class CustomTokenObtainPairView(TokenObtainPairView):
    """ Custom login endpoint with role information """
    serializer_class = CustomTokenObtainPairSerializer 

class LogoutView(generics.GenericAPIView):
    """ Logout endpoint to blacklist refresh tokens """
    permission_classes = [AllowAny]

    def post(self, request):
        try:
            refresh_token = request.data.get("refresh")
            if refresh_token:
                from rest_framework_simplejwt.token_blacklist.models import BlacklistedToken
                from rest_framework_simplejwt.tokens import RefreshToken
                token = RefreshToken(refresh_token)
                token.blacklist()
            return Response({"message": "Logged out successfully."}, status=200)
        except Exception as e:
            return Response({"error": str(e)}, status=400)     