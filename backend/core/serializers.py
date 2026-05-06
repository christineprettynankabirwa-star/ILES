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

    def validate(self, data):
        #Extract the data being sent from the UI
        student = data.get('student')
        start = data.get('start_date')
        end = data.get('end_date')

        #Logical check: Is the end date after the start date
        if start and end and start >= end:
            raise serializers.ValidationError({
                "end_date": "The internship cannot end before it starts."
                })

            #Check for overlapping placements for the same student
        overlapping_placements = InternshipPlacement.objects.filter(
            student=student,
            start_date__lt=end,
            end_date__gt=start
        )

         #Safety (If editing an existing placement, don't count itself as an overlap)
        if self.instance:
            overlapping_placements = overlapping_placements.exclude(pk=self.instance.pk)

        if overlapping_placements.exists():
            raise serializers.ValidationError({
                "This student already has an internship placement during these dates."
            })

class EvaluationCriteriaSerializer(serializers.ModelSerializer):
    class Meta:
        model = EvaluationCriteria
        fields = '__all__'
        
class EvaluationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Evaluation
        fields = '__all__'