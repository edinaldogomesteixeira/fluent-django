from django.contrib.auth.backends import ModelBackend

from django.contrib.auth.models import User


class EmailOrUsernameBackend(ModelBackend):

    def authenticate(
        self,
        request,
        username=None,
        password=None,
        **kwargs
    ):

        user = None

        # LOGIN COM EMAIL

        if username and '@' in username:

            user = User.objects.filter(
                email__iexact=username
            ).first()

        # LOGIN COM USERNAME

        else:

            user = User.objects.filter(
                username=username
            ).first()

        if not user:

            return None

        if user.check_password(password):

            return user

        return None