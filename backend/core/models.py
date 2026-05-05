'''Models for the internship management system, including CustomUser, InternshipPlacement, and WeeklyLog. These models define the structure of the database tables and the relationships between them.'''
# pylint: disable=no-member
from django.db import models
from django.contrib.auth.models import AbstractUser
from django.conf import settings


class CustomUser(AbstractUser):
    '''Custom user model with roles for internship system'''
    ROLE_CHOICES = (
        ('student', 'Student'),
        ('work_supervisor', 'Workplace Supervisor'),
        ('acad_supervisor', 'Academic Supervisor'),
        ('admin', 'Admin'),
    )

    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='student')
    university_id = models.CharField(max_length=50, blank=True, null=True)

    def  __str__(self):
        return  str(self.username)

    class Meta:
        '''Meta definition for CustomUser model'''
        verbose_name = "Custom User"
        verbose_name_plural = "Custom Users"
class InternshipPlacement(models.Model):
    '''Model representing an internship placement'''
    student = models.ForeignKey('CustomUser',
    on_delete=models.CASCADE, limit_choices_to={'role': 'student'})
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

    def __str__(self):
        return f"{self.student.username} - {self.organization_name}"


class WeeklyLog(models.Model):
    '''Model representing a weekly log for an internship placement'''
    STATUS_CHOICES = [
        ('draft', 'Draft'),
        ('submitted', 'Submitted'),
        ('reviewed', 'Reviewed'),
        ('approved', 'Approved'),
    ]

    placement = models.ForeignKey(InternshipPlacement,
         on_delete=models.CASCADE, related_name='weekly_logs')

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
