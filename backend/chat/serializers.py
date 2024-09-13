from rest_framework import serializers
from chat.models import Message
from user.serializers import UserSerializer

class MessageSerializer(serializers.ModelSerializer):
	sender = UserSerializer()
	receiver = UserSerializer()

	class Meta:
		model = Message
		fields = ['sender', 'receiver', 'content', 'time_created']