from django.http import JsonResponse
from django.views.decorators.http import require_POST
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth.decorators import login_required

import json

from .models import (
    FlashcardDeck,
    FlashcardDeckWord,
)

from apps.vocabulary.models import VocabularyWord


@csrf_exempt
@login_required
@require_POST
def add_word_to_deck(request):

    data = json.loads(request.body)

    deck_id = data.get("deck_id")

    word_id = data.get("word_id")

    deck = FlashcardDeck.objects.get(
        id=deck_id,
        user=request.user,
    )

    vocabulary_word = VocabularyWord.objects.get(id=word_id)

    FlashcardDeckWord.objects.get_or_create(
        deck=deck,
        vocabulary_word=vocabulary_word,
    )

    return JsonResponse(
        {
            "success": True,
        }
    )


@login_required
def deck_list(request):

    language = request.user.profile.language_learning

    decks = FlashcardDeck.objects.filter(
        user=request.user,
        language=language,
    )

    data = []

    for deck in decks:

        data.append(
            {
                "id": deck.id,
                "name": deck.name,
                "is_system": deck.is_system,
            }
        )

    return JsonResponse(
        data,
        safe=False,
    )


@csrf_exempt
@login_required
@require_POST
def create_deck(request):

    data = json.loads(request.body)

    name = data.get("name", "").strip()

    if not name:

        return JsonResponse(
            {
                "success": False,
                "message": "Name required",
            },
            status=400,
        )

    language = request.user.profile.language_learning

    deck, created = FlashcardDeck.objects.get_or_create(
        user=request.user,
        language=language,
        name=name,
    )

    return JsonResponse(
        {
            "success": True,
            "id": deck.id,
            "name": deck.name,
            "created": created,
        }
    )


@login_required
def deck_detail(request, deck_id):

    deck = FlashcardDeck.objects.get(
        id=deck_id,
        user=request.user,
    )

    words = FlashcardDeckWord.objects.filter(deck=deck).select_related(
        "vocabulary_word"
    )

    data = {
        "id": deck.id,
        "name": deck.name,
        "words": [],
    }

    for item in words:

        word = item.vocabulary_word

        data["words"].append(
            {
                "id": word.id,
                "word": word.word,
                "ipa": word.ipa,
                "frequency_rank": word.frequency_rank,
            }
        )

    return JsonResponse(data)

@csrf_exempt
@login_required
@require_POST
def add_words_to_deck(request):

    data = json.loads(
        request.body
    )

    deck_id = data.get(
        "deck_id"
    )

    word_ids = data.get(
        "word_ids",
        []
    )

    deck = FlashcardDeck.objects.get(
        id=deck_id,
        user=request.user,
    )

    created_count = 0

    for word_id in word_ids:

        vocabulary_word = (
            VocabularyWord.objects.get(
                id=word_id
            )
        )

        _, created = (
            FlashcardDeckWord.objects.get_or_create(
                deck=deck,
                vocabulary_word=vocabulary_word,
            )
        )

        if created:

            created_count += 1

    return JsonResponse(
        {
            "success": True,
            "created": created_count,
        }
    )