from django.shortcuts import render,redirect
from django.http import HttpResponse
from django.db.models import Q
import urllib.parse
from django.forms import formset_factory
import threading
import json

from .models import *
# Create your views here. im 
def cards(request,group_id):
    group = Group_cards.objects.get(id=group_id)
    cards = Card.objects.filter(in_group=group)
    group_was_rated = group.was_rated(request.user)
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
            groups = Group_cards.objects.filter(Q(title__contains=query)).all()
            groups = sorted(groups, key=lambda group: group.quantity_raits(),reverse=True)[int(request.headers['start']):int(request.headers['end'])]
        elif format_sort=="5":
           format_sort = '-title'
           groups = Group_cards.objects.filter(Q(title__contains=query)).order_by(format_sort)[int(request.headers['start']):int(request.headers['end'])]
        elif format_sort=="4":
            format_sort='-author'
            groups = Group_cards.objects.filter(Q(title__contains=query)).order_by(format_sort)[int(request.headers['start']):int(request.headers['end'])]
        elif format_sort=="3":
            groups = Group_cards.objects.filter(Q(title__contains=query)).all()
            groups = sorted(groups, key=lambda group: group.group_raiting(),reverse=True)[int(request.headers['start']):int(request.headers['end'])]
        else:
              groups = Group_cards.objects.filter(Q(title__contains=query)).order_by('title')[int(request.headers['start']):int(request.headers['end'])]
    
      
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
        
        group = Group_cards.objects.get(id=group_id)
        
        cards = Card.objects.filter(in_group=group)
        card = cards[int(card_id)-1]
        
        data = {
            'group':group,
            'card':card
        }
        return render(request,'cards/particles/test_place.html',data)
    
def send_quest(request):
    if request.method == "POST":
        
        answers = request.body
        group_id = request.headers['group_id']
        group = Group_cards.objects.get(id=group_id)
        
        answer = json.loads(answers.decode('utf-8')) 
        
        results=[]
        
        cards = Card.objects.filter(in_group=group)
        for i in range(cards.count()):
            if not (str(i+1) in answer):
                results.append([cards[i].question,cards[i].answer,"","Неправильно"])
            elif cards[i].answer.lower() == answer[str(i+1)].lower():
                results.append([cards[i].question,cards[i].answer,answer[str(i+1)],"Правильно"])
            else:
                results.append([cards[i].question,cards[i].answer,answer[str(i+1)],"Неправильно"])
        print(results)
        data = {
            'results':results,
            'group_id':group_id,
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


log_mutex = threading.Lock()
def create_group(request):
    log_mutex.acquire()
    if request.method =="POST":
        title = request.POST.get('group_name')
        input_question = request.POST.get('input_question')
        input_answer = request.POST.get('input_answer')
        print(title,input_question,input_answer)
        if Group_cards.objects.filter(title=title).exists() == False:
            group = Group_cards.objects.create(title=title,author = request.user)
            print(group,'группа создана')
        else:
            group = Group_cards.objects.get(title=title,author = request.user)
            print(group,'группа найдена')
        Card.objects.create(question=input_question,answer = input_answer,in_group = group)
        log_mutex.release()
        return redirect("group",group.id)
    log_mutex.release()
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


    
    
    

