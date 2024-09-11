from django.urls import path
from . import views

urlpatterns = [
	#path('<user>', views.GameAllHistory),
	path('send_friend_request', views.send_friend_request),
	path('<user>/friends', views.get_friends)
]