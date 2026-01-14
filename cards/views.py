from django.shortcuts import render,redirect
from django.http import HttpResponse
from django.db.models import Q
import urllib.parse
from .forms import CardForm
from django.forms import formset_factory


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

def user_raiting(request):
    print(123)
    group_id = request.headers['group-id']
    group =  Group_cards.objects.get(id = group_id)
    raiting = int(request.headers['mark'])
    rait_in_db = UserRaiting.objects.filter(user = request.user, group = group)
    print(rait_in_db)
    if rait_in_db.exists() and raiting==0:
        rait_in_db[0].delete()
        print(f'{group} удалена')
    else:
        if raiting>5 or raiting<0:
            return HttpResponse(status=200)
        elif rait_in_db.exists() == False and (raiting<=5 and raiting>0):
            user_raiting = UserRaiting.objects.create(user = request.user,raiting = raiting,group = group)
            user_raiting.save()
    return HttpResponse(status=200)


def create_group(request):
    if request.method =="POST":
        title = request.POST.get('group_name')
        input_question = request.POST.get('input_question')
        input_answer = request.POST.get('input_answer')
        print(title,input_question,input_answer)
        if Group_cards.objects.filter(title=title,author = request.user).exists() == False:
            group = Group_cards.objects.create(title=title,author = request.user)
            group.save()
            
        else:
            group = Group_cards.objects.get(title=title,author = request.user)
        Card.objects.create(question=input_question,answer = input_answer,in_group = group).save()

    return redirect("group",group.id)


    
    
    

