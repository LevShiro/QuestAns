from django.contrib.auth.forms import UserCreationForm,AuthenticationForm
from django import forms
from django.forms import TextInput,PasswordInput
from django.contrib.auth import get_user_model
from django.contrib.auth import authenticate
from django.core.exceptions import ValidationError
import re

User=get_user_model()

class RegisterForm(UserCreationForm):
    
    username = forms.CharField(min_length=3,max_length=10,widget=TextInput(attrs={
        'class':'form-input',
        'placeholder':'Логин'
    }))
    email = forms.CharField(min_length=3,widget=TextInput(attrs={
        'class':'form-input',
        'placeholder':'Эл. адрес'
    }))
    password1 =  forms.CharField(widget=PasswordInput(attrs={
        'class':'form-input',
        'placeholder':'Пароль'
    }))
    password2 = forms.CharField(widget=PasswordInput(attrs={
        'class':'form-input',
        'placeholder':'Повторите ваш пароль'
    }))
        
    def clean_password2(self):
        password1 = self.cleaned_data['password1']
        
        if not(bool(re.search("[a-zA-Z]",password1))):
            raise ValidationError("Пароль должен состоять из символов латиницы (a-z,A-Z) и цифр")
        return password1
    def save(self, commit=True):
        user = User.objects.create_user(
            email=self.cleaned_data['email'],
            username=self.cleaned_data['username'],
            password=self.cleaned_data['password1']
        )
        return user
    class Meta:
        model = User
        fields = ('email','username','password1','password2')

class LoginForm(AuthenticationForm):
    username = forms.CharField(min_length=3,widget=TextInput(attrs={
        'class':'form-input',
        'placeholder':'Логин/email'
    }))
    password = forms.CharField(widget=PasswordInput(attrs={
        'class':'form-input',
        'placeholder':'Пароль'
    }))
    def clean(self):
        username = self.cleaned_data.get('username')
        password = self.cleaned_data.get('password')
        if username and password:
            if '@' in username:
                user = User.objects.get(email=username)
                self.user_cache = authenticate(username = user.username, password=password)
            else:
                self.user_cache = authenticate(username = username, password=password)
        if self.user_cache is None:
            raise ValidationError('Неправильно введён пароль или имя пользователя (или email)')
        else:
            self.confirm_login_allowed(self.user_cache)
        return self.cleaned_data
    
    
    
