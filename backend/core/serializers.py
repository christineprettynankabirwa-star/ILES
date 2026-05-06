from rest_framework import serializers
from .models import WeeklyLog, EvaluationCriteria, Evaluation, InternshipPlacement
class WeeklyLogSerializer(serializers.ModelSerializer):
    class Meta:
        model = WeeklyLog
        fields = '__all__'
class InternshipPlacementSerializer(serializers.ModelSerializer):
    class Meta:
        model = InternshipPlacement
        fields = '__all__'

class EvaluationCriteriaSerializer(serializers.ModelSerializer):
    class Meta:
        model = EvaluationCriteria
        fields = '__all__'
class EvaluationSerialiser(serializers.ModelSerializer):
    class Meta:
        model = Evaluation
        fields = '__all__'

#THE ISSUESERIALIZER
class IssueSerializer(serializers.ModelSerializer):
    class Meta:
        model = Issue
        fields = '__all__'