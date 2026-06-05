from pathlib import Path

import yt_dlp


def download_youtube_video(youtube_url):

    # =========================
    # TEMP DIRECTORIES
    # =========================

    videos_dir = (
        Path("media")
        / "videos"
    )

    
    videos_dir.mkdir(
        parents=True,
        exist_ok=True
    )

    # =========================
    # YOUTUBE OPTIONS
    # =========================

    ydl_opts = {

        # MP4 COM ÁUDIO E VÍDEO
        "format": (

            "best[ext=mp4]"
            "[height<=360]"
            "[acodec!=none]"
            "[vcodec!=none]"

        ),

        # EVITA PLAYLIST
        "noplaylist": True,

        # THUMBNAIL
        "writethumbnail": True,

        "embedthumbnail": False,

        # CONVERTE PARA JPG
        "postprocessors": [

            {

                "key":
                    "FFmpegThumbnailsConvertor",

                "format":
                    "jpg"

            }

        ],


        # USER AGENT
        "http_headers": {

            "User-Agent": (

                "Mozilla/5.0 "
                "(Windows NT 10.0; Win64; x64) "
                "AppleWebKit/537.36 "
                "(KHTML, like Gecko) "
                "Chrome/124.0 Safari/537.36"

            )

        },

        # MENOS ESPERA
        "sleep_interval":1,

        "max_sleep_interval": 3,

        # NOME TEMPORÁRIO
        "outtmpl": str(

            videos_dir
            / "%(id)s.%(ext)s"

        ),

    }

    # =========================
    # DOWNLOAD
    # =========================

    with yt_dlp.YoutubeDL(
        ydl_opts
    ) as ydl:

        info = ydl.extract_info(

            youtube_url,

            download=True

        )

        youtube_id = info.get(
            "id"
        )

        video_file = (
            videos_dir
            / f"{youtube_id}.mp4"
        )

        thumbnail_file = (
            videos_dir
            / f"{youtube_id}.jpg"
        )

        return {

            "title":
                info.get(
                    "title",
                    ""
                ),

            "description":
                info.get(
                    "description",
                    ""
                ),

            "youtube_id":
                youtube_id,

            "youtube_url":
                youtube_url,

            "duration":
                info.get(
                    "duration",
                    0
                ),

            "channel":
                info.get(
                    "channel",
                    ""
                ),

            "thumbnail":
                str(
                    thumbnail_file
                ),

            "filepath":
                str(
                    video_file
                ),

            "filesize":
                info.get(
                    "filesize",
                    0
                )

        }
    
# =========================
# RUN
# =========================

if __name__ == "__main__":

    youtube_url = (
        "https://www.youtube.com/"
        "watch?v=QQK7rgM3Mhk"
    )

    result = download_youtube_video(youtube_url)

    print(result)

    