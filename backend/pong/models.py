from django.db import models
from user.models import User

class Game(models.Model):
    p1 = models.ForeignKey(User, on_delete=models.CASCADE, related_name='p1')
    p2 = models.ForeignKey(User, on_delete=models.CASCADE, related_name='p2')
    p1_score = models.PositiveSmallIntegerField()
    p2_score = models.PositiveSmallIntegerField()
    time_start = models.DateTimeField()
    time_end = models.DateTimeField()

    def __repr__(self) -> str:
        return (f"<Game {self.id}: "
                +f"{self.p1.get_username()}:{self.p1_score}"
                + " - "
                + f"{self.p2.get_username()}:{self.p2_score}>")
    def __str__(self) -> str:
        return self.__repr__()[1:-1]
