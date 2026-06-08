from apps.flashcards.models import FlashcardDeck


def ensure_default_decks(user):

    if not hasattr(user, "profile"):

        return

    language = user.profile.language_learning

    if not language:

        return

    FlashcardDeck.objects.get_or_create(
        user=user,
        language=language,
        name="My Vocab",
        defaults={
            "is_system": True,
        },
    )

    FlashcardDeck.objects.get_or_create(
        user=user,
        language=language,
        name="Already Known",
        defaults={
            "is_system": True,
        },
    )
