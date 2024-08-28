from chat.models import Message
from django.contrib.auth.models import User
from chat.serializers import MessageSerializer
from rest_framework import generics
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes, authentication_classes
from rest_framework.authentication import SessionAuthentication, TokenAuthentication
from rest_framework.permissions import IsAuthenticated

class MessageList(generics.ListCreateAPIView):
	queryset = Message.objects.all()
	serializer_class = MessageSerializer

class MessageDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = Message.objects.all()
    serializer_class = MessageSerializer

@api_view(['GET'])
@authentication_classes([SessionAuthentication, TokenAuthentication])
@permission_classes([IsAuthenticated])
def GetChat(request, user):
    logged_user = request.user.id
    other_user = User.objects.get(username=user).id
    chat = Message.objects.filter(sender=logged_user, receiver=other_user) | Message.objects.filter(sender=other_user, receiver=logged_user)
    serializer = MessageSerializer(chat, many=True)
    return Response(serializer.data)