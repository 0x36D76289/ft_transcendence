from rest_framework import serializers
from game.models import Game

class GameSerializer(serializers.ModelSerializer):
	class Meta:
		model = Game
		fields = ['p1_id', 'p2_id', 'p1_score', 'p2_score', 'time_start', 'time_end']