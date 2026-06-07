import eng_to_ipa as ipa

from django.db.models import Q

from apps.vocabulary.models import VocabularyWord


def generate_ipa(word):

    try:

        result = ipa.convert(word)

        return result.strip()

    except Exception:

        return ""


def update_missing_ipa():

    words = VocabularyWord.objects.filter(Q(ipa__isnull=True) | Q(ipa="")).iterator()

    total = 0

    for word in words:

        word.ipa = generate_ipa(word.word)

        word.save(update_fields=["ipa"])

        total += 1

    return total
