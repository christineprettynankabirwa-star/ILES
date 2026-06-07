from rest_framework import serializers
from django.contrib.auth.password_validation import validate_password
from .models import CustomUser, Department, WeeklyLog, EvaluationCriteria, Evaluation, InternshipPlacement 
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

class WeeklyLogSerializer(serializers.ModelSerializer):
    class Meta:
        model = WeeklyLog
        fields = '__all__'
class InternshipPlacementSerializer(serializers.ModelSerializer):
    student_name = serializers.ReadOnlyField(source='student.username')
    class Meta:
        model = InternshipPlacement
        fields = '__all__'

class EvaluationCriteriaSerializer(serializers.ModelSerializer):
    class Meta:
        model = EvaluationCriteria
        fields = '__all__'
class EvaluationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Evaluation
        fields = '__all__'


class DepartmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Department
        fields = '__all__'

class CustomUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'role', 'student_number', 'department', 'staff_number', 'phone_number']

class UserRegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True, validators=[validate_password])
    password2 = serializers.CharField(write_only=True, required=True)

    class Meta:
        model = CustomUser
        fields = ['username', 'email', 'first_name', 'last_name', 'role', 'student_number', 'department', 'staff_number', 'phone_number', 'password', 'password2']

    def validate(self, attrs):
        if attrs['password'] != attrs['password2']:
            raise serializers.ValidationError({"password": "Password fields didn't match."})
        return attrs

    def create(self, validated_data):
        validated_data.pop('password2')
        user = CustomUser.objects.create(
            username=validated_data['username'],
            email=validated_data['email'],
            first_name=validated_data['first_name'],
            last_name=validated_data['last_name'],
            role=validated_data['role'],
            student_number=validated_data.get('student_number'),
            department=validated_data.get('department'),
            staff_number=validated_data.get('staff_number'),
            phone_number=validated_data.get('phone_number'),
        )
        user.set_password(validated_data['password'])
        user.save()

        from django.contrib.auth.models import Group
        group, _ = Group.objects.get_or_create(name=user.get_role_display())
        user.groups.add(group)

        return user
    
class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)

        #Add custom claims (role-based data)
        token['username'] = user.username
        token['email'] = user.email
        token['department_id'] = user.department.id if user.department else None
        token['department'] = user.department.name if user.department else None
        token['role'] = user.role

        return token
    
    def validate(self, attrs):
        data = super().validate(attrs)

        # Add user data to response
        data['user'] = {
            'id': self.user.id,
            'username': self.user.username,
            'email': self.user.email,
            'first_name': self.user.first_name,
            'last_name': self.user.last_name,
            'role': self.user.role,
            'student_number': self.user.student_number,
            'department': self.user.department.name if self.user.department else None,
        }

        return data