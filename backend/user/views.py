from rest_framework.decorators import api_view, permission_classes, authentication_classes
from rest_framework.response import Response
from .serializers import UserSerializer, UserFriendSerializer
from rest_framework import status
from rest_framework.authtoken.models import Token
from django.contrib.auth.models import User
from .models import UserFriend
from django.contrib.auth import authenticate
from django.shortcuts import get_object_or_404
from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated
from django.db.models import Q

# USER
@api_view(['POST'])
def login(request):
	user = authenticate(username=request.data.get('username'), password=request.data.get('password'))
	if not user:
		return Response({'success': False, 'detail': 'Not found.'}, status=status.HTTP_404_NOT_FOUND)
	token, created = Token.objects.get_or_create(user=user)
	return Response({'success': True, 'token': token.key, 'username': user.username})

@api_view(['POST'])
def register(request):
	serializer = UserSerializer(data=request.data)
	if not serializer.is_valid():
		return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
	serializer.save()
	user = User.objects.get(username=request.data['username'])
	user.set_password(request.data['password'])
	user.save()
	token = Token.objects.create(user=user)
	return Response({'success': True, 'token': token.key, 'username': user.username})

@api_view(['POST'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def logout(request):
	token = Token.objects.get(user=request.user)
	token.delete()
	return(Response({'success': True, 'detail': 'Logged out!'}, status=status.HTTP_200_OK))

# USER_FRIEND
@api_view(['GET'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def get_friends(request, user):
	if user != request.user.username:
		return Response({'success': False, 'detail': 'You can\'t see someone else friends'}, status=status.HTTP_400_BAD_REQUEST)
	friends = UserFriend.objects.filter(Q(uid1=request.user.id, status=UserFriend.FRIEND) | Q(uid2=request.user.id, status=UserFriend.FRIEND))
	serializer = UserFriendSerializer(friends, many=True)
	return Response(serializer.data)

@api_view(['POST'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def send_friend_request(request):
	logged_user = request.user
	other_user = get_object_or_404(User, username=request.data['username'])
	if logged_user == other_user:
		return Response({'success': False, 'detail': 'Cannot be friend with yourself'}, status=status.HTTP_400_BAD_REQUEST)
	user1 = logged_user if logged_user.id < other_user.id else other_user
	user2 = other_user if logged_user.id < other_user.id else logged_user
	try:
		friendship = UserFriend.objects.get(uid1=user1.id, uid2=user2.id)
	except:
		friendship = None

	if friendship != None:
		if friendship.status == UserFriend.FRIEND:
			return Response({'success': False, 'detail': 'Already friends'}, status=status.HTTP_400_BAD_REQUEST)
		if (friendship.status == UserFriend.REQ_UID1 and user1.id == logged_user.id)\
		or (friendship.status == UserFriend.REQ_UID2 and user2.id == logged_user.id):
			return Response({'success': False, 'detail': 'Already sent request to this user'}, status=status.HTTP_400_BAD_REQUEST)
		friendship.status = UserFriend.FRIEND
		friendship.save()
		return Response({'success': True, 'detail': 'You are now friends'}, status=status.HTTP_200_OK)
	stat = UserFriend.REQ_UID1 if user1.id == logged_user.id else UserFriend.REQ_UID2
	friendship = UserFriend(uid1=user1, uid2=user2, status=stat)
	friendship.save()
	return Response({'success': True, 'detail': 'Sent friend request'}, status=status.HTTP_200_OK)