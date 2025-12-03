from django.urls import path
from .views import RegisterView, CurrentUserView
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

urlpatterns = [
    # Rejestracja
    path("register/", RegisterView.as_view(), name="register"),

    # Logowanie (Pobranie tokena)
    path("login/", TokenObtainPairView.as_view(), name="token_obtain_pair"),

    # Odświeżanie tokena
    path("refresh/", TokenRefreshView.as_view(), name="token_refresh"),

    # Dane użytkownika (To naprawi błąd Reacta)
    path("me/", CurrentUserView.as_view(), name="current_user"),
]