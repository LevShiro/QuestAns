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
    groups = Group_cards.objects.filter(Q(title__contains=query))[int(request.headers['start']):int(request.headers['end'])]
    data = {
        'groups':groups,
    }
    return render(request,"cards/particles/find_group.html",data)

def go_test(request,group_id):
    group = Group_cards.objects.get(id = group_id)
    cards = Card.objects.filter(in_group=group).order_by('?')
    
    context = {
        "group": group,
        "cards":cards
    }
    return render(request,"cards/go_test.html",context)