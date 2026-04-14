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

#stub for Weekly-logs

#actual code for evaluation-module
