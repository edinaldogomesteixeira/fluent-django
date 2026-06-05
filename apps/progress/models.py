from django.db import models

from django.contrib.auth.models import User

from apps.videos.models import Video


class WatchProgress(models.Model):

    user = models.ForeignKey(

        User,

        on_delete=models.CASCADE,

        related_name='watch_progress'
    )

    video = models.ForeignKey(

        Video,

        on_delete=models.CASCADE,

        related_name='watch_progress'
    )

    current_seconds = models.FloatField(
        default=0
    )

    duration_seconds = models.FloatField(
        default=0
    )

    progress_percent = models.FloatField(
        default=0
    )

    is_completed = models.BooleanField(
        default=False
    )

    completed_at = models.DateTimeField(
        blank=True,
        null=True
    )

    last_watched_at = models.DateTimeField(
        auto_now=True
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
            'video'
        )

    def __str__(self):

        return (

            f'{self.user.username} - '
            f'{self.video.title} '
            f'({self.progress_percent:.1f}%)'
        )