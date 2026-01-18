
from django import forms
from .models import Card



class CardForm(forms.ModelForm):
    question = forms.CharField(widget=forms.TextInput(attrs={
        'class': 'create_card__input_question',
        'placeholder': 'Вопрос'
    }))
    answer = forms.CharField(widget=forms.TextInput(attrs={
        'class':'create_card__input_answer',
        'placeholder':'Ответ'
    }))
    class Meta:
        model = Card
        fields = ["question","answer"]

