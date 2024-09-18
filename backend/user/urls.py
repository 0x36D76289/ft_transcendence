from django.urls import path
from user import views

urlpatterns = [
	path('login', views.login),
	path('register', views.register),
	path('logout', views.logout),
	path('update_user', views.update_user),
	path('send_friend_request', views.send_friend_request),
	path('remove_friend_request', views.remove_friend_request),
	path('get_friendship', views.get_friendship),
	path('get_friends', views.get_friends),
	path('profile/<username>', views.get_profile),
	path('stats/<username>', views.get_stats)
]