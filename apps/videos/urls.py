from django.urls import path

from .views import video_list,category_list
from .views import stream_video
from .views import upload_video
from .views import import_youtube


urlpatterns = [

    path(
        'api/videos/',
        video_list
    ),
    path(
        "api/videos/categories/",
        category_list,
        name="category_list"
    ),
  
    path(

        'stream/<int:video_id>/',

        stream_video,

        name='stream_video'
    ),
    path(
        'api/videos/upload/',
        upload_video,
        name='upload_video'
    ),
    path(

        'api/videos/import-youtube/',

        import_youtube,

        name='import_youtube'

    ),

]