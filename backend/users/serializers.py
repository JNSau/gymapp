from rest_framework import serializers
from django.contrib.auth import get_user_model
from rest_framework.validators import UniqueValidator


User = get_user_model()


class UserSerializer(serializers.ModelSerializer):

    date_joined = serializers.DateTimeField(format="%Y-%m-%d", read_only=True)

    class Meta:
        model = User
        fields = ["id", "username", "email", "level", "date_joined"]

        read_only_fields = ["id", "date_joined", "username", "email"]



class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)


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