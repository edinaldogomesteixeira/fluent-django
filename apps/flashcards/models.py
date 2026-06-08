from django.db import models
from django.contrib.auth.models import User

from apps.users.models import Language
from apps.vocabulary.models import VocabularyWord


class FlashcardDeck(models.Model):

    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="flashcard_decks",
    )

    language = models.ForeignKey(
        Language,
        on_delete=models.CASCADE,
        related_name="flashcard_decks",
    )

    name = models.CharField(
        max_length=100,
    )

    description = models.TextField(
        blank=True,
    )
    
    is_system = models.BooleanField(
        default=False,
    )

    created_at = models.DateTimeField(
        auto_now_add=True,
    )

    updated_at = models.DateTimeField(
        auto_now=True,
    )

    class Meta:

        ordering = ["name"]

        unique_together = (
            "user",
            "language",
            "name",
        )

    def __str__(self):

        return self.name


class FlashcardDeckWord(models.Model):

    deck = models.ForeignKey(
        FlashcardDeck,
        on_delete=models.CASCADE,
        related_name="words",
    )

    vocabulary_word = models.ForeignKey(
        VocabularyWord,
        on_delete=models.CASCADE,
        related_name="flashcard_decks",
    )

    created_at = models.DateTimeField(
        auto_now_add=True,
    )

    class Meta:

        unique_together = (
            "deck",
            "vocabulary_word",
        )

    def __str__(self):

        return f"{self.deck.name} - " f"{self.vocabulary_word.word}"
