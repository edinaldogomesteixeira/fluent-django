from deep_translator import GoogleTranslator

from apps.vocabulary.models import (
    VocabularyTranslation,
)


def translate_word(
    word,
    source_language,
    target_language,
):

    try:

        return GoogleTranslator(
            source=source_language.translation_code,
            target=target_language.translation_code,
        ).translate(word)

    except Exception:

        return ""


def get_translation(
    vocabulary_word,
    target_language,
):

    existing = VocabularyTranslation.objects.filter(
        vocabulary_word=vocabulary_word,
        language=target_language,
    ).first()

    if existing:

        return existing.translation

    source_language = vocabulary_word.language

    translation = translate_word(
        vocabulary_word.word,
        source_language,
        target_language,
    )

    if not translation:

        return ""

    obj, created = VocabularyTranslation.objects.get_or_create(
        vocabulary_word=vocabulary_word,
        language=target_language,
        defaults={
            "translation": translation,
        },
    )

    return obj.translation
