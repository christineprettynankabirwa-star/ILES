from rest_framework import serializers
from django.contrib.auth.models import User
from .models import WeeklyLog, EvaluationCriteria, Evaluation, InternshipPlacement, Issue

class UserSerializer(serializers.ModelSerializer):
    # Field to capture role from the React signup dropdown
    role = serializers.CharField(write_only=True, required=False)

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'password', 'role']
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        # Prevent 'Signup failed' by extracting role before creating the User
        role = validated_data.pop('role', 'student')
        user = User.objects.create_user(**validated_data)
        return user

class IssueSerializer(serializers.ModelSerializer):
    # Read-only student name for the UI
    student_name = serializers.CharField(source='student.username', read_only=True)

    class Meta:
        model = Issue
        fields = ['id', 'student', 'student_name', 'issue_description', 'status', 'created_at']
        # Read-only prevents 'Failed to submit' if React doesn't send the ID
        read_only_fields = ['student', 'status', 'created_at']

class WeeklyLogSerializer(serializers.ModelSerializer):
    student_name = serializers.CharField(source='student.username', read_only=True)
    
    class Meta:
        model = WeeklyLog
        fields = '__all__'
        read_only_fields = ['student', 'created_at', 'updated_at']

    def update(self, instance, validated_data):
        """
        Passes the user context to the signal for LogStatusHistory tracking.
        """
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

        # Logical check: Is the end date after the start date
        if start and end and start >= end:
            raise serializers.ValidationError({
                "end_date": "The internship cannot end before it starts."
            })

        # Check for overlapping placements
        overlapping_placements = InternshipPlacement.objects.filter(
            student=student,
            start_date__lt=end,
            end_date__gt=start
        )

        if self.instance:
            overlapping_placements = overlapping_placements.exclude(pk=self.instance.pk)

        if overlapping_placements.exists():
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