from django.shortcuts import render,redirect
from django.contrib.auth import logout
from django.http import JsonResponse
from django.db.models import Q

from .models import *
# Create your views here. im 
def cards(request,group_id):
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

def find_cards(request):
    if request.method == "GET":
        query=request.headers['group-name']
    groups = Group_cards.objects.filter(Q(title__contains=query))[:5]
    print(groups)
    data = {
        'groups':groups,
        'input_value':query,
    }
    return render(request,"cards/particles/find_group.html",data)
    