from django.shortcuts import render,redirect
from django.contrib.auth import logout
from .models import *
# Create your views here.
def cards(request,group_id,group_name):
    group = Group_cards.objects.get(id=group_id)
    cards = Card.objects.filter(in_group=group)
    arr_cards = []
    for card in cards:
        arr_cards.append({'card_object':card,'gallery':GalleryCard.objects.filter(card=card)})
    
    context = {
        'group':group,
        'cards':arr_cards
        }
    return render(request,'cards/group.html',context)