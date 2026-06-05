import whisper


model = whisper.load_model(
    'base'
)


def format_time(seconds):

    hours = int(seconds // 3600)

    minutes = int(
        (seconds % 3600) // 60
    )

    secs = int(seconds % 60)

    millis = int(
        (seconds * 1000) % 1000
    )

    return (
        f'{hours:02}:{minutes:02}:'
        f'{secs:02},{millis:03}'
    )


def generate_srt(
    video_path,
    output_path
):

    result = model.transcribe(
        video_path
    )

    segments = result['segments']

     # NOVO
    full_text = []

    with open(
        output_path,
        'w',
        encoding='utf-8'
    ) as file:

        for i, segment in enumerate(
            segments,
            start=1
        ):

            start = format_time(
                segment['start']
            )

            end = format_time(
                segment['end']
            )

            text = segment['text']

            # NOVO
            full_text.append(
                text.strip()
            )

            file.write(f'{i}\n')

            file.write(
                f'{start} --> {end}\n'
            )

            file.write(
                f'{text}\n\n'
            )
    # NOVO
    return {

        'text': '\n'.join(full_text),

        'segments': segments

    }