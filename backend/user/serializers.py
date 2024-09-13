from rest_framework import serializers
from user.models import User, UserFriend

class UserSerializer(serializers.ModelSerializer):
	class Meta(object):
		model = User
		fields = ['id', 'username', 'bio', 'date_joined', 'is_online', 'last_online']

class UserFriendSerializer(serializers.ModelSerializer):
	uid1 = UserSerializer()
	uid2 = UserSerializer()

	class Meta(object):
		model = UserFriend
		fields = ['uid1', 'uid2', 'status']