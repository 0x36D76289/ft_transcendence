from rest_framework import serializers
from chat.models import Message, Conversation
from user.serializers import UserSerializer

class MessageSerializer(serializers.ModelSerializer):
	sender = serializers.SlugRelatedField(
		read_only=True,
		slug_field='username'
	)

	class Meta:
		model = Message
		exclude = ('conversation_id',)

class ConversationListSerializer(serializers.ModelSerializer):
	initiator = UserSerializer()
	receiver = UserSerializer()
	last_message = serializers.SerializerMethodField()

	class Meta:
		model = Conversation
		fields = ['id', 'initiator', 'receiver', 'last_message']

	def get_last_message(self, instance):
		message = instance.message_set.first()
		return MessageSerializer(instance=message).data
	
class ConversationSerializer(serializers.ModelSerializer):
	initiator = UserSerializer()
	receiver = UserSerializer()
	message_set = MessageSerializer(many=True)

	class Meta:
		model = Conversation
		fields = ['id', 'initiator', 'receiver', 'message_set']