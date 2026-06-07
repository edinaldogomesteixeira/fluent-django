import re

from apps.vocabulary.models import VocabularyWord, SubtitleWord

from apps.subtitles.models import SubtitleSegment
from apps.vocabulary.services.vocabulary_ipa_service import generate_ipa
from apps.vocabulary.services.vocabulary_frequency_service import update_frequency_rank


WORD_PATTERN = re.compile(r"[a-zA-Z']+")


def normalize_word(word):

    return word.lower().strip()


def import_vocabulary(video):

    language = video.language

    total_words = 0

    SubtitleWord.objects.filter(segment__video=video).delete()

    segments = SubtitleSegment.objects.filter(video=video)

    for segment in segments:

        words = WORD_PATTERN.findall(segment.text)

        position = 1

        for word in words:

            normalized = normalize_word(word)

            if not normalized:

                continue

            vocabulary_word, created = VocabularyWord.objects.get_or_create(
                language=language,
                normalized_word=normalized,
                defaults={
                    "word": word,
                    "ipa": generate_ipa(word),
                },
            )

            if not vocabulary_word.ipa:

                vocabulary_word.ipa = generate_ipa(vocabulary_word.word)

                vocabulary_word.save(update_fields=["ipa"])

            SubtitleWord.objects.create(
                segment=segment,
                vocabulary_word=vocabulary_word,
                original_word=word,
                position=position,
            )

            total_words += 1

            position += 1

    video.words = total_words

    video.save()

    update_frequency_rank()

    return total_words



