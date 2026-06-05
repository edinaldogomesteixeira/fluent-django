from django.http import JsonResponse

from apps.subtitles.models import (
    SubtitleSegment
)


def video_subtitles(
    request,
    video_id
):

    subtitles = SubtitleSegment.objects.filter(
        video_id=video_id
    )

    data = []

    for subtitle in subtitles:

        data.append({

            'start':
                subtitle.start_seconds,

            'end':
                subtitle.end_seconds,

            'text':
                subtitle.text,

            'translated_text':
                subtitle.translated_text,

            'ipa':
                subtitle.ipa,
        })

    return JsonResponse(
        data,
        safe=False
    )