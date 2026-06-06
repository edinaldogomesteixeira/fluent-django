import json
import os
import time
import requests
import subprocess

from pathlib import Path

# ==========================
# DJANGO
# ==========================

BASE_URL = "http://2.24.104.26"
#BASE_URL = "http://192.168.15.41:8000"

# ==========================
# BUNNY STREAM
# ==========================

BUNNY_LIBRARY_ID = "665190"

BUNNY_STREAM_KEY = "7f302752-3b51-403f-b79dd8362ac6-ff4f-4424"

BUNNY_STREAM_DOMAIN = ("vz-daa8a3a5-441.b-cdn.net")

# ==========================
# BUNNY STORAGE
# ==========================

BUNNY_STORAGE_ZONE = ( "fluentu-images")

BUNNY_STORAGE_REGION = ("br")

BUNNY_STORAGE_KEY = ("3307d2fe-6571-4a09-bcc3b08f16e7-7f82-46cb")

BUNNY_STORAGE_DOMAIN = ("fluentu-media.b-cdn.net")

# ==========================
# DOWNLOAD
# ==========================
YTDLP_PATH = "/volume1/homes/admin/bin/yt-dlp"

DOWNLOAD_DIR = Path(
    "downloads"
)

DOWNLOAD_DIR.mkdir(
    exist_ok=True
)

# ==========================
# DJANGO API
# ==========================


def get_next_job():

    response = requests.get(

        f"{BASE_URL}/api/worker/videos/next/"

    )

    response.raise_for_status()

    data = response.json()

    if not data:

        return None

    return data

def update_status(
    video_id,
    status
):

    requests.post(

        f"{BASE_URL}/api/worker/videos/{video_id}/status/",

        json={
            "status": status
        }

    )

def complete_job(
    video_id,
    payload
):

    requests.post(

        f"{BASE_URL}/api/worker/videos/{video_id}/complete/",

        json=payload

    )

def error_job(
    job_id,
    error_message
):

    requests.post(

        f"{BASE_URL}/api/job/{job_id}/error/",

        json={
            "error": error_message
        }

    )


# ==========================
# BUNNY
# ==========================


def bunny_create_video(
    title
):

    response = requests.post(

        f"https://video.bunnycdn.com/library/{BUNNY_LIBRARY_ID}/videos",

        headers={

            "AccessKey":
                BUNNY_STREAM_KEY,

            "Content-Type":
                "application/json"

        },

        json={
            "title": title
        }

    )

    response.raise_for_status()

    return response.json()


def bunny_upload_video(
    bunny_video_id,
    filepath
):

    with open(
        filepath,
        "rb"
    ) as file:

        response = requests.put(

            f"https://video.bunnycdn.com/library/{BUNNY_LIBRARY_ID}/videos/{bunny_video_id}",

            headers={

                "AccessKey":
                    BUNNY_STREAM_KEY,

                "Content-Type":
                    "video/mp4"

            },

            data=file

        )

    response.raise_for_status()


def bunny_upload_thumbnail(
    thumbnail_path,
    youtube_id
):

    remote_file = (
        f"thumbnails/{youtube_id}.jpg"
    )

    url = (

        f"https://{BUNNY_STORAGE_REGION}.storage.bunnycdn.com/"
        f"{BUNNY_STORAGE_ZONE}/"
        f"{remote_file}"

    )

    with open(
        thumbnail_path,
        "rb"
    ) as file:

        response = requests.put(

            url,

            headers={

                "AccessKey":
                    BUNNY_STORAGE_KEY

            },

            data=file

        )

    response.raise_for_status()

    return (

        f"https://{BUNNY_STORAGE_DOMAIN}/"
        f"{remote_file}"

    )


# ==========================
# DOWNLOAD YOUTUBE
# ==========================


def download_video(
    youtube_url
):

    output = str(
        DOWNLOAD_DIR /
        "%(id)s.%(ext)s"
    )

    cmd = [

        YTDLP_PATH,

        "-f",
        "worst",

        "--write-thumbnail",

        "-o",
        output,

        youtube_url

    ]

    subprocess.run(
        cmd,
        check=True
    )

    info = subprocess.run(

        [

            YTDLP_PATH,

            "--dump-json",

            "--skip-download",

            youtube_url

        ],

        capture_output=True,

        text=True,

        check=True

    )

    metadata = json.loads(
        info.stdout
    )

    youtube_id = metadata["id"]

    video_files = list(
        DOWNLOAD_DIR.glob(
            f"{youtube_id}.mp4"
        )
    )

    if not video_files:

        raise Exception(
            "MP4 não encontrado"
        )

    video_file = video_files[0]

    thumbnail_file = None

    for ext in [

        ".jpg",
        ".jpeg",
        ".webp",
        ".png"

    ]:

        candidate = (
            DOWNLOAD_DIR /
            f"{youtube_id}{ext}"
        )

        if candidate.exists():

            thumbnail_file = candidate

            break

    if not thumbnail_file:

        raise Exception(
            "Thumbnail não encontrada"
        )

    return {

        "youtube_id":
            youtube_id,

        "title":
            metadata.get(
                "title",
                ""
            ),

        "channel":
            metadata.get(
                "channel",
                ""
            ),

        "duration":
            metadata.get(
                "duration",
                0
            ),

        "filepath":
            str(video_file),

        "thumbnail":
            str(thumbnail_file)

    }

# ==========================
# LOOP
# ==========================

while True:

    try:

        job = get_next_job()

        if not job:

            time.sleep(5)

            continue

        job_id = job["id"]
        update_status(
            job_id,
            "downloading"
        )

        youtube_url = (
            job["youtube_url"]
        )

        data = download_video(
            youtube_url
        )

        update_status(
            job_id,
            "uploading"
        )

        bunny_video = (

            bunny_create_video(

                data["title"]

            )

        )

        bunny_video_id = (
            bunny_video["guid"]
        )

        bunny_upload_video(

            bunny_video_id,

            data["filepath"]

        )

        thumbnail_url = (

            bunny_upload_thumbnail(

                data["thumbnail"],

                data["youtube_id"]

            )

        )

        hls_url = (

            f"https://"

            f"{BUNNY_STREAM_DOMAIN}/"

            f"{bunny_video_id}/playlist.m3u8"

        )

        preview_url = (

            f"https://"

            f"{BUNNY_STREAM_DOMAIN}/"

            f"{bunny_video_id}/preview.webp"

        )

        payload = {

            "title":
                data["title"],

            "channel":
                data["channel"],

            "duration":
                data["duration"],

            "thumbnail_url":
                thumbnail_url,

            "bunny_video_id":
                bunny_video_id,

            "hls_url":
                hls_url,

            "preview_url":
                preview_url,

            "bunny_url":
                hls_url,

        }

        complete_job(
            job_id,
            payload
        )

        try:

            os.remove(
                data["filepath"]
            )

        except:
            pass

        try:

            os.remove(
                data["thumbnail"]
            )

        except:
            pass

    except Exception as ex:

        try:

            error_job(
                job_id,
                "error"
            )

        except:
            pass

    time.sleep(2)