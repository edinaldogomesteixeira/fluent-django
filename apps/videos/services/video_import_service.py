from pathlib import Path

from apps.videos.models import Video, Category

from .youtube_service import download_youtube_video

from .bunny_service import (
    bunny_create_video,
    bunny_upload_video,
    bunny_upload_thumbnail,
    get_hls_url,
    get_thumbnail_url,
    get_preview_url,
)

from apps.subtitles.services.youtube_subtitle_service import download_subtitles

from apps.subtitles.services.subtitle_import_service import import_subtitles


def import_youtube_to_bunny(youtube_url, language):

    # =====================
    # DOWNLOAD YOUTUBE
    # =====================

    youtube_data = download_youtube_video(youtube_url)

    # =====================
    # CREATE VIDEO BUNNY
    # =====================

    bunny_video = bunny_create_video(youtube_data["title"])

    bunny_video_id = bunny_video["guid"]

    # =====================
    # UPLOAD VIDEO
    # =====================

    bunny_upload_video(bunny_video_id, youtube_data["filepath"])

    # =====================
    # UPLOAD THUMBNAIL
    # =====================

    thumbnail_file = Path(youtube_data["thumbnail"])

    print("EXISTS:", thumbnail_file.exists())

    print("FILE:", thumbnail_file)

    if thumbnail_file.exists():

        thumbnail_url = bunny_upload_thumbnail(
            str(thumbnail_file), youtube_data["youtube_id"]
        )

        print("Thumbnail uploaded:")

        print(thumbnail_url)

    # =====================
    # BUNNY URLS
    # =====================

    hls_url = get_hls_url(bunny_video_id)

    thumbnail_url = get_thumbnail_url(youtube_data["youtube_id"])

    preview_url = get_preview_url(bunny_video_id)

    # =====================
    # CATEGORY
    # =====================

    category = Category.objects.filter(name="Most Recent").first()

    # =====================
    # CREATE VIDEO
    # =====================

    video = Video.objects.create(
        title=youtube_data["title"],
        description=youtube_data["description"],
        provider="hls",
        youtube_url=youtube_url,
        youtube_id=youtube_data["youtube_id"],
        bunny_video_id=bunny_video_id,
        hls=hls_url,
        image=thumbnail_url,
        preview=preview_url,
        duration=youtube_data["duration"],
        language=language,
        status="ready",
    )

    # =====================
    # DOWNLOAD SUBTITLES
    # =====================

    try:

        subtitle_file = download_subtitles(youtube_url)

        subtitle_count = import_subtitles(video, subtitle_file)

        print(f"{subtitle_count} subtitles imported")

    except Exception as e:

        print(f"Subtitle import error: {e}")

    # =====================
    # DOWNLOAD word
    # =====================

    from apps.vocabulary.services.vocabulary_import_service import import_vocabulary

    total_words = import_vocabulary(video)

    print(f"{total_words} words imported")

    if category:

        video.categories.add(category)

        video.save()

    print(f"Video created: {video.id}")

    return video
