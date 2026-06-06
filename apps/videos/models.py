from django.db import models
from apps.users.models import Language

class Category(models.Model):

    name = models.CharField(
        max_length=100
    )

    slug = models.SlugField(
        unique=True
    )

    created_at = models.DateTimeField(
        auto_now_add=True
    )

    def __str__(self):

        return self.name
    
class Video(models.Model):
    language = models.ForeignKey(

            Language,

            on_delete=models.CASCADE,

            related_name='videos',

            null=True,

            blank=True
        )

    PROVIDERS = [

        ('local', 'Local'),

        ('youtube', 'YouTube'),

        ('hls', 'HLS'),
    ]

    STATUS_CHOICES = [

        ('pending', 'Pending'),

        ('downloading', 'Downloading'),

        ('uploading', 'Uploading'),

        ('ready', 'Ready'),

        ('error', 'Error'),
    ]

    title = models.CharField(
        max_length=255
    )

    description = models.TextField(
        blank=True,
        null=True
    )

    provider = models.CharField(
        max_length=20,
        choices=PROVIDERS
    )

    level = models.CharField(
        max_length=50,
        blank=True,
        null=True
    )

    duration = models.CharField(
        max_length=50,
        blank=True,
        null=True
    )

    image = models.CharField(
        blank=True,
        null=True
    )

    preview = models.URLField(
        blank=True,
        null=True
    )

    # LOCAL VIDEO

    video = models.CharField(
        blank=True,
        null=True
    )

    # YOUTUBE

    youtube_id = models.CharField(
        max_length=255,
        blank=True,
        null=True
    )

    youtube_url = models.URLField(
        blank=True,
        null=True
    )

    # HLS

    hls = models.URLField(
        blank=True,
        null=True
    )

    bunny_video_id = models.CharField(
        max_length=255,
        blank=True,
        null=True
    )

    subtitles = models.CharField(
        blank=True,
        null=True
    )

    categories = models.ManyToManyField(
        'Category',
        related_name='videos',
        blank=True
    )

    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default='pending'
    )

    words = models.IntegerField(
        default=0
    )

    created_at = models.DateTimeField(
        auto_now_add=True
    )

    updated_at = models.DateTimeField(
        auto_now=True
    )

    def __str__(self):

        return self.title