from rest_framework import serializers
from django.contrib.auth import get_user_model
from rest_framework.validators import UniqueValidator

# Pobieramy Twój niestandardowy model użytkownika
User = get_user_model()

# Serializer do wyświetlania danych użytkownika
class UserSerializer(serializers.ModelSerializer):
    # Formatujemy datę (np. 2023-10-12), read_only bo nie chcemy jej edytować
    date_joined = serializers.DateTimeField(format="%Y-%m-%d", read_only=True)

    class Meta:
        model = User
        # Dodajemy 'date_joined' do listy pól zwracanych do Frontendu
        fields = ["id", "username", "email", "level", "date_joined"]


# Serializer do rejestracji
class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    # --- ZMIANA: WYMUSZAMY EMAIL + UNIKALNOŚĆ ---
    email = serializers.EmailField(
        required=True,
        validators=[UniqueValidator(queryset=User.objects.all(), message="This email is already in use.")]
    )

    class Meta:
        model = User
        fields = ["username", "email", "password", "level"]

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password'],
            level=validated_data.get('level', 'BEGINNER')
        )
        return user