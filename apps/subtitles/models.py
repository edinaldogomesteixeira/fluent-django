from django.db import models

from apps.videos.models import Video
from apps.users.models import Language


class SubtitleSegment(models.Model):

    video = models.ForeignKey(Video, on_delete=models.CASCADE, related_name="segments")

    sequence_order = models.IntegerField()

    start_seconds = models.FloatField()

    end_seconds = models.FloatField()

    text = models.TextField()

    ipa = models.TextField(blank=True, null=True)

    created_at = models.DateTimeField(auto_now_add=True)

    updated_at = models.DateTimeField(auto_now=True)

    class Meta:

        ordering = ["sequence_order"]

        indexes = [
            models.Index(fields=["video"]),
            models.Index(fields=["sequence_order"]),
        ]

    def __str__(self):

        return f"{self.video.title} - " f"{self.sequence_order}"


class SubtitleTranslation(models.Model):

    segment = models.ForeignKey(
        SubtitleSegment, on_delete=models.CASCADE, related_name="translations"
    )

    language = models.ForeignKey(
        Language, on_delete=models.CASCADE, related_name="subtitle_translations"
    )

    translated_text = models.TextField()

    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:

        unique_together = (
            "segment",
            "language",
        )

    def __str__(self):

        return f"Segment {self.segment.id} -> " f"{self.language.code}"
