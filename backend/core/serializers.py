from rest_framework import serializers
from .models import WeeklyLog

class WeeklyLogSerializer(serializers.ModelSerializer):
    class Meta:
        model = WeeklyLog
        # This includes all fields from your model (date, activities, status, etc.)
        fields = '__all__'