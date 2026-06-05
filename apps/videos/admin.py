from django.contrib import admin

from .models import (
    Video,
    Category
)


#admin.site.register(Video)
@admin.register(Video)
class VideoAdmin(admin.ModelAdmin):

    list_display = (

        'id',
        'language',
        'provider',
        'title',
        'get_categories',
        'status',
        'level',
        'duration',
        'words',
        'created_at',
    )

    list_filter = (
        'language',
        'status',
        'level',
    )

    filter_horizontal = (
        'categories',
    )

    search_fields = (

        'title',

        'youtube_url',
    )

    ordering = (
        '-created_at',
    )

    list_per_page = 50

    def get_categories(self, obj):

        return ", ".join(

            category.name

            for category in obj.categories.all()

        )

    get_categories.short_description = 'Categories'


admin.site.register(Category)

    