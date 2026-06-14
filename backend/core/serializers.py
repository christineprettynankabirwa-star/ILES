from rest_framework import serializers
from django.contrib.auth.password_validation import validate_password
from django.contrib.auth import get_user_model
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from .models import (
    CustomUser, Department, WeeklyLog,
    EvaluationCriteria, Evaluation, InternshipPlacement,
    LogStatusHistory,
)

User = get_user_model()

# DEPARTMENT
class DepartmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Department
        fields = '__all__'

# CUSTOM USER
class CustomUserSerializer(serializers.ModelSerializer):
    department_name = serializers.CharField(source='department.name', read_only=True)

    class Meta:
        model = CustomUser
        fields = [
            'id', 'username', 'email', 'first_name', 'last_name',
            'role', 'student_number', 'department', 'department_name',
            'staff_number', 'phone_number',
        ]

# USER REGISTRATION 
class UserRegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(
        write_only=True, required=True, validators=[validate_password]
    )
    password2 = serializers.CharField(write_only=True, required=True)

    class Meta:
        model = CustomUser
        fields = [
            'username', 'email', 'first_name', 'last_name',
            'role', 'student_number', 'department',
            'staff_number', 'phone_number',
            'password', 'password2',
        ]
    def validate(self, attrs):
        if attrs['password'] != attrs['password2']:
            raise serializers.ValidationError(
                {"password": "Password fields didn't match."}
            )
        return attrs
    def create(self, validated_data):
        validated_data.pop('password2')
        password = validated_data.pop('password')
        user = CustomUser(**validated_data)
        user.set_password(password)
        user.save()
        from django.contrib.auth.models import Group
        group, _ = Group.objects.get_or_create(name=user.get_role_display())
        user.groups.add(group)
        return user

# JWT — custom claims 
class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        token['username'] = user.username
        token['email'] = user.email
        token['role'] = user.role
        token['department_id'] = user.department_id
        token['department'] = user.department.name if user.department else None
        return token

    def validate(self, attrs):
        data = super().validate(attrs)
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
    
# INTERNSHIP PLACEMENT  
class InternshipPlacementSerializer(serializers.ModelSerializer):
    student_name = serializers.ReadOnlyField(source='student.username')
    academic_supervisor_name = serializers.ReadOnlyField(
        source='academic_supervisor.get_full_name'
    )
    workplace_supervisor_name = serializers.ReadOnlyField(
        source='workplace_supervisor.get_full_name'
    )

    class Meta:
        model = InternshipPlacement
        fields = '__all__'
        read_only_fields = ['total_score', 'final_grade', 'created_at']
        extra_kwargs = {
            'student': {'required': False, 'allow_null': True},
        }

    def validate(self, data):
        student = data.get('student') or (self.instance.student if self.instance else None)
        start = data.get('start_date') or (self.instance.start_date if self.instance else None)
        end = data.get('end_date') or (self.instance.end_date if self.instance else None)

        if start and end:
            if start >= end:
                raise serializers.ValidationError(
                    {"end_date": "The internship end date must be after the start date."}
                )

            overlapping = InternshipPlacement.objects.filter(
                student=student,
                start_date__lt=end,
                end_date__gt=start,
            )
            if self.instance:
                overlapping = overlapping.exclude(pk=self.instance.pk)

            if overlapping.exists():
                raise serializers.ValidationError(
                    "This student already has an internship during these dates."
                )

        return data
    
# LOG STATUS HISTORY 
class LogStatusHistorySerializer(serializers.ModelSerializer):
    changed_by_username = serializers.ReadOnlyField(source='changed_by.username')

    class Meta:
        model = LogStatusHistory
        fields = '__all__'

# WEEKLY LOG 

class WeeklyLogSerializer(serializers.ModelSerializer):
    student_name = serializers.ReadOnlyField(source='student.username')
    history = LogStatusHistorySerializer(many=True, read_only=True)

    class Meta:
        model = WeeklyLog
        fields = '__all__'
        read_only_fields = ['student', 'created_at', 'submitted_at', 'history']

    def validate_status(self, new_status):
        instance = self.instance
        if instance is None:
            return new_status 
        old_status = instance.status
        allowed = WeeklyLog.VALID_TRANSITIONS.get(old_status, [])
        if new_status != old_status and new_status not in allowed:
            raise serializers.ValidationError(
                f"Cannot change status from '{old_status}' to '{new_status}'."
            )
        return new_status

    def update(self, instance, validated_data):
        instance._changed_by = self.context['request'].user
        return super().update(instance, validated_data)

# EVALUATION CRITERIA 
class EvaluationCriteriaSerializer(serializers.ModelSerializer):
    class Meta:
        model = EvaluationCriteria
        fields = '__all__'

# EVALUATION 
class EvaluationSerializer(serializers.ModelSerializer):
    student_name = serializers.ReadOnlyField(source='placement.student.username')
    computed_score = serializers.ReadOnlyField(source='total_weighted_score')

    class Meta:
        model = Evaluation
        fields = '__all__'
        read_only_fields = ['total_weighted_score', 'date_evaluated']

    def validate(self, data):
        placement = data.get('placement') or (
            self.instance.placement if self.instance else None
        )
        if (
            placement
            and not self.instance  # only on create
            and Evaluation.objects.filter(placement=placement).exists()
        ):
            raise serializers.ValidationError(
                "An evaluation for this placement already exists."
            )
        return data