# warga/urls.py
from django.urls import path
from .views import WargaListView, WargaDetailView

urlpatterns = [
    path('', WargaListView.as_view(), name='warga-list'),
    path('<int:pk>/', WargaDetailView.as_view(), name='warga-detail')
]
