
from django.urls import path
from . import views

urlpatterns = [
    path('group=<str:group_name>(<int:group_id>)',views.cards,name='group')
]