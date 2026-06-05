from apps.subtitles.services.youtube_subtitle_service import (
    download_subtitles
)

path = download_subtitles(

    "https://youtu.be/jvBkSC5PfRY?si=FTD21yWn-1Zc2e2-"

)

print(path)