def language_learning(request):

    if request.user.is_authenticated and hasattr(request.user, "profile"):

        return {"language_learning": request.user.profile.language_learning}

    return {"language_learning": None}


from apps.vocabulary.models import UserVocabulary


def topbar_stats(request):

    if not request.user.is_authenticated:
        return {}

    profile = getattr(request.user, "profile", None)

    if not profile:

        return {
            "known_words": 0,
            "learning_words": 0,
            "streak_days": 0,
        }

    language = profile.language_learning

    known_words = UserVocabulary.objects.filter(
        user=request.user, vocabulary_word__language=language, knowledge_level__gte=5
    ).count()

    learning_words = UserVocabulary.objects.filter(
        user=request.user,
        vocabulary_word__language=language,
        knowledge_level__in=[2, 3, 4],
    ).count()

    return {
        "known_words": known_words,
        "learning_words": learning_words,
        "streak_days": 7,  # temporário
    }
