from rest_framework import generics, status
from rest_framework.decorators import api_view, permission_classes, authentication_classes
from rest_framework.response import Response
from user.models import User, UserFriend
from user.serializers import UserSerializer
from sys import stderr

def create_user(username, password, bio='bio default'):
	data = {'username': username, 'password': password, 'bio': bio}
	user = UserSerializer(data=data)
	if not user.is_valid():
		print('failed to create user', file=stderr)
	else:
		user.save(password=data.get('password'))
		print(f"created user '{data['username']}' with password '{data['password']}'", file=stderr)
		return User.objects.get(username=data['username'])

def make_friendship(user1, user2):
	user1, user2 = (user1, user2) if user1.id < user2.id else (user2, user1)
	friendship = UserFriend(uid1=user1, uid2=user2, status=UserFriend.FRIEND)
	friendship.save()
	print(f"'{user1.username}' is now friend with '{user2.username}'", file=stderr)

@api_view(['POST'])
@authentication_classes([])
@permission_classes([])
def create_test_data(request):
	samy = create_user('samy', 'a', 'salutt')
	celeste = create_user('celeste', 'a', 'uwu')
	milan = create_user('milan', 'a', 'yoyo')
	ven = create_user('ven', 'a', 'disparu')
	loic = create_user('loic', 'a', 'mahjong :3')
	raphael = create_user('raphael', 'a', 'j\'adore le metallll')

	make_friendship(samy, celeste)
	make_friendship(samy, ven)
	make_friendship(celeste, milan)
	make_friendship(milan, loic)
	make_friendship(raphael, celeste)
	make_friendship(raphael, loic)
	make_friendship(celeste, loic)
	make_friendship(celeste, ven)

	return Response({'detail': 'success'})