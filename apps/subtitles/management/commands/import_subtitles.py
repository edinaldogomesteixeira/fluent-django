import json

from django.core.management.base import BaseCommand

from apps.videos.models import Video

from apps.subtitles.models import SubtitleSegment


class Command(BaseCommand):

    help = 'Import subtitles JSON into database'

    def handle(self, *args, **kwargs):

        videos = Video.objects.exclude(
            subtitles=''
        ).exclude(
            subtitles__isnull=True
        )

        for video in videos:

            subtitle_path = (
                '.' + video.subtitles
            )

            print(
                f'Importing: {subtitle_path}'
            )

            try:

                with open(
                    subtitle_path,
                    'r',
                    encoding='utf-8'
                ) as file:

                    subtitles = json.load(file)

            except Exception as e:

                print(
                    f'Error: {e}'
                )

                continue

            SubtitleSegment.objects.filter(
                video=video
            ).delete()

            segments = []

            for index, subtitle in enumerate(subtitles):

                segments.append(

                    SubtitleSegment(

                        video=video,

                        sequence_order=index,

                        start_seconds=
                            subtitle.get(
                                'start',
                                0
                            ),

                        end_seconds=
                            subtitle.get(
                                'end',
                                0
                            ),

                        text=
                            subtitle.get(
                                'text',
                                ''
                            )
                    )
                )

            SubtitleSegment.objects.bulk_create(
                segments
            )

            print(
                f'Imported {len(segments)} subtitles'
            )

        self.stdout.write(

            self.style.SUCCESS(
                'Import completed'
            )
        )