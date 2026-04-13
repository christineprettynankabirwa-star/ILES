from django.contrib.auth.models import AbstractUser
from django.db import models

class CustomUser(AbstractUser):
    ROLE_CHOICES = (
        ('student', 'Student'),
        ('work_supervisor', 'Workplace Supervisor'),
        ('acad_supervisor', 'Academic Supervisor'),
        ('admin', 'Admin'),
    )

    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='student')
    university_id = models.CharField(max_length=50, blank=True, null=True)

    def __str__(self):
        return self.username
    
    class Meta:
        verbose_name = "Custom User"
        verbose_name_plural = "Custom Users"


#WeeklyLog model to store weekly logs for students

class WeeklyLog(models.Model):
    STATUS_CHOICES = [
        ('draft', 'Draft'),
        ('submitted', 'Submitted'),
        ('reviewed', 'Reviewed'),
        ('approved', 'Approved'),
    ]

    student = models.ForeignKey(
        'CustomUser',
        on_delete=models.CASCADE,
        limit_choices_to={'role': 'student'}
    )

    placement = models.ForeignKey(
        'InternshipPlacement',
        on_delete=models.CASCADE,
        related_name='weekly_logs'
    )

    week_number = models.IntegerField()

    activities = models.TextField()
    challenges = models.TextField()

    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default='draft'
    )

    submitted_at = models.DateTimeField(null=True, blank=True)

    def __str__(self):
        return f"Week {self.week_number} - {self.student.username}" 