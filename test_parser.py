from apps.subtitles.services.vtt_parser import (
    parse_vtt
)

subs = parse_vtt(

    "media/subtitles/jvBkSC5PfRY.en.vtt"

)

print(

    len(subs)

)

print(

    subs[0]

)