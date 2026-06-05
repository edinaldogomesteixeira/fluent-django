from django.contrib import admin

from .models import SubtitleSegment


#admin.site.register(
#    SubtitleSegment
#)
@admin.register(SubtitleSegment)
class SubtitleSegmentAdmin(admin.ModelAdmin):

    list_display = (
        'video_id_display',
        'sequence_order',
        'start_seconds',
        'end_seconds',
        'short_text',
    )

    search_fields = (
        'text',
    )

    list_filter = (
        'video',
    )

    ordering = (
        'video',
        'sequence_order',
    )

    def short_text(self, obj):

        return obj.text[:80]

    short_text.short_description = 'Text'

    def video_id_display(self, obj):

        return obj.video.id

    video_id_display.short_description = 'Video ID'