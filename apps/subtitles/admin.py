from django.contrib import admin

from .models import SubtitleSegment, SubtitleTranslation


# admin.site.register(
#    SubtitleSegment
# )
@admin.register(SubtitleSegment)
class SubtitleSegmentAdmin(admin.ModelAdmin):

    list_display = (
        "video_id_display",
        "sequence_order_display",
        "start_seconds_display",
        "end_seconds_display",
        "short_text",
    )

    search_fields = ("text",)

    list_filter = ("video",)

    ordering = (
        "video",
        "sequence_order",
    )

  
    @admin.display(description="Seq")
    def sequence_order_display(self, obj):return obj.sequence_order
    
    @admin.display(description="Text")
    def short_text(self, obj):return obj.text[:80]
    
    @admin.display(description="Video")
    def video_id_display(self, obj):return obj.video.id
    
    @admin.display(description="Start")
    def start_seconds_display(self, obj): return round(obj.start_seconds, 2)

    @admin.display(description="End")
    def end_seconds_display(self, obj):return round(obj.end_seconds, 2)



@admin.register(SubtitleTranslation)
class SubtitleTranslationAdmin(admin.ModelAdmin):

    list_display = (
        "id",
        "video_id",
        "original_text",
        "translated_preview",
        "language",
    )

    search_fields = (
        "translated_text",
        "segment__text",
        "segment__video__title",
    )

    list_filter = (
        "language",
        "segment__video",
    )

    ordering = ("-id",)

    readonly_fields = (
        "video_id",
        "original_text",
    )

    fields = (
        "video_id",
        "original_text",
        "language",
        "translated_text",
    )

    @admin.display(description="Video")
    def video_id(self, obj):

        return obj.segment.video.id

    @admin.display(description="Original")
    def original_text(self, obj):

        return obj.segment.text[:60]

    @admin.display(description="Translation")
    def translated_preview(self, obj):

        return obj.translated_text[:60]
