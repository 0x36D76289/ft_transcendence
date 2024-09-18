from django.urls import path
from . import views

urlpatterns = [
	path('get/<user>', views.get_chat),
	path('send', views.send_message),
	path('block', views.block_user),
	path('unblock', views.unblock_user),
	path('is_user_blocked', views.is_user_blocked),
	path('', views.MessageList.as_view())
]
