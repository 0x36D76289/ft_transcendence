from django.urls import path
from . import views

urlpatterns = [
	path('get/<user>', views.GetChat),
	path('send', views.SendMessage)
]
