from django.urls import path
from . import views

urlpatterns = [
    path('bin-data/', views.bin_data_create, name='bin-data-create'),
    path('bin-data/list/', views.bin_data_list, name='bin-data-list'),
    path('esp32-data/', views.esp32_data, name='esp32-data'),
]
