import json
import requests

from django.conf import settings


def bunny_create_video(title):

    url = (
        f"https://video.bunnycdn.com/library/"
        f"{settings.BUNNY_LIBRARY_ID}/videos"
    )

    headers = {

        "AccessKey":
            settings.BUNNY_STREAM_KEY,

        "Content-Type":
            "application/json"

    }

    response = requests.post(

        url,

        headers=headers,

        data=json.dumps({

            "title": title

        })

    )

    response.raise_for_status()

    return response.json()


def bunny_upload_video(
    bunny_video_id,
    filepath
):

    upload_url = (

        f"https://video.bunnycdn.com/library/"
        f"{settings.BUNNY_LIBRARY_ID}"
        f"/videos/{bunny_video_id}"

    )

    headers = {

        "AccessKey":
            settings.BUNNY_STREAM_KEY,

        "Content-Type":
            "video/mp4"

    }

    with open(
        filepath,
        "rb"
    ) as file:

        response = requests.put(

            upload_url,

            headers=headers,

            data=file

        )

    response.raise_for_status()

    return True


def bunny_upload_thumbnail(
    thumbnail_path,
    youtube_id
):
    
    remote_file = (
        f"thumbnails/{youtube_id}.jpg"
    )

    url = (

        f"https://br.storage.bunnycdn.com/"

        f"{settings.BUNNY_STORAGE_ZONE}/"

        f"{remote_file}"

    )

    headers = {

        "AccessKey":
            settings.BUNNY_STORAGE_KEY

    }

    with open(
        thumbnail_path,
        "rb"
    ) as file:

        response = requests.put(

            url,

            headers=headers,

            data=file

        )

    response.raise_for_status()

    return (

        f"https://{settings.BUNNY_STORAGE_DOMAIN}/"

        f"{remote_file}"

    )


def get_hls_url(
    bunny_video_id
):

    return (

        f"https://{settings.BUNNY_STREAM_DOMAIN}/"

        f"{bunny_video_id}/playlist.m3u8"

    )


def get_thumbnail_url(
    youtube_id
):

    return (

        f"https://{settings.BUNNY_STORAGE_DOMAIN}/"

        f"thumbnails/{youtube_id}.jpg"

    )


def get_preview_url(
    bunny_video_id
):

    return (

        f"https://{settings.BUNNY_STREAM_DOMAIN}/"

        f"{bunny_video_id}/preview.webp"

    )