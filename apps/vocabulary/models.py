from django.db import models
from apps.users.models import Language

from apps.subtitles.models import (
    SubtitleSegment
)


class VocabularyWord(models.Model):
    
    language = models.ForeignKey(

        Language,

        on_delete=models.CASCADE,

        related_name='vocabulary_words',

        null=True,

        blank=True
    )

    word = models.CharField(
        max_length=255
    )

    normalized_word = models.CharField(
        max_length=255,
        db_index=True
    )

    translation = models.CharField(
        max_length=255,
        blank=True,
        null=True
    )

    ipa = models.CharField(
        max_length=255,
        blank=True,
        null=True
    )

    frequency_rank = models.IntegerField(
        default=0
    )

    created_at = models.DateTimeField(
        auto_now_add=True
    )

    class Meta:

        ordering = ['word']
        
        unique_together = (
            'language',
            'normalized_word'
        )

    def __str__(self):

        return self.word


class SubtitleWord(models.Model):

    segment = models.ForeignKey(

        SubtitleSegment,

        on_delete=models.CASCADE,

        related_name='subtitle_words'
    )

    vocabulary_word = models.ForeignKey(

        VocabularyWord,

        on_delete=models.CASCADE,

        related_name='subtitle_words'
    )

    original_word = models.CharField(
        max_length=255
    )

    position = models.IntegerField(
        default=0
    )

    created_at = models.DateTimeField(
        auto_now_add=True
    )

    class Meta:

        ordering = [

            'segment',
            'position'
        ]

        unique_together = (

            'segment',
            'position'
        )

    def __str__(self):

        return (

            f'{self.original_word} '
            f'({self.segment.id})'
        )

from django.contrib.auth.models import User
class UserVocabulary(models.Model):

    KNOWLEDGE_LEVELS = [

        (1, 'New'),

        (2, 'Recognizing'),

        (3, 'Learning'),

        (4, 'Known'),

        (5, 'Mastered'),
    ]

    user = models.ForeignKey(

        User,

        on_delete=models.CASCADE,

        related_name='user_vocabulary'
    )

    vocabulary_word = models.ForeignKey(

        VocabularyWord,

        on_delete=models.CASCADE,

        related_name='user_data'
    )

    knowledge_level = models.IntegerField(

        choices=KNOWLEDGE_LEVELS,

        default=1
    )

    review_count = models.IntegerField(
        default=0
    )

    last_reviewed_at = models.DateTimeField(

        blank=True,

        null=True
    )

    created_at = models.DateTimeField(
        auto_now_add=True
    )

    updated_at = models.DateTimeField(
        auto_now=True
    )

    class Meta:

        unique_together = (
            'user',
            'vocabulary_word'
        )

    def __str__(self):

        return (

            f'{self.user.username} - '
            f'{self.vocabulary_word.word} '
            f'({self.knowledge_level})'
        )