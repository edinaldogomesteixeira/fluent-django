from django.urls import path

from .views import (
    vocabulary_detail,
    delete_user_vocabulary,
    save_vocabulary_level,
    user_vocabulary_levels,
    video_vocabulary
)


urlpatterns = [

    path(

        'api/vocabulary/<str:word>/',

        vocabulary_detail
    ),
    path(

        'api/delete-user-vocabulary/',

        delete_user_vocabulary
    ),

    path(

        'api/save-vocabulary-level/',

        save_vocabulary_level
    ),
    path(

        'api/user-vocabulary-levels/',

        user_vocabulary_levels
    ),
    path(
        'api/videos/<int:video_id>/vocabulary/',
        video_vocabulary
    ),
    
]