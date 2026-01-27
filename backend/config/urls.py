"""
URL configuration for config project.
"""

from django.contrib import admin
from django.urls import path, include
# --- NOWE IMPORTY (Potrzebne do obsługi mediów) ---
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [

    path('admin/', admin.site.urls),


    path('api/users/', include('users.urls')),


    path('api/exercises/', include('exercises.urls')),


    path('api/plans/', include('plans.urls')),


    path('api/feedback/', include('feedback.urls')),
]


if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)