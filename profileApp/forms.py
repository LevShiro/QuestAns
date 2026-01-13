from django import forms
from django.contrib.auth import get_user_model

User=get_user_model()

class EditProfileImageForm(forms.ModelForm):
    avatar = forms.ImageField(required=False) #required = False убирает "Выберите файл"
    class Meta:
        model = User
        fields = ['avatar']