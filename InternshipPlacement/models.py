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
    
# campanies database table
class company(models.Model):
    name = models.CharField(max_length=100)
    contact_email = models.EmailField(unique=True)
    phone = models.CharField(max_length=15) 
    industry  = models.CharField(max_length=100)

    def __str__(self):
        return self.name
    
# internships database table
class internship(models.Model):
    title = models.CharField(max_length=100)
    description = models.TextField()
    company = models.ForeignKey(company, on_delete=models.CASCADE)
    location = models.CharField(max_length=100)
    duration = models.CharField(max_length=50)
    start_date = models.DateField()
    end_date = models.DateField()
    status = models.CharField(max_length=20,
    )

    def __str__(self):
        return self.title
