from django.contrib import admin

from .models import (
    Language,
    UserProfile
)


@admin.register(Language)
class LanguageAdmin(admin.ModelAdmin):

    list_display = (
        'name',
        'code',
        'is_active'
    )

    search_fields = (
        'name',
        'code'
    )


@admin.register(UserProfile)
class UserProfileAdmin(admin.ModelAdmin):

    list_display = (
        'user',
        'current_language'
    )

    search_fields = (
        'user__username',
    )