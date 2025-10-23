from django.db import models
from django.contrib.auth.models import AbstractUser
from django.conf import settings

# Create your models here.
class User(AbstractUser):
    email = models.EmailField()
    avatar = models.ImageField(null=True,blank=True,upload_to="users/avatars")
    banned = models.BooleanField(blank=True,default=False)
    is_moderator = models.BooleanField(blank=True,default=False)
    