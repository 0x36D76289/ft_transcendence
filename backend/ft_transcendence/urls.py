from django.contrib import admin
from django.urls import path, include
from ft_transcendence import views
urlpatterns = [
    path('admin', admin.site.urls),
	path('user/', include('user.urls')),
	path('chat/', include('chat.urls')),
	path('pong/', include('pong.urls')),
	path('debug/test_data', views.create_test_data)
]
