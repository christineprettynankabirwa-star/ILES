from django.db import models

# students database table
class Student(models.Model):
    name = models.CharField(max_length=100)
    email = models.EmailField(unique=True)
    phone_number = models.CharField(max_length=15)
    course = models.CharField(max_length=100)
    year_of_study = models.IntegerField()

    def __str__(self):
        return self.name
    
# companies database table
class Company(models.Model):
    name = models.CharField(max_length=100)
    contact_email = models.EmailField(unique=True)
    phone_number = models.CharField(max_length=15)
    industry = models.CharField(max_length=100)

    def __str__(self):
        return self.name
    
    # placements database table
class Placement(models.Model):
    student = models.ForeignKey(Student, on_delete=models.CASCADE)
    company = models.ForeignKey(Company, on_delete=models.CASCADE)
    position = models.CharField(max_length=100)
    strart_date = models.DateField()
    end_date = models.DateField()
    status = models.CharField(max_length=20, choices=[
                                                         ('pending', 'Placed'), 
                                                         ('pending', 'Pending'), 
                                                         ('rejected', 'Rejected')
                                                         ]
    )

    def __str__(self):
        return f"{self.student.name} placed at {self.company.name} as {self.position}"
