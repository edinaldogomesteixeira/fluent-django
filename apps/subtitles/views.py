from django.http import JsonResponse

from apps.subtitles.models import SubtitleSegment
from apps.subtitles.services.subtitle_translation_service import (
    get_translation,
)


def video_subtitles(request, video_id):

    subtitles = SubtitleSegment.objects.filter(video_id=video_id)

    target_language = request.user.profile.language_native

    data = []

    for subtitle in subtitles:

        translated_text = get_translation(
            subtitle,
            target_language,
        )

        data.append(
            {
                "start": subtitle.start_seconds,
                "end": subtitle.end_seconds,
                "text": subtitle.text,
                "translated_text": translated_text,
                "ipa": subtitle.ipa,
            }
        )

    return JsonResponse(
        data,
        safe=False,
    )
