import json
from django.views.decorators.csrf import csrf_exempt

from django.contrib.auth.decorators import login_required
from django.http import JsonResponse

from apps.vocabulary.models import VocabularyWord, UserVocabulary
from apps.vocabulary.services.vocabulary_translation_service import get_translation

from apps.vocabulary.models import SubtitleWord


@login_required
def vocabulary_detail(request, word):

    normalized = word.lower().strip()

    try:

        language_learning = request.user.profile.language_learning

        vocabulary = VocabularyWord.objects.get(
            language=language_learning,
            normalized_word=normalized,
        )

        target_language = request.user.profile.language_native

        user_vocab = UserVocabulary.objects.filter(
            user=request.user,
            vocabulary_word=vocabulary,
            language=target_language,
        ).first()

        translation = get_translation(vocabulary, target_language)

        knowledge_level = 1

        if user_vocab:

            knowledge_level = user_vocab.knowledge_level

        else:

            UserVocabulary.objects.get_or_create(
                user=request.user,
                vocabulary_word=vocabulary,
                language=target_language,
                defaults={
                    "knowledge_level": 1,
                },
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

        target_language = request.user.profile.language_native

        UserVocabulary.objects.filter(
            user=request.user,
            vocabulary_word=vocabulary_word,
            language=target_language,
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

    target_language = request.user.profile.language_native

    user_vocab, created = UserVocabulary.objects.get_or_create(
        user=request.user,
        vocabulary_word=vocabulary_word,
        language=target_language,
        defaults={
            "knowledge_level": 1,
        },
    )

    user_vocab.knowledge_level = knowledge_level

    user_vocab.review_count += 1

    user_vocab.save()

    return JsonResponse({"success": True})


@login_required
def user_vocabulary_levels(request):

    language_learning = request.user.profile.language_learning

    target_language = request.user.profile.language_native

    vocabulary = UserVocabulary.objects.filter(
        user=request.user,
        vocabulary_word__language=language_learning,
        language=target_language,
    ).select_related("vocabulary_word")

    data = {}

    for item in vocabulary:

        normalized = item.vocabulary_word.normalized_word

        data[normalized] = item.knowledge_level

    return JsonResponse(data)


@login_required
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

        translation = get_translation(
            item.vocabulary_word,
            target_language,
        )

        data[normalized] = {
            "id": item.vocabulary_word.id,
            "word": item.vocabulary_word.word,
            "translation": translation,
            "ipa": item.vocabulary_word.ipa,
            "frequency_rank": item.vocabulary_word.frequency_rank,
            "example": item.segment.text,
        }

    return JsonResponse(data)
