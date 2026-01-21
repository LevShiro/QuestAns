
from django.urls import path
from . import views

urlpatterns = [
    path('group_id=<int:group_id>',views.cards,name='group'),
    path('group_id=<int:group_id>/go_test',views.go_test,name='go_test'),
    path('api/get_quest/',views.get_quest,name='get_quest'),
    path('api/send_quest/',views.send_quest,name='send_quest'),
    path('api/find_cards/',views.find_cards,name='find_cards'),
    path('api/raiting_group/',views.user_raiting,name='raiting_group'),
    path('create_group/',views.create_group,name='create_group'),
    path('api/save_group',views.save_group,name="save_group")
    #path('api/create_group/',views.create_group_api,name='create_group_api')
]