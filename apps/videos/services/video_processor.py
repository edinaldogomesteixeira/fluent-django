from background_task import background

from apps.videos.models import Video

from apps.videos.services.transcription import (
    generate_srt
)

from apps.videos.services.thumbnail_service import (
    process_video_thumbnail
)
from apps.subtitles.services.transcription_pipeline_service import (
    process_transcription_pipeline
)
from apps.videos.services.youtube_pipeline_service import (
    process_youtube_video
)
from apps.videos.services.video_metadata_service import (
    process_video_metadata
)
from apps.videos.constants import (
    VIDEO_STATUS_READY,
    VIDEO_STATUS_ERROR,
)

@background(schedule=5)
def process_video(video_id):

    print(
        'START PROCESS:',
        video_id
    )

    # ====================================
    # GET VIDEO
    # ====================================

    video = Video.objects.filter(
        id=video_id
    ).first()

    if not video:

        print(
            f'Video {video_id} not found'
        )

        return

    try:

        # ====================================
        # YOUTUBE DOWNLOAD
        # ====================================
        data = process_youtube_video(
            video
        )
        # ====================================
        # VIDEO PATH
        # ====================================

        video_path = video.video_file.path

        # ====================================
        # THUMBNAIL
        # ====================================
        process_video_thumbnail(

            video=video,

            video_path=video_path,

            youtube_data=data if (
                video.source_type == 'youtube'
            ) else None
        )
 
        # ====================================
        # SUBTITLE
        # ====================================
        transcription_result = (
            process_transcription_pipeline(
                video=video,
                video_path=video_path
            )
        )

        transcription_text = (
            transcription_result['text']
        )
        # ====================================
        # xxxxxxx
        # ====================================
        process_video_metadata(
            video=video,
            video_path=video_path,
            transcription_text=transcription_text
        )
            
        # ====================================
        # STATUS
        # ====================================

        video.status = VIDEO_STATUS_READY

        # ====================================
        # SAVE
        # ====================================

        video.save()

        print(
            f'Video {video.id} processed'
        )

    except Exception as error:

        print(
            'PROCESS ERROR:'
        )

        print(error)

        if video:

            video.status = VIDEO_STATUS_ERROR

            video.save()