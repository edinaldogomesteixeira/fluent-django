import json

from django.http import JsonResponse

from django.views.decorators.csrf import csrf_exempt

from django.contrib.auth.models import User

from apps.videos.models import Video

from .models import WatchProgress

from django.contrib.auth.decorators import login_required


@csrf_exempt
@login_required
def save_progress(request):

    if request.method != "POST":

        return JsonResponse({"error": "POST required"}, status=400)

    data = json.loads(request.body)

    video_id = data.get("video_id")

    current_seconds = data.get("current_seconds", 0)

    duration_seconds = data.get("duration_seconds", 0)

    progress_percent = data.get("progress_percent", 0)

    video = Video.objects.get(id=video_id)

    progress, created = WatchProgress.objects.get_or_create(
        user=request.user, video=video
    )

    progress.current_seconds = current_seconds

    progress.duration_seconds = duration_seconds

    progress.progress_percent = progress_percent

    if progress_percent >= 90:

        progress.is_completed = True

    progress.save()

    return JsonResponse({"success": True})


@login_required
def get_progress(request, video_id):

    user = request.user

    try:

        progress = WatchProgress.objects.get(user=user, video_id=video_id)

        data = {
            "current_seconds": progress.current_seconds,
            "progress_percent": progress.progress_percent,
        }

    except WatchProgress.DoesNotExist:

        data = {
            "current_seconds": 0,
            "progress_percent": 0,
        }

    return JsonResponse(data)


def continue_watching(request):

    if not request.user.is_authenticated:

        return JsonResponse([], safe=False)

    language_learning = request.user.profile.language_learning

    progress_list = (
        WatchProgress.objects.filter(
            user=request.user,
            video__language=language_learning,
            progress_percent__gt=1,
            progress_percent__lt=95,
        )
        .select_related("video")
        .order_by("-updated_at")[:20]
    )

    data = []

    for progress in progress_list:

        video = progress.video

        data.append(
            {
                "id": video.id,
                "title": video.title,
                "description": video.description,
                "image": video.image,
                "preview": video.preview,
                "level": video.level,
                "words": video.words,
                "progress": progress.progress_percent,
            }
        )

    return JsonResponse(data, safe=False)


from django.db.models import Sum

from django.db.models import Avg


@login_required
def learning_analytics(request):

    language_learning = request.user.profile.language_learning

    progress_list = WatchProgress.objects.filter(
        user=request.user, video__language=language_learning
    )

    total_videos = progress_list.count()

    completed_videos = progress_list.filter(is_completed=True).count()

    total_watch_seconds = (
        progress_list.aggregate(total=Sum("current_seconds"))["total"] or 0
    )

    total_words = 0

    favorite_categories = {}

    for progress in progress_list:

        video = progress.video

        total_words += video.words or 0

        for category in video.categories.all():

            if category.name not in favorite_categories:

                favorite_categories[category.name] = 0

            favorite_categories[category.name] += 1

    sorted_categories = sorted(
        favorite_categories.items(), key=lambda item: item[1], reverse=True
    )

    data = {
        "total_videos": total_videos,
        "completed_videos": completed_videos,
        "total_watch_seconds": total_watch_seconds,
        "total_words": total_words,
        "favorite_categories": sorted_categories[:5],
    }

    return JsonResponse(data)
