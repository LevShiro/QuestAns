from django.shortcuts import render,redirect
from django.contrib.auth import logout
# Create your views here.
def index(request):
    if "logout-button" in request.POST:
        logout(request)
        return redirect('home')
    return render(request,'main/main.html')