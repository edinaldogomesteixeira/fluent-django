from deep_translator import GoogleTranslator

from apps.subtitles.models import SubtitleTranslation


def get_translation(
    segment,
    target_language,
):

    existing = SubtitleTranslation.objects.filter(
        segment=segment,
        language=target_language,
    ).first()

    if existing:

        return existing.translated_text

    source_language = segment.video.language

    if not source_language or not source_language.translation_code:
        return ""

    if not target_language or not target_language.translation_code:
        return ""

    translation = GoogleTranslator(
        source=source_language.translation_code,
        target=target_language.translation_code,
    ).translate(segment.text)

    obj, created = SubtitleTranslation.objects.get_or_create(
        segment=segment,
        language=target_language,
        defaults={
            "translated_text": translation,
        },
    )

    return obj.translated_text
