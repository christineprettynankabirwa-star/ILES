from django.contrib.auth.models import User
from django.db import models

# Create your models here.
# Extend user roles
class Profile(models.Model):
    ROLE_CHOICES = (
        ('student', 'Student'),
        ('supervisor', 'Supervisor'),
    )

    user = models.OneToOneField(User, on_delete=models.CASCADE)
    role = models.CharField(max_length=20, choices=ROLE_CHOICES)

    def __str__(self):
        return self.user.username
#  Evaluation Criteria (Reusable)
class EvaluationCriteria(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField()

    def __str__(self):
        return self.name
    # 🔹 Evaluation per student (summary)
class Evaluation(models.Model):
    student = models.ForeignKey(User, on_delete=models.CASCADE)
    supervisor = models.ForeignKey(User, on_delete=models.CASCADE, related_name='supervisor')
    date = models.DateField(auto_now_add=True)
    general_feedback = models.TextField()

    def __str__(self):
        return f"{self.student.username} evaluation"
# 🔹 Score per criteria
class EvaluationScore(models.Model):
    evaluation = models.ForeignKey(Evaluation, on_delete=models.CASCADE)
    criteria = models.ForeignKey(EvaluationCriteria, on_delete=models.CASCADE)
    score = models.IntegerField()  # e.g. 1–5
    comment = models.TextField(blank=True)

    def __str__(self):
        return f"{self.criteria.name} - {self.score}"
#SUGGESTED CRITERIA
#CRITERIA    	                         DESCRIPTION	                                             SCORE RANGE
#Attendance	             Comes to work regularly and on time	                                       1–5
#Communication   	Clear communication with team                                                      1–5
#Technical Skills	             Ability to perform assigned tasks	                                   1–5
#Teamwork	             Works well with others	                                                       1–5
#Initiative	            Takes responsibility and shows effort	                                       1–5
#Professionalism  	Behavior, ethics, attitude	                                                       1–5

# 5. SCORING GUIDE
#Use a consistent scale:
#SCORE	                                     MEANING
#5	                                        Excellent
#4	                                         Good
#3	                                        Average
#2	                                       Below Average
#1	                                            Poor
