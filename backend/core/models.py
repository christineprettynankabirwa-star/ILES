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


# stub for InternshipPlacement
class InternshipPlacement(models.Model):
    pass

#stub for Weekly-logs
class WeeklyLog(models.Model):
    pass

#actual code for evaluation-module starting with EvaluationCriteria
class EvaluationCriteria(models.Model):
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    max_score = models.IntegerField()

    def __str__(self):
        return f"{self.title} ({self.max_score} marks)"

# actual code for evaluation-module starting with Evaluation 
class Evaluation(models.Model):
    student = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    placement = models.ForeignKey(InternshipPlacement, on_delete=models.CASCADE)
    criteria = models.ForeignKey(EvaluationCriteria, on_delete=models.CASCADE)

    score = models.IntegerField()
    supervisor_comment = models.TextField(blank=True)
    date_evaluated = models.DateField(auto_now_add=True)

    def __str__(self):
        return f"{self.student.username} - {self.criteria.title} ({self.score})"
