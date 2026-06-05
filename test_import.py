import os
import django

os.environ.setdefault(
    "DJANGO_SETTINGS_MODULE",
    "config.settings"
)

django.setup()
from apps.users.models import Language
from apps.videos.services.video_import_service import (
    import_youtube_to_bunny
)

language = Language.objects.first()

video = import_youtube_to_bunny(

    "https://www.youtube.com/watch?v=QQK7rgM3Mhk",

    language

)

print(video.id)

print(video.title)