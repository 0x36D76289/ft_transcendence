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
	other_user = serializers.SerializerMethodField()
	last_message = serializers.SerializerMethodField()

	class Meta:
		model = Conversation
		fields = ['id', 'other_user', 'last_message']

	def get_other_user(self, instance):
		if not self.context.get('current_user'):
			raise serializers.ValidationError('current_user was not passed in context')
		current_user = self.context['current_user']
		if current_user == instance.initiator:
			return UserSerializer(instance.receiver).data
		return UserSerializer(instance.initiator).data

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