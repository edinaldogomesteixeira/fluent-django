from django import forms

from django.contrib.auth.models import User

from django.contrib.auth.forms import (
    UserCreationForm,
    AuthenticationForm
)


class RegisterForm(UserCreationForm):

    email = forms.EmailField(

        required=True,

        widget=forms.EmailInput(
            attrs={
                "placeholder": "Email"
            }
        )
    )

    username = forms.CharField(

        widget=forms.TextInput(
            attrs={
                "placeholder": "Usuário"
            }
        )
    )

    password1 = forms.CharField(

        widget=forms.PasswordInput(
            attrs={
                "placeholder": "Senha"
            }
        )
    )

    password2 = forms.CharField(

        widget=forms.PasswordInput(
            attrs={
                "placeholder": "Confirmar senha"
            }
        )
    )

    class Meta:

        model = User

        fields = (

            'username',

            'email',

            'password1',

            'password2'
        )

    def clean_email(self):

        email = self.cleaned_data['email']

        if User.objects.filter(
            email__iexact=email
        ).exists():

            raise forms.ValidationError(
                'Este email já está cadastrado.'
            )

        return email


class LoginForm(AuthenticationForm):

    username = forms.CharField(

        required=True,

        error_messages={
            'required':
                'Por favor, informe seu email ou usuário.'
        },

        widget=forms.TextInput(
            attrs={
                "placeholder":
                    "Email ou usuário"
            }
        )
    )

    password = forms.CharField(

        required=True,

        error_messages={
            'required':
                'Por favor, informe sua senha.'
        },

        widget=forms.PasswordInput(
            attrs={
                "placeholder":
                    "Senha"
            }
        )
    )

    error_messages = {

        'invalid_login':

            'Email/usuário ou senha inválidos.',

        'inactive':

            'Esta conta está desativada.'
    }