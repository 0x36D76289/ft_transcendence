from django.urls import path
from . import views

urlpatterns = [
	path('', views.MessageList.as_view()),
	path('<int:pk>/', views.MessageDetail.as_view()),
	path('<user>/', views.GetChat)
]
