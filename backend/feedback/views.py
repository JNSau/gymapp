from django.shortcuts import render

# Create your views here.
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import Feedback
from .serializers import FeedbackSerializer
from plans.models import TrainingPlan

class FeedbackView(APIView):
    def post(self, request, plan_id):
        plan = TrainingPlan.objects.get(id=plan_id)
        serializer = FeedbackSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(user=request.user, plan=plan)
            return Response({"message": "Feedback saved"}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
