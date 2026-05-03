from django.shortcuts import render
from rest_framework import viewsets, serializers
from .models import WeeklyLog
from .serializers import WeeklyLogSerializer

class WeeklyLogViewSet(viewsets.ModelViewSet):
    queryset = WeeklyLog.objects.all()
    serializer_class = WeeklyLogSerializer

    def perform_update(self, serializer):
        # Retrieve the current log from the database before saving changes
        instance = self.get_object()
        
        # Logic: If the log is already 'Submitted' or 'Approved', block updates
        if instance.status in ['Submitted', 'Approved']:
            raise serializers.ValidationError(
                "This log has already been submitted or approved and cannot be edited."
            )
        
        serializer.save()
# Create your views here.
