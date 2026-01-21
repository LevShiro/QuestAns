from django.db import models
from django.contrib.auth.models import AbstractUser
from django.conf import settings
from cards.models import Group_cards
#from django.apps import apps

#Group_cards = apps.get_model('cards','Group_cards')
# Create your models here.
class User(AbstractUser):
    email = models.EmailField()
    avatar = models.ImageField(null=True,blank=True,upload_to="users/avatars")
    save_group = models.ForeignKey(Group_cards,on_delete=models.CASCADE)
    banned = models.BooleanField(blank=True,default=False)
    is_moderator = models.BooleanField(blank=True,default=False)
    