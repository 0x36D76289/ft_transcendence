from rest_framework import serializers
from django.contrib.auth.models import User
from .models import UserFriend

class UserSerializer(serializers.ModelSerializer):
	class Meta(object):
		model = User
		fields = ['id', 'username', 'password']

class UserFriendSerializer(serializers.ModelSerializer):
	class Meta(object):
		model = UserFriend
		fields = ['uid1', 'uid2', 'status']
