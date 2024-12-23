from chat.models import Message, Conversation, UserBlock
from user.models import User
from chat.serializers import (
    MessageSerializer,
    ConversationSerializer,
    ConversationListSerializer,
)
from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.decorators import (
    api_view,
    permission_classes,
    authentication_classes,
)
from django.shortcuts import get_object_or_404
from django.db.models import Q, Count
from sys import stderr


@api_view(["POST"])
def start_conversation(request):
    if not request.data.get("username"):
        return Response(
            {"detail": "username field required"}, status=status.HTTP_400_BAD_REQUEST
        )
    other_user = get_object_or_404(User, username=request.data["username"])
    conversation = (
        Conversation.objects.annotate(n_users=Count("participants"))
        .filter(n_users=2)
        .filter(participants=request.user)
        .filter(participants=other_user)
    )
    if conversation.exists():
        conversation = conversation[0]
    else:
        conversation = Conversation()
        conversation.save()
        conversation.participants.add(request.user, other_user)
    serializer = ConversationSerializer(conversation)
    return Response(serializer.data)


@api_view(["GET"])
def get_conversation(request, convo_id):
    conversation = get_object_or_404(Conversation, id=convo_id)
    if request.user not in conversation.participants.all():
        return Response(
            {"detail": "You are not in this conversation"},
            status=status.HTTP_403_FORBIDDEN,
        )
    if conversation.participants.all().count() == 2:
        other_p = conversation.participants.exclude(id=request.user.id)[0]
        if UserBlock.objects.filter(uid1=request.user, uid2=other_p).exists():
            return Response(
                {"detail": "You blocked this user"},
                status=status.HTTP_403_FORBIDDEN
			)
    return Response(ConversationSerializer(conversation).data)


@api_view(["GET"])
def conversations(request):
    conversations_list = Conversation.objects.filter(participants=request.user)
    serializer = ConversationListSerializer(
        conversations_list, many=True, context={"current_user": request.user}
    )
    return Response(serializer.data)


@api_view(["POST"])
def block_user(request):
    logged_user = request.user
    other_user = get_object_or_404(User, username=request.data.get("username"))
    if UserBlock.objects.filter(uid1=logged_user, uid2=other_user).exists():
        return Response(
            {"detail": "User already blocked"}, status=status.HTTP_400_BAD_REQUEST
        )
    block = UserBlock(uid1=logged_user, uid2=other_user)
    block.save()
    return Response({"detail": "User blocked"})


@api_view(["POST"])
def unblock_user(request):
    logged_user = request.user
    other_user = get_object_or_404(User, username=request.data.get("username"))
    try:
        block = UserBlock.objects.get(uid1=logged_user, uid2=other_user)
        block.delete()
        return Response({"detail": "User unblocked"})
    except:
        return Response(
            {"detail": "User not blocked"}, status=status.HTTP_400_BAD_REQUEST
        )


@api_view(["POST"])
def is_user_blocked(request):
    logged_user = request.user
    other_user = get_object_or_404(User, username=request.data.get("username"))
    if UserBlock.objects.filter(uid1=logged_user, uid2=other_user).exists():
        return Response({"detail": True})
    return Response({"detail": False})
