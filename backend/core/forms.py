from django import forms 
from .models import WeeklyLog

class WeeklyLogForm(forms.ModelForm):
    class Meta:
        model = WeeklyLog
        fields = ['week_start_date', 'tasks_done', 'learning_outcomes', 'hours_worked']
        widgets = {
            'week_start_date': forms.DateInput(attrs={'type': 'date'}),
            'tasks_done': forms.Textarea(attrs={'rows': 4}),
            'learning_outcomes': forms.Textarea(attrs={'rows': 4}),
            'hours_worked': forms.NumberInput(attrs={'step': 0.25}),
        }