def current_language(request):

    if (

        request.user.is_authenticated

        and

        hasattr(
            request.user,
            'profile'
        )

    ):

        return {

            'current_language':

                request.user.profile
                .current_language
        }

    return {

        'current_language': None
    }

from apps.vocabulary.models import UserVocabulary

def topbar_stats(request):

    if not request.user.is_authenticated:
        return {}

    profile = getattr(
        request.user,
        'profile',
        None
    )

    if not profile:

        return {

            'known_words': 0,
            'learning_words': 0,
            'streak_days': 0,
        }

    language = profile.current_language

    known_words = (

        UserVocabulary.objects.filter(
            user=request.user,
            vocabulary_word__language=language,
            knowledge_level__gte=5
        ).count()
    )

    learning_words = (

        UserVocabulary.objects.filter(
            user=request.user,
            vocabulary_word__language=language,
            knowledge_level__in=[2,3,4]
        ).count()
    )

    return {

        'known_words': known_words,

        'learning_words': learning_words,

        'streak_days': 7,  # temporário
    }