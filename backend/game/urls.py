from django.urls import path
from . import views

urlpatterns = [
	path('history', views.GameAllHistory),
	path('history/<user>', views.GameUserHistory),
	path('', views.GameList.as_view())
]