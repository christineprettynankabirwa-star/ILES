from rest_framework import serializers
from django.contrib.auth.models import User
from .models import WeeklyLog, EvaluationCriteria, Evaluation, InternshipPlacement, Issue, LogStatusHistory

class UserSerializer(serializers.ModelSerializer):
    # Field to capture role from the React frontend dropdown
    role = serializers.CharField(write_only=True, required=False)

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'password', 'role']
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        # Extracts role to prevent 'Signup failed' if the User model doesn't have a 'role' field
        role = validated_data.pop('role', 'student')
        user = User.objects.create_user(**validated_data)
        # Role assignment logic can be handled here or in the signup_view
        return user

class IssueSerializer(serializers.ModelSerializer):
    student_name = serializers.CharField(source='student.username', read_only=True)

    class Meta:
        model = Issue
        fields = ['id', 'student', 'student_name', 'issue_description', 'status', 'created_at']
        # Set student to read_only to prevent 'Failed to submit' if not sent from React
        read_only_fields = ['student', 'status', 'created_at']

class WeeklyLogSerializer(serializers.ModelSerializer):
    student_name = serializers.CharField(source='student.username', read_only=True)
    
    class Meta:
        model = WeeklyLog
        fields = '__all__'
        read_only_fields = ['student', 'created_at', 'updated_at']

    def update(self, instance, validated_data):
        """
        Critical for Signals: Passes the logged-in user to the pre_save/post_save signals.
        """
        # Attach the user from the request context to the instance
        instance._changed_by = self.context['request'].user
        return super().update(instance, validated_data)

class InternshipPlacementSerializer(serializers.ModelSerializer):
    student_name = serializers.CharField(source='student.username', read_only=True)
    academic_supervisor_name = serializers.CharField(source='academic_supervisor.username', read_only=True)
    workplace_supervisor_name = serializers.CharField(source='workplace_supervisor.username', read_only=True)

    class Meta:
        model = InternshipPlacement
        fields = '__all__'

class LogStatusHistorySerializer(serializers.ModelSerializer):
    changed_by_name = serializers.CharField(source='changed_by.username', read_only=True)

    class Meta:
        model = LogStatusHistory
        fields = ['id', 'from_status', 'to_status', 'comments', 'changed_at', 'changed_by_name']

class EvaluationCriteriaSerializer(serializers.ModelSerializer):
    class Meta:
        model = EvaluationCriteria
        fields = '__all__'

class EvaluationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Evaluation
        fields = '__all__'