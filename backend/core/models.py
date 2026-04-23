from django.db import models
from django.contrib.auth.models import AbstractUser
from django.core.exceptions import ValidationError
from django.utils import timezone
from datetime import timedelta


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
        
class InternshipPlacement(models.Model):
    student = models.ForeignKey('CustomUser', on_delete=models.CASCADE, limit_choices_to={'role': 'student'})
    organization_name = models.CharField(max_length=255)
    registration_number = models.CharField(max_length=100)
    course = models.CharField(max_length=255)
    start_date = models.DateField()
    end_date = models.DateField()
    
    # Supervisor Details
    academic_supervisor = models.CharField(max_length=255)
    academic_supervisor_email = models.EmailField()
    workplace_supervisor_name = models.CharField(max_length=255)
    workplace_supervisor_email = models.EmailField()
    
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.student.username} - {self.organization_name}"
    

class WeeklyLog(models.Model):
    STATUS_CHOICES = [
        ('draft', 'Draft'),
        ('submitted', 'Submitted'),
        ('reviewed', 'Reviewed'),
        ('approved', 'Approved'),
    ]

    placement = models.ForeignKey(InternshipPlacement, on_delete=models.CASCADE, related_name='weekly_logs')

    student = models.ForeignKey(
      'CustomUser',
      on_delete=models.CASCADE,
      limit_choices_to={'role': 'student'} 
    )

 # ForeignKeys link your model to the work your team already did
    week_number = models.PositiveIntegerField()
    week_start_date = models.DateField()
    activities = models.TextField()
    challenges = models.TextField()


    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='draft')
    created_at = models.DateTimeField(auto_now_add=True)
    submitted_at = models.DateTimeField(null=True, blank=True)

    def __str__(self):
        return f"Week {self.week_number} - {self.placement.student.username}"
    
    
def clean(self):
        # 1. Define the Deadline 7 days 
       submission_deadline = self.week_start_date + timedelta(days=7)

       # 2. Enforce the Deadline 
       if self.status == 'submitted' and timezone.now().date() > submission_deadline:
        raise ValidationError(f"The submission deadline for Week {self.week_number} has passed.")

    # 3. Prevent Future Submissions 
       if self.status == 'submitted' and self.week_start_date > timezone.now().date():
        raise ValidationError("You cannot submit a log for a week that hasn't started yet.")
    
def save(self, *args, **kwargs):
        """
        Handles Week 6 State Transitions and Locking[cite: 15, 142].
        """
        if self.pk:  # If updating an existing record
            original = WeeklyLog.objects.get(pk=self.pk)
            
            # Lock editing: Prevent modifications if the log is already approved 
            if original.status == 'approved':
                raise ValidationError("This log has been approved and can no longer be edited.")

        # Run the clean() method validation before saving to the database
        self.full_clean()
        super().save(*args, **kwargs)