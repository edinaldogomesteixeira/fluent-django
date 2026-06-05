from apps.videos.services.video_duration import (
    get_video_duration
)

from apps.videos.services.word_counter import (
    count_words
)


def process_video_metadata(
    video,
    video_path,
    transcription_text
):

    # =========================
    # DURATION
    # =========================

    video.duration = (
        get_video_duration(
            video_path
        )
    )

    # =========================
    # DESCRIPTION
    # =========================

    video.description = (
        transcription_text.strip()
    )

    # =========================
    # WORD COUNT
    # =========================

    video.word_count = (
        count_words(
            transcription_text
        )
    )