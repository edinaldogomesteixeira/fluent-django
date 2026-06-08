from django.contrib import admin

from .models import (
    FlashcardDeck,
    FlashcardDeckWord,
)


@admin.register(FlashcardDeck)
class FlashcardDeckAdmin(admin.ModelAdmin):

    list_display = (
        "id",
        "name",
        "user",
        "language",
        "created_at",
    )

    search_fields = (
        "name",
        "user__username",
    )


@admin.register(FlashcardDeckWord)
class FlashcardDeckWordAdmin(admin.ModelAdmin):

    list_display = (
        "id",
        "deck",
        "vocabulary_word",
        "created_at",
    )

    search_fields = (
        "deck__name",
        "vocabulary_word__word",
    )