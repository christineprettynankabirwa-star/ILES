class Evaluation(models.Model):
    student = models.ForeignKey(User, on_delete=models.CASCADE)
    supervisor = models.ForeignKey(User, on_delete=models.CASCADE, related_name='supervisor')
    status=models.CharField(max_length=10,choices=STATUS_CHOICES,default='SUBMITTED')
    Created_at = models.DateField(auto_now_add=True)
    Updated_at=models.DateField(auto_now=True)
    general_feedback = models.TextField()
    supervisor_comment=models.TextField(blank=True,null=True)

