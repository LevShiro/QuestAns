from django.shortcuts import render,redirect
from django.contrib.auth import logout
from cards.models import Group_cards
# Create your views here.
def main(request):
    groups = Group_cards.objects.all()
    print(groups)
    if "logout-button" in request.POST:
        logout(request)
        return redirect('home')
    context = {'groups':groups}
    return render(request,'main/main.html',context)