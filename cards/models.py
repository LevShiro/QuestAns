from django.db import models
from django.contrib.auth import get_user_model
from django.db.models import Sum

User = get_user_model()
# Create your models here.
class Group_cards(models.Model):
    title = models.CharField(max_length=64)
    author = models.ForeignKey(User,on_delete=models.CASCADE,blank=True)
    def group_raiting(self):
        sum_raitings = UserRaiting.objects.filter(group=self).aggregate(Sum('raiting'))
        
        
        if UserRaiting.objects.filter(group=self).count() == 0:
            return 0
        
        return sum_raitings['raiting__sum'] / UserRaiting.objects.filter(group=self).count()
    def __str__(self):
        return self.title
    
    

class Card(models.Model):
    question = models.CharField(max_length=1000)
    answer = models.CharField(max_length=100)
    in_group = models.ForeignKey(Group_cards,on_delete=models.CASCADE,blank=True)
    def __str__(self):
        return self.question
    
class GalleryCard(models.Model):
    photo = models.ImageField(null=True,blank=True,upload_to="media/imagecards")
    card = models.ForeignKey(Card,on_delete=models.CASCADE,blank=True,default=None)
    def __str__(self):
        return str(f"{self.card}_{self.photo}")

class UserRaiting(models.Model):
    user = models.ForeignKey(User,on_delete=models.CASCADE)
    raiting = models.IntegerField()
    group = models.OneToOneField(Group_cards,on_delete=models.CASCADE)
    def __str__(self):
        return f"{self.user}_{self.group}"
    