from django.db.models import Count

from apps.vocabulary.models import (
    VocabularyWord,
    SubtitleWord,
)


def update_frequency_rank():

    words = (
        SubtitleWord.objects.values("vocabulary_word")
        .annotate(total=Count("id"))
        .order_by("-total")
    )

    rank = 1

    for item in words:

        VocabularyWord.objects.filter(id=item["vocabulary_word"]).update(
            frequency_rank=rank
        )

        rank += 1

    return rank - 1
