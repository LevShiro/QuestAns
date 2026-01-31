from django.shortcuts import render,redirect
from django.http import HttpResponse
from django.db.models import Q
import urllib.parse
from django.forms import formset_factory
from .funcs import *
import json
import random

from .models import *
# Create your views here. im 
def cards(request,group_id):
    group = Group_cards.objects.get(id=group_id)
    cards = Card.objects.filter(in_group=group)
    group_was_rated = group.was_rated(request.user)
    group_was_save=False
    if request.user.is_authenticated:
        group_was_save = request.user.save_group.filter(id=group_id).exists()
    
    arr_cards = []
    
    for card in cards:
        arr_cards.append({'card_object':card,'gallery':GalleryCard.objects.filter(card=card)})
    
    context = {
        'group':group,
        'cards':arr_cards,
        'was_rated':group_was_rated,
        'was_save':group_was_save
    }
    return render(request,'cards/group.html',context)

#@ratelimit(key='ip',rate='1/s',block=True)
def find_cards(request):
    if request.method == "GET":
        query=request.headers['group-name']
        query = urllib.parse.unquote(query)
        format_sort = request.headers['sort']
        if format_sort == "6":
            groups = Group_cards.objects.filter(Q(title__contains=query),is_private = False).all()
            groups = sorted(groups, key=lambda group: group.quantity_raits(),reverse=True)[int(request.headers['start']):int(request.headers['end'])]
        elif format_sort=="5":
           format_sort = '-title'
           groups = Group_cards.objects.filter(Q(title__contains=query,is_private = False)).order_by(format_sort)[int(request.headers['start']):int(request.headers['end'])]
        elif format_sort=="4":
            format_sort='-author'
            groups = Group_cards.objects.filter(Q(title__contains=query,is_private = False)).order_by(format_sort)[int(request.headers['start']):int(request.headers['end'])]
        elif format_sort=="3":
            groups = Group_cards.objects.filter(Q(title__contains=query,is_private = False)).all()
            groups = sorted(groups, key=lambda group: group.group_raiting(),reverse=True)[int(request.headers['start']):int(request.headers['end'])]
        else:
            groups = Group_cards.objects.filter(Q(title__contains=query),is_private = False).order_by('title')[int(request.headers['start']):int(request.headers['end'])]
        
      
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

def get_quest(request):
    if request.method == "GET":
        group_id = request.headers['group-id']
        card_id = request.headers['card-id']
        seed = request.headers['seed']
        random.seed(seed)
        group = Group_cards.objects.get(id=group_id)
        cards = Card.objects.filter(in_group=group)
        cards = random.sample(list(cards),cards.count())
        print(cards)
        try:
            card = cards[int(card_id)-1]
        except:
            return HttpResponse(status=416)
        
        is_last_card = False
        
        if int(card_id) == len(cards):
            is_last_card = True
        
        gallery = GalleryCard.objects.filter(card=card)
        data = {
            'group':group,
            'card':card,
            'is_last_card': is_last_card,
            'gallery':gallery
        }
        return render(request,'cards/particles/test_place.html',data)
    
def send_quest(request):
    if request.method == "POST":
        seed = request.headers['seed']
        answers = request.body
        group_id = request.headers['group_id']
        group = Group_cards.objects.get(id=group_id)
        
        answer = json.loads(answers.decode('utf-8')) 
        
        results=[]
        
        random.seed(seed)
        cards = Card.objects.filter(in_group=group)
        cards = random.sample(list(cards),cards.count())
        true = 0
        for i in range(len(cards)):
            if not (str(i+1) in answer):
                results.append([cards[i].question,cards[i].answer,"","Неправильно"])
            elif cards[i].answer.lower() == answer[str(i+1)].lower():
                true += 1
                results.append([cards[i].question,cards[i].answer,answer[str(i+1)],"Правильно"])
            else:
                results.append([cards[i].question,cards[i].answer,answer[str(i+1)],"Неправильно"])
        
        data = {
            'results':results,
            'group_id':group_id,
            'true':true,
        }
        return render(request,'cards/result.html',data)

def user_raiting(request):
    group_id = request.headers['group-id']
    group =  Group_cards.objects.get(id = group_id)
    raiting = int(request.headers['mark'])
    rait_in_db = UserRaiting.objects.filter(user = request.user, group = group)
    print(rait_in_db)
    if rait_in_db.exists() and raiting==0:
        rait_in_db[0].delete()
    else:
        if raiting>5 or raiting<0:
            return HttpResponse(status=200)
        elif rait_in_db.exists() == False and (raiting<=5 and raiting>0):
            user_raiting = UserRaiting.objects.create(user = request.user,raiting = raiting,group = group)
            user_raiting.save()
    return HttpResponse(status=200)

def create_group(request):
    
    if request.method =="POST":
        is_private = request.POST.get('is_private')
        main_photo = request.FILES.get('photo-main')
        title = request.POST.get('group_name')
        input_question = request.POST.getlist('input_question')
        input_answer = request.POST.getlist('input_answer')
        print(is_private,123)
        
        if is_private=='on':
            is_private = True
        else: is_private = False
        
        if Group_cards.objects.filter(title=title).exists() == False:
            if main_photo is None:
                group = Group_cards.objects.create(title=title,author = request.user, is_private = is_private)
            else:
                group = Group_cards.objects.create(title=title,author = request.user,photo=main_photo, is_private = is_private)
            arr_photo = get_photos(request)
            for i in range(len(input_answer)):
                new_card = Card.objects.create(question = input_question[i], answer = input_answer[i], in_group = group)
                if len(arr_photo)!=0:
                    for photo in arr_photo[i]:
                        GalleryCard.objects.create(photo=photo,card=new_card)
            return redirect('group',group.id)
        
    return render(request, 'cards/create_group.html')

def save_group(request):
    group_id = request.headers['group-id']
    is_exist = request.user.save_group.filter(id=group_id).exists()
    group = Group_cards.objects.get(id=group_id)
    
    if request.headers['save'] == 'true':
        save = True
    else:
        save = False
    
    if save and not(is_exist):
        request.user.save_group.add(group)
    elif not(save) and is_exist:
        request.user.save_group.remove(group)
    return HttpResponse(status=200)

def delete_group(request,group_id):
    group = Group_cards.objects.get(id=group_id)
    group.photo.delete(False)
    if request.user.is_superuser or group.author == request.user:
        cards = Card.objects.filter(in_group = group)
        for card in cards:
            gallerys = GalleryCard.objects.filter(card=card)
            if gallerys.exists():
                for gallery in gallerys:
                    gallery.photo.delete(False)
        group.delete()
    return redirect('home')