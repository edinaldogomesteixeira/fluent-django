import json
from django.views.decorators.csrf import csrf_exempt

from django.contrib.auth.decorators import login_required
from django.http import JsonResponse

from apps.vocabulary.models import VocabularyWord, UserVocabulary
from apps.vocabulary.services.vocabulary_translation_service import get_translation

from apps.vocabulary.models import (
    SubtitleWord,
    VocabularyTranslation,
)


def vocabulary_detail(request, word):

    normalized = word.lower().strip()

    try:

        language_learning = request.user.profile.language_learning

        vocabulary = VocabularyWord.objects.get(
            language=language_learning,
            normalized_word=normalized,
        )

        user_vocab = UserVocabulary.objects.filter(
            user=request.user, vocabulary_word=vocabulary
        ).first()

        target_language = request.user.profile.language_native

        translation = get_translation(vocabulary, target_language)

        knowledge_level = 1

        if user_vocab:

            knowledge_level = user_vocab.knowledge_level

        else:

            UserVocabulary.objects.create(
                user=request.user, vocabulary_word=vocabulary, knowledge_level=1
            )

        data = {
            "word": vocabulary.word,
            "translation": translation,
            "ipa": vocabulary.ipa,
            "frequency_rank": vocabulary.frequency_rank,
            "knowledge_level": knowledge_level,
        }

    except VocabularyWord.DoesNotExist:

        data = {
            "word": word,
            "translation": "",
            "ipa": "",
            "knowledge_level": 1,
        }

    return JsonResponse(data)


@csrf_exempt
@login_required
def delete_user_vocabulary(request):

    if request.method != "POST":

        return JsonResponse({"error": "POST required"}, status=400)

    data = json.loads(request.body)

    word = data.get("word")

    try:

        language_learning = request.user.profile.language_learning

        vocabulary_word = VocabularyWord.objects.get(
            language=language_learning, word__iexact=word
        )

        UserVocabulary.objects.filter(
            user=request.user, vocabulary_word=vocabulary_word
        ).delete()

        return JsonResponse({"success": True})

    except VocabularyWord.DoesNotExist:

        return JsonResponse({"error": "Word not found"}, status=404)


@csrf_exempt
@login_required
def save_vocabulary_level(request):

    if request.method != "POST":

        return JsonResponse({"error": "POST required"}, status=400)

    data = json.loads(request.body)

    word = data.get("word")

    knowledge_level = data.get("knowledge_level")

    try:

        language_learning = request.user.profile.language_learning

        vocabulary_word = VocabularyWord.objects.get(
            language=language_learning, word__iexact=word
        )

    except VocabularyWord.DoesNotExist:

        return JsonResponse({"error": "Word not found"}, status=404)

    user_vocab, created = UserVocabulary.objects.get_or_create(
        user=request.user, vocabulary_word=vocabulary_word
    )

    user_vocab.knowledge_level = knowledge_level

    user_vocab.review_count += 1

    user_vocab.save()

    return JsonResponse({"success": True})


@login_required
def user_vocabulary_levels(request):

    language_learning = request.user.profile.language_learning

    vocabulary = UserVocabulary.objects.filter(
        user=request.user, vocabulary_word__language=language_learning
    ).select_related("vocabulary_word")

    data = {}

    for item in vocabulary:

        normalized = item.vocabulary_word.normalized_word

        data[normalized] = item.knowledge_level

    return JsonResponse(data)


from django.http import JsonResponse


def video_vocabulary(request, video_id):

    words = SubtitleWord.objects.filter(segment__video_id=video_id).select_related(
        "vocabulary_word"
    )

    target_language = request.user.profile.language_native

    data = {}

    for item in words:

        normalized = item.vocabulary_word.normalized_word

        if normalized in data:

            continue

        translation_obj = VocabularyTranslation.objects.filter(
            vocabulary_word=item.vocabulary_word,
            language=target_language,
        ).first()

        translation = ""

        if translation_obj:

            translation = translation_obj.translation

        data[normalized] = {
            "word": item.vocabulary_word.word,
            "translation": translation,
            "ipa": item.vocabulary_word.ipa,
            "frequency_rank": item.vocabulary_word.frequency_rank,
        }

    return JsonResponse(data)
