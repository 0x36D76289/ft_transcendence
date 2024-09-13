from rest_framework.decorators import api_view, permission_classes, authentication_classes
from rest_framework.response import Response
from user.serializers import UserSerializer, UserFriendSerializer
from rest_framework import status
from rest_framework.authtoken.models import Token
from user.models import User, UserFriend
from django.contrib.auth import authenticate
from django.shortcuts import get_object_or_404
from django.utils.timezone import now
from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated
from django.db.models import Q

# USER
@api_view(['POST'])
def login(request):
	try:
		user = User.objects.get(username=request.data.get('username'))
	except:
		user = None
	if not user or not user.check_password(request.data.get('password')):
		return Response({'detail': 'Not found.'}, status=status.HTTP_404_NOT_FOUND)
	token, created = Token.objects.get_or_create(user=user)
	user.is_online = True
	user.save()
	return Response({'token': token.key, 'username': user.username})

@api_view(['POST'])
def register(request):
	if not request.data.get('username') or not request.data.get('password'):
		return Response({'detail': 'Missing arguments'}, status=status.HTTP_400_BAD_REQUEST)
	if User.objects.filter(username=request.data.get('username')).exists():
		return Response({'detail': 'A user with this username already exists'}, status=status.HTTP_400_BAD_REQUEST)
	user = User(username=request.data.get('username'))
	user.set_password(request.data['password'])
	user.last_online = now()
	user.save()
	return Response({'detail': 'Account created', 'username': user.username})

@api_view(['POST'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def logout(request):
	user = request.user
	token = Token.objects.get(user=user)
	token.delete()
	user.is_online = False
	user.last_online = now()
	user.save()
	return(Response({'detail': 'Logged out!'}))

@api_view(['GET'])
def get_profile(request, username):
	try:
		user = User.objects.get(username=username)
	except:
		return Response({'detail': 'User not found'}, status=status.HTTP_404_NOT_FOUND)

	serializer = UserSerializer(user)
	return Response(serializer.data)


# USER_FRIEND
@api_view(['GET'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def get_friends(request, user):
	if user != request.user.username:
		return Response({'detail': 'You can\'t see someone else friends'}, status=status.HTTP_400_BAD_REQUEST)
	friends = UserFriend.objects.filter(Q(uid1=request.user, status=UserFriend.FRIEND) | Q(uid2=request.user, status=UserFriend.FRIEND))
	serializer = UserFriendSerializer(friends, many=True)
	return Response(serializer.data)

@api_view(['POST'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def send_friend_request(request):
	logged_user = request.user
	other_user = get_object_or_404(User, username=request.data.get('username'))
	if logged_user == other_user:
		return Response({'detail': 'Cannot be friend with yourself'}, status=status.HTTP_400_BAD_REQUEST)
	user1 = logged_user if logged_user.id < other_user.id else other_user
	user2 = other_user if logged_user.id < other_user.id else logged_user
	try:
		friendship = UserFriend.objects.get(uid1=user1.id, uid2=user2.id)
	except:
		friendship = None

	if friendship != None:
		if friendship.status == UserFriend.FRIEND:
			return Response({'detail': 'Already friends'}, status=status.HTTP_400_BAD_REQUEST)
		if (friendship.status == UserFriend.REQ_UID1 and user1 == logged_user)\
		or (friendship.status == UserFriend.REQ_UID2 and user2 == logged_user):
			return Response({'detail': 'Already sent request to this user'}, status=status.HTTP_400_BAD_REQUEST)
		friendship.status = UserFriend.FRIEND
		friendship.save()
		return Response({'detail': 'You are now friends'})
	stat = UserFriend.REQ_UID1 if user1 == logged_user else UserFriend.REQ_UID2
	friendship = UserFriend(uid1=user1, uid2=user2, status=stat)
	friendship.save()
	return Response({'detail': 'Sent friend request'})

@api_view(['POST'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def remove_friend_request(request):
	logged_user = request.user
	other_user = get_object_or_404(User, username=request.data.get('username'))
	if logged_user == other_user:
		return Response({'detail': 'Cannot be friend with yourself'}, status=status.HTTP_400_BAD_REQUEST)
	user1 = logged_user if logged_user.id < other_user.id else other_user
	user2 = other_user if logged_user.id < other_user.id else logged_user
	try:
		friendship = UserFriend.objects.get(uid1=user1.id, uid2=user2.id)
	except:
		friendship = None

	message = ''
	if friendship != None:
		if friendship.status == UserFriend.FRIEND:
			message = 'You are no longer friends'
		elif (friendship.status == UserFriend.REQ_UID1 and user1 == other_user)\
		or (friendship.status == UserFriend.REQ_UID2 and user2 == other_user):
			message = 'Friend request declined'
		else:
			message = 'Friend request removed'
		friendship.delete()
		return Response({'detail': message})
	return Response({'detail': 'Users are not friends or no request was sent between them'})

@api_view(['GET'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def get_friendship(request):
	logged_user = request.user
	other_user = get_object_or_404(User, username=request.data.get('username'))
	if logged_user == other_user:
		return Response({'detail': 'Cannot be friend with yourself'}, status=status.HTTP_400_BAD_REQUEST)
	user1 = logged_user if logged_user.id < other_user.id else other_user
	user2 = other_user if logged_user.id < other_user.id else logged_user
	try:
		friendship = UserFriend.objects.get(uid1=user1.id, uid2=user2.id)
	except:
		friendship = None
	
	if friendship == None:
		return Response({'status': 'NONE'})
	if friendship.status == UserFriend.FRIEND:
		return Response({'status': 'FRIEND'})
	if (friendship.status == UserFriend.REQ_UID1 and user1 == logged_user)\
	or (friendship.status == UserFriend.REQ_UID2 and user2 == logged_user):
		return Response({'status': 'REQ_SENT'})
	return Response({'status': 'REQ_RECEIVED'})
