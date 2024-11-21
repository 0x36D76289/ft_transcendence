from django.urls import path
from . import views

urlpatterns = [
	path('<int:convo_id>', views.get_conversation),
	path('start', views.start_conversation),
	path('block', views.block_user),
	path('unblock', views.unblock_user),
	path('is_user_blocked', views.is_user_blocked),
	path('conversations', views.conversations)
	#path('', views.MessageList.as_view())
]
