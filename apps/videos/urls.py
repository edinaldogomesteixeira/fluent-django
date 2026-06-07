from django.urls import path

from .views import video_list, category_list
from .views import stream_video
from .views import upload_video
from .views import (
    import_youtube,
    worker_next_video,
    worker_update_status,
    worker_complete_video,
    worker_next_transcription,
    worker_save_segments,
)

urlpatterns = [
    path("api/videos/", video_list),
    path("api/videos/categories/", category_list, name="category_list"),
    path("stream/<int:video_id>/", stream_video, name="stream_video"),
    path("api/videos/upload/", upload_video, name="upload_video"),
    path("api/videos/import-youtube/", import_youtube, name="import_youtube"),
    path("api/worker/videos/next/", worker_next_video, name="worker_next_video"),
    path(
        "api/worker/videos/<int:video_id>/status/",
        worker_update_status,
        name="worker_update_status",
    ),
    path(
        "api/worker/videos/<int:video_id>/complete/",
        worker_complete_video,
        name="worker_complete_video",
    ),
    path(
        "api/worker/transcriptions/next/",
        worker_next_transcription,
        name="worker_next_transcription",
    ),
    path(
        "api/worker/videos/<int:video_id>/segments/",
        worker_save_segments,
        name="worker_save_segments",
    ),
]
