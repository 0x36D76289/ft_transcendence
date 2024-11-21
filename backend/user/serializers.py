from rest_framework import serializers
from user.models import User, UserFriend

class UserSerializer(serializers.ModelSerializer):
	class Meta(object):
		model = User
		fields = ['id', 'username', 'bio', 'pfp', 'date_joined', 'is_online', 'last_login', 'is_guest']

	def create(self, validated_data):
		if not validated_data.get('password'):
			raise serializers.ValidationError({'detail': 'Must include a password'})
		user = User.objects.create(**validated_data)
		user.set_password(validated_data['password'])
		user.save()
		return user

	def update(self, instance, validated_data):
		if validated_data.get('password'):
			instance.set_password(validated_data['password'])
		instance.username = validated_data.get('username', instance.username)
		instance.bio = validated_data.get('bio', instance.bio)
		instance.pfp = validated_data.get('pfp', instance.pfp)
		instance.save()
		return instance
	
	def validate_username(self, username):
		if username.startswith('noob_') or username.startswith('42_'):
			raise serializers.ValidationError('username can not start with noob_ or 42_.')
		return username

class UserFriendSerializer(serializers.ModelSerializer):
	uid1 = UserSerializer()
	uid2 = UserSerializer()

	class Meta(object):
		model = UserFriend
		fields = ['uid1', 'uid2', 'status']