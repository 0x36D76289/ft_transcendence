from django.db import models
from django.contrib.auth.models import User

class Game(models.Model):
	p1 = models.ForeignKey(User, on_delete=models.CASCADE, related_name='p1')
	p2 = models.ForeignKey(User, on_delete=models.CASCADE, related_name='p2')
	p1_score = models.PositiveSmallIntegerField()
	p2_score = models.PositiveSmallIntegerField()
	time_start = models.DateTimeField()
	time_end = models.DateTimeField()
