from rest_framework.decorators import api_view, permission_classes, authentication_classes
from rest_framework.response import Response
from .serializers import UserSerializer
from rest_framework import status
from rest_framework.authtoken.models import Token
from django.contrib.auth.models import User
from django.contrib.auth import authenticate
from django.shortcuts import get_object_or_404
from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated


@api_view(['POST'])
def login(request):
	user = authenticate(username=request.data.get('username'), password=request.data.get('password'))
	if not user:
		return Response({'success': False, 'detail': 'Not found.'}, status=status.HTTP_404_NOT_FOUND)
	token, created = Token.objects.get_or_create(user=user)
	return Response({'success': True, 'token': token.key, 'username': user.username})

@api_view(['POST'])
def register(request):
	serializer = UserSerializer(data=request.data)
	if not serializer.is_valid():
		return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
	serializer.save()
	user = User.objects.get(username=request.data['username'])
	user.set_password(request.data['password'])
	user.save()
	token = Token.objects.create(user=user)
	return Response({'success': True, 'token': token.key, 'user': user.username})

@api_view(['POST'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def logout(request):
	token = Token.objects.get(user=request.user)
	token.delete()
	return(Response({'success': True, 'detail': 'Logged out!'}, status=status.HTTP_200_OK))
