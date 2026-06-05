from django.http import JsonResponse
from django.shortcuts import render, redirect

from django.views.decorators.http import require_POST
from django.contrib.auth.decorators import login_required

from django.contrib.auth import login

from .models import Language
from .forms import RegisterForm

from django.contrib.auth.views import LoginView
from .forms import LoginForm


# ==========================================
# REGISTER
# ==========================================

def register_view(request):

    if request.method == 'POST':

        form = RegisterForm(request.POST)

        if form.is_valid():

            user = form.save()

            login(
                request,
                user,
                backend='apps.users.backends.EmailOrUsernameBackend'
            )

            return redirect(
                '/onboarding/language/'
            )

    else:

        form = RegisterForm()

    return render(

        request,

        'registration/register.html',

        {
            'form': form
        }
    )


# ==========================================
# LANGUAGE
# ==========================================

@login_required
def language_view(request):

    languages = Language.objects.filter(
        is_active=True
    )

    return render(

        request,

        'onboarding/language.html',

        {
            'languages': languages
        }
    )


# ==========================================
# SAVE LANGUAGE
# ==========================================

@login_required
@require_POST
def save_language(request):

    code = request.POST.get(
        'language'
    )

    language = Language.objects.get(
        code=code
    )

    profile = request.user.profile

    profile.current_language = language

    profile.save()

    return redirect(
        '/onboarding/goal/'
    )


# ==========================================
# GOAL
# ==========================================

@login_required
def goal_view(request):

    return render(

        request,

        'onboarding/goal.html'
    )


# ==========================================
# SAVE GOAL
# ==========================================

@login_required
@require_POST
def save_goal(request):

    goal = request.POST.get(
        'goal'
    )

    profile = request.user.profile

    profile.learning_goal = goal

    profile.save()

    return redirect(
        '/explore/'
    )


# ==========================================
# API LANGUAGES
# ==========================================

def language_list(request):

    languages = Language.objects.filter(
        is_active=True
    )

    data = []

    for language in languages:

        data.append({

            'id': language.id,

            'code': language.code,

            'name': language.name,

            'flag': language.flag,
        })

    return JsonResponse(
        data,
        safe=False
    )


# ==========================================
# CHANGE LANGUAGE
# ==========================================

@login_required
@require_POST
def change_language(request):

    import json

    data = json.loads(
        request.body
    )

    code = data.get(
        'language'
    )

    language = Language.objects.get(
        code=code
    )

    profile = request.user.profile

    profile.current_language = language

    profile.save()

    return JsonResponse({

        'success': True,

        'language': language.code
    })


class CustomLoginView(LoginView):

    template_name = 'registration/login.html'

    authentication_form = LoginForm