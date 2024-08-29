from game.models import Game
from game.serializers import GameSerializer, GameSerializerUsername
from rest_framework import generics, status
from rest_framework.decorators import api_view, authentication_classes, permission_classes
from rest_framework.response import Response
from django.contrib.auth.models import User

class GameList(generics.ListCreateAPIView):
	queryset = Game.objects.all()
	serializer_class = GameSerializer

class GameDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = Game.objects.all()
    serializer_class = GameSerializer

@api_view(['GET'])
def GameAllHistory(request):
	games = Game.objects.all()
	serializer = GameSerializerUsername(games, many=True)
	return Response(serializer.data)

@api_view(['GET'])
def GameUserHistory(request, user):
	try:
		user = User.objects.get(username=user)
	except:
		return Response({'detail': 'Not found.'}, status=status.HTTP_404_NOT_FOUND)
	games = Game.objects.filter(p1=user.id) | Game.objects.filter(p2=user.id)
	serializer = GameSerializerUsername(games, many=True)
	return Response(serializer.data)