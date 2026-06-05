import re

from django.core.management.base import BaseCommand

from apps.subtitles.models import (
    SubtitleSegment
)

from apps.vocabulary.models import (
    VocabularyWord,
    SubtitleWord
)


class Command(BaseCommand):

    help = 'Import vocabulary from subtitles'

    def handle(self, *args, **kwargs):

        SubtitleWord.objects.all().delete()

        segments = SubtitleSegment.objects.all()

        for segment in segments:

            words = segment.text.split()

            for position, word in enumerate(words):

                normalized = self.normalize_word(word)

                if not normalized:

                    continue

                language = segment.video.language

                vocabulary_word, created = (

                    VocabularyWord.objects.get_or_create(

                        language=language,

                        normalized_word=normalized,

                        defaults={

                            'word': normalized,

                            'language': language
                        }
                    )
                )

                SubtitleWord.objects.create(

                    segment=segment,

                    vocabulary_word=vocabulary_word,

                    original_word=word,

                    position=position
                )

        self.stdout.write(

            self.style.SUCCESS(
                'Vocabulary imported successfully'
            )
        )

    def normalize_word(self, word):

        word = word.lower()

        word = re.sub(
            r'[^\w\s]',
            '',
            word
        )

        return word.strip()