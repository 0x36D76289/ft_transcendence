from chat.models import Message, Conversation, UserBlock
from user.models import User
from chat.serializers import MessageSerializer, ConversationSerializer, ConversationListSerializer
from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes, authentication_classes
from django.shortcuts import get_object_or_404
from django.db.models import Q

@api_view(['POST'])
def start_conversation(request):
	if not request.data.get('username'):
		return Response(
			{'detail': 'username field required'},
			status=status.HTTP_400_BAD_REQUEST
		)
	participant = get_object_or_404(User, username=request.data['username'])
	try:
		conversation = Conversation.objects.get(
			Q(initiator=request.user, receiver=participant) |
			Q(initiator=participant, receiver=request.user)
		)
	except:
		conversation = Conversation.objects.create(
			initiator=request.user,
			receiver=participant
		)
	serializer = ConversationSerializer(conversation)
	return Response(serializer.data)

@api_view(['GET'])
def get_conversation(request, convo_id):
	conversation = get_object_or_404(Conversation, id=convo_id)
	if request.user not in (conversation.initiator, conversation.receiver):
		return Response(
			{'detail': 'You are not in this conversation'},
			status=status.HTTP_403_FORBIDDEN
		)
	return Response(ConversationSerializer(conversation).data)

@api_view(['GET'])
def conversations(request):
	conversations_list = Conversation.objects.filter(
		Q(initiator=request.user) | Q(receiver=request.user)
	)
	serializer = ConversationListSerializer(conversations_list, many=True)
	return Response(serializer.data)

@api_view(['POST'])
def block_user(request):
	logged_user = request.user
	other_user = get_object_or_404(User, username=request.data.get('username'))
	if UserBlock.objects.filter(uid1=logged_user, uid2=other_user).exists():
		return Response(
			{'detail': 'User already blocked'},
			status=status.HTTP_400_BAD_REQUEST
		)
	block = UserBlock(uid1=logged_user, uid2=other_user)
	block.save()
	return Response({'detail': 'User blocked'})

@api_view(['POST'])
def unblock_user(request):
	logged_user = request.user
	other_user = get_object_or_404(User, username=request.data.get('username'))
	try:
		block = UserBlock.objects.get(uid1=logged_user, uid2=other_user)
		block.delete()
		return Response({'detail': 'User unblocked'})
	except:
		return Response(
			{'detail': 'User not blocked'},
			status=status.HTTP_400_BAD_REQUEST
		)

@api_view(['GET'])
def is_user_blocked(request):
	logged_user = request.user
	other_user = get_object_or_404(User, username=request.data.get('username'))
	if UserBlock.objects.filter(uid1=logged_user, uid2=other_user).exists():
		return Response({'detail': True})
	return Response({'detail': False})


#DEBUG
from rest_framework import serializers
from rest_framework import generics

class MessageSerializerDebug(serializers.ModelSerializer):
	class Meta:
		model = Message
		fields = ['sender', 'receiver', 'content', 'time_created']

class MessageList(generics.ListCreateAPIView):
	queryset = Message.objects.all()
	serializer_class = MessageSerializerDebug