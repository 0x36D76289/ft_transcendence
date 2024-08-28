from django.urls import path
from . import views

urlpatterns = [
	path('', views.MessageList.as_view()),
	path('<int:pk>/', views.MessageDetail.as_view()),
	path('get/<user>/', views.GetChat),
	path('send/', views.SendMessage)
]
