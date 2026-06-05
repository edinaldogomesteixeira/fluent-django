import os
from django.conf import settings
from django.http import JsonResponse
from django.shortcuts import (
    render,
    get_object_or_404
)

from .models import Video, Category
from apps.users.models import UserProfile


def video_list(request):

    if (

        request.user.is_authenticated

        and

        request.user.profile.current_language

    ):

        videos = Video.objects.filter(

            language=
            request.user.profile.current_language

        )

    else:

        videos = Video.objects.all()


    data = []

    for video in videos:

        data.append({

            'id': video.id,

            'title': video.title,

            'description': video.description,

            'image': video.image,
            
            'preview': video.preview,

            'level': video.level,

            'words': video.words,

            'provider': video.provider,

            'video': video.video,

            'youtubeId': video.youtube_id,

            'hls': video.hls,

            'subtitles': video.subtitles,

            'categories': [

                {
                    'name': category.name,
                    'slug': category.slug,
                }

                for category in video.categories.all()

            ],
        })

    return JsonResponse(
        data,
        safe=False
    )


from ranged_response import (
    RangedFileResponse
)

def stream_video(
    request,
    video_id
):

    video = get_object_or_404(
        Video,
        id=video_id
    )

    file_path = os.path.join(

        settings.BASE_DIR,

        video.video.lstrip('/')
    )

    file_handle = open(
        file_path,
        'rb'
    )

    response = RangedFileResponse(

        request,

        file_handle,

        content_type='video/mp4'
    )

    response['Accept-Ranges'] = (
        'bytes'
    )

    return response

from django.views.decorators.http import require_POST
from django.contrib.auth.decorators import login_required

@login_required
@require_POST
def upload_video(request):

    title = request.POST.get('title')

    level = request.POST.get('level')

    video_file = request.FILES.get(
        'video_file'
    )

    if not video_file:

        return JsonResponse(
            {
                'success': False,
                'message': 'Video required'
            },
            status=400
        )

    video_path = (
        f'media/videos/{video_file.name}'
    )

    import os

    os.makedirs(
        'media/videos',
        exist_ok=True
    )

    with open(
        video_path,
        'wb+'
    ) as destination:

        for chunk in video_file.chunks():

            destination.write(chunk)
    
    profile = request.user.profile

    video = Video.objects.create(

        title=title or video_file.name,

        provider='local',

        video='/' + video_path,

        level=level,

        status='ready',

        language=profile.current_language

    )

    default_category = Category.objects.filter(
        name='Most Recent'
    ).first()

    if default_category:

        video.categories.add(
            default_category
        )

    return JsonResponse({

        'success': True,

        'video_id': video.id

    })

from apps.videos.services.video_import_service import (import_youtube_to_bunny)
from django.views.decorators.csrf import csrf_exempt

@csrf_exempt
@login_required
@require_POST
def import_youtube(request):
 
    youtube_url = request.POST.get(
        'youtube_url'
    )

    category_id = request.POST.get(
            "category_id"
        )


    if not youtube_url:

        return JsonResponse({

            'success': False,

            'message':
                'Youtube URL required'

        }, status=400)

    try:

        video = import_youtube_to_bunny(

            youtube_url,

            request.user.profile.current_language

        )
        if category_id:

            category = Category.objects.filter(

                id=category_id

            ).first()

            if category:

                video.categories.add(
                    category
                )

        return JsonResponse({

            'success': True,

            'video_id': video.id,

            'title': video.title

        })

    except Exception as e:

        return JsonResponse({

            'success': False,

            'message': str(e)

        }, status=500)
    


def category_list(request):

    data = []

    for category in Category.objects.all():

        data.append({

            "id": category.id,

            "name": category.name,

            "slug": category.slug

        })

    return JsonResponse(
        data,
        safe=False
    )