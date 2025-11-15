# from django.urls import path
# from .views import WargaListAPIView, WargaDetailAPIView

# urlpatterns = [
#     path('warga/', WargaListAPIView.as_view(), name='api-warga-list'),
#     path('warga/<int:pk>/', WargaDetailAPIView.as_view(), name='api-warga-detail'),
# ]
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import WargaViewSet, PengaduanViewSet

router = DefaultRouter()
router.register(r'warga', WargaViewSet, basename='warga')
router.register(r'pengaduan', PengaduanViewSet, basename='pengaduan')


urlpatterns = [
    path('', include(router.urls)),
]

