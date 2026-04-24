from django.db import models
from django.contrib.auth.models import AbstractUser


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

class EvaluationCriteria(models.Model):
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    max_score = models.IntegerField(default=10) 

    def __str__(self):
        return f"{self.title} ({self.max_score} marks) "
class Evaluation(models.Model):
    EVALUATOR_ROLE = (
        ('work_supervisor', 'Workplace Supervisor'),
        ('acad_supervisor', 'Academic Supervisor'),
    )
    criteria=models.ForeignKey(EvaluationCriteria,on_delete=models.CASCADE,related_name='evaluations')

    placement = models.ForeignKey(
        InternshipPlacement,
        on_delete=models.CASCADE,
        related_name='evaluations'
    )

    evaluator = models.ForeignKey(
        CustomUser,
        on_delete=models.CASCADE,
        limit_choices_to={'role__in': ['work_supervisor', 'acad_supervisor']}
    )

    evaluator_role = models.CharField(max_length=20, choices=EVALUATOR_ROLE)

    # Evaluation Criteria (Scores out of 10 or 100)
    communication_skills = models.IntegerField()
    technical_skills = models.IntegerField()
    teamwork = models.IntegerField()
    punctuality = models.IntegerField()
    problem_solving = models.IntegerField()

    # Overall
    overall_score = models.FloatField(blank=True, null=True)
    comments = models.TextField(blank=True, null=True)

    evaluated_at = models.DateTimeField(auto_now_add=True)

    def save(self, *args, **kwargs):
        # Auto-calculate overall score
        scores = [
            self.communication_skills,
            self.technical_skills,
            self.teamwork,
            self.punctuality,
            self.problem_solving
        ]
        self.overall_score = sum(scores) / len(scores)
        super().save(*args, **kwargs)
    def __str__(self):
        return f" {self.student.username} -{self.criteria.title} ({self.overall_score}) " 

    def __str__(self):
        return f"Evaluation for {self.placement.student.username} by {self.evaluator.username}"
    
class EvaluationCriteria(models.Model):
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    max_score = models.IntegerField(default=10) 

    def __str__(self):
        return f"{self.title} ({self.max_score} marks) "
