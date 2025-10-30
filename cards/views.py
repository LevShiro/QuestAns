from django.shortcuts import render,redirect
from django.contrib.auth import logout

# Create your views here.
def cards(request):
    if "logout-button" in request.POST:
        logout(request)
        return redirect('cards')
    return render(request,'cards/cards_main.html')