from django.urls import path

from .views import (
    register_view,
    language_view,
    goal_view,
    save_goal,
    save_language,
    change_language,
    language_list,
    CustomLoginView
)

from django.contrib.auth.views import LogoutView


urlpatterns = [

    # LOGIN

    path(
        'accounts/login/',
        CustomLoginView.as_view(),
        name='login'
    ),

    path(
        'accounts/logout/',
        LogoutView.as_view(),
        name='logout'
    ),

    # REGISTRO

    path(
        'register/',
        register_view,
        name='register'
    ),

    # ONBOARDING

    path(
        'onboarding/language/',
        language_view,
        name='language'
    ),

    path(
        'onboarding/save-language/',
        save_language,
        name='save_language'
    ),

    path(
        'onboarding/goal/',
        goal_view,
        name='goal'
    ),

    path(
        'onboarding/save-goal/',
        save_goal,
        name='save_goal'
    ),

    # APIs

    path(
        'api/languages/list/',
        language_list,
        name='language_list'
    ),

    path(
        'api/languages/change-language/',
        change_language,
        name='change_language'
    ),
]