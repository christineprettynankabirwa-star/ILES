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

    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('approved', 'Approved'),
        ('rejected', 'Rejected'),
    ]


#link to the students 
    student = models.ForeignKey(
        'CustomUser',
        on_delete=models.CASCADE,
        related_name='student_placements',
        limit_choices_to={'role': 'student'},
    )
    
    #student details
    registration_number = models.CharField(max_length=20, unique=True, null=True, blank=True)
    course = models.CharField(max_length=100)
    year_of_study = models.IntegerField()

#academic supervisor details
    academic_supervisor = models.ForeignKey(
        CustomUser,
        on_delete=models.SET_NULL,
        null=True,
        related_name='academic_supervisor_placements',
        limit_choices_to={'role': 'acad_supervisor'},
    )

    academic_supervisor_name = models.CharField(max_length=255, blank=True, null=True)
    academic_supervisor_contact = models.CharField(max_length=15, blank=True, null=True)
    academic_supervisor_email = models.EmailField(blank=True, null=True)

    #workplace details
    organization_name = models.CharField(max_length=255)
    workplace_supervisor_name = models.CharField(max_length=255)
    workplace_supervisor_contact = models.CharField(max_length=15, blank=True, null=True)
    workplace_supervisor_email = models.EmailField(blank=True, null=True)

    #duration 
    created_at = models.DateTimeField(auto_now_add=True)
    start_date = models.DateField()
    end_date = models.DateField()

    #status
    is_active = models.BooleanField(default=True)
    

    def __str__(self):
        return f"{self.student.username} - {self.organization_name}"
    
    from django.db import models

class WeeklyLog(models.model):
    # ForeignKeys link your model to the work your team already did
    placement = models.ForeignKey('InternshipPlacement', on_delete=models.CASCADE, related_name='weekly_logs')
    week_number = models.PositiveIntegerField()
    activities = models.TextField()
    
    # These choices handle the approval workflow required by your lecturer
    STATUS_CHOICES = [
        ('Pending', 'Pending'),
        ('Approved', 'Approved'),
        ('Rejected', 'Rejected'),
    ]
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='Pending')
    
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Week {self.week_number} - {self.placement.student.username}"
