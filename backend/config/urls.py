"""
URL configuration for config project.
"""

from django.contrib import admin
from django.urls import path, include
# --- NOWE IMPORTY (Potrzebne do obsługi mediów) ---
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    # Panel administracyjny Django
    path('admin/', admin.site.urls),

    # API aplikacji Users – rejestracja i logowanie JWT
    path('api/users/', include('users.urls')),

    # API aplikacji Exercises – katalog ćwiczeń
    path('api/exercises/', include('exercises.urls')),

    # API aplikacji Plans – plany treningowe
    path('api/plans/', include('plans.urls')),

    # API aplikacji Feedback – oceny planów treningowych
    path('api/feedback/', include('feedback.urls')),
]

# --- NOWY FRAGMENT (Obsługa wyświetlania zdjęć) ---
# To sprawia, że zdjęcia wgrane przez admina są dostępne pod adresem URL
# Działa tylko wtedy, gdy DEBUG = True w settings.py (czyli u Ciebie na komputerze)
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)