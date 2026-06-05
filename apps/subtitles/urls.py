from django.urls import path

from .views import video_subtitles


urlpatterns = [

    path(

        'api/videos/<int:video_id>/subtitles/',

        video_subtitles
    ),
]