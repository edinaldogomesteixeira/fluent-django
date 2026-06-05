import os

from django.conf import settings

from apps.videos.services.thumbnails import (
    generate_thumbnail
)


def process_video_thumbnail(
    video,
    video_path,
    youtube_data=None
):

    thumbnail_dir = os.path.join(

        settings.MEDIA_ROOT,

        'videos'

    )

    os.makedirs(

        thumbnail_dir,

        exist_ok=True

    )

    video_filename = os.path.basename(
        video_path
    )

    name, _ = os.path.splitext(
        video_filename
    )

    thumbnail_filename = (
        f'{name}.jpg'
    )

    thumbnail_path = os.path.join(

        thumbnail_dir,

        thumbnail_filename

    )

    # =========================
    # YOUTUBE THUMBNAIL
    # =========================

    if (
        video.source_type == 'youtube'
        and youtube_data
    ):

        thumbnail_filename = youtube_data[
            'thumbnail_filename'
        ]

    # =========================
    # LOCAL THUMBNAIL
    # =========================

    else:

        generate_thumbnail(

            video_path,

            thumbnail_path

        )

    video.thumbnail.name = (
        f'videos/{thumbnail_filename}'
    )