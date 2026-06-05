from django.contrib import admin
from django.urls import path, include


urlpatterns = [

    path('admin/', admin.site.urls),

    path('', include('apps.core.urls')),

    path('', include('apps.videos.urls')),

    path('', include('apps.subtitles.urls')),

    path('', include('apps.vocabulary.urls')),

    path('', include('apps.progress.urls')),

    # USERS
    path('', include('apps.users.urls')),
    

]