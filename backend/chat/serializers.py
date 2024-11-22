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
	participants = serializers.SerializerMethodField()
	last_message = serializers.SerializerMethodField()

	class Meta:
		model = Conversation
		fields = ['id', 'participants', 'last_message']

	def get_participants(self, instance):
		if not self.context.get('current_user'):
			raise serializers.ValidationError('current_user was not passed in context')
		current_user = self.context['current_user']
		users = instance.participants.all().exclude(id=current_user.id)
		return UserSerializer(users, many=True).data

	def get_last_message(self, instance):
		message = instance.message_set.first()
		return MessageSerializer(instance=message).data
	
class ConversationSerializer(serializers.ModelSerializer):
	participants = UserSerializer(many=True)
	message_set = MessageSerializer(many=True)

	class Meta:
		model = Conversation
		fields = ['id', 'participants', 'message_set']