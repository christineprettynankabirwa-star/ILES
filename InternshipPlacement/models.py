from django.db import models
# students database table 
class student(models.Model):
    name = models.CharField(max_length=100)
    email = models.EmailField(unique=True)
    phone = models.CharField(max_length=15) 
    course  = models.CharField(max_length=100)
    year_of_study = models.IntegerField()

    def __str__(self):
        return self.name
