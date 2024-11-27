from rest_framework import generics, status
from rest_framework.decorators import api_view, permission_classes, authentication_classes
from rest_framework.response import Response
from user.models import User, UserFriend
from user.serializers import UserSerializer
from chat.models import Conversation, Message
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

def create_conv(*users):
	conv = Conversation()
	conv.save()
	conv.participants.add(*users)
	print(f"created conversation with {users}", file=stderr)
	return conv

def create_message(sender, conversation, message):
	message = Message(sender=sender, conversation_id=conversation, content=message)
	message.save()
	print(f"created message from '{sender.username}' in conversation {conversation.participants.all()}", file=stderr)

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

	conv_samy_celeste = create_conv(samy, celeste)
	conv_celeste_milan = create_conv(celeste, milan)
	conv_loic_raphael = create_conv(loic, raphael)
	conv_celeste_ven = create_conv(celeste, ven)
	conv_all = create_conv(samy, celeste, milan, ven, loic, raphael)

	create_message(samy, conv_samy_celeste, 'salutt !')
	create_message(celeste, conv_samy_celeste, 'yooo')
	create_message(celeste, conv_samy_celeste, 'comment ca va?')
	create_message(samy, conv_samy_celeste, 'ca va ca va on est la quoi')
	create_message(celeste, conv_samy_celeste, 'euh ratio')
	create_message(samy, conv_samy_celeste, 'wtfff euhhh counter ratio lol xDDDD')
	create_message(celeste, conv_samy_celeste, 'hahaha bakayaro')
	create_message(samy, conv_samy_celeste, ':(')

	create_message(celeste, conv_celeste_milan, 'yoo ca avance sur le jeu??')
	create_message(celeste, conv_celeste_milan, 'yoo ca avance sur le jeu??')
	create_message(celeste, conv_celeste_milan, 'yoo ca avance sur le jeu??')
	create_message(celeste, conv_celeste_milan, 'yoo ca avance sur le jeu??')
	create_message(celeste, conv_celeste_milan, 'yoo ca avance sur le jeu??')
	create_message(milan, conv_celeste_milan, 'yooo ouais je push ca demain tqt!')
	create_message(celeste, conv_celeste_milan, 'ouais c\'est ca ouais')

	create_message(loic, conv_loic_raphael, 'mahjong soul?')
	create_message(raphael, conv_loic_raphael, 'vas y hihi')
	create_message(loic, conv_loic_raphael, 'ouaisss j\'ai fait un Chuuren poutou')
	create_message(raphael, conv_loic_raphael, 'menfou')
	create_message(loic, conv_loic_raphael, 'ok pas lu')

	create_message(celeste, conv_celeste_ven, 'yoo ca avance sur le jeu??')

	create_message(celeste, conv_all, 'yo bk ce soir les gars????')
	create_message(loic, conv_all, 'ahhh etoo je viens d\'en prendre un il y a 1 seconde')
	create_message(raphael, conv_all, 'ftg loic')
	create_message(samy, conv_all, '+1')
	create_message(loic, conv_all, '*envoie un gif nul*')
	create_message(milan, conv_all, 'qui joue a rivals 2 ce soir?')
	create_message(samy, conv_all, 'chaudd')

	return Response({'detail': 'success'})