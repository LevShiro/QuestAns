from django.shortcuts import render,redirect
from django.contrib.auth import logout
from django.http import HttpResponse
from django.db.models import Q
from django_ratelimit.decorators import ratelimit
import urllib.parse
import json

from .models import *
# Create your views here. im 
def cards(request,group_id):
    group = Group_cards.objects.get(id=group_id)
    cards = Card.objects.filter(in_group=group)
    group_was_rated = group.was_rated(request.user)
    arr_cards = []
    
    for card in cards:
        arr_cards.append({'card_object':card,'gallery':GalleryCard.objects.filter(card=card)})
    context = {
        'group':group,
        'cards':arr_cards,
        'was_rated':group_was_rated
    }
    return render(request,'cards/group.html',context)

#@ratelimit(key='ip',rate='1/s',block=True)
def find_cards(request):
    if request.method == "GET":
        query=request.headers['group-name']
        query = urllib.parse.unquote(query)
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

def user_raiting(request):
    print(123)
    group_id = request.headers['group-id']
    group =  Group_cards.objects.get(id = group_id)
    raiting = int(request.headers['mark'])
    rait_in_db = UserRaiting.objects.filter(user = request.user, group = group)
    
    if rait_in_db.exists() and raiting==0:
        rait_in_db[0].delete()
        print(f'{group} удалена')
    else:
        if raiting>5 or raiting<0:
            return HttpResponse(status=200)
        else:
            user_raiting = UserRaiting.objects.create(user = request.user,raiting = raiting,group = group)
            user_raiting.save()
    return HttpResponse(status=200)

