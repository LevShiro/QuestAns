from django.shortcuts import render,redirect
from cards.models import Group_cards
from .forms import EditProfileImageForm
from django.contrib.auth import get_user_model

User = get_user_model()

# Create your views here.
def profile(request):
    my_groups = Group_cards.objects.filter(author = request.user)
    
    if 'photo_edit_button' in request.POST:
           form_avatar = EditProfileImageForm(request.POST,request.FILES,instance=request.user)
           if form_avatar.is_valid() and len(list(request.FILES))!=0:
               #Удаление старой аватарки
               user_uplodading = User.objects.get(id=request.user.id)
               user_uplodading.avatar.delete(False)
               #сохранение фотки
               user_uplodading.avatar = form_avatar.cleaned_data['avatar']
               user_uplodading.save()
               return redirect('profile')
           
    else:
            form_avatar = EditProfileImageForm()
    
    context = {
        'form': form_avatar,
        'my_groups':my_groups,
        'user':request.user
    }
    return render(request,'profileApp/profile.html',context)

