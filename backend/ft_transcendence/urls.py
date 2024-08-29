from django.contrib import admin
from django.urls import path, include
from . import views

urlpatterns = [
    path('admin', admin.site.urls),
	path('login', views.login),
	path('register', views.register),
	path('logout', views.logout),
	path('game/', include('game.urls')),
	path('chat/', include('chat.urls'))
]
