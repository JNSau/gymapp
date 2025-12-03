from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated, AllowAny
from .serializers import RegisterSerializer, UserSerializer

# Widok Rejestracji
class RegisterView(APIView):
    permission_classes = [AllowAny] # Rejestracja jest dostępna dla każdego

    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({"message": "User created"}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# Widok "O mnie" - to naprawi błąd 404
class CurrentUserView(APIView):
    permission_classes = [IsAuthenticated] # Tylko zalogowani (z tokenem)

    def get(self, request):
        # Serializujemy użytkownika wyciągniętego z tokena (request.user)
        serializer = UserSerializer(request.user)
        return Response(serializer.data)