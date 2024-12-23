from django.contrib import admin
from django.urls import path, include
from ft_transcendence import views, settings

urlpatterns = [
    path('admin', admin.site.urls),
	path('user/', include('user.urls')),
	path('chat/', include('chat.urls')),
	path('pong/', include('pong.urls')),
]

if settings.DEBUG:
	urlpatterns += path('debug/test_data', views.create_test_data)