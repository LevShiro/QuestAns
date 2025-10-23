from django.shortcuts import render,redirect
from .forms import RegisterForm,LoginForm
from django.contrib.auth import login,authenticate
from django.contrib.auth import get_user_model

User = get_user_model()
# Create your views here.
def register_user(request):
    if request.method == "POST":
        form = RegisterForm(data=request.POST)
        if form.is_valid():
            new_user = form.save()
            login(request,new_user,backend='django.contrib.auth.backends.ModelBackend')
            return redirect('home')
    else:
        form = RegisterForm()
    context = {'form':form}
    return render(request, 'users/registration.html',context)

def login_user(request):
    if request.method == "POST":
        form = LoginForm(data=request.POST)
        
        if form.is_valid():
            username = form.cleaned_data['username']
            password = form.cleaned_data['password']
            if "@" in username:
                username = User.objects.get(email = username).username
            user = authenticate(username=username, password = password)
            if user is not None:
                login(request,user)
                return redirect('home')
    else:
        form = LoginForm()
    data = {'form':form}
    return render(request,'users/login.html',data)


    