from django.db import models
from django.contrib.auth.models import User


class Language(models.Model):

    code = models.CharField(
        max_length=10,
        unique=True
    )

    name = models.CharField(
        max_length=50
    )

    flag = models.CharField(
        max_length=20
    )

    is_active = models.BooleanField(
        default=True
    )

    created_at = models.DateTimeField(
        auto_now_add=True
    )

    def __str__(self):

        return self.name


class UserProfile(models.Model):

    GOAL_CHOICES = [

        ('travel', 'Travel'),

        ('work', 'Work'),

        ('study', 'Study'),

        ('personal', 'Personal'),
    ]

    user = models.OneToOneField(

        User,

        on_delete=models.CASCADE,

        related_name='profile'
    )

    current_language = models.ForeignKey(

        Language,

        on_delete=models.SET_NULL,

        null=True,

        blank=True
    )

    learning_goal = models.CharField(

        max_length=20,

        choices=GOAL_CHOICES,

        null=True,

        blank=True
    )

    created_at = models.DateTimeField(
        auto_now_add=True
    )

    updated_at = models.DateTimeField(
        auto_now=True
    )

    def __str__(self):

        return self.user.username