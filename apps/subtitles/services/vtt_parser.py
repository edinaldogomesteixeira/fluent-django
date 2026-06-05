import re


def vtt_time_to_seconds(
    time_str
):

    time_str = (
        time_str.strip()
    )

    time_str = (
        time_str.split(" ")[0]
    )

    h, m, s = (
        time_str.split(":")
    )

    return (

        int(h) * 3600 +

        int(m) * 60 +

        float(s)

    )


def clean_text(
    text
):

    # remove timestamps internos
    text = re.sub(

        r"<\d{2}:\d{2}:\d{2}\.\d{3}>",

        "",

        text

    )

    # remove tags <c>
    text = re.sub(

        r"</?c>",

        "",

        text

    )

    # remove espaços duplicados
    text = re.sub(

        r"\s+",

        " ",

        text

    )

    return text.strip()


def parse_vtt(
    filepath
):

    subtitles = []

    with open(

        filepath,

        "r",

        encoding="utf-8"

    ) as file:

        lines = file.readlines()

    sequence = 1

    i = 0

    while i < len(lines):

        line = lines[i].strip()

        if "-->" in line:

            start, end = (

                line.split("-->")
            )

            start = (
                start.strip()
            )

            end = (
                end.strip()
            )

            text_lines = []

            i += 1

            while (

                i < len(lines)

                and

                lines[i].strip()

            ):

                text_lines.append(

                    lines[i].strip()

                )

                i += 1

            text = " ".join(
                text_lines
            )

            text = clean_text(
                text
            )

            if text:

                subtitles.append({

                    "sequence_order":
                        sequence,

                    "start_seconds":
                        vtt_time_to_seconds(
                            start
                        ),

                    "end_seconds":
                        vtt_time_to_seconds(
                            end
                        ),

                    "text":
                        text

                })

                sequence += 1

        i += 1

    return subtitles