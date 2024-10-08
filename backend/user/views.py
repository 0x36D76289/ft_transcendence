from rest_framework.decorators import api_view, permission_classes, authentication_classes, parser_classes
from rest_framework.response import Response
from user.serializers import UserSerializer, UserFriendSerializer
from rest_framework import status
from rest_framework.authtoken.models import Token
from user.models import User, UserFriend
from django.shortcuts import get_object_or_404
from django.utils.timezone import now
from django.db.models import Q, F
from game.models import Game
from django_otp.plugins.otp_totp.models import TOTPDevice
from qrcode import QRCode
from django_otp import user_has_device
import qrcode

# USER
@api_view(['POST'])
@authentication_classes([])
@permission_classes([])
def login(request):
	try:
		user = User.objects.get(username=request.data.get('username'))
	except:
		user = None
	# if not user or not user.check_password(request.data.get('password')):
		# return Response({'detail': 'Not found.'}, status=status.HTTP_404_NOT_FOUND)
	if user_has_device(user):
		device = user.totpdevice_set.get(confirmed=True)
		if not device.verify_token(request.data.get('password')):
			return Response({'detail': 'Invalid 2FA'}, status=status.HTTP_400_BAD_REQUEST)

	token, created = Token.objects.get_or_create(user=user)
	user.is_online = True
	user.last_login = now()
	user.save()
	return Response({'token': token.key, 'username': user.username, 'detail': 'Successfuly logged in!'})

@api_view(['POST'])
@authentication_classes([])
@permission_classes([])
def register(request):
	if request.data.get('token'):
		try:
			guest = Token.objects.get(key=request.data['token']).user
		except:
			return Response({'detail': 'Token is not valid'}, status=status.HTTP_404_NOT_FOUND)
		if not guest.is_guest:
			return Response({'detail': 'Token corresponds to a non guest user'}, status=status.HTTP_400_BAD_REQUEST)
		serializer = UserSerializer(guest, data=request.data)
	else:
		serializer = UserSerializer(data=request.data)
	if not serializer.is_valid():
		return Response({'detail': f"Errors in field(s): {[k for k in serializer.errors.keys()]}"}, status=status.HTTP_400_BAD_REQUEST)
	user = serializer.save(password=request.data.get('password'))
	
	device = TOTPDevice.objects.create(user=user, confirmed=False)
	uri = device.config_url
	qr_code_img = qrcode.make(uri)
	qr_code_img.save("qr_code.png")
	return Response({'detail': 'Account created', 'username': serializer.data['username'], 'qr_code_uri': uri})

@api_view(['POST'])
def logout(request):
	user = request.user
	token = Token.objects.get(user=user)
	token.delete()
	if user.is_guest:
		user.delete()
		return(Response({'detail': 'Logged out and removed guest account!'}))
	user.is_online = False
	user.save()
	return(Response({'detail': 'Logged out!'}))

@api_view(['POST'])
@authentication_classes([])
@permission_classes([])
def is_token_valid(request):
	if not request.data.get('token'):
		return Response({'detail': 'Missing token argument'}, status=status.HTTP_400_BAD_REQUEST)
	token = get_object_or_404(Token, key=request.data['token'])
	return Response({'username': token.user.username, 'detail': 'Valid token !'})

@api_view(['POST'])
def delete_user(request):
	user = request.user
	user.delete()
	return Response({'detail': 'Account deleted.'})

@api_view(['POST'])
def update_user(request):
	serializer = UserSerializer(request.user, data=request.data, partial=True)
	if not serializer.is_valid():
		return Response({'detail': f"Errors in field(s): {[k for k in serializer.errors.keys()]}"}, status=status.HTTP_400_BAD_REQUEST)
	serializer.save()
	return Response({'detail': 'Successfuly updated user'})

@api_view(['POST'])
@authentication_classes([])
@permission_classes([])
def create_guest(request):
	guest = User.objects.create()
	guest.username = f"guest_{guest.id}"
	guest.is_guest = True
	guest.save()
	token, created = Token.objects.get_or_create(user=guest)
	return Response({'token': token.key, 'username': guest.username, 'detail': 'Successfuly created guest account!'})

@api_view(['GET'])
def get_profile(request, username):
	try:
		user = User.objects.get(username=username)
	except:
		return Response({'detail': 'User not found'}, status=status.HTTP_404_NOT_FOUND)

	serializer = UserSerializer(user)
	return Response(serializer.data)

@api_view(['GET'])
def get_stats(request, username):
	try:
		user = User.objects.get(username=username)
	except:
		return Response({'detail': 'User not found'}, status=status.HTTP_404_NOT_FOUND)

	games_played = Game.objects.filter(Q(p1=user) | Q(p2=user)).count()
	win = Game.objects.filter(Q(p1=user, p1_score__gt=F('p2_score')) | Q(p2=user, p2_score__gt=F('p1_score'))).count()
	lose = games_played - win
	win_rate = (win / (games_played if games_played != 0 else 1)) * 100
	return Response({'games_played': games_played, 'win': win, 'lose': lose, 'win_rate': win_rate})

@api_view(['GET'])
def list_users(request):
	query_set = User.objects.all().order_by('-date_joined')[:20]
	serializer = UserSerializer(query_set, many=True)
	return Response(serializer.data);

# USER_FRIEND
@api_view(['GET'])
def get_friends(request, user):
	if user != request.user.username:
		return Response({'detail': 'You can\'t see someone else friends'}, status=status.HTTP_400_BAD_REQUEST)
	friends = UserFriend.objects.filter(Q(uid1=request.user, status=UserFriend.FRIEND) | Q(uid2=request.user, status=UserFriend.FRIEND))
	serializer = UserFriendSerializer(friends, many=True)
	return Response(serializer.data)

@api_view(['POST'])
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
def remove_friend_request(request):
	logged_user = request.user
	other_user = get_object_or_404(User, username=request.data.get('username'))
	if logged_user == other_user:
		return Response({'detail': 'Cannot be friend with yourself'}, status=status.HTTP_400_BAD_REQUEST)
	user1, user2 = (logged_user, other_user) if logged_user.id < other_user.id else (other_user, logged_user)
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
def get_friendship(request):
	logged_user = request.user
	other_user = get_object_or_404(User, username=request.data.get('username'))
	if logged_user == other_user:
		return Response({'detail': 'Cannot be friend with yourself'}, status=status.HTTP_400_BAD_REQUEST)
	user1, user2 = (logged_user, other_user) if logged_user.id < other_user.id else (other_user, logged_user)
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
