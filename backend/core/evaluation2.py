
#  Evaluation per student (summary)
class Evaluation(models.Model):
    student = models.ForeignKey(User, on_delete=models.CASCADE)
    supervisor = models.ForeignKey(User, on_delete=models.CASCADE, related_name='supervisor')
    date = models.DateField(auto_now_add=True)
    general_feedback = models.TextField()

    def __str__(self):
        return f"{self.student.username} evaluation"
