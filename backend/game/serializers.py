from rest_framework import serializers
from game.models import Game
from user.serializers import UserSerializer

class GameSerializer(serializers.ModelSerializer):
	class Meta:
		model = Game
		fields = ['p1', 'p2', 'p1_score', 'p2_score', 'time_start', 'time_end']

class GameSerializerUsername(serializers.ModelSerializer):
	p1 = serializers.SlugRelatedField(read_only=True, slug_field='username')
	p2 = serializers.SlugRelatedField(read_only=True, slug_field='username')

	class Meta:
		model = Game
		fields = ['p1', 'p2', 'p1_score', 'p2_score', 'time_start', 'time_end']