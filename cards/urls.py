
from django.urls import path
from . import views

urlpatterns = [
    path('group_id=<int:group_id>',views.cards,name='group'),
    path('api/find_cards/',views.find_cards,name='find_cards'),
    
]