from apps.subtitles.models import (
    SubtitleSegment
)

from .vtt_parser import (
    parse_vtt
)


MIN_TEXT_LENGTH = 3


def import_subtitles(
    video,
    subtitle_file
):

    subtitles = parse_vtt(
        subtitle_file
    )

    SubtitleSegment.objects.filter(
        video=video
    ).delete()

    cleaned_subtitles = []

    for subtitle in subtitles:

        text = (
            subtitle["text"]
            .strip()
        )

        if not text:

            continue

        if len(text) < MIN_TEXT_LENGTH:

            continue

        cleaned_subtitles.append({

            "start_seconds":
                subtitle[
                    "start_seconds"
                ],

            "end_seconds":
                subtitle[
                    "end_seconds"
                ],

            "text":
                text

        })

    merged_subtitles = []

    for subtitle in cleaned_subtitles:

        text = subtitle["text"]

        if not merged_subtitles:

            merged_subtitles.append(
                subtitle
            )

            continue

        previous = (
            merged_subtitles[-1]
        )

        previous_text = (
            previous["text"]
        )

        # --------------------
        # DUPLICADO EXATO
        # --------------------

        if text == previous_text:

            continue

        # --------------------
        # TEXTO PROGRESSIVO
        #
        # Hi
        # Hi, I'm
        # Hi, I'm Justine
        # --------------------

        if text.startswith(
            previous_text
        ):

            previous["text"] = text

            previous["end_seconds"] = (

                subtitle[
                    "end_seconds"
                ]

            )

            continue

        merged_subtitles.append(
            subtitle
        )

    created = 0

    for sequence, subtitle in enumerate(

        merged_subtitles,

        start=1

    ):

        SubtitleSegment.objects.create(

            video=video,

            sequence_order=
                sequence,

            start_seconds=
                subtitle[
                    "start_seconds"
                ],

            end_seconds=
                subtitle[
                    "end_seconds"
                ],

            text=
                subtitle[
                    "text"
                ]

        )

        created += 1

    print(
        f"{created} subtitles imported"
    )

    return created