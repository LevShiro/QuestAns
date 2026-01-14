from django.shortcuts import render,redirect
from django.contrib.auth import logout
from cards.models import Group_cards
from django.views import View
# Create your views here.
def main(request):
    groups = Group_cards.objects.all()[:5]
    
    if "logout-button" in request.POST:
        logout(request)
        return redirect('home')
    context = {'groups':groups}
    return render(request,'main/main.html',context)

