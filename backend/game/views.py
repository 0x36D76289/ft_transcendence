from game.models import Game
from game.serializers import GameSerializer
from rest_framework import generics

class GameList(generics.ListCreateAPIView):
	queryset = Game.objects.all()
	serializer_class = GameSerializer

class GameDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = Game.objects.all()
    serializer_class = GameSerializer
