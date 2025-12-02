from django.shortcuts import render

# Create your views here.
from rest_framework import generics
from .models import TrainingPlan
from .serializers import TrainingPlanSerializer

class TrainingPlanList(generics.ListAPIView):
    serializer_class = TrainingPlanSerializer

    def get_queryset(self):
        user = self.request.user
        if not user.is_authenticated or not user.level:
            return TrainingPlan.objects.all()
        return TrainingPlan.objects.filter(level=user.level)

class TrainingPlanDetail(generics.RetrieveAPIView):
    queryset = TrainingPlan.objects.all()
    serializer_class = TrainingPlanSerializer
