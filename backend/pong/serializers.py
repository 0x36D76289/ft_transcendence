from rest_framework import serializers
from pong.models import Game
from user.serializers import UserSerializer

class GameSerializer(serializers.ModelSerializer):
	class Meta:
		model = Game
		fields = ['p1', 'p2', 'p1_score', 'p2_score', 'time_start', 'time_end']

class GameSerializerUsername(serializers.ModelSerializer):
	p1 = UserSerializer()
	p2 = UserSerializer()

	class Meta:
		model = Game
		fields = ['p1', 'p2', 'p1_score', 'p2_score', 'time_start', 'time_end']