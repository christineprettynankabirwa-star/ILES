from django.db import models
from django.core.exceptions import ValidationError
from django.contrib.auth.models import AbstractUser
from django.conf import settings
from django.utils import timezone
from datetime import timedelta


# DEPARTMENT

class Department(models.Model):
    name = models.CharField(max_length=255)
    code = models.CharField(max_length=10, unique=True)

    def __str__(self):
        return self.name


# CUSTOMUSER  

class CustomUser(AbstractUser):
    ROLE_CHOICES = (
        ('student', 'Student'),
        ('work_supervisor', 'Workplace Supervisor'),
        ('acad_supervisor', 'Academic Supervisor'),
        ('admin', 'Admin'),
    )

    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='student')
    student_number = models.CharField(max_length=50, unique=True, blank=True, null=True)
    department = models.ForeignKey(
        'Department', on_delete=models.SET_NULL, null=True, blank=True
    )
    staff_number = models.CharField(max_length=50, unique=True, blank=True, null=True)
    phone_number = models.CharField(max_length=20, blank=True, null=True)

    def __str__(self):
        return f"{self.username} ({self.get_role_display()})"


    @property
    def is_student(self):
        return self.role == 'student'

    @property
    def is_workplace_supervisor(self):
        return self.role == 'work_supervisor'

    @property
    def is_academic_supervisor(self):
        return self.role == 'acad_supervisor'

    @property
    def is_admin_user(self):
        return self.role == 'admin' or self.is_superuser

    class Meta:
        verbose_name = "Custom User"
        verbose_name_plural = "Custom Users"

# INTERNSHIP PLACEMENT 

class InternshipPlacement(models.Model):
    student = models.ForeignKey(
        settings.AUTH_USER_MODEL,        
        related_name='placements',
        on_delete=models.CASCADE,
        limit_choices_to={'role': 'student'}
    )

    academic_supervisor = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        related_name='supervised_placements',
        on_delete=models.SET_NULL,
        null=True, blank=True,
        limit_choices_to={'role': 'acad_supervisor'}
    )

    workplace_supervisor = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        related_name='workplace_placements',
        on_delete=models.SET_NULL,
        null=True, blank=True,
        limit_choices_to={'role': 'work_supervisor'}
    )

    organization_name = models.CharField(max_length=255)
    registration_number = models.CharField(max_length=100)
    position = models.CharField(max_length=255)
    location = models.CharField(max_length=255)
    duration = models.CharField(max_length=100)
    stipend = models.CharField(max_length=100, blank=True)
    description = models.TextField(blank=True)
    course = models.CharField(max_length=255)
    start_date = models.DateField()
    end_date = models.DateField()

    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)


    total_score = models.DecimalField(max_digits=5, decimal_places=2, default=0.00)
    final_grade = models.CharField(max_length=2, blank=True)

    def clean(self):
        if self.start_date and self.end_date:
            if self.start_date >= self.end_date:
                raise ValidationError(
                    {"end_date": "The internship end date must be after the start date."}
                )

            overlapping = InternshipPlacement.objects.filter(
                student=self.student,
                start_date__lt=self.end_date,
                end_date__gt=self.start_date,
            ).exclude(pk=self.pk)

            if overlapping.exists():
                raise ValidationError(
                    "This student already has an internship placement during this period."
                )

    def save(self, *args, **kwargs):
        self.full_clean()
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.student.username} - {self.organization_name}"

# WEEKLY LOG  (Week 6 requirement)

