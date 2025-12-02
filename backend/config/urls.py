"""
URL configuration for config project.
"""

from django.contrib import admin
from django.urls import path, include

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
