from django.shortcuts import render
from cards.models import Group_cards
# Create your views here.
def profile(request):
    my_groups = Group_cards.objects.filter(author = request.user)
    context = {'my_groups':my_groups}
    return render(request,'profileApp/profile.html',context)

def create_group(request):
    
    return render(request,'profileApp/create_group.html')