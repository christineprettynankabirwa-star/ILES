class EvaluationScore(models.Model):
    evaluation = models.ForeignKey(Evaluation, on_delete=models.CASCADE)
    criteria = models.ForeignKey(EvaluationCriteria, on_delete=models.CASCADE)
    score = models.IntegerField()  # e.g. 1–5
    comment = models.TextField(blank=True)

    def __str__(self):
        return f"{self.criteria.name} - {self.score}"

