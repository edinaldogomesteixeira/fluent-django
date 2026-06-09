from django.urls import path
from .views import *

urlpatterns = [
    path("", home, name="home"),
    path("explore/", explore_page),
    path("explore-content/", explore_content),
    path("video/", video_page),
    path("reading/", reading_page),
    path("play/", play_page),
    path("courses/", courses_page),
    path("topic/", topic_page),
    path("dashboard/", dashboard_page),
    path("library/", library_page),
    path("profile/", profile_page),

    path("settings/", settings_page),
    path("flashcards/", flashcards_page),
    path("achievements/", achievements_page),
]
