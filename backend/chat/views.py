from chat.models import Message
from django.contrib.auth.models import User
from chat.serializers import MessageSerializer
from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes, authentication_classes
from rest_framework.authentication import SessionAuthentication, TokenAuthentication
from rest_framework.permissions import IsAuthenticated
from django.shortcuts import get_object_or_404

@api_view(['GET'])
@authentication_classes([SessionAuthentication, TokenAuthentication])
@permission_classes([IsAuthenticated])
def GetChat(request, user):
    logged_user = request.user.id
    other_user = User.objects.get(username=user).id
    chat = Message.objects.filter(sender=logged_user, receiver=other_user) | Message.objects.filter(sender=other_user, receiver=logged_user)
    serializer = MessageSerializer(chat, many=True)
    return Response(serializer.data)

@api_view(['POST'])
@authentication_classes([SessionAuthentication, TokenAuthentication])
@permission_classes([IsAuthenticated])
def SendMessage(request):
	sender = request.user
	receiver = get_object_or_404(User, username=request.data['username'])
	if (request.data['message'] != ""):
		message = Message(sender=sender, receiver=receiver, content=request.data['message'])
		message.save()
		return Response(status=status.HTTP_201_CREATED)
	return Response(status=status.HTTP_400_BAD_REQUEST)
