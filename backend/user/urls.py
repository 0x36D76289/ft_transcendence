from django.urls import path
from user import views

urlpatterns = [
	path('login', views.login),
	path('register', views.register),
	path('logout', views.logout),
	path('is_token_valid', views.is_token_valid),
	path('update_user', views.update_user),
	path('delete_user', views.delete_user),
	path('create_guest', views.create_guest),
	path('profile/<username>', views.get_profile),
	path('stats/<username>', views.get_stats),
	path('send_friend_request', views.send_friend_request),
	path('remove_friend_request', views.remove_friend_request),
	path('get_friendship', views.get_friendship),
	path('get_friends', views.get_friends),
	path('list', views.list_users)
]