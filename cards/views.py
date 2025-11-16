from django.shortcuts import render,redirect
from django.contrib.auth import logout
from django.http import JsonResponse

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
        print(request.headers['group-name'])
    data = {'my_answer':'Ответ получен!'}
    return JsonResponse(data)