class WeeklyLog(models.Model):
    STATUS_CHOICES = [
        ('draft', 'Draft'),
        ('submitted', 'Submitted'),
        ('reviewed', 'Reviewed'),
        ('approved', 'Approved'),
    ]

    VALID_TRANSITIONS = {
        'draft': ['submitted'],
        'submitted': ['reviewed', 'draft'],  
        'reviewed': ['approved', 'submitted'],
        'approved': [],                    
    }

    placement = models.ForeignKey(
        InternshipPlacement, on_delete=models.CASCADE, related_name='weekly_logs'
    )
    student = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        limit_choices_to={'role': 'student'}
    )
    week_start_date = models.DateField(null=True, blank=True)
    week_number = models.PositiveIntegerField()
    activities = models.TextField()
    challenges = models.TextField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='draft')
    created_at = models.DateTimeField(auto_now_add=True)
    submitted_at = models.DateTimeField(null=True, blank=True)
    supervisor_comments = models.TextField(blank=True)
    reviewed_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True, blank=True,
        related_name='reviewed_logs',
        limit_choices_to={'role': 'work_supervisor'}
    )
    reviewed_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        unique_together = ('placement', 'week_number')

    def __str__(self):
        return f"Week {self.week_number} - {self.student.username} ({self.status})"

    def clean(self):
        # ── Deadline enforcement (Week 6) ──
        if self.week_start_date:
            submission_deadline = self.week_start_date + timedelta(days=7)
            if self.status == 'submitted' and timezone.now().date() > submission_deadline:
                raise ValidationError(
                    f"The submission deadline for Week {self.week_number} has passed "
                    f"({submission_deadline})."
                )
        if self.pk:
            original = WeeklyLog.objects.get(pk=self.pk)
            if original.status == 'approved':
                raise ValidationError(
                    "This log has been approved and can no longer be edited."
                )

            if original.status != self.status:
                allowed = self.VALID_TRANSITIONS.get(original.status, [])
                if self.status not in allowed:
                    raise ValidationError(
                        f"Invalid status transition: '{original.status}' → '{self.status}'."
                    )
    def save(self, *args, **kwargs):
        if self.status == 'submitted' and not self.submitted_at:
            self.submitted_at = timezone.now()
        self.full_clean()
        super().save(*args, **kwargs)

# EVALUATION CRITERIA 
class EvaluationCriteria(models.Model):
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    max_score = models.IntegerField()

    def __str__(self):
        return f"{self.title} - {self.max_score} marks"

# EVALUATION 
class Evaluation(models.Model):
    placement = models.OneToOneField(
        'InternshipPlacement',
        on_delete=models.CASCADE,
        related_name='evaluation_detail'
    )
    academic_supervisor = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        limit_choices_to={'role': 'acad_supervisor'}
    )
    attendance_punctuality = models.PositiveIntegerField(default=0)   
    technical_competence = models.PositiveIntegerField(default=0)     
    quality_of_work = models.PositiveIntegerField(default=0)          

    total_weighted_score = models.FloatField(editable=False, default=0.0)
    supervisor_comments = models.TextField(blank=True)
    date_evaluated = models.DateTimeField(auto_now_add=True)

    def clean(self):
        for field_name, score in [
            ('attendance_punctuality', self.attendance_punctuality),
            ('technical_competence', self.technical_competence),
            ('quality_of_work', self.quality_of_work),
        ]:
            if score < 0 or score > 100:
                raise ValidationError(
                    {field_name: "Score must be between 0 and 100."}
                )

    def save(self, *args, **kwargs):
        self.full_clean()
        self.total_weighted_score = round(
            (self.attendance_punctuality * 0.4) +
            (self.technical_competence * 0.3) +
            (self.quality_of_work * 0.3),
            2
        )
        super().save(*args, **kwargs)
        score = self.total_weighted_score
        if score >= 80:
            grade = 'A'
        elif score >= 70:
            grade = 'B'
        elif score >= 60:
            grade = 'C'
        elif score >= 50:
            grade = 'D'
        else:
            grade = 'F'

        InternshipPlacement.objects.filter(pk=self.placement_id).update(
            total_score=score,
            final_grade=grade,
        )

    def __str__(self):
        return f"Evaluation: {self.placement.student.username} ({self.total_weighted_score})"

# LOG STATUS HISTORY

class LogStatusHistory(models.Model):
    log = models.ForeignKey(WeeklyLog, on_delete=models.CASCADE, related_name='history')
    old_status = models.CharField(max_length=20)
    new_status = models.CharField(max_length=20)
    changed_at = models.DateTimeField(auto_now_add=True)
    changed_by = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True
    )

    def __str__(self):
        return f"{self.log} | {self.old_status} → {self.new_status}"
