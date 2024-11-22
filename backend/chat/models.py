from django.db import models
from user.models import User

class Conversation(models.Model):
	participants = models.ManyToManyField(User)
	start_time = models.DateTimeField(auto_now_add=True)

class Message(models.Model):
	sender = models.ForeignKey(User, on_delete=models.CASCADE, related_name='message_sender')
	content = models.TextField(max_length=300)
	conversation_id = models.ForeignKey(Conversation, on_delete=models.CASCADE, related_name='message_set')
	time_created = models.DateTimeField(auto_now_add=True)

	class Meta:
		ordering = ('-time_created',)

class UserBlock(models.Model):
	uid1 = models.ForeignKey(User, on_delete=models.CASCADE, related_name='user_block_uid1');
	uid2 = models.ForeignKey(User, on_delete=models.CASCADE, related_name='user_block_uid2');