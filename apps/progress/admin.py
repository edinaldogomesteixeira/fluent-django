from django.contrib import admin

from .models import (
    WatchProgress
)


@admin.register(WatchProgress)
class WatchProgressAdmin(admin.ModelAdmin):

    list_display = (

        'id',

        'user_id',

        'video_id',

        'video',
        
        'current_seconds',

        'progress_percent',

        'is_completed',

        'last_watched_at',
    )

    list_filter = (

        'is_completed',
    )

    search_fields = (

        'user__username',

        'video__title',
    )

    ordering = (

        '-last_watched_at',
    )

    list_per_page = 100