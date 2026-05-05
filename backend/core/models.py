from django.db import models
from django.core.exceptions import ValidationError
from django.contrib.auth.models import AbstractUser
from django.conf import settings
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
    created_at = models.DateTimeField(auto_now_add=True)# ... existing fields (student, company, etc.) ...
    total_score = models.DecimalField(max_digits=5, decimal_places=2, default=0.00)
    final_grade = models.CharField(max_length=2, blank=True)

    def calculate_final_performance(self):
        """
        Implements weighted scoring logic:
        Technical (40%), Attendance (30%), Behavior (30%)
        """
        evals = self.evaluations.all()
        scores = {e.criteria.title.lower(): e.score for e in evals}
        
        # Mapping weights (Assumes criteria titles match these keys)
        tech_score = scores.get('technical', 0) * 0.40
        attn_score = scores.get('attendance', 0) * 0.30
        behave_score = scores.get('behavior', 0) * 0.30
        
        self.total_score = tech_score + attn_score + behave_score
        
        # Auto-calculate Grade
        if self.total_score >= 80: self.final_grade = 'A'
        elif self.total_score >= 70: self.final_grade = 'B'
        elif self.total_score >= 60: self.final_grade = 'C'
        else: self.final_grade = 'F'
        
        self.save()


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
    week_start_date = models.DateField(null=True, blank=True)
    week_number = models.PositiveIntegerField()
    activities = models.TextField()
    challenges = models.TextField()
    

    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='draft')
    created_at = models.DateTimeField(auto_now_add=True)
    submitted_at = models.DateTimeField(null=True, blank=True)

    def __str__(self):
        return f"Week {self.week_number} - {self.placement.student.username} ({self.status})" 

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
    placement = models.OneToOneField(
        'InternshipPlacement', 
        on_delete=models.CASCADE, 
        related_name='evaluation'
    )
   
    academic_supervisor = models.ForeignKey(
        'CustomUser', 
        on_delete=models.CASCADE, 
        limit_choices_to={'role': 'academic_supervisor'}
    )
    attendance_punctuality = models.PositiveIntegerField(default=0)  
    technical_competence = models.PositiveIntegerField(default=0)    
    quality_of_work = models.PositiveIntegerField(default=0)         
    
    total_weighted_score = models.FloatField(editable=False, default=0.0)
    supervisor_comments = models.TextField(blank=True)
    date_evaluated = models.DateTimeField(auto_now_add=True)
    class Meta:
        # PREVENT DOUBLE SUBMISSION: 
        # Ensures one evaluation per student, per placement, per criteria.
        unique_together = ('student', 'placement', 'criteria')

    def clean(self):
        # DATA VALIDATION: Ensure score does not exceed max_score
        if self.score > self.criteria.max_score:
            raise ValidationError(f"Score cannot exceed {self.criteria.max_score} for {self.criteria.title}.")

    def save(self, *args, **kwargs):
        self.full_clean() # Force validation on save
        super().save(*args, **kwargs)

    def clean(self):
        # Validation to ensure scores are within a 0-100 range 
        for score in [self.attendance_punctuality, self.technical_competence, self.quality_of_work]:
            if score < 0 or score > 100:
                raise ValidationError("All scores must be between 0 and 100.")

    def save(self, *args, **kwargs):
        # Formula: (40% * Score1) + (30% * Score2) + (30% * Score3)
        self.total_weighted_score = (
            (self.attendance_punctuality * 0.4) + 
            (self.technical_competence * 0.3) + 
            (self.quality_of_work * 0.3)
        )
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.placement.student.username} - Final Score: {self.total_weighted_score}"

# The Issue Model
class Issue(models.Model):
    title = models.CharField(max_length=200)
    issue_type = models.CharField(max_length=20, choices=[('Missing Marks', 'Missing Marks'), ('Exam Result', 'Exam Result')])
    status = models.CharField(max_length=20, default='Open')
    description = models.TextField()
