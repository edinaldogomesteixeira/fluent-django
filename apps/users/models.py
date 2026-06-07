from django.db import models
from django.contrib.auth.models import User


class Language(models.Model):

    name = models.CharField(max_length=50)

    code = models.CharField(max_length=10, unique=True)

    translation_code = models.CharField(max_length=10, blank=True, null=True)

    flag = models.CharField(max_length=20)

    is_active = models.BooleanField(default=True)

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):

        return self.name


class UserProfile(models.Model):

    GOAL_CHOICES = [
        ("travel", "Travel"),
        ("work", "Work"),
        ("study", "Study"),
        ("personal", "Personal"),
    ]

    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name="profile")

    language_native = models.ForeignKey(
        Language,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="native_users",
    )

    language_learning = models.ForeignKey(
        Language,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="learning_users",
    )

    learning_goal = models.CharField(
        max_length=20, choices=GOAL_CHOICES, null=True, blank=True
    )

    created_at = models.DateTimeField(auto_now_add=True)

    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):

        return self.user.username
