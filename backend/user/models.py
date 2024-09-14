from django.db import models
from django.contrib.auth.models import AbstractBaseUser

class User(AbstractBaseUser):
	username = models.CharField(max_length=20, unique=True)
	bio = models.CharField(max_length=100)
	date_joined = models.DateTimeField(auto_now_add=True)
	is_online = models.BooleanField(default=False)
	last_online = models.DateTimeField()

	USERNAME_FIELD = "username"

class UserFriend(models.Model):
	class Meta:
		constraints = [
			models.CheckConstraint(
				name="uid1_less_than_uid2",
				condition=models.Q(uid1__lt=models.F("uid2"))
			)
		]

	REQ_UID1 = "rq1"
	REQ_UID2 = "rq2"
	FRIEND = "fri"
	STATUS_CHOICES = {
		REQ_UID1: "UID_1 is making a friend request to UID_2",
		REQ_UID2: "UID_2 is making a friend request to UID_1",
		FRIEND: "UID_1 and UID_2 are friends"
	}

	uid1 = models.ForeignKey(User, on_delete=models.CASCADE, related_name='user_friend_uid1');
	uid2 = models.ForeignKey(User, on_delete=models.CASCADE, related_name='user_friend_uid2');
	status = models.CharField(max_length=3, choices=STATUS_CHOICES)
