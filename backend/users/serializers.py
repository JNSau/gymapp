from rest_framework import serializers
from django.contrib.auth import get_user_model

# Pobieramy Twój niestandardowy model użytkownika
User = get_user_model()

# Serializer do wyświetlania danych użytkownika (np. w Navbarze)
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        # Zwracamy te pola do Reacta po zalogowaniu
        fields = ["id", "username", "email", "level"]

# Serializer do rejestracji
class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        # Oczekujemy tych pól z formularza rejestracji
        fields = ["username", "email", "password", "level"]

    def create(self, validated_data):
        # Używamy create_user, żeby hasło zostało poprawnie zahaszowane
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data.get('email', ''),
            password=validated_data['password'],
            level=validated_data.get('level', 'BEGINNER') # Domyślnie BEGINNER
        )
        return user