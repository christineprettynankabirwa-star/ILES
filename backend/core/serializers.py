from rest_framework import serializers
<<<<<<< HEAD
from .models import WeeklyLog

class WeeklyLogSerializer(serializers.ModelSerializer):
    class Meta:
        model = WeeklyLog
        # This includes all fields from your model (date, activities, status, etc.)
=======
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
>>>>>>> d5f02f8d4bae4f2809989de2306aa5b8248675f0
        fields = '__all__'