from django.db import models
from ..users.models import User

# Create your models here.
class Group_cards(models.Model):
    title = models.CharField(max_length=64)
    author = models.ForeignKey(User,on_delete=models.CASCADE,blank=True)