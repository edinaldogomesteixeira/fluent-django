from django.contrib import admin

from .models import VocabularyWord, SubtitleWord, UserVocabulary, VocabularyTranslation

# admin.site.register(
#    VocabularyWord
# )

# admin.site.register(
#    SubtitleWord
# )


@admin.register(VocabularyWord)
class VocabularyWordAdmin(admin.ModelAdmin):

    list_display = (
        "id",
        "language",
        "word",
        "normalized_word",
        "frequency_rank",
    )

    list_filter = ("language",)

    search_fields = ("word",)

    ordering = ("word",)

    list_per_page = 100


@admin.register(SubtitleWord)
class SubtitleWordAdmin(admin.ModelAdmin):

    list_display = (
        "id",
        "original_word",
        "vocabulary_word",
        "segment",
        "position",
    )

    search_fields = ("original_word",)

    list_filter = ("vocabulary_word",)

    ordering = (
        "segment",
        "position",
    )

    list_per_page = 100


@admin.register(UserVocabulary)
class UserVocabularyAdmin(admin.ModelAdmin):

    list_display = (
        "id",
        "user",
        "vocabulary_word",
        # 'vocabulary_normalized_word',
        "knowledge_level",
        "review_count",
    )

    list_filter = ("knowledge_level",)

    search_fields = (
        "vocabulary_word__word",
        "user__username",
    )

    ordering = ("vocabulary_word",)


@admin.register(VocabularyTranslation)
class VocabularyTranslationAdmin(admin.ModelAdmin):

    list_display = (
        "id",
        "vocabulary_word",
        "language",
        "translation",
    )

    search_fields = (
        "translation",
        "vocabulary_word__word",
    )
