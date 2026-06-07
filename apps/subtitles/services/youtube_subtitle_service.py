from pathlib import Path

import yt_dlp


def download_subtitles(youtube_url):

    subtitles_dir = Path("media") / "subtitles"

    subtitles_dir.mkdir(parents=True, exist_ok=True)

    ydl_opts = {
        "skip_download": True,
        "writesubtitles": True,
        "writeautomaticsub": True,
        "subtitleslangs": ["en"],
        "subtitlesformat": "vtt",
        "outtmpl": str(subtitles_dir / "%(id)s"),
    }

    with yt_dlp.YoutubeDL(ydl_opts) as ydl:

        info = ydl.extract_info(youtube_url, download=True)

        youtube_id = info["id"]

        subtitle_file = subtitles_dir / f"{youtube_id}.en.vtt"

        return str(subtitle_file)
