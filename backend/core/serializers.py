from rest_framework import serializers
#for WeeklyLog 
from .models import WeeklyLog

class WeeklyLogSerializer(serializers.ModelSerializer):
    class Meta: 
        model = WeeklyLog
        fields = '__all__'

#for InternshipPlacement
from .models import InternshipPlacement 

class InternshipPlacementSerializer(serializers.ModelSerializer):
    class Meta:
        model = InternshipPlacement
        fields = '__all__'

# for EvaluationCriteria
from .models import Evaluation, EvaluationCriteria
class EvaluationCriteriaSerializer(serializers.ModelSerializer):
    class Meta:
        model = EvaluationCriteria
        fields = '__all__'
         
# for Evaluation
class EvaluationSErializer(serializers.ModelSerializer):
    class Meta:
        model = Evaluation
        fields = '__all__'