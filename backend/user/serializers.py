from rest_framework import serializers
from user.models import User, UserFriend
import os
from string import ascii_letters, digits

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
		if instance.is_guest and instance.username != validated_data.get('username', instance.username):
			raise serializers.ValidationError('guest users cannot change their username')
		instance.username = validated_data.get('username', instance.username)
		instance.bio = validated_data.get('bio', instance.bio)
		if validated_data.get('pfp'):
			if (instance.pfp.name != 'pfp/default_pfp.svg'):
				os.remove(instance.pfp.path)
			instance.pfp = validated_data['pfp']
		instance.save()
		return instance
	
	def validate_username(self, username):
		allowed = ascii_letters + digits + "_-"
		for letter in username:
			if letter not in allowed:
				raise serializers.ValidationError('username must contain only letters, digits, _ and -')
		if username.startswith('noob_') or username.startswith('42_'):
			raise serializers.ValidationError('username can not start with noob_ or 42_')
		return username

class UserFriendSerializer(serializers.ModelSerializer):
	uid1 = UserSerializer()
	uid2 = UserSerializer()

	class Meta(object):
		model = UserFriend
		fields = ['uid1', 'uid2', 'status']

class UserFriendListSerializer(serializers.ModelSerializer):
	user = serializers.SerializerMethodField()
	status = serializers.SerializerMethodField()

	class Meta(object):
		model = UserFriend
		fields = ['user', 'status']

	def get_user(self, instance):
		if not self.context.get('current_user'):
			raise serializers.ValidationError('current_user was not passed in context')
		current_user = self.context['current_user']
		if current_user != instance.uid1 and current_user != instance.uid2:
			raise serializers.ValidationError('current_user is not in the UserFriend')
		if current_user != instance.uid1:
			return UserSerializer(instance.uid1).data
		return UserSerializer(instance.uid2).data
	
	def get_status(self, instance):
		if not self.context.get('current_user'):
			raise serializers.ValidationError('current_user was not passed in context')
		current_user = self.context['current_user']
		if current_user != instance.uid1 and current_user != instance.uid2:
			raise serializers.ValidationError('current_user is not in the UserFriend')
		if instance.status == UserFriend.FRIEND:
			return 'friend'
		elif instance.status == UserFriend.REQ_UID1:
			if instance.uid1 == current_user:
				return 'request_sent'
			else:
				return 'request_received'
		else:
			if instance.uid2 == current_user:
				return 'request_sent'
			else:
				return 'request_received'