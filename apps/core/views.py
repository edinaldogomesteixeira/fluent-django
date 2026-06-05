from django.shortcuts import (
    render,
    redirect
)

from django.contrib.auth.decorators import (
    login_required
)


# ==========================================
# LANDING PAGE (PÚBLICA)
# ==========================================

def home(request):

    return render(

        request,

        'marketing/landing.html'
    )


# ==========================================
# EXPLORE
# ==========================================

@login_required
def explore_page(request):

    profile = request.user.profile

    if not profile.current_language:

        return redirect(
            '/onboarding/language/'
        )

    if not profile.learning_goal:

        return redirect(
            '/onboarding/goal/'
        )

    return render(

        request,

        'core/home.html'
    )

@login_required
def explore_content(request):

    return render(
        request,
        'core/explore.html'
    )

# ==========================================
# VIDEO
# ==========================================

@login_required
def video_page(request):

    return render(

        request,

        'core/video.html'
    )


# ==========================================
# READING
# ==========================================

@login_required
def reading_page(request):

    return render(

        request,

        'core/reading.html'
    )


# ==========================================
# PLAY
# ==========================================

@login_required
def play_page(request):

    return render(

        request,

        'core/play.html'
    )


# ==========================================
# COURSES
# ==========================================

@login_required
def courses_page(request):

    return render(

        request,

        'core/courses.html'
    )


# ==========================================
# TOPIC
# ==========================================

@login_required
def topic_page(request):

    return render(

        request,

        'core/topic.html'
    )


# ==========================================
# DASHBOARD
# ==========================================

@login_required
def dashboard_page(request):

    return render(

        request,

        'core/dashboard.html'
    )