from django.db import models
from django.core.exceptions import ValidationError
from django.contrib.auth.models import AbstractUser
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

    position = models.CharField(max_length=255)
    location = models.CharField(max_length=255)
    duration = models.CharField(max_length=100)
    stipend = models.CharField(max_length=100)
    description = models.TextField()

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

    # validation logic
    def clean(self):
        #date validation 
        if self.start_date and self.end_date:
            if self.start_date >= self.end_date:
                raise ValidationError("incorrect date: The internship cannot end before it starts.")
            
            #avoid overlapping placements
            overlapping_placements = InternshipPlacement.objects.filter(
                student=self.student,
                start_date__lt=self.end_date,
                end_date__gt=self.start_date
            ).exclude(pk=self.pk)
            if overlapping_placements.exists():
                raise ValidationError("This student already has an internship placement during this period.")
            
    def __str__(self):
        return f"{self.student.username} - {self.organization_name}"
    

class WeeklyLog(models.Model):
    STATUS_CHOICES = [
        ('draft', 'Draft'),
        ('submitted', 'Submitted'),
        ('reviewed', 'Reviewed'),
        ('approved', 'Approved'),
    ]
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='draft')

    placement = models.ForeignKey(InternshipPlacement, on_delete=models.CASCADE, related_name='weekly_logs')

    student = models.ForeignKey(
      'CustomUser',
      on_delete=models.CASCADE,
      limit_choices_to={'role': 'student'} 
    )

 # ForeignKeys link your model to the work your team already did
    week_number = models.PositiveIntegerField()
    activities = models.TextField()
    challenges = models.TextField()

    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='draft')
    created_at = models.DateTimeField(auto_now_add=True)
    submitted_at = models.DateTimeField(null=True, blank=True)

    def __str__(self):
        return f"Week {self.week_number} - {self.placement.student.username}"
    
    def __str__(self):
        return f"Week {self.week_number} - {self.status}"

    def clean(self):
        
        # 1. Deadline enforcement logic
        if self.week_start_date:
            submission_deadline = self.week_start_date + timedelta(days=7)
            if self.status == 'submitted' and timezone.now().date() > submission_deadline:
                raise ValidationError(f"The submission deadline for Week {self.week_number} has passed.")

        # 2. Lock editing logic (MOVED FROM SAVE)
        if self.pk:  # Check if this is an existing record
            original = WeeklyLog.objects.get(pk=self.pk)
            if original.status == 'approved':
                raise ValidationError("This log has been approved and can no longer be edited.")

    def save(self, *args, **kwargs):
        
        self.full_clean()  # This ensures clean() is called before saving
        super().save(*args, **kwargs)

class EvaluationCriteria(models.Model):
    '''Model representing evaluation criteria for internship placements'''
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    max_score = models.IntegerField()

    
    def __str__(self):
        return f"{self.title} - {self.max_score}marks"
class Evaluation(models.Model):
    '''Model representing an evaluation for an internship placement'''
    student = models.ForeignKey('CustomUser', on_delete=models.CASCADE, limit_choices_to={'role': 'student'})
    placement = models.ForeignKey(InternshipPlacement, on_delete=models.CASCADE, related_name='evaluations')
    criteria = models.ForeignKey(EvaluationCriteria, on_delete=models.CASCADE)
    score = models.IntegerField()
    supervisor_comments = models.TextField(blank=True)
    date_evaluated = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.placement.student.username} - {self.criteria.title}: {self.score} marks"

# The Issue Model
class Issue(models.Model):
    title = models.CharField(max_length=200)
    issue_type = models.CharField(max_length=20, choices=[('Missing Marks', 'Missing Marks'), ('Exam Result', 'Exam Result')])
    status = models.CharField(max_length=20, default='Open')
    description = models.TextField()
