import os
import django

os.environ.setdefault(
    "DJANGO_SETTINGS_MODULE",
    "config.settings"
)

django.setup()

from apps.videos.models import Video

from apps.subtitles.services.subtitle_import_service import (
    import_subtitles
)

video = Video.objects.last()

count = import_subtitles(

    video,

    "media/subtitles/jvBkSC5PfRY.en.vtt"

)

print(
    f"{count} subtitles imported"
)