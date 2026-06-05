from django.urls import path

from .views import (
    save_progress,
    get_progress,
    continue_watching,
    learning_analytics
)


urlpatterns = [

    path(

        'api/progress/save/',

        save_progress
    ),
    path(

        'api/progress/<int:video_id>/',

        get_progress
    ),
    path(
        'api/continue-watching/',
        continue_watching
    ),
    path(
        'api/learning-analytics/',
        learning_analytics
    ),
]