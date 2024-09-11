from django.contrib import admin
from django.urls import path, include
from user import views

urlpatterns = [
    path('admin', admin.site.urls),
	path('login', views.login),
	path('register', views.register),
	path('logout', views.logout),
	path('user/', include('user.urls')),
	path('game/', include('game.urls')),
	path('chat/', include('chat.urls'))
]
