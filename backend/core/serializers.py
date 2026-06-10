from rest_framework import serializers
from django.contrib.auth.password_validation import validate_password
from .models import CustomUser, Department, WeeklyLog, EvaluationCriteria, Evaluation, InternshipPlacement 
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from django.contrib.auth import get_user_model

User = get_user_model()

class WeeklyLogSerializer(serializers.ModelSerializer):
    student_name = serializers.CharField(source='student.username', read_only=True)
    
    class Meta:
        model = WeeklyLog
        fields = '__all__'
        read_only_fields = ['student', 'created_at', 'updated_at']

    def update(self, instance, validated_data):
        instance._changed_by = self.context['request'].user
        return super().update(instance, validated_data)

class InternshipPlacementSerializer(serializers.ModelSerializer):
    student_name = serializers.ReadOnlyField(source='student.username')

    class Meta:
        model = InternshipPlacement
        fields = '__all__'

    def validate(self, data):
        student = data.get('student')
        start = data.get('start_date')
        end = data.get('end_date')

        if start and end and start >= end:
            raise serializers.ValidationError({
                "end_date": "The internship cannot end before it starts."
            })

        overlapping = InternshipPlacement.objects.filter(
            student=student,
            start_date__lt=end,
            end_date__gt=start
        )

        if self.instance:
            overlapping = overlapping.exclude(pk=self.instance.pk)

        if overlapping.exists():
            raise serializers.ValidationError(
                "This student already has an internship placement during these dates."
            )
            
        return data

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
