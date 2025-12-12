from rest_framework import generics, permissions, status
from rest_framework.response import Response
from django.db import IntegrityError
from .models import Feedback
from .serializers import FeedbackSerializer

class FeedbackView(generics.CreateAPIView):
    queryset = Feedback.objects.all()
    serializer_class = FeedbackSerializer
    permission_classes = [permissions.IsAuthenticated]

    def create(self, request, *args, **kwargs):
        try:
            return super().create(request, *args, **kwargs)
        except IntegrityError:
            # --- ZMIEŃ TEKST TUTAJ ---
            return Response(
                {"error": "You have already rated this plan."}, # <--- Było po polsku, wpisz po angielsku
                status=status.HTTP_400_BAD_REQUEST
            )
        except Exception as e:
            return Response(
                {"error": str(e)},
                status=status.HTTP_400_BAD_REQUEST
            )

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)