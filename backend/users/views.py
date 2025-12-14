from rest_framework import generics, permissions
from django.contrib.auth import get_user_model
from .serializers import RegisterSerializer, UserSerializer

User = get_user_model()

# --- REJESTRACJA ---
# Używamy generics.CreateAPIView - to standard do tworzenia nowych obiektów
class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    permission_classes = [permissions.AllowAny]
    serializer_class = RegisterSerializer


# --- PROFIL UŻYTKOWNIKA (GET oraz PATCH) ---
# Zmieniamy na RetrieveUpdateAPIView - to automatycznie obsługuje pobieranie i edycję
class CurrentUserView(generics.RetrieveUpdateAPIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = UserSerializer

    # Nadpisujemy get_object, aby operować na aktualnie zalogowanym użytkowniku
    # (dzięki temu nie musimy podawać ID w URLu, np. /api/users/me/)
    def get_object(self):
        return self.request.user