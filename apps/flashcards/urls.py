from django.urls import path

from .views import (
    deck_list,
    add_word_to_deck,
    create_deck,
    deck_detail,
    add_words_to_deck,
)

urlpatterns = [
    path(
        "api/flashcards/decks/",
        deck_list,
    ),
    path(
        "api/flashcards/add-word/",
        add_word_to_deck,
    ),
    path(
        "api/flashcards/decks/create/",
        create_deck,
    ),
    path(
        "api/flashcards/deck/<int:deck_id>/",
        deck_detail,
    ),
    path(
        "api/flashcards/add-words/",
        add_words_to_deck,
    ),
]
