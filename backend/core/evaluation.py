# Evaluation
class Evaluation(models.Model):
    log = models.OneToOneField(Log, on_delete=models.CASCADE)
    supervisor = models.ForeignKey(User, on_delete=models.CASCADE)
    score = models.IntegerField()
    feedback = models.TextField()

    def __str__(self):
        return f"Evaluation for {self.log}"

