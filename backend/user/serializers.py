from rest_framework import serializers
from user.models import User, UserFriend

class UserSerializer(serializers.ModelSerializer):
	class Meta(object):
		model = User
		fields = ['id', 'username', 'bio', 'pfp', 'date_joined', 'is_online', 'last_login']

	def create(self, validated_data):
		if not validated_data.get('password'):
			raise serializers.ValidationError('Must include a password')
		user = User.objects.create(**validated_data)
		user.set_password(validated_data['password'])
		user.save()
		return user

	def update(self, instance, validated_data):
		instance.username = validated_data.get('username', instance.username)
		instance.bio = validated_data.get('bio', instance.bio)
		instance.pfp = validated_data.get('pfp', instance.pfp)
		instance.save()
		return instance

class UserFriendSerializer(serializers.ModelSerializer):
	uid1 = UserSerializer()
	uid2 = UserSerializer()

	class Meta(object):
		model = UserFriend
		fields = ['uid1', 'uid2', 'status